"""Real HTTP + MariaDB integration tests in an isolated temporary project copy."""
import base64
import hashlib
import html
import http.cookiejar
import json
import os
from pathlib import Path
import re
import secrets
import shutil
import socket
import subprocess
import tempfile
import time
import urllib.error
import urllib.parse
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
PHP = Path(os.environ.get('TEST_PHP', r'C:\xampp\php\php.exe'))
MYSQL_BIN = Path(os.environ.get('TEST_MYSQL_BIN', r'C:\xampp\mysql\bin'))
FLAGS = getattr(subprocess, 'CREATE_NO_WINDOW', 0)


def free_port():
    with socket.socket() as sock:
        sock.bind(('127.0.0.1', 0))
        return sock.getsockname()[1]


def check(condition, label):
    if not condition:
        raise AssertionError(label)
    print('PASS:', label, flush=True)


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


class Client:
    def __init__(self, base):
        self.base = base
        self.jar = http.cookiejar.CookieJar()
        self.opener = urllib.request.build_opener(NoRedirect(), urllib.request.HTTPCookieProcessor(self.jar))

    def request(self, path, fields=None, file=None):
        data = None
        headers = {}
        if file is not None:
            name, content, mime = file
            boundary = 'Kamiliya' + secrets.token_hex(12)
            parts = []
            for key, value in fields.items():
                parts.append(f'--{boundary}\r\nContent-Disposition: form-data; name="{key}"\r\n\r\n{value}\r\n'.encode())
            parts.append(f'--{boundary}\r\nContent-Disposition: form-data; name="file"; filename="{name}"\r\nContent-Type: {mime}\r\n\r\n'.encode() + content + b'\r\n')
            parts.append(f'--{boundary}--\r\n'.encode())
            data = b''.join(parts)
            headers['Content-Type'] = 'multipart/form-data; boundary=' + boundary
        elif fields is not None:
            data = urllib.parse.urlencode(fields).encode()
        request = urllib.request.Request(self.base + path, data=data, headers=headers)
        try:
            response = self.opener.open(request, timeout=15)
        except urllib.error.HTTPError as error:
            response = error
        with response:
            return response.status, response.headers, response.read()

    def token(self, path):
        status, _, body = self.request(path)
        check(status == 200, 'GET ' + path)
        token = re.search(rb'name="csrf_token" value="([a-f0-9]+)"', body)
        check(token is not None, 'CSRF token ' + path)
        return token.group(1).decode()

    def cookie(self):
        return next((cookie.value for cookie in self.jar if cookie.name == 'kamiliya_admin'), None)


