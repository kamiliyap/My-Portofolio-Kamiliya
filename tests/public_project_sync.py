"""Test admin CRUD -> public cards using only a uniquely named temporary project.

Uses the existing database, never creates/imports/changes its schema, and cleans up
only the project created by this run. Password is read from stdin, not stored.
"""
import base64
import hashlib
import json
import os
from pathlib import Path
import re
import runpy
import secrets
import subprocess
import sys
import tempfile
import time
import urllib.error

ROOT = Path(__file__).resolve().parents[1]
PHP = Path(os.environ.get('TEST_PHP', r'C:\xampp\php\php.exe'))
FLAGS = getattr(subprocess, 'CREATE_NO_WINDOW', 0)
helpers = runpy.run_path(str(ROOT / 'tests/admin_integration.py'))
Client, free_port, check = (helpers[key] for key in ['Client', 'free_port', 'check'])


def query(sql, params=None):
    encoded = base64.b64encode(json.dumps([sql, params or []]).encode()).decode()
    code = "require 'connection.php';$q=json_decode(base64_decode('" + encoded + "'),true);$s=portfolioDatabase()->prepare($q[0]);$s->execute($q[1]);echo json_encode($s->fetchAll());"
    result = subprocess.run([str(PHP), '-r', code], cwd=ROOT, capture_output=True, creationflags=FLAGS, timeout=15)
    if result.returncode:
        raise RuntimeError('Database inspection failed; check server configuration.')
    return json.loads(result.stdout)


def cards(body):
    return dict((int(project_id), content) for project_id, content in re.findall(rb'<article class="project-card" data-project-id="(\d+)">(.*?)</article>', body, re.S))


def legacy(body):
    return re.findall(rb'<article class="project-card">(.*?)</article>', body, re.S)


