// Browser interaction + responsive screenshots against the isolated integration fixture.
import { spawn } from 'node:child_process';
import { mkdir, writeFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, join, sep } from 'node:path';
import net from 'node:net';

let input = '';
for await (const chunk of process.stdin) input += chunk;
const options = JSON.parse(input);
const profile = await mkdtemp(join(tmpdir(), 'kamiliya-browser-'));
const screenshots = resolve(options.screenshots);
await mkdir(screenshots, { recursive: true });
const port = await new Promise(resolvePort => {
  const server = net.createServer();
  server.listen(0, '127.0.0.1', () => { const port = server.address().port; server.close(() => resolvePort(port)); });
});
const browser = spawn(options.browser, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=' + port, '--user-data-dir=' + profile, 'about:blank'], { windowsHide: true, stdio: 'ignore' });
let ws;
const pending = new Map();
const errors = [];
let nextId = 0;
const sleep = ms => new Promise(resolveSleep => setTimeout(resolveSleep, ms));
function assert(value, message) { if (!value) throw new Error(message); console.log('PASS BROWSER:', message); }
try {
  let pages;
  for (let attempt = 0; attempt < 100; attempt++) {
    try { pages = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); if (pages.some(p => p.type === 'page')) break; } catch {}
    await sleep(100);
  }
  ws = new WebSocket(pages.find(p => p.type === 'page').webSocketDebuggerUrl);
  await new Promise((resolveOpen, rejectOpen) => { ws.addEventListener('open', resolveOpen, { once: true }); ws.addEventListener('error', rejectOpen, { once: true }); });
  ws.addEventListener('message', event => {
    const data = JSON.parse(event.data);
    if (data.id && pending.has(data.id)) {
      const { resolve, reject, timeout } = pending.get(data.id); clearTimeout(timeout); pending.delete(data.id);
      if (data.error) reject(new Error(JSON.stringify(data.error))); else resolve(data.result);
    }
    if (data.method === 'Runtime.exceptionThrown') errors.push(data.params.exceptionDetails.text);
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++nextId;
    const timeout = setTimeout(() => { pending.delete(id); reject(new Error('CDP timeout: ' + method)); }, 15000);
    pending.set(id, { resolve, reject, timeout }); ws.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async expression => {
    const data = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (data.exceptionDetails) throw new Error(JSON.stringify(data.exceptionDetails));
    return data.result.value;
  };
  const waitFor = async expression => {
    for (let attempt = 0; attempt < 100; attempt++) {
      try { if (await evaluate(expression)) return; } catch {}
      await sleep(100);
    }
    throw new Error('Timed out waiting for page state: ' + expression);
  };
  const navigate = async path => { const target = new URL(path, options.base); await send('Page.navigate', { url: target.href }); await waitFor('document.readyState === "complete" && location.pathname === ' + JSON.stringify(target.pathname) + ' && location.search === ' + JSON.stringify(target.search)); await sleep(150); };
  const screenshot = async name => {
    const result = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
    await writeFile(join(screenshots, name), Buffer.from(result.data, 'base64'));
  };
  await send('Page.enable'); await send('Runtime.enable'); await send('DOM.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await navigate('/admin-login.php');
  await screenshot('admin-login-dark.png');
  await evaluate(`document.querySelector('#username').value=${JSON.stringify(options.username)};document.querySelector('#password').value=${JSON.stringify(options.password)};document.querySelector('[data-show-password]').click();`);
  assert(await evaluate('document.querySelector("#password").type === "text"'), 'Show password button');
  await evaluate('document.querySelector("[data-show-password]").click();document.querySelector("form").requestSubmit();');
  await waitFor('location.pathname === "/admin/dashboard.php" && document.readyState === "complete"');
  assert(await evaluate('!!document.querySelector(".admin-sidebar")'), 'Browser login/dashboard');
  await screenshot('admin-dashboard-dark.png');
  await evaluate('document.querySelector("[data-theme-toggle]").click()');
  assert(await evaluate('document.body.classList.contains("light") && localStorage.getItem("theme") === "light"'), 'Light theme and shared localStorage');
  assert(await evaluate('getComputedStyle(document.querySelector("h1")).color === "rgb(15, 23, 42)"'), 'Light theme uses dark legible headings');
  await screenshot('admin-dashboard-light.png');
  await navigate('/admin/add_project.php');
  await evaluate('document.querySelector("#title").value="Sales Order System";document.querySelector("#description").value="Dashboard analisis sales order dengan PHP dan MySQL.";document.querySelector("#tech").value="PHP, MySQL, Bootstrap";document.querySelector("#category").value="Web Application"');
  const { root } = await send('DOM.getDocument');
  const { nodeId } = await send('DOM.querySelector', { nodeId: root.nodeId, selector: '#file' });
  await send('DOM.setFileInputFiles', { nodeId, files: [options.upload] });
  await screenshot('admin-add-light.png');
  await evaluate('document.querySelector("form.admin-form").requestSubmit()');
  await waitFor('location.pathname === "/admin/projects.php" && document.readyState === "complete"');
  assert(await evaluate('document.querySelector(".admin-table").textContent.includes("Sales Order System")'), 'Browser form upload/INSERT');
  const detailPath = await evaluate('[...document.querySelectorAll(".admin-table tbody tr")].find(row=>row.textContent.includes("Sales Order System")).querySelector("a").getAttribute("href")');
  await navigate(detailPath);
  await evaluate('document.querySelector("[data-theme-toggle]").click()');
  await screenshot('admin-detail-dark.png');
  await evaluate('document.querySelector("[data-delete-id]").click()');
  assert(await evaluate('document.querySelector("#delete-dialog").open && document.querySelector("#delete-project-name").textContent === "Sales Order System"'), 'Delete modal shows exact project name');
  await screenshot('admin-delete-modal-dark.png');
  await evaluate('document.querySelector("#delete-dialog [data-close-dialog]").click()');
  assert(await evaluate('!document.querySelector("#delete-dialog").open'), 'Cancel delete keeps detail page');
  const editPath = await evaluate('[...document.querySelectorAll("a")].find(a=>a.textContent==="Edit").getAttribute("href")');
  await navigate(editPath);
  assert(await evaluate('document.querySelector("#title").value === "Sales Order System" && !document.querySelector("#file").required'), 'Edit fields populated/file optional');
  await screenshot('admin-edit-dark.png');
  await navigate('/admin/dashboard.php');
  await screenshot('admin-dashboard-dark.png');
  await evaluate('document.querySelector("[data-theme-toggle]").click()');
  await screenshot('admin-dashboard-light.png');
  await evaluate('document.querySelector("[data-theme-toggle]").click()');
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await sleep(150);
  assert(await evaluate('document.documentElement.scrollWidth <= window.innerWidth'), 'Mobile layout has no page overflow');
  assert(await evaluate('document.querySelector(".table-scroll").scrollWidth > document.querySelector(".table-scroll").clientWidth && document.querySelector(".admin-table tbody tr").getBoundingClientRect().height < 180'), 'Mobile table scrolls with readable compact rows');
  await screenshot('admin-dashboard-mobile.png');
  await evaluate('document.querySelector("#account-trigger").click();document.querySelector("[data-open-logout]").click()');
  assert(await evaluate('document.querySelector("#logout-dialog").open'), 'Logout confirmation modal');
  await screenshot('admin-logout-modal-mobile.png');
  await evaluate('document.querySelector("#logout-dialog form").requestSubmit()');
  await waitFor('location.pathname === "/admin-login.php" && document.readyState === "complete"');
  assert(true, 'Browser logout returns to login');
  assert(errors.length === 0, 'No uncaught browser JavaScript exceptions');
  console.log('SCREENSHOTS:', screenshots);
} finally {
  if (ws) ws.close();
  browser.kill();
  await new Promise(resolveExit => { if (browser.exitCode !== null) resolveExit(); else { browser.once('exit', resolveExit); setTimeout(resolveExit, 5000); } });
  const resolvedProfile = resolve(profile);
  if (!resolvedProfile.startsWith(resolve(tmpdir()) + sep) || !resolvedProfile.includes('kamiliya-browser-')) throw new Error('Unsafe profile cleanup target');
  await rm(resolvedProfile, { recursive: true, force: true, maxRetries: 5, retryDelay: 500 });
}