def main():
    for binary in [PHP, MYSQL_BIN / 'mysqld.exe', MYSQL_BIN / 'mysql_install_db.exe']:
        if not binary.is_file():
            raise RuntimeError('Missing test binary: ' + str(binary))
    baseline = {p.relative_to(ROOT): hashlib.sha256(p.read_bytes()).hexdigest() for p in ROOT.rglob('*') if p.is_file() and '.git' not in p.parts and '__pycache__' not in p.parts}
    with tempfile.TemporaryDirectory(prefix='kamiliya-admin-test-') as temp:
        temp = Path(temp)
        app = temp / 'app'
        shutil.copytree(ROOT, app, ignore=shutil.ignore_patterns('.git', '__pycache__'))
        datadir = temp / 'mysql'
        db_port, http_port = free_port(), free_port()
        secret = secrets.token_urlsafe(24)
        env = os.environ.copy()
        env.update(PORTFOLIO_DB_HOST='127.0.0.1', PORTFOLIO_DB_PORT=str(db_port), PORTFOLIO_DB_USERNAME='root', PORTFOLIO_DB_PASSWORD=secret)
        install = subprocess.run([str(MYSQL_BIN / 'mysql_install_db.exe'), '--datadir=' + str(datadir), '--port=' + str(db_port), '--password=' + secret, '--silent'], capture_output=True, creationflags=FLAGS, timeout=60)
        check(install.returncode == 0, 'Initialize isolated MariaDB')
        db_log = open(temp / 'mysql.log', 'wb')
        php_log = open(temp / 'php.log', 'wb')
        db = web = None
        try:
            db = subprocess.Popen([str(MYSQL_BIN / 'mysqld.exe'), '--defaults-file=' + str(datadir / 'my.ini'), '--bind-address=127.0.0.1', '--port=' + str(db_port), '--console'], stdout=db_log, stderr=subprocess.STDOUT, creationflags=FLAGS)

            def php(code):
                result = subprocess.run([str(PHP), '-d', 'error_reporting=32767', '-r', code], env=env, cwd=app, capture_output=True, creationflags=FLAGS, timeout=15)
                if result.returncode:
                    raise RuntimeError(result.stderr.decode(errors='replace'))
                return result.stdout.decode().strip()

            connect = "$p=new PDO('mysql:host=127.0.0.1;port='.getenv('PORTFOLIO_DB_PORT').';charset=utf8mb4','root',getenv('PORTFOLIO_DB_PASSWORD'),[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION]);"
            for _ in range(60):
                try:
                    php(connect)
                    break
                except RuntimeError:
                    time.sleep(.25)
            else:
                raise RuntimeError('Isolated MariaDB did not start')
            php(connect + "foreach(explode(';',file_get_contents('database/portfolio.sql')) as $sql){if(trim($sql)!==''){$s=$p->prepare($sql);$s->execute();}}")
            check(True, 'Import portfolio_db projects/users schema')
            password = secrets.token_urlsafe(20)
            created = subprocess.run([str(PHP), 'scripts/create-admin.php', 'testadmin'], input=(password + '\n').encode(), env=env, cwd=app, capture_output=True, creationflags=FLAGS, timeout=15)
            check(created.returncode == 0, 'Create admin via CLI password_hash')

            def query(sql, params=None):
                payload = base64.b64encode(json.dumps([sql, params or []]).encode()).decode()
                return json.loads(php("require 'connection.php';$x=json_decode(base64_decode('" + payload + "'),true);$s=portfolioDatabase()->prepare($x[0]);$s->execute($x[1]);echo json_encode($s->columnCount()?$s->fetchAll():[]);"))

            user = query('SELECT password FROM users WHERE username = ?', ['testadmin'])[0]
            check(user['password'] != password and user['password'].startswith('$2y$'), 'Only password hash stored')
            user_schema = query('SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? ORDER BY ORDINAL_POSITION', ['portfolio_db', 'users'])
            check([row['COLUMN_NAME'] for row in user_schema] == ['id', 'username', 'password', 'created_at'], 'Exact admin user columns')
            schema = query("SELECT COLUMN_NAME, COLUMN_KEY, EXTRA FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? ORDER BY ORDINAL_POSITION", ['portfolio_db', 'projects'])
            check([r['COLUMN_NAME'] for r in schema] == ['id', 'title', 'description', 'tech', 'category', 'file_path', 'created_at'] and schema[0]['COLUMN_KEY'] == 'PRI' and schema[0]['EXTRA'] == 'auto_increment', 'Exact project columns and auto-increment primary key')
            # Remove the fixture uploads folder to test automatic creation and protection.
            shutil.rmtree(app / 'uploads')
            web = subprocess.Popen([str(PHP), '-d', 'error_reporting=32767', '-d', 'log_errors=1', '-d', 'display_errors=0', '-d', 'upload_max_filesize=3M', '-d', 'post_max_size=4M', '-S', f'127.0.0.1:{http_port}', '-t', str(app)], env=env, cwd=app, stdout=php_log, stderr=subprocess.STDOUT, creationflags=FLAGS)
            base = f'http://127.0.0.1:{http_port}'
            client, guest = Client(base), Client(base)
            for _ in range(60):
                try:
                    if client.request('/admin-login.php')[0] == 200:
                        break
                except urllib.error.URLError:
                    time.sleep(.1)
            else:
                raise RuntimeError('PHP HTTP server did not start')
            for page in ['dashboard', 'projects', 'add_project', 'edit_project', 'detail_project', 'delete_project']:
                status, headers, body = guest.request('/admin/' + page + '.php')
                check(status == 303 and headers.get('Location') == '/admin-login.php', 'Guest blocked from ' + page + ' (status=' + str(status) + ', location=' + str(headers.get('Location')) + ', body=' + body[:150].decode(errors='replace') + ')')
            check(guest.request('/logout.php')[0] == 303, 'Guest blocked from logout')
            throttled = Client(base)
            throttled_token = throttled.token('/admin-login.php')
            for _ in range(5):
                throttled.request('/admin-login.php', {'csrf_token': throttled_token, 'username': 'testadmin', 'password': 'incorrect-password'})
            check(b'Terlalu banyak percobaan' in throttled.request('/admin-login.php', {'csrf_token': throttled_token, 'username': 'testadmin', 'password': password})[2], 'Five failed login attempts trigger session throttle')
            token = client.token('/admin-login.php')
            check(client.request('/admin-login.php', {'csrf_token': 'invalid', 'username': 'testadmin', 'password': password})[0] == 403, 'Login CSRF rejection')
            check(b'Username atau password salah' in client.request('/admin-login.php', {'csrf_token': token, 'username': "' OR 1=1 --", 'password': password})[2], 'Login SQL injection rejected')
            old_cookie = client.cookie()
            status, headers, _ = client.request('/admin-login.php', {'csrf_token': token, 'username': 'testadmin', 'password': password})
            check(status == 303 and headers.get('Location') == '/admin/dashboard.php' and client.cookie() != old_cookie, 'Login success with session ID regeneration')
            check('HttpOnly' in headers.get('Set-Cookie', '') and 'SameSite=Strict' in headers.get('Set-Cookie', ''), 'Session cookie HttpOnly/SameSite')
            check(client.request('/admin/dashboard.php')[0] == 200, 'Dashboard renders with E_ALL')
            fields = {'csrf_token': client.token('/admin/add_project.php'), 'title': '<script>alert(1)</script>', 'description': "Description ' OR 1=1 --", 'tech': 'PHP, MySQL', 'category': 'Web Application'}
            pdf = b'%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\n%%EOF\n'
            png = base64.b64decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=')
            jpeg = b'\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x00\x00\x01\x00\x01\x00\x00' + b'\x00' * 32 + b'\xff\xd9'
            check(client.request('/admin/add_project.php', {**fields, 'csrf_token': 'wrong'}, ('a.pdf', pdf, 'application/pdf'))[0] == 403, 'Create CSRF rejection')
            for name, content, expected in [('bad.php', pdf, 'Hanya PDF'), ('fake.pdf', b'<?php echo 1; ?>', 'Hanya PDF'), ('huge.pdf', pdf + b'x' * (2 * 1024 * 1024), 'maksimal 2 MB'), ('empty.pdf', b'', 'tidak boleh kosong')]:
                status, _, body = client.request('/admin/add_project.php', fields, (name, content, 'application/octet-stream'))
                check(status == 200 and expected.encode() in body, 'Reject upload: ' + name)
            check(query('SELECT id FROM projects') == [], 'Invalid uploads did not create rows')
            check(b'File project wajib' in client.request('/admin/add_project.php', fields)[2], 'Upload required on create')
            check(b'Title wajib' in client.request('/admin/add_project.php', {**fields, 'title': '  '}, ('a.pdf', pdf, 'application/pdf'))[2], 'Empty text validation')
            status, _, _ = client.request('/admin/add_project.php', fields, ('a.pdf', pdf, 'application/pdf'))
            check(status == 303, 'INSERT PDF project')
            project = query('SELECT * FROM projects')[0]
            project_id = project['id']
            old_file = app / project['file_path']
            check(old_file.is_file() and re.fullmatch(r'uploads/[a-f0-9]{32}\.pdf', project['file_path']) is not None and (app / 'uploads/.htaccess').is_file(), 'mkdir, unique filename, relative path, protection file')
            files_before = set((app / 'uploads').iterdir())
            query('RENAME TABLE projects TO projects_test_hidden')
            try:
                status, _, body = client.request('/admin/add_project.php', fields, ('a.pdf', pdf, 'application/pdf'))
                check(status == 200 and b'Project belum dapat disimpan' in body and b'SQLSTATE' not in body, 'Failed INSERT has generic form error')
                check(set((app / 'uploads').iterdir()) == files_before, 'Failed INSERT cleans newly uploaded file')
            finally:
                query('RENAME TABLE projects_test_hidden TO projects')
            for page in ['/admin/projects.php', f'/admin/detail_project.php?id={project_id}', f'/admin/edit_project.php?id={project_id}', '/project-library.php']:
                status, _, body = client.request(page)
                check(status == 200 and b'&lt;script&gt;' in body and b'<script>alert(1)</script>' not in body, 'Escaped output ' + page)
            status, headers, body = guest.request(f'/download-project.php?id={project_id}')
            check(status == 200 and body == pdf and headers.get('Content-Type') == 'application/pdf' and 'attachment' in headers.get('Content-Disposition', ''), 'Public download by ID exact bytes/headers')
            check(guest.request('/download-project.php?id=../../config/database.local.php')[0] == 400, 'Reject traversal in ID')
            check(guest.request('/download-project.php?file_path=../config/database.local.php')[0] == 400, 'Raw file_path ignored')
            edit = {**fields, 'id': project_id, 'title': 'Updated project', 'csrf_token': client.token(f'/admin/edit_project.php?id={project_id}')}
            check(client.request(f'/admin/edit_project.php?id={project_id}', {**edit, 'csrf_token': 'wrong'})[0] == 403, 'Update CSRF rejection')
            check(client.request(f'/admin/edit_project.php?id={project_id}', edit)[0] == 303 and old_file.is_file(), 'UPDATE without upload retains old file')
            query("CREATE TRIGGER projects_test_reject_update BEFORE UPDATE ON projects FOR EACH ROW SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'test update failure'")
            try:
                files_before = set((app / 'uploads').iterdir())
                status, _, body = client.request(f'/admin/edit_project.php?id={project_id}', edit, ('replacement.png', png, 'image/png'))
                check(status == 200 and b'Project belum dapat diperbarui' in body and b'SQLSTATE' not in body, 'Failed UPDATE has generic error')
                check(old_file.is_file() and set((app / 'uploads').iterdir()) == files_before and query('SELECT file_path FROM projects WHERE id = ?', [project_id])[0]['file_path'] == project['file_path'], 'Failed UPDATE rolls back and retains old file, removes new file')
            finally:
                query('DROP TRIGGER projects_test_reject_update')
            check(client.request(f'/admin/edit_project.php?id={project_id}', edit, ('replacement.png', png, 'image/png'))[0] == 303, 'UPDATE with PNG upload')
            updated = query('SELECT * FROM projects WHERE id = ?', [project_id])[0]
            check(not old_file.exists() and (app / updated['file_path']).is_file(), 'Old file unlinked after successful update')
            check(guest.request(f'/download-project.php?id={project_id}')[2] == png, 'Download replacement bytes')
            for ext in ['jpg', 'jpeg']:
                check(client.request('/admin/add_project.php', {**fields, 'title': 'JPEG ' + ext}, ('photo.' + ext, jpeg, 'image/jpeg'))[0] == 303, 'Accept actual MIME image/' + ext)
            invalid_path_id = query('SELECT id FROM projects WHERE title = ?', ['JPEG jpg'])[0]['id']
            query('UPDATE projects SET file_path = ? WHERE id = ?', ['uploads/../config/database.local.php', invalid_path_id])
            check(guest.request(f'/download-project.php?id={invalid_path_id}')[0] == 404, 'Reject malicious path stored in DB')
            query('UPDATE projects SET file_path = ? WHERE id = ?', ['uploads/' + 'a' * 32 + '.pdf', invalid_path_id])
            check(guest.request(f'/download-project.php?id={invalid_path_id}')[0] == 404, 'Missing file returns 404')
            check(client.request('/admin/delete_project.php', {'id': project_id, 'csrf_token': 'wrong'})[0] == 403, 'Delete CSRF rejection')
            check(client.request(f'/admin/delete_project.php?id={project_id}')[0] == 405, 'GET cannot delete')
            token = client.token('/admin/projects.php')
            query("CREATE TRIGGER projects_test_reject_delete BEFORE DELETE ON projects FOR EACH ROW SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'test delete failure'")
            try:
                check(client.request('/admin/delete_project.php', {'id': project_id, 'csrf_token': token})[0] == 303, 'Failed DELETE redirects with flash error')
                check(query('SELECT id FROM projects WHERE id = ?', [project_id]) != [] and (app / updated['file_path']).is_file(), 'Failed DELETE rolls back without unlinking file')
            finally:
                query('DROP TRIGGER projects_test_reject_delete')
            check(client.request('/admin/delete_project.php', {'id': project_id, 'csrf_token': token})[0] == 303, 'DELETE project')
            check(query('SELECT id FROM projects WHERE id = ?', [project_id]) == [] and not (app / updated['file_path']).exists(), 'Deleted row and upload removed')
            check(guest.request(f'/download-project.php?id={project_id}')[0] == 404, 'Deleted download returns 404')
            if os.environ.get('TEST_BROWSER'):
                upload = temp / 'preview.png'
                upload.write_bytes(png)
                browser_options = {'browser': os.environ['TEST_BROWSER'], 'base': base, 'username': 'testadmin', 'password': password, 'upload': str(upload), 'screenshots': str(Path(tempfile.gettempdir()) / 'kamiliya-admin-preview')}
                browser_result = subprocess.run(['node', str(app / 'tests/admin_browser.mjs')], input=json.dumps(browser_options).encode(), capture_output=True, creationflags=FLAGS, timeout=120)
                print(browser_result.stdout.decode(errors='replace'), flush=True)
                if browser_result.returncode:
                    raise RuntimeError(browser_result.stderr.decode(errors='replace'))
                check(True, 'Browser UI/theme/modals/responsive checks')
            check(client.request('/logout.php', {'csrf_token': 'wrong'})[0] == 403, 'Logout CSRF rejection')
            check(client.request('/logout.php')[0] == 405, 'GET cannot logout')
            status, headers, _ = client.request('/logout.php', {'csrf_token': token})
            check(status == 303 and headers.get('Location') == '/admin-login.php', 'POST logout redirects to hidden login')
            check(client.request('/admin/dashboard.php')[0] == 303, 'Session no longer authorized after logout')
            sub_port = free_port()
            sub_web = subprocess.Popen([str(PHP), '-d', 'error_reporting=32767', '-d', 'log_errors=1', '-d', 'display_errors=0', '-S', f'127.0.0.1:{sub_port}', '-t', str(temp)], env=env, cwd=temp, stdout=php_log, stderr=subprocess.STDOUT, creationflags=FLAGS)
            try:
                sub = Client(f'http://127.0.0.1:{sub_port}/app')
                for _ in range(60):
                    try:
                        if sub.request('/admin-login.php')[0] == 200:
                            break
                    except urllib.error.URLError:
                        time.sleep(.1)
                status, headers, _ = sub.request('/admin/dashboard.php')
                check(status == 303 and headers.get('Location') == '/app/admin-login.php', 'Subfolder guest redirect uses correct base URL')
                sub_token = sub.token('/admin-login.php')
                status, headers, _ = sub.request('/admin-login.php', {'csrf_token': sub_token, 'username': 'testadmin', 'password': password})
                check(status == 303 and headers.get('Location') == '/app/admin/dashboard.php', 'Subfolder login redirect uses correct base URL')
                status, _, body = sub.request('/admin/dashboard.php')
                check(status == 200 and b'/app/assets/css/admin.css' in body and b'/app/admin/add_project.php' in body, 'Subfolder assets and action URLs render correctly')
                check(sub.request('/project-library.php')[0] == 200, 'Public database library works in subfolder')
                sub_token = sub.token('/admin/dashboard.php')
                status, headers, _ = sub.request('/logout.php', {'csrf_token': sub_token})
                check(status == 303 and headers.get('Location') == '/app/admin-login.php', 'Subfolder logout redirect works')
            finally:
                sub_web.terminate()
                sub_web.wait(timeout=15)
            for page in ['index.php', 'about.php', 'project.php', 'analytics.php', 'certifications.php', 'services.php', 'testimonials.php', 'contact.php']:
                status, _, body = guest.request('/' + page)
                check(status == 200 and b'portfolio-assistant' in body and b'language-switcher' in body, 'Existing public page regression ' + page)
            db.terminate()
            db.wait(timeout=15)
            db = None
            status, _, body = guest.request('/project-library.php')
            check(status == 503 and b'SQLSTATE' not in body and b'PDOException' not in body, 'DB failure shown as generic message')
            php_log.flush()
            log = (temp / 'php.log').read_text(errors='replace')
            check(not re.search(r'PHP (Warning|Fatal error|Notice|Deprecated|Parse error):', log), 'No PHP warning/fatal/notice/deprecation with E_ALL')
            check('[Kamiliya admin]' in log, 'Database exception logged server-side')
        except Exception:
            php_log.flush()
            print((temp / 'php.log').read_text(errors='replace')[-6000:], flush=True)
            raise
        finally:
            for process in [web, db]:
                if process is not None and process.poll() is None:
                    process.terminate()
                    try:
                        process.wait(timeout=15)
                    except subprocess.TimeoutExpired:
                        process.kill()
                        process.wait(timeout=15)
            php_log.close()
            db_log.close()
    check(all((ROOT / path).is_file() and hashlib.sha256((ROOT / path).read_bytes()).hexdigest() == digest for path, digest in baseline.items()), 'Original workspace files unchanged by integration tests')
    print('ALL INTEGRATION CHECKS PASSED', flush=True)


if __name__ == '__main__':
    raise SystemExit('Pengujian integrasi ditunda: tunggu konfirmasi tabel manual di portfolio_kamiliya. Runner setup skema otomatis tidak dijalankan.')
