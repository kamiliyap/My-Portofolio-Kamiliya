# Regression verification for the four final audit fixes; password is read only from stdin.

import base64, hashlib, json, os, re, runpy, secrets, socket, subprocess, sys, tempfile, time, urllib.error, urllib.request
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]; PHP=r'C:\xampp\php\php.exe'; FLAGS=getattr(subprocess,'CREATE_NO_WINDOW',0)
h=runpy.run_path(str(ROOT/'tests/admin_integration.py'));Client=h['Client'];check=h['check'];free_port=h['free_port']
password=sys.stdin.readline().rstrip('\r\n'); username='kamiliyaprasmaisya@gmail.com'
def query(sql,params=None):
    p=base64.b64encode(json.dumps([sql,params or []]).encode()).decode()
    code="require 'connection.php';$q=json_decode(base64_decode('"+p+"'),true);$s=portfolioDatabase()->prepare($q[0]);$s->execute($q[1]);echo json_encode($s->columnCount()?$s->fetchAll():[]);"
    r=subprocess.run([PHP,'-r',code],capture_output=True,creationflags=FLAGS,timeout=15)
    if r.returncode: raise RuntimeError('Database check failed')
    return json.loads(r.stdout)
def project_card(body,id):
    m=re.search(rb'<article class="project-card" data-project-id="'+str(id).encode()+rb'">(.*?)</article>',body,re.S)
    return m.group(1) if m else None