def main():
    if len(sys.argv) != 2:
        raise SystemExit('Usage: send password via stdin to python tests/public_project_sync.py ADMIN_USERNAME')
    username = sys.argv[1]
    password = sys.stdin.readline().rstrip('\r\n')
    if not password:
        raise SystemExit('Admin password is required via stdin.')
    before = query('SELECT * FROM projects ORDER BY id')
    original_ids = {row['id'] for row in before}
    contacts_before = query('SELECT COUNT(*) AS total FROM contact_messages')[0]['total']
    source_files = ['navbar.html', 'footer.php', 'assets/css/style-site.css', 'assets/css/style-navbar.css', 'assets/js/robot-assistant.js', 'includes/portfolio-data.php']
    source_hashes = {name: hashlib.sha256((ROOT / name).read_bytes()).hexdigest() for name in source_files}
    prefix = 'Public sync test ' + secrets.token_hex(8)
    fixture_id = None
    with tempfile.TemporaryDirectory(prefix='kamiliya-public-sync-') as temp:
        temp = Path(temp)
        log = open(temp / 'php.log', 'wb')
        port = free_port()
        server = subprocess.Popen([str(PHP), '-d', 'error_reporting=32767', '-d', 'display_errors=0', '-d', 'log_errors=1', '-S', f'127.0.0.1:{port}', '-t', str(ROOT)], cwd=ROOT, stdout=log, stderr=subprocess.STDOUT, creationflags=FLAGS)
        admin, guest = Client(f'http://127.0.0.1:{port}'), Client(f'http://127.0.0.1:{port}')
        try:
            for _ in range(60):
                try:
                    if guest.request('/project.php')[0] == 200:
                        break
                except urllib.error.URLError:
                    time.sleep(.1)
            else:
                raise RuntimeError('PHP server did not start.')
            status, _, initial_page = guest.request('/project.php')
            initial_legacy = legacy(initial_page)
            check(status == 200 and len(initial_legacy) == 3, 'Three legacy public projects preserved')
            token = admin.token('/admin-login.php')
            status, headers, _ = admin.request('/admin-login.php', {'csrf_token': token, 'username': username, 'password': password})
            del password
            check(status == 303 and headers.get('Location') == '/admin/dashboard.php', 'Existing admin login successful')
            token = admin.token('/admin/add_project.php')
            title = prefix + ' <img src=x onerror=window.publicSyncXss=1>'
            description = 'Deskripsi database <script>window.publicSyncXss=1</script>'
            fields = {'csrf_token': token, 'title': title, 'description': description, 'tech': 'PHP, MySQL; JavaScript', 'category': 'Web Application'}
            png = (ROOT / 'assets/images/project-tokobuku.png').read_bytes()
            check(len(png) <= 2 * 1024 * 1024, 'PNG fixture within upload limit')
            status, _, _ = admin.request('/admin/add_project.php', fields, ('preview.png', png, 'image/png'))
            created = query('SELECT * FROM projects WHERE title = ?', [title])
            if created:
                fixture_id = created[0]['id']
            check(status == 303 and fixture_id is not None and fixture_id not in original_ids, 'Add project through admin form and INSERT')
            row = created[0]
            uploaded_png = ROOT / row['file_path']
            status, headers, body = guest.request('/project.php')
            card = cards(body)[fixture_id]
            check(status == 200 and 'no-store' in headers.get('Cache-Control', ''), 'Public project reload uses fresh SELECT')
            check(b'&lt;img' in card and b'&lt;script&gt;' in card and b'<script>' not in card, 'Database title and description escaped')
            check(all(value in card for value in [b'>PHP</span>', b'>MySQL</span>', b'>JavaScript</span>', b'>Web Application</div>']), 'Technology badges and category mapping')
            check(f'project-image.php?id={fixture_id}'.encode() in card and row['file_path'].encode() not in card, 'Thumbnail uses project ID, never raw file path')
            check(legacy(body) == initial_legacy, 'Legacy cards unchanged after add')
            status, headers, image = guest.request(f'/project-image.php?id={fixture_id}')
            check(status == 200 and image == png and headers.get('Content-Type') == 'image/png', 'Public PNG thumbnail bytes and MIME')
            check(guest.request('/project-image.php?id=../../config/database.local.php')[0] == 400, 'Image endpoint rejects traversal ID')
            check(guest.request('/project-image.php?file_path=../config/database.local.php')[0] == 400, 'Image endpoint ignores raw file path input')
            if os.environ.get('TEST_BROWSER'):
                browser_preview(temp, guest.base, fixture_id, title)
            edit = {**fields, 'id': fixture_id, 'title': prefix + ' edited', 'description': 'Deskripsi hasil edit', 'tech': 'Laravel, PHP', 'category': 'Dashboard'}
            edit['csrf_token'] = admin.token(f'/admin/edit_project.php?id={fixture_id}')
            check(admin.request(f'/admin/edit_project.php?id={fixture_id}', edit)[0] == 303, 'Edit project through admin without replacing file')
            card = cards(guest.request('/project.php')[2])[fixture_id]
            check(edit['title'].encode() in card and b'Deskripsi hasil edit' in card and b'>Laravel</span>' in card and b'>Dashboard</div>' in card and b'publicSyncXss' not in card, 'Edited title/description/tech/category immediately visible in public')
            pdf = b'%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\n%%EOF\n'
            check(admin.request(f'/admin/edit_project.php?id={fixture_id}', edit, ('document.pdf', pdf, 'application/pdf'))[0] == 303, 'Admin replaces image with PDF')
            card = cards(guest.request('/project.php')[2])[fixture_id]
            check(b'<img ' not in card and b'>PDF</text>' in card and f'download-project-recap.php?id={fixture_id}'.encode() in card, 'PDF gets document placeholder and data recap, never img')
            check(not uploaded_png.exists(), 'Old PNG removed after replacement')
            status, headers, data = guest.request(f'/download-project.php?id={fixture_id}')
            check(status == 200 and data == pdf and 'attachment' in headers.get('Content-Disposition', ''), 'Public PDF download works')
            check(guest.request(f'/project-image.php?id={fixture_id}')[0] == 404, 'Image endpoint refuses PDFs')
            jpeg = (ROOT / 'assets/images/project-aerox.jpg').read_bytes()
            check(len(jpeg) <= 2 * 1024 * 1024 and admin.request(f'/admin/edit_project.php?id={fixture_id}', edit, ('photo.jpeg', jpeg, 'image/jpeg'))[0] == 303, 'Admin replaces PDF with JPEG')
            card = cards(guest.request('/project.php')[2])[fixture_id]
            status, headers, data = guest.request(f'/project-image.php?id={fixture_id}')
            check(b'<img ' in card and status == 200 and data == jpeg and headers.get('Content-Type') == 'image/jpeg', 'Public JPEG preview follows current DB file')
            current_file = ROOT / query('SELECT file_path FROM projects WHERE id = ?', [fixture_id])[0]['file_path']
            token = admin.token('/admin/projects.php')
            check(admin.request('/admin/delete_project.php', {'id': fixture_id, 'csrf_token': token})[0] == 303, 'Delete only test project through admin')
            body = guest.request('/project.php')[2]
            check(fixture_id not in cards(body) and prefix.encode() not in body and not current_file.exists(), 'Deleted project disappears from public and upload is removed')
            check(legacy(body) == initial_legacy, 'Legacy projects preserved after delete')
            check(guest.request(f'/project-image.php?id={fixture_id}')[0] == 404 and guest.request(f'/download-project.php?id={fixture_id}')[0] == 404, 'Deleted file endpoints return 404')
            fixture_id = None
            check(query('SELECT * FROM projects ORDER BY id') == before, 'All existing project data unchanged')
            check(query('SELECT COUNT(*) AS total FROM contact_messages')[0]['total'] == contacts_before, 'contact_messages unchanged')
        finally:
            if fixture_id is not None and fixture_id not in original_ids:
                remaining = query('SELECT title FROM projects WHERE id = ?', [fixture_id])
                if remaining and remaining[0]['title'].startswith(prefix):
                    token = admin.token('/admin/projects.php')
                    admin.request('/admin/delete_project.php', {'id': fixture_id, 'csrf_token': token})
            server.terminate()
            server.wait(timeout=15)
            log.close()
        log_text = (temp / 'php.log').read_text(errors='replace')
        check(not re.search(r'PHP (Warning|Fatal error|Notice|Deprecated|Parse error):', log_text), 'No PHP warnings/fatal errors with E_ALL')
    check(all(hashlib.sha256((ROOT / name).read_bytes()).hexdigest() == digest for name, digest in source_hashes.items()), 'Navbar/footer/CSS/robot/static data sources unchanged')
    print('ALL PUBLIC PROJECT SYNC CHECKS PASSED', flush=True)


