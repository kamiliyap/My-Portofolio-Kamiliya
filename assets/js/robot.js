(() => {
  'use strict';
  const qa = document.getElementById('chatbox-toggle');
  if (!qa || document.getElementById('portfolio-robot')) return;

  const scriptUrl = document.currentScript.src;
  const asset = (name) => new URL(`../robot/robot-${name}.png`, scriptUrl).href;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const coarsePointer = matchMedia('(pointer: coarse)');
  const controls = document.createElement('div');
  controls.className = 'robot-controls';
  qa.before(controls);
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'robot-toggle';
  toggle.setAttribute('aria-pressed', 'false');
  toggle.setAttribute('aria-controls', 'portfolio-robot');
  controls.append(toggle, qa);

  const robot = document.createElement('button');
  robot.id = 'portfolio-robot';
  robot.className = 'portfolio-robot';
  robot.type = 'button';
  robot.hidden = true;
  robot.innerHTML = '<span class="robot-body"><img class="robot-sprite" alt="" draggable="false"></span><span class="robot-bubble" role="status"></span><span class="robot-hearts" aria-hidden="true"></span>';
  document.body.append(robot);
  const sprite = robot.querySelector('img');
  const bubble = robot.querySelector('.robot-bubble');
  const hearts = robot.querySelector('.robot-hearts');
  const sprites = { idle: 'idle', follow: 'walk', fly: 'fly', surprised: 'surprised', love: 'love', happy: 'love' };
  sprite.src = asset('idle');
  sprite.addEventListener('error', () => {
    if (sprite.src !== asset('idle')) sprite.src = asset('idle');
  });

  let active = false, leaving = false, robotState = 'idle', frame = 0;
  let x = 0, y = 0, tilt = 0, previousFrame = 0, flightUntil = 0;
  let lastMove = 0, holdUntil = 0, surpriseUntil = 0, lastBubble = -Infinity;
  let bubbleTimer, lastTap = -Infinity, hoveredLink = null;
  let strokeDirection = 0, strokeDistance = 0, turns = 0, lastTurn = 0, pets = 0;
  const pointer = { x: innerWidth / 2, y: innerHeight / 2, time: 0, seen: false };
  const words = {
    id: { call: '🤖 Panggil Robot', active: '🤖 Robot Aktif', leave: '👋 Pulangkan Robot', label: 'Robot Kamiliya. Klik dua kali untuk membuatnya kaget.', hi: 'Hai! 👋', cv: 'Jangan lupa download CV 😁', projects: 'Lihat project Kamiliya yuk!', certificates: 'Lihat sertifikasi Kamiliya ✨', contact: 'Yuk, ngobrol dengan Kamiliya!' },
    en: { call: '🤖 Call Robot', active: '🤖 Robot Active', leave: '👋 Send Robot Home', label: 'Kamiliya’s robot. Double click to surprise it.', hi: 'Hi! 👋', cv: 'Remember to download my CV 😁', projects: 'Explore Kamiliya’s projects!', certificates: 'Explore Kamiliya’s certifications ✨', contact: 'Let’s talk to Kamiliya!' }
  };
  const copy = () => words[document.documentElement.lang] || words.id;
  function labels() {
    toggle.textContent = leaving ? copy().leave : active ? copy().active : copy().call;
    toggle.title = active ? copy().leave : copy().call;
    toggle.setAttribute('aria-label', active ? copy().leave : copy().call);
    robot.setAttribute('aria-label', copy().label);
  }
  new MutationObserver(() => { labels(); bubble.classList.remove('is-visible'); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  labels();

  function state(next) {
    if (robotState === next && robot.dataset.state) return;
    robotState = next;
    robot.dataset.state = next;
    sprite.src = asset(sprites[next]);
  }
  function say(text, now = performance.now()) {
    if (now - lastBubble < 6000) return;
    lastBubble = now;
    bubble.textContent = text;
    bubble.classList.add('is-visible');
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => bubble.classList.remove('is-visible'), 2400);
  }
  function emitHearts(count) {
    for (let i = 0; i < count; i++) {
      const heart = document.createElement('span');
      heart.className = 'robot-heart';
      heart.textContent = '♥';
      heart.style.setProperty('--heart-x', `${(i - (count - 1) / 2) * 15}px`);
      heart.style.animationDelay = `${i * .07}s`;
      hearts.append(heart);
      setTimeout(() => heart.remove(), 1800);
    }
  }
  const clamp = (n, min, max) => Math.max(min, Math.min(n, Math.max(min, max)));
  const overlaps = (px, py, size, r) => px < r.right + 12 && px + size > r.left - 12 && py < r.bottom + 12 && py + size > r.top - 12;
  function safeTarget(tx, ty, size) {
    tx = clamp(tx, 12, innerWidth - size - 12);
    ty = clamp(ty, 70, innerHeight - size - 12);
    const obstacles = [document.getElementById('chatbox-widget'), hoveredLink, document.querySelector('.navbar-custom')]
      .filter(Boolean).map((el) => el.getBoundingClientRect());
    for (const r of obstacles) {
      if (!overlaps(tx, ty, size, r)) continue;
      const candidates = [[r.left - size - 18, ty], [r.right + 18, ty], [tx, r.top - size - 18], [tx, r.bottom + 18]];
      const available = candidates.filter(([cx, cy]) => cx >= 12 && cy >= 70 && cx + size <= innerWidth - 12 && cy + size <= innerHeight - 12 && !obstacles.some((other) => overlaps(cx, cy, size, other)));
      available.sort((a, b) => Math.hypot(a[0] - tx, a[1] - ty) - Math.hypot(b[0] - tx, b[1] - ty));
      if (available.length) [tx, ty] = available[0];
    }
    return [tx, ty];
  }
  function onHead(px, py) {
    const r = robot.getBoundingClientRect();
    return px >= r.left + r.width * .12 && px <= r.right - r.width * .12 && py >= r.top && py <= r.top + r.height * .55;
  }
  function resetStrokes() { turns = 0; strokeDistance = 0; strokeDirection = 0; }

  document.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch') return;
    const now = performance.now();
    const dx = event.clientX - pointer.x;
    const speed = Math.hypot(dx, event.clientY - pointer.y) / Math.max(1, now - pointer.time);
    const head = active && !leaving && now > flightUntil && onHead(event.clientX, event.clientY);
    if (head && now > surpriseUntil) {
      // Hold still during a potential stroke; only repeated slow reversals trigger affection.
      holdUntil = now + 1500;
      if (speed <= .65 && Math.abs(dx) > .4) {
        if (now - lastTurn > 1800) {
          resetStrokes();
          lastTurn = now;
        }
        const direction = Math.sign(dx);
        if (direction !== strokeDirection && strokeDistance >= 6) {
          turns++;
          lastTurn = now;
          strokeDistance = 0;
        }
        strokeDirection = direction;
        strokeDistance += Math.abs(dx);
        if (!lastTurn) lastTurn = now;
        if (turns >= 3) {
          pets++;
          state(pets >= 3 ? 'happy' : 'love');
          emitHearts(pets >= 3 ? 8 : 3);
          clearTimeout(bubbleTimer);
          bubble.classList.remove('is-visible');
          bubble.textContent = '';
          resetStrokes();
          lastTurn = now;
        }
      } else if (speed > .65) resetStrokes();
    } else {
      resetStrokes();
      lastTurn = now;
    }
    Object.assign(pointer, { x: event.clientX, y: event.clientY, time: now, seen: true });
    lastMove = now;
    hoveredLink = event.target.closest('a, button, input, textarea, select');
    if (hoveredLink === robot || hoveredLink === toggle) hoveredLink = null;
    if (active && hoveredLink?.matches('a')) {
      const href = hoveredLink.getAttribute('href') || '';
      const key = /download-cv/.test(href) ? 'cv' : /project\.php/.test(href) ? 'projects' : /certifications/.test(href) ? 'certificates' : /contact\.php/.test(href) ? 'contact' : null;
      if (key) say(copy()[key], now);
    }
  }, { passive: true });

  function surprise() {
    if (!active || leaving || performance.now() < flightUntil) return;
    const now = performance.now();
    surpriseUntil = now + 1000;
    holdUntil = 0;
    resetStrokes();
    state('surprised');
    say('😲', now);
  }
  document.addEventListener('dblclick', (event) => {
    const r = robot.getBoundingClientRect();
    if (Math.hypot(event.clientX - r.left - r.width / 2, event.clientY - r.top - r.height / 2) < r.width + 45) surprise();
  });
  robot.addEventListener('click', (event) => {
    const now = performance.now();
    if (event.detail === 0 || now - lastTap < 350) surprise();
    lastTap = now;
  });

  function animate(now) {
    if (!active || document.hidden) { frame = 0; return; }
    const dt = Math.min(now - previousFrame || 16, 50);
    previousFrame = now;
    const size = robot.offsetWidth;
    let tx = x, ty = y;
    if (leaving) {
      tx = innerWidth + size + 30;
      ty = innerHeight + size;
      state('fly');
      if (now > flightUntil) { finish(); return; }
    } else if (now < flightUntil) {
      [tx, ty] = safeTarget(innerWidth - size - 45, innerHeight - size - 115, size);
      state('fly');
    } else if (now < surpriseUntil) state('surprised');
    else if (now < holdUntil) {
      if (!['love', 'happy'].includes(robotState)) state('idle');
    } else {
      const following = pointer.seen && !coarsePointer.matches;
      [tx, ty] = following ? safeTarget(pointer.x + 45, pointer.y + 35, size) : safeTarget(innerWidth - size - 45, innerHeight - size - 115, size);
      state(following && now - lastMove < 250 ? 'follow' : 'idle');
    }
    const alpha = 1 - Math.exp(-dt / (reducedMotion.matches ? 240 : 150));
    const vx = tx - x;
    x += vx * alpha;
    y += (ty - y) * alpha;
    tilt += ((reducedMotion.matches ? 0 : clamp(vx * .12, -12, 12)) - tilt) * alpha;
    robot.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${tilt}deg)`;
    // Pass clicks through while crossing controls during a flight or a resize.
    const protectedAreas = [document.getElementById('chatbox-widget'), hoveredLink]
      .filter(Boolean).map((el) => el.getBoundingClientRect());
    robot.style.pointerEvents = protectedAreas.some((r) => overlaps(x, y, size, r)) ? 'none' : 'auto';
    // Keep the speech bubble inside the viewport without widening the page.
    bubble.style.marginLeft = `${clamp(x + size / 2, 95, innerWidth - 95) - (x + size / 2)}px`;
    frame = requestAnimationFrame(animate);
  }
  function finish() {
    active = false;
    leaving = false;
    robot.hidden = true;
    cancelAnimationFrame(frame);
    frame = 0;
    clearTimeout(bubbleTimer);
    bubble.classList.remove('is-visible');
    hearts.replaceChildren();
    toggle.setAttribute('aria-pressed', 'false');
    labels();
  }
  toggle.addEventListener('click', () => {
    if (leaving) return;
    const now = performance.now();
    if (active) {
      leaving = true;
      flightUntil = now + (reducedMotion.matches ? 100 : 650);
      bubble.classList.remove('is-visible');
      labels();
      return;
    }
    active = true;
    robot.style.transform = `translate3d(${innerWidth}px, ${innerHeight + 100}px, 0)`;
    robot.hidden = false;
    x = innerWidth - robot.offsetWidth - 45;
    y = innerHeight + 100;
    holdUntil = surpriseUntil = 0;
    pets = 0;
    resetStrokes();
    flightUntil = now + 850;
    toggle.setAttribute('aria-pressed', 'true');
    labels();
    say(copy().hi, now);
    previousFrame = now;
    frame = requestAnimationFrame(animate);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && active && !leaving) { toggle.click(); toggle.focus(); }
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
    else if (active && !frame) { previousFrame = performance.now(); frame = requestAnimationFrame(animate); }
  });
})();