sources={str(p.relative_to(ROOT)):hashlib.sha256(p.read_bytes()).hexdigest() for p in ROOT.rglob('*') if p.is_file() and '.git' not in p.parts and '__pycache__' not in p.parts}
before=query('SELECT * FROM projects ORDER BY id'); before_contacts=query('SELECT * FROM contact_messages ORDER BY id')
prefix='FINAL AUDIT '+secrets.token_hex(8);id=None
with tempfile.TemporaryDirectory(prefix='kamiliya-final-audit-') as temp:
    temp=Path(temp);log=open(temp/'php.log','wb');port=free_port();server=subprocess.Popen([PHP,'-d','error_reporting=32767','-d','display_errors=0','-d','log_errors=1','-S',f'127.0.0.1:{port}','-t',str(ROOT)],stdout=log,stderr=subprocess.STDOUT,creationflags=FLAGS)
    base=f'http://127.0.0.1:{port}';admin=Client(base);guest=Client(base)
    try:
        for _ in range(50):
            try:
                if guest.request('/admin-login.php')[0]==200:break
            except urllib.error.URLError:time.sleep(.1)
        for page in ['index.php','about.php','project.php','analytics.php','certifications.php','services.php','testimonials.php','contact.php','project-library.php']:
            status,_,body=guest.request('/'+page);check(status==200,'E_ALL GET '+page)
        for page in ['dashboard','projects','add_project','edit_project','detail_project','delete_project']:
            status,headers,_=guest.request('/admin/'+page+'.php');check(status==303 and headers.get('Location')=='/admin-login.php','Guest denied '+page)
        token=admin.token('/admin-login.php');old_sid=admin.cookie()
        status,_,body=admin.request('/admin-login.php',{'csrf_token':token,'username':"' OR 1=1 --",'password':password});check(status==200 and b'Username atau password salah' in body,'SQL injection login rejected')
        status,headers,_=admin.request('/admin-login.php',{'csrf_token':token,'username':username,'password':password});check(status==303 and headers.get('Location')=='/admin/dashboard.php' and admin.cookie()!=old_sid,'J1 login and session regeneration')
        check('HttpOnly' in headers.get('Set-Cookie','') and 'SameSite=Strict' in headers.get('Set-Cookie',''),'Session cookie flags')
        token=admin.token('/admin/add_project.php');fields={'csrf_token':token,'title':prefix+' <script>window.auditXss=1</script>','description':'Audit <img src=x onerror=window.auditXss=1>','tech':'PHP, MySQL; JavaScript','category':'Web <b>Audit</b>','demo_url':'https://drive.google.com/file/d/audit-demo/view?usp=sharing'}
        png=(ROOT/'assets/images/project-tokobuku.png').read_bytes(); pdf=(ROOT/'assets/cv/CV - KAMILIYA LATIFAH PRASMAISYA-IT 2026.pdf').read_bytes()
        for filename,content,expected in [('script.php',b'<?php echo 1; ?>',b'Hanya PDF'),('fake.png',b'plain text',b'Hanya PDF'),('huge.pdf',pdf+b'x'*(2*1024*1024),b'maksimal 2 MB')]:
            status,_,body=admin.request('/admin/add_project.php',fields,(filename,content,'application/octet-stream'));check(status==200 and expected in body,'Upload rejected '+filename)
        check(admin.request('/admin/add_project.php',{**fields,'csrf_token':'invalid'},('a.png',png,'image/png'))[0]==403,'Create CSRF rejected')
        check(b'Link video demo harus' in admin.request('/admin/add_project.php',{**fields,'demo_url':'javascript:alert(1)'},('a.png',png,'image/png'))[2],'Unsafe demo URL rejected')
        status,_,_=admin.request('/admin/add_project.php',fields,('preview.png',png,'image/png'));created=query('SELECT * FROM projects WHERE title=?',[fields['title']]);id=created[0]['id'] if created else None
        check(status==303 and id is not None and id not in {r['id'] for r in before},'J2 add image project through admin')
        row=created[0];old_file=ROOT/row['file_path'];check(old_file.is_file() and re.fullmatch(r'uploads/[a-f0-9]{32}\.png',row['file_path']) is not None,'Unique relative upload path')
        admin_list=admin.request('/admin/projects.php')[2];check(prefix.encode() in admin_list,'J3 new project visible in admin')
        body=guest.request('/project.php')[2];card=project_card(body,id);check(card is not None and prefix.encode() in card,'J4 new project visible public')
        check(b'&lt;script&gt;' in card and b'&lt;img' in card and b'<script>' not in card and b'Web &lt;b&gt;Audit&lt;/b&gt;' in card,'Stored XSS escaped in public output')
        check(b'Video Demo' in card and b'drive.google.com/file/d/audit-demo' in card,'Demo URL stored and visible public')
        check(b'download-project' not in card and b'Unduh' not in card,'Public respects removal of download buttons')
        status,headers,data=guest.request(f'/project-image.php?id={id}');check(status==200 and data==png and headers.get('Content-Type')=='image/png','Public PNG preview')
        check(guest.request('/project-image.php?id=../../config/database.local.php')[0]==400 and guest.request('/download-project.php?file_path=../config/database.local.php')[0]==400,'File traversal rejected')
        # Verify Apache protection while the real test upload exists.
        try:
            response=urllib.request.urlopen('http://localhost/portofolio-kamiliya/'+row['file_path'],timeout=10);status=response.status;response.close()
        except urllib.error.HTTPError as e:status=e.code
        check(status==403,'Apache denies direct uploads access')
        if os.environ.get('TEST_BROWSER'):
            original=(ROOT/'tests/admin_browser.mjs').read_text(encoding='utf-8');start=original.index("  await navigate('/admin-login.php');");end=original.index("  console.log('SCREENSHOTS:', screenshots);",start)
            checks=r"""
  await navigate('/admin-login.php');
  await evaluate(`document.querySelector('#username').value=${JSON.stringify(options.username)};document.querySelector('#password').value=${JSON.stringify(options.password)};document.querySelector('form').requestSubmit();`);
  await waitFor('location.pathname === "/admin/dashboard.php" && document.readyState === "complete"');
  assert(await evaluate('document.querySelector(".admin-topbar #account-trigger")!==null && document.querySelectorAll(".admin-sidebar nav a").length===3 && !document.querySelector(".admin-sidebar .admin-account")'), 'Topbar account and simple sidebar');
  await evaluate('document.querySelector("[data-theme-toggle]").click()');
  await evaluate('if(!document.body.classList.contains("light"))document.querySelector("[data-theme-toggle]").click()');
  const adminLight=await evaluate('getComputedStyle(document.body).getPropertyValue("--bg").trim()');
  console.log('THEME ADMIN_LIGHT_BG:',adminLight);
  await navigate('/admin/projects.php');
  await evaluate('document.querySelector("[data-delete-id=\\"'+options.projectId+'\\"]")');
"""
            # Append the UI checks with selector safely passed through JSON.
            checks=checks[:checks.rfind("  await evaluate('document.querySelector")]+r"""
  const deleteSelector='[data-delete-id="'+options.projectId+'"]';
  await evaluate('document.querySelector('+JSON.stringify(deleteSelector)+').click()');
  assert(await evaluate('document.querySelector("#delete-dialog").open && document.querySelector("#delete-project-name").textContent.includes("FINAL AUDIT")'), 'Delete modal exact title');
  await evaluate('document.querySelector("#delete-dialog [data-close-dialog]").click()');
  await send('Emulation.setDeviceMetricsOverride',{width:320,height:844,deviceScaleFactor:1,mobile:true});await sleep(150);
  assert(await evaluate('document.documentElement.scrollWidth<=innerWidth'), 'Admin dashboard/list responsive 320px');
  await evaluate('document.querySelector("#account-trigger").click();document.querySelector("[data-open-logout]").click()');
  assert(await evaluate('document.querySelector("#logout-dialog").open'), 'Logout modal');
  await evaluate('document.querySelector("#logout-dialog [data-close-dialog]").click()');
  await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
  await navigate('/project.php?lang=id');
  const selector='[data-project-id="'+options.projectId+'"]';
  await waitFor('document.querySelector('+JSON.stringify(selector)+')?.querySelector("img")?.naturalWidth>0');
  assert(await evaluate('window.auditXss===undefined'), 'Database XSS inert in browser');
  const publicLight=await evaluate('getComputedStyle(document.body).getPropertyValue("--bg").trim()');
  assert(adminLight===publicLight && publicLight==='#f3f6fb' && await evaluate('localStorage.getItem(\"theme\")===\"light\" && document.body.classList.contains(\"light\")'), 'Admin/public light state and palette synchronized');
  await evaluate('document.querySelector("[data-lang=en]").click()');
  assert(await evaluate('document.documentElement.lang==="en" && document.querySelector('+JSON.stringify(selector)+').querySelector(".small-button").textContent==="Watch Demo"'), 'Public ID/EN switch');
  const wasLight=await evaluate('document.body.classList.contains("light")');await evaluate('document.querySelector("#theme-button").click()');
  assert(await evaluate('document.body.classList.contains("light")')!==wasLight,'Public theme toggle');

  assert(await evaluate('document.body.classList.contains("dark") && window.KamiliyaTheme.get()==="dark" && localStorage.getItem("theme")==="dark"'), 'Public toggle sets canonical dark state');
  await navigate('/admin/dashboard.php');
  assert(await evaluate('document.body.classList.contains("dark") && window.KamiliyaTheme.get()==="dark"'), 'Public dark preference carried into admin');
  await evaluate('localStorage.removeItem("kamiliya-theme-version");localStorage.setItem("theme","light")');
  await navigate('/project.php?lang=id');
  assert(await evaluate('document.body.classList.contains("dark") && localStorage.getItem("theme")==="dark" && localStorage.getItem("kamiliya-theme-version")==="2"'), 'Legacy public dark palette preserved by one-time migration');
  await navigate('/admin/dashboard.php');
  assert(await evaluate('document.body.classList.contains("dark")'), 'Theme migration is not repeated on admin navigation');
  for(const width of [390,320]){
    await send('Emulation.setDeviceMetricsOverride',{width,height:844,deviceScaleFactor:1,mobile:true});await sleep(150);
    assert(await evaluate('document.documentElement.scrollWidth<=innerWidth && document.querySelectorAll(".stat-card").length===4'), 'Dashboard responsive '+width+'px');
  }
  await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
  await navigate('/project.php?lang=id');

  await waitFor('!document.querySelector("#portfolio-assistant").hidden');
  await evaluate('document.querySelector(".assistant-character").click()');await waitFor('!document.querySelector(".assistant-bubble").hidden');
  assert(await evaluate('document.querySelector(".assistant-message").textContent.length>0'), 'Robot wakes and displays message');
  await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await evaluate('document.querySelector("#navbar-burger").click()');
  assert(await evaluate('document.querySelector("#navbar-burger").getAttribute("aria-expanded")==="true" && document.querySelector(".navbar-custom").classList.contains("is-open")'), 'Mobile public navbar opens');
  await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
  await navigate('/analytics.php');
  await waitFor('typeof window.Chart === "function" && Object.keys(window.Chart.instances).length===5');
  assert(await evaluate('Object.keys(window.Chart.instances).length===5'),'Analytics renders five charts');
  await evaluate('document.querySelector("#refresh-analytics").click()');
  assert(await evaluate('document.querySelector("#analytics-status").textContent.includes("(1)")'),'Analytics refresh works');
  assert(errors.length===0,'No uncaught JS exceptions');
"""
            script=temp/'browser.mjs';script.write_text(original[:start]+checks+original[end:],encoding='utf-8')
            options={'browser':os.environ['TEST_BROWSER'],'base':base,'username':username,'password':password,'projectId':id,'screenshots':str(Path(tempfile.gettempdir())/'kamiliya-final-audit-preview')}
            result=subprocess.run(['node',str(script)],input=json.dumps(options).encode(),capture_output=True,creationflags=FLAGS,timeout=150)
            print(result.stdout.decode(errors='replace'),flush=True)
            check(result.returncode==0,'Browser regression checks')
            if result.returncode:print(result.stderr.decode(errors='replace'),flush=True)
        edit={**fields,'id':id,'title':prefix+' edited','description':'Description updated','category':'Dashboard','tech':'Laravel, PHP','demo_url':'https://youtu.be/audit-demo'};edit['csrf_token']=admin.token(f'/admin/edit_project.php?id={id}')
        check(admin.request(f'/admin/edit_project.php?id={id}',{**edit,'csrf_token':'invalid'})[0]==403,'Edit CSRF rejected')
        check(admin.request(f'/admin/edit_project.php?id={id}',edit)[0]==303,'J5 edit project')
        card=project_card(guest.request('/project.php')[2],id);check(edit['title'].encode() in card and b'Description updated' in card and b'>Laravel</span>' in card and b'youtu.be/audit-demo' in card,'J6 edits reflected public')
        status,headers,data=admin.request(f'/download-project.php?id={id}');check(status==200 and data==png and 'attachment' in headers.get('Content-Disposition',''),'J7 download image file by ID')
        check(admin.request(f'/admin/edit_project.php?id={id}',edit,('document.pdf',pdf,'application/pdf'))[0]==303,'Replace PNG with PDF')
        check(not old_file.exists(),'Old image unlinked after committed update')
        card=project_card(guest.request('/project.php')[2],id);check(b'<img ' not in card and b'>PDF</text>' in card and b'download-project.php?id=' in card and b'&amp;view=1' in card and b'Lihat PDF' in card,'Public PDF placeholder with View PDF link')
        status,headers,data=guest.request(f'/download-project.php?id={id}');check(status==200 and data==pdf and headers.get('Content-Type')=='application/pdf','PDF download endpoint handles bytes correctly')
        status,headers,data=guest.request(f'/download-project.php?id={id}&view=1');check(status==200 and data==pdf and headers.get('Content-Disposition','').startswith('inline;'),'Public PDF view uses inline header and exact PDF bytes')
        path=ROOT/query('SELECT file_path FROM projects WHERE id=?',[id])[0]['file_path'];token=admin.token('/admin/projects.php')
        check(admin.request('/admin/delete_project.php',{'id':id,'csrf_token':'invalid'})[0]==403,'Delete CSRF rejected')
        check(admin.request(f'/admin/delete_project.php?id={id}')[0]==405,'GET delete denied')
        check(admin.request('/admin/delete_project.php',{'id':id,'csrf_token':token})[0]==303,'J8 delete project')
        check(not path.exists(),'J9 physical upload deleted')
        check(project_card(guest.request('/project.php')[2],id) is None,'J10 deleted project absent public');id=None
        old_sid=admin.cookie();check(admin.request('/logout.php',{'csrf_token':token})[0]==303,'J11 logout')
        status,headers,_=admin.request('/admin/dashboard.php');check(status==303 and headers.get('Location')=='/admin-login.php','J12 admin access redirects after logout')
        replay=Client(base);replay.opener.addheaders=[('Cookie','kamiliya_admin='+old_sid)];check(replay.request('/admin/dashboard.php')[0]==303,'Destroyed session cannot be replayed')
        # Validate contact without inserting or changing any contact record.
        contact=Client(base);contact_token=contact.token('/contact.php');status,_,_=contact.request('/contact.php',{'csrf_token':contact_token,'name':'','email':'not-an-email','message':''});check(status==303,'Contact invalid POST redirects')
        body=contact.request('/contact.php')[2];check(b'Nama wajib diisi' in body and b'Email tidak valid' in body and b'Pesan wajib diisi' in body,'Contact validation errors rendered')
        status,headers,data=guest.request('/download-cv.php');check(status==200 and data==(ROOT/'assets/cv/CV - KAMILIYA LATIFAH PRASMAISYA-IT 2026.pdf').read_bytes() and 'attachment' in headers.get('Content-Disposition',''),'CV download exact bytes')
        check(query('SELECT * FROM projects ORDER BY id')==before,'All original project rows unchanged')
        check(query('SELECT * FROM contact_messages ORDER BY id')==before_contacts,'All contact rows unchanged')
    finally:
        if id is not None and id not in {r['id'] for r in before}:
            remaining=query('SELECT title FROM projects WHERE id=?',[id])
            if remaining and remaining[0]['title'].startswith(prefix):
                token=admin.token('/admin/projects.php');admin.request('/admin/delete_project.php',{'id':id,'csrf_token':token})
        server.terminate();server.wait(timeout=15);log.close()
    text=(temp/'php.log').read_text(errors='replace');check(not re.search(r'PHP (Warning|Fatal error|Notice|Deprecated|Parse error):',text),'No PHP warning/fatal/notice/deprecation E_ALL')
check(all((ROOT/name).is_file() and hashlib.sha256((ROOT/name).read_bytes()).hexdigest()==digest for name,digest in sources.items()),'All original workspace files unchanged')
print('FINAL 60-REQUIREMENT FUNCTIONAL AUDIT PASSED',flush=True)