def browser_preview(temp, base, project_id, title):
    original = (ROOT / 'tests/admin_browser.mjs').read_text(encoding='utf-8')
    start = original.index("  await navigate('/admin-login.php');")
    end = original.index("  console.log('SCREENSHOTS:', screenshots);", start)
    checks = r'''
  await send('Network.enable');
  await send('Network.setBlockedURLs', {urls:['https://fonts.googleapis.com/*','https://fonts.gstatic.com/*','https://cdn.jsdelivr.net/*']});
  await navigate('/project.php');
  const selector = '[data-project-id="' + options.projectId + '"]';
  await waitFor('document.querySelector('+JSON.stringify(selector)+')?.querySelector("img")?.naturalWidth > 0');
  assert(await evaluate('document.querySelector('+JSON.stringify(selector)+').querySelector("h2").textContent === '+JSON.stringify(options.title)), 'DB project image/title displayed in browser');
  await evaluate('document.querySelector("[data-lang=en]").click()');
  assert(await evaluate('document.documentElement.lang === "en" && document.querySelector('+JSON.stringify(selector)+').querySelector("h2").textContent === '+JSON.stringify(options.title)), 'ID/EN preserves database title');
  assert(await evaluate('document.querySelector('+JSON.stringify(selector)+').querySelector(".small-button").textContent === "Download Summary"'), 'Recap label translates to English');
  assert(await evaluate('!!document.querySelector(".navbar-custom") && !!document.querySelector("#portfolio-assistant") && window.publicSyncXss === undefined'), 'Navbar/robot retained and stored XSS inert');
  await screenshot('public-project-database-en.png');
  const wasLight = await evaluate('document.body.classList.contains("light")');
  await evaluate('document.querySelector("#theme-button").click()');
  assert(await evaluate('document.body.classList.contains("light")') !== wasLight, 'Existing public theme toggle still works');
  await evaluate('document.querySelector("[data-lang=id]").click()');
  assert(await evaluate('document.querySelector('+JSON.stringify(selector)+').querySelector(".small-button").textContent === "Unduh Rekap Data"'), 'Recap label translates to Indonesian');
  await screenshot('public-project-database-id.png');
  assert(errors.length === 0, 'No uncaught browser JavaScript exceptions');
'''
    script = temp / 'public-preview.mjs'
    script.write_text(original[:start] + checks + original[end:], encoding='utf-8')
    options = {'browser': os.environ['TEST_BROWSER'], 'base': base, 'projectId': project_id, 'title': title, 'screenshots': str(Path(tempfile.gettempdir()) / 'kamiliya-public-project-preview')}
    result = subprocess.run(['node', str(script)], input=json.dumps(options).encode(), capture_output=True, creationflags=FLAGS, timeout=90)
    print(result.stdout.decode(errors='replace'), flush=True)
    if result.returncode:
        raise RuntimeError(result.stderr.decode(errors='replace'))


if __name__ == '__main__':
    main()
