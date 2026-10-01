// Anime.js resmi v3.2.2 sebagai module privat, bukan window.anime.
import anime from './vendor/anime-3.2.2.es.js';

class PortfolioAssistant {
  constructor(root) {
    this.root = root;
    // Konteks halaman memakai pathname, terpisah dari query bahasa ID/EN.
    const path = window.location.pathname.toLowerCase();
    if (path.includes('analytics')) this.pageContext = 'analytics';
    else if (path.includes('contact')) this.pageContext = 'contact';
    else this.pageContext = 'portfolio';
    this.panel = root.querySelector('.assistant-panel');
    this.bubble = root.querySelector('.assistant-bubble');
    this.sleepHint = root.querySelector('.assistant-sleep-hint');
    this.message = root.querySelector('.assistant-message');
    this.character = root.querySelector('.assistant-character');
    this.image = this.character.querySelector('img');
    this.float = root.querySelector('.assistant-float');
    this.follow = root.querySelector('.assistant-follow');
    this.controls = {};
    root.querySelectorAll('[data-assistant]').forEach((element) => { this.controls[element.dataset.assistant] = element; });
    this.controls.summon = document.querySelector('[data-assistant="summon"]');
    this.motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.pointer = window.matchMedia('(pointer: fine)');
    this.supportsSpeech = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
    // Satu sumber state untuk alur UI dan animasi; session membatalkan callback lama.
    this.state = {
      phase: 'sleeping', robot: 'sleeping', closed: false, session: 0,
      get resting() { return this.phase === 'sleeping' || this.phase === 'waking'; },
      get speaking() { return this.phase === 'speaking'; },
      get finished() { return this.phase === 'finished'; }
    };
    this.utterance = null;
    this.expressionTimer = null;
    this.speechTimer = null;
    this.motionLoop = null;
    this.roaming = null;
    this.roamTimer = null;
    this.interacting = false;
    this.followFrame = null;
    this.followTarget = { x: 0, y: 0 };
    this.followPosition = { x: 0, y: 0 };
    this.followResetTimer = null;
    this.petTrack = { point: null, direction: 0, distance: 0, turns: 0, lastAt: 0 };
    this.touchTrack = null;
    this.lastTap = 0;
    this.voices = this.supportsSpeech ? window.speechSynthesis.getVoices() : [];
    this.assets = {};
    ['tidur', 'idle', 'walk', 'fly', 'surprised', 'love'].forEach((name) => {
      this.assets[name] = new URL(`../robot/robot-${name}.png`, import.meta.url).href;
      const preload = new Image();
      preload.src = this.assets[name];
    });
    this.bindEvents();
    this.setPhase('sleeping');
    this.setImage('tidur');
    root.hidden = false;
    this.startRobotSleeping();
    console.log('[Portfolio Assistant] Ready', { speech: this.supportsSpeech, animation: 'Anime.js 3.2.2 module' });
  }

  get english() { return document.documentElement.lang.toLowerCase().startsWith('en'); }

  pageExplanation() {
    if (this.pageContext === 'analytics') {
      return this.english
        ? "The Analytics page gives a visual overview of Kamiliya's skills, projects, and learning journey. Explore the skill overview, project categories, learning progress, technologies used in projects, and project complexity and duration analysis."
        : 'Halaman Analytics menampilkan gambaran visual mengenai skill, project, dan perjalanan belajar Kamiliya. Kamu dapat melihat skill overview, kategori project, learning progress, teknologi yang digunakan dalam project, serta analisis tingkat kesulitan dan durasi pengerjaan project.';
    }
    if (this.pageContext === 'contact') {
      return this.english
        ? 'To contact Kamiliya, email kamiliyaprasmaisya@gmail.com or fill out the Start a Discussion form on this page.'
        : 'Jika ingin menghubungi Kamiliya, kamu dapat mengirim email ke kamiliyaprasmaisya@gmail.com atau mengisi form Mulai Diskusi di halaman ini.';
    }
    return '';
  }

  setPhase(phase) {
    this.state.phase = phase;
    this.root.dataset.state = phase;
    this.setRobotState(phase === 'sleeping' ? 'sleeping' : phase === 'speaking' ? 'speaking' : 'idle');
    this.bubble.hidden = this.state.resting;
    this.sleepHint.hidden = !this.state.resting;
    this.character.setAttribute('aria-expanded', String(!this.state.resting));
    this.renderControls();
    console.log('[Portfolio Assistant] State:', phase);
  }

  setRobotState(state) {
    this.state.robot = state;
    this.root.dataset.robotState = state;
  }

  // Greeting native: dihitung saat tampil dan saat tombol suara diklik.
  greeting() {
    const hour = new Date().getHours();
    let greeting;
    if (hour >= 5 && hour < 11) greeting = this.english ? 'Good morning' : 'Selamat pagi';
    else if (hour >= 11 && hour < 15) greeting = this.english ? 'Good afternoon' : 'Selamat siang';
    else if (hour >= 15 && hour < 18) greeting = this.english ? 'Good evening' : 'Selamat sore';
    else greeting = this.english ? 'Good night' : 'Selamat malam';
    return greeting;
  }

  story() {
    // Tombol suara pada halaman khusus membacakan bantuan halaman tersebut.
    if (this.pageContext !== 'portfolio') return [this.pageExplanation()];
    const introStory = this.english ? [
      'Kamiliya began her journey in Informatics Engineering.',
      'She then strengthened her skills through training, certifications, and real projects.',
      'Kamiliya has developed a Sales Order System, school report applications, school finance applications, a portfolio website, and a mobile application.',
      'Today, Kamiliya continues to develop her skills in web development and backend development.'
    ] : [
      'Kamiliya memulai perjalanan dari Teknik Informatika.',
      'Kemudian ia memperkuat kemampuan melalui pelatihan, sertifikasi, dan berbagai project nyata.',
      'Kamiliya pernah mengembangkan Sales Order System, aplikasi rapor sekolah, aplikasi keuangan sekolah, portfolio website, dan mobile application.',
      'Sekarang Kamiliya terus mengembangkan kemampuan di bidang web development dan backend.'
    ];
    return [`${this.greeting()}.`, ...introStory];
  }

  renderControls() {
    const en = this.english;
    this.controls.listen.textContent = this.supportsSpeech
      ? (en ? 'Listen to Explanation' : 'Dengarkan Penjelasan')
      : (en ? 'Read Explanation' : 'Baca Penjelasan');
    if (this.state.finished) this.controls.listen.textContent = en ? 'Replay Story' : 'Ulangi Cerita';
    this.controls.stop.textContent = '\u25a0 Stop';
    this.controls.summon.textContent = en ? 'Call Robot' : 'Panggil Robot';
    this.controls.summon.hidden = this.state.speaking;
    this.controls.projects.textContent = en ? 'View Projects' : 'Lihat Projects';
    this.controls.analytics.textContent = en ? 'View Analytics' : 'Lihat Analytics';
    this.controls.contact.textContent = en ? 'Contact Kamiliya' : 'Hubungi Kamiliya';
    this.controls.open.textContent = en ? 'Portfolio Assistant' : 'Asisten Portfolio';
    this.controls.close.setAttribute('aria-label', en ? 'Close assistant' : 'Tutup asisten');
    this.character.setAttribute('aria-label', en ? 'Robot: double click for a surprised expression' : 'Robot: klik dua kali untuk ekspresi kaget');
    this.sleepHint.textContent = en ? 'Click to wake up' : 'Klik untuk membangunkan';
    if (this.state.resting) this.character.setAttribute('aria-label', this.sleepHint.textContent);
    this.controls.listen.disabled = this.state.speaking;
    this.controls.listen.hidden = this.state.speaking;
    this.controls.stop.hidden = !this.state.speaking;
    ['projects', 'analytics', 'contact'].forEach((key) => {
      this.controls[key].hidden = this.state.speaking;
    });
    if (this.state.finished) {
      this.controls.projects.textContent = 'Projects';
      this.controls.analytics.textContent = 'Analytics';
      this.controls.contact.textContent = en ? 'Contact' : 'Kontak';
    }
    ['projects', 'analytics', 'contact'].forEach((key) => {
      const paths = { projects: 'project.php', analytics: 'analytics.php', contact: 'contact.php' };
      this.controls[key].href = `${paths[key]}?lang=${en ? 'en' : 'id'}`;
    });
    if (this.pageContext !== 'portfolio') {
      this.controls.listen.textContent = this.supportsSpeech
        ? (this.state.finished ? (en ? 'Listen Again' : 'Dengarkan Lagi') : (en ? 'Listen to Page Guide' : 'Dengarkan Penjelasan'))
        : (en ? 'Read Page Guide' : 'Baca Penjelasan');
    }
    if (this.pageContext === 'analytics') {
      this.controls.projects.textContent = en ? 'View Skills' : 'Lihat Skill';
      this.controls.projects.setAttribute('href', '#skills-title');
      this.controls.analytics.textContent = en ? 'View Project Analytics' : 'Lihat Project Analytics';
      this.controls.analytics.setAttribute('href', '#technology-title');
      this.controls.contact.textContent = en ? 'Back to Portfolio' : 'Kembali ke Portfolio';
      this.controls.contact.href = `index.php?lang=${en ? 'en' : 'id'}`;
      this.controls.contact.hidden = this.state.speaking;
    } else if (this.pageContext === 'contact') {
      this.controls.projects.textContent = en ? 'Send Email' : 'Kirim Email';
      this.controls.projects.setAttribute('href', 'mailto:kamiliyaprasmaisya@gmail.com');
      this.controls.analytics.textContent = en ? 'Start a Discussion' : 'Mulai Diskusi';
      this.controls.analytics.setAttribute('href', '#contact-form');
      this.controls.contact.hidden = true;
    }
  }

  renderWelcome() {
    if (this.state.resting) { this.renderControls(); return; }
    if (this.state.phase !== 'welcome') this.setPhase('welcome');
    else this.renderControls();
    this.message.textContent = `${this.greeting()}! ${this.english ? "I'm Kamiliya Assistant." : 'Saya Kamiliya Assistant.'}`;
  }

  startRobotSleeping() {
    this.stopRobotTalking();
    this.stopRoaming(true);
    this.resetFollow(true);
    if (this.motion.matches || document.hidden) return;
    this.motionLoop = anime({ targets: this.character, translateY: [-3, 3], duration: 2200, direction: 'alternate', loop: true, easing: 'easeInOutSine' });
  }

  // Klik membangunkan saja, tidak pernah memulai speech synthesis.
  wakeRobot() {
    if (this.state.phase !== 'sleeping') return;
    const chatButton = document.getElementById('chatbox-toggle');
    if (chatButton?.getAttribute('aria-expanded') === 'true') chatButton.click();
    this.setPhase('waking');
    this.stopRobotTalking();
    this.setImage('idle');
    const completeWake = () => {
      if (this.state.phase !== 'waking') return;
      this.wakeAnimation = null;
      this.setPhase('welcome');
      this.renderWelcome();
      this.enter();
    };
    this.completeWake = completeWake;
    if (this.motion.matches) { completeWake(); return; }
    this.wakeAnimation = anime({ targets: this.character, scale: [0.94, 1.06, 1], rotate: [0, -4, 4, 0], duration: 850, easing: 'easeInOutSine', complete: completeWake });
  }

  setImage(name) { this.image.src = this.assets[name]; }

  followAt(x, y) {
    if (this.state.resting || this.state.speaking || this.state.closed) return;
    this.followTarget = { x, y };
    if (!['love', 'surprised'].includes(this.state.robot)) {
      if (this.state.robot !== 'following') {
        this.setRobotState('following');
        this.setImage('walk');
      }
    }
    clearTimeout(this.followResetTimer);
    this.followResetTimer = setTimeout(() => {
      this.followTarget = { x: 0, y: 0 };
      if (this.state.robot === 'following') {
        this.setRobotState('idle');
        this.setImage('idle');
      }
      if (this.motion.matches) this.resetFollow(true);
      else if (!this.followFrame) this.followFrame = requestAnimationFrame(() => this.animateFollow());
    }, 650);
    if (this.motion.matches) {
      this.followPosition = { ...this.followTarget };
      this.follow.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    } else if (!this.followFrame) this.followFrame = requestAnimationFrame(() => this.animateFollow());
  }

  animateFollow() {
    const xDistance = this.followTarget.x - this.followPosition.x;
    const yDistance = this.followTarget.y - this.followPosition.y;
    this.followPosition.x += xDistance * 0.18;
    this.followPosition.y += yDistance * 0.18;
    if (Math.abs(xDistance) < 0.2 && Math.abs(yDistance) < 0.2) {
      this.followPosition = { ...this.followTarget };
      this.follow.style.transform = this.followTarget.x || this.followTarget.y
        ? `translate3d(${this.followTarget.x}px, ${this.followTarget.y}px, 0)` : '';
      this.followFrame = null;
      return;
    }
    this.follow.style.transform = `translate3d(${this.followPosition.x}px, ${this.followPosition.y}px, 0)`;
    this.followFrame = requestAnimationFrame(() => this.animateFollow());
  }

  resetFollow(immediate = false) {
    clearTimeout(this.followResetTimer);
    this.followTarget = { x: 0, y: 0 };
    if (this.state.robot === 'following') {
      this.setRobotState('idle');
      if (!this.state.resting && !this.state.speaking) this.setImage('idle');
    }
    if (immediate || this.motion.matches) {
      if (this.followFrame) cancelAnimationFrame(this.followFrame);
      this.followFrame = null;
      this.followPosition = { x: 0, y: 0 };
      this.follow.style.transform = '';
    } else if (!this.followFrame) {
      this.followFrame = requestAnimationFrame(() => this.animateFollow());
    }
  }

  trackPetMove(x, y) {
    const now = performance.now();
    const bounds = this.character.getBoundingClientRect();
    if (y > bounds.top + bounds.height * 0.65 || this.state.resting || this.state.speaking) {
      this.petTrack.point = null;
      return;
    }
    const previous = this.petTrack.point;
    this.petTrack.point = { x, y };
    if (!previous) { this.petTrack.lastAt = now; return; }
    const dx = x - previous.x;
    const elapsed = Math.max(1, now - this.petTrack.lastAt);
    this.petTrack.lastAt = now;
    if (now - this.petTrack.lastTurn > 1800) {
      this.petTrack.turns = 0;
      this.petTrack.distance = 0;
    }
    if (Math.hypot(dx, y - previous.y) / elapsed > 0.85) {
      this.petTrack.turns = 0;
      this.petTrack.distance = 0;
      this.petTrack.direction = 0;
      return;
    }
    if (Math.abs(dx) < 0.4) return;
    const direction = Math.sign(dx);
    if (direction !== this.petTrack.direction && this.petTrack.distance >= 6) {
      this.petTrack.turns += 1;
      this.petTrack.distance = 0;
      this.petTrack.lastTurn = now;
    }
    this.petTrack.direction = direction;
    this.petTrack.distance += Math.abs(dx);
    if (this.petTrack.turns >= 3) {
      this.petTrack.turns = 0;
      this.petTrack.distance = 0;
      this.expression('love');
    }
  }

  // Web Speech tidak menyediakan gender; prioritaskan nama voice perempuan dikenal.
  selectVoice() {
    const language = this.english ? 'en' : 'id';
    const candidates = this.voices.filter((voice) => voice.lang.toLowerCase().startsWith(language));
    const femaleNames = /female|woman|gadis|indah|zira|aria|jenny|samantha|victoria|susan|hazel|sonia|sara|ava|emma|allison|joanna|salli|karen|moira|tessa|fiona|google uk english female/i;
    return candidates.find((voice) => femaleNames.test(voice.name))
      || candidates.find((voice) => /google bahasa indonesia/i.test(voice.name))
      || candidates.find((voice) => voice.default)
      || candidates[0];
  }

  // Keliling pelan dalam batas viewport; panel dan tombol selalu ikut terlihat.
  stopRoaming(reset = false) {
    clearTimeout(this.roamTimer);
    if (this.roaming) this.roaming.pause();
    anime.remove(this.root);
    if (reset) this.root.style.transform = '';
  }

  scheduleRoaming() {
    this.stopRoaming();
    if (this.state.resting || innerWidth <= 768 || this.motion.matches || this.state.closed || this.state.speaking || this.interacting || document.hidden) return;
    this.roamTimer = setTimeout(() => this.roamNext(), 3500);
  }

  roamNext() {
    if (this.state.resting || innerWidth <= 768) return;
    if (this.motion.matches || this.state.closed || this.state.speaking || this.interacting || document.hidden) return;
    // Offset dihitung dari posisi CSS asal, bukan dari posisi animasi sebelumnya.
    const css = getComputedStyle(this.root);
    const width = this.root.offsetWidth;
    const height = this.root.offsetHeight;
    const baseX = innerWidth - parseFloat(css.right) - width;
    const baseY = innerHeight - parseFloat(css.bottom) - height;
    const left = 12;
    const right = Math.max(left, innerWidth - width - 12);
    const top = Math.min(110, Math.max(12, innerHeight - height - 90));
    const bottom = Math.max(top, innerHeight - height - 90);
    const points = [{ x: left, y: bottom }, { x: left, y: top }, { x: right, y: top }, { x: right, y: bottom }];
    this.roamIndex = ((this.roamIndex ?? -1) + 1) % points.length;
    const destination = points[this.roamIndex];
    this.setImage('walk');
    this.roaming = anime({
      targets: this.root,
      translateX: destination.x - baseX,
      translateY: destination.y - baseY,
      duration: 14000,
      easing: 'easeInOutSine',
      complete: () => { this.setImage('idle'); this.scheduleRoaming(); }
    });
  }

  // Satu loop karakter aktif; selalu bersihkan loop lama sebelum berganti state.
  stopRobotTalking() {
    if (this.motionLoop) this.motionLoop.pause();
    anime.remove([this.float, this.character]);
    this.motionLoop = null;
    this.float.style.transform = '';
    this.character.style.transform = '';
  }

  startRobotIdle() {
    if (this.state.resting) return;
    this.stopRobotTalking();
    if (this.motion.matches || this.state.closed || document.hidden) return;
    this.motionLoop = anime({
      targets: this.character,
      translateY: [-6, 6], rotate: [-1.5, 1.5],
      duration: 1800, direction: 'alternate', loop: true, easing: 'easeInOutSine'
    });
  }

  startRobotTalking() {
    this.stopRobotTalking();
    if (this.motion.matches || this.state.closed || document.hidden) return;
    this.motionLoop = anime({
      targets: this.character,
      translateY: [-4, 4], scale: [1, 1.04], rotate: [-2, 2],
      duration: 450, direction: 'alternate', loop: true, easing: 'easeInOutSine'
    });
  }

  // Hover memakai gambar, sehingga tidak menimpa transform loop karakter.
  reactToHover(active) {
    if (this.state.resting) return;
    anime.remove(this.image);
    if (this.motion.matches || this.state.closed) {
      this.image.style.transform = '';
      return;
    }
    anime({ targets: this.image, scale: active ? 1.06 : 1, duration: 260, easing: 'easeOutQuad' });
  }

  animateLoop() {
    if (this.state.phase === 'sleeping') { this.startRobotSleeping(); return; }
    if (this.state.phase === 'waking') return;
    this.scheduleRoaming();
    if (this.state.speaking) this.startRobotTalking();
    else this.startRobotIdle();
  }

  enter() {
    this.setImage('fly');
    if (!this.motion.matches) {
      anime({ targets: this.panel, opacity: [0, 1], translateY: [22, 0], duration: 850, easing: 'easeOutQuad' });
      anime({ targets: this.bubble, opacity: [0, 1], duration: 700, delay: 200, easing: 'easeOutQuad' });
      anime({ targets: this.root.querySelectorAll('.assistant-actions > *'), opacity: [0, 1], translateY: [8, 0], delay: anime.stagger(80, { start: 300 }), duration: 650, easing: 'easeOutQuad' });
    }
    clearTimeout(this.expressionTimer);
    this.expressionTimer = setTimeout(() => { if (!this.state.speaking) this.setImage('idle'); }, 900);
    this.animateLoop();
  }

  expression(name) {
    if (this.state.resting) return;
    // Ekspresi hanya visual dan tidak mengubah narasi.
    if (this.state.speaking || this.state.closed) return;
    clearTimeout(this.expressionTimer);
    this.setRobotState(name);
    this.setImage(name);
    anime.remove(this.image);
    if (!this.motion.matches) anime({
      targets: this.image,
      scale: name === 'surprised' ? [0.84, 1.12, 1] : [0.94, 1.08, 1],
      rotate: name === 'surprised' ? [0, -7, 7, 0] : [0, -3, 3, 0],
      duration: name === 'surprised' ? 560 : 720,
      easing: 'easeOutBack'
    });
    this.expressionTimer = setTimeout(() => {
      if (this.state.resting || this.state.speaking || this.state.closed) return;
      this.setRobotState('idle');
      this.setImage('idle');
    }, name === 'surprised' ? 1500 : 2200);
  }

  stopSpeech() {
    const wasSpeaking = this.state.speaking;
    this.state.session += 1; // Abaikan callback dari sesi narasi sebelumnya.
    if (!this.state.resting) this.setPhase(this.state.closed ? 'sleeping' : 'welcome');
    clearTimeout(this.speechTimer);
    if (this.utterance) {
      this.utterance.onstart = null;
      this.utterance.onend = null;
      this.utterance.onerror = null;
    }
    if (wasSpeaking && this.supportsSpeech) window.speechSynthesis.cancel();
    this.utterance = null;
    this.setImage(this.state.resting ? 'tidur' : 'idle');
    this.renderControls();
    if (wasSpeaking && !this.state.closed) this.renderWelcome();
    this.animateLoop();
  }

  finish() {
    this.stopSpeech();
    this.setPhase('finished');
    this.message.textContent = this.english ? 'Finished. Where would you like to go next?' : 'Selesai. Mau lanjut ke mana?';
    this.renderControls();
  }

  textFallback(lines) {
    this.stopSpeech();
    this.setPhase('finished');
    this.message.textContent = `${lines.join('\n\n')}\n\n${this.english ? 'Explore more about Kamiliya below.' : 'Lihat lebih lanjut tentang Kamiliya melalui tombol di bawah.'}`;
    this.renderControls();
  }

  speakIntroduction() {
    if (this.state.resting || this.state.closed) return;
    if (this.state.speaking) return;
    const lines = this.story();
    if (!this.supportsSpeech) { this.textFallback(lines); return; }
    this.stopSpeech();
    this.setPhase('speaking');
    this.stopRoaming(true);
    this.voices = window.speechSynthesis.getVoices();
    const selectedVoice = this.selectVoice();
    console.log('[Portfolio Assistant] Voice selected', selectedVoice?.name || 'Browser default');
    const session = this.state.session;
    clearTimeout(this.expressionTimer);
    this.setImage('idle');
    this.follow.style.transform = '';
    this.message.textContent = this.english ? 'Speaking...' : 'Sedang berbicara...';
    this.renderControls();
    this.animateLoop();
    let index = 0;
    const speakNext = () => {
      if (session !== this.state.session || !this.state.speaking) return;
      if (index >= lines.length) { this.finish(); return; }
      const speech = new SpeechSynthesisUtterance(lines[index]);
      speech.lang = this.english ? 'en-US' : 'id-ID';
      speech.rate = 0.95;
      speech.pitch = 1;
      const voice = selectedVoice;
      if (voice) speech.voice = voice;
      this.utterance = speech;
      // Un moteur indisponible ne doit pas bloquer indéfiniment les boutons.
      this.speechTimer = setTimeout(() => { if (session === this.state.session) this.textFallback(lines); }, 12000);
      speech.onstart = () => {
        if (session !== this.state.session) return;
        clearTimeout(this.speechTimer);
        this.speechTimer = setTimeout(() => { if (session === this.state.session) this.textFallback(lines); }, 90000);
      };
      speech.onend = () => {
        if (session !== this.state.session) return;
        clearTimeout(this.speechTimer);
        this.stopRobotTalking();
        this.startRobotIdle();
        index += 1;
        speakNext();
      };
      speech.onerror = () => { if (session === this.state.session) this.textFallback(lines); };
      try {
        this.startRobotTalking();
        window.speechSynthesis.speak(speech);
      }
      catch { this.textFallback(lines); }
    };
    console.log('[Portfolio Assistant] Introduction requested', { language: this.english ? 'en-US' : 'id-ID' });
    speakNext();
  }

  summonRobot() {
    this.stopSpeech();
    this.state.closed = false;
    this.root.hidden = false;
    this.panel.hidden = false;
    this.controls.open.hidden = true;
    this.stopRoaming(true);
    this.resetFollow(true);
    if (this.state.phase === 'sleeping') { this.wakeRobot(); return; }
    if (this.state.phase === 'waking') { this.completeWake?.(); return; }
    this.setPhase('welcome');
    this.renderWelcome();
    this.enter();
    if (!this.motion.matches) anime({
      targets: this.character,
      scale: [0.82, 1.1, 1],
      rotate: [0, -5, 0],
      duration: 620,
      easing: 'easeOutBack'
    });
  }

  close(returnFocus = true) {
    this.state.closed = true;
    this.reactToHover(false);
    this.stopRoaming(true);
    this.stopSpeech();
    clearTimeout(this.expressionTimer);
    if (this.wakeAnimation) this.wakeAnimation.pause();
    this.state.closed = false;
    this.setPhase('sleeping');
    this.setImage('tidur');
    this.panel.hidden = false;
    this.controls.open.hidden = true;
    this.startRobotSleeping();
    if (returnFocus) this.character.focus();
  }

  bindEvents() {
    this.character.addEventListener('click', () => this.wakeRobot());
    this.controls.summon.addEventListener('click', () => this.summonRobot());
    // Navigasi lokal via JavaScript; tidak menyentuh submit/validasi contact form.
    ['projects', 'analytics'].forEach((key) => {
      this.controls[key].addEventListener('click', (event) => {
        const href = this.controls[key].getAttribute('href');
        if (!href.startsWith('#')) return;
        const target = document.querySelector(href);
        if (!target) return;
        event.preventDefault();
        this.close(false);
        const navbar = document.querySelector('.navbar-custom');
        target.style.scrollMarginTop = `${(navbar?.getBoundingClientRect().height || 0) + 20}px`;
        target.scrollIntoView({ behavior: this.motion.matches ? 'auto' : 'smooth', block: 'start' });
        const focusTarget = href === '#contact-form' ? document.getElementById('contact-form-title') : target;
        if (focusTarget) {
          focusTarget.setAttribute('tabindex', '-1');
          focusTarget.focus({ preventScroll: true });
        }
      });
    });
    if (this.supportsSpeech) window.speechSynthesis.addEventListener('voiceschanged', () => {
      this.voices = window.speechSynthesis.getVoices();
    });
    // Berhenti saat disentuh, hover, atau navigasi keyboard agar tombol mudah diklik.
    this.root.addEventListener('pointerenter', () => { this.interacting = true; this.stopRoaming(); });
    this.root.addEventListener('pointerdown', () => { this.interacting = true; this.stopRoaming(); });
    this.root.addEventListener('pointerleave', () => {
      this.interacting = this.root.contains(document.activeElement);
      this.scheduleRoaming();
    });
    this.root.addEventListener('focusin', () => { this.interacting = true; this.stopRoaming(); });
    this.root.addEventListener('focusout', () => {
      setTimeout(() => { this.interacting = this.root.matches(':hover') || this.root.contains(document.activeElement); this.scheduleRoaming(); }, 0);
    });
    window.addEventListener('resize', () => { this.stopRoaming(true); this.scheduleRoaming(); });
    this.controls.listen.addEventListener('click', () => this.speakIntroduction());
    this.controls.stop.addEventListener('click', () => { this.stopSpeech(); this.renderWelcome(); this.controls.listen.focus(); });
    this.controls.close.addEventListener('click', () => this.close());
    this.controls.open.addEventListener('click', () => {
      const chatButton = document.getElementById('chatbox-toggle');
      if (chatButton?.getAttribute('aria-expanded') === 'true') chatButton.click();
      this.state.closed = false;
      this.panel.hidden = false;
      this.controls.open.hidden = true;
      this.renderWelcome();
      this.enter();
      this.controls.listen.focus();
    });
    this.root.addEventListener('keydown', (event) => { if (event.key === 'Escape') this.close(); });
    this.character.addEventListener('dblclick', () => this.expression('surprised'));
    this.character.addEventListener('mouseenter', () => { this.petTrack.point = null; this.reactToHover(true); });
    this.character.addEventListener('mouseleave', () => {
      this.petTrack.point = null;
      this.reactToHover(false);
      this.resetFollow();
    });
    this.character.addEventListener('mousemove', (event) => this.trackPetMove(event.clientX, event.clientY));
    this.character.addEventListener('focus', () => this.reactToHover(true));
    this.character.addEventListener('blur', () => this.reactToHover(false));
    this.character.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') this.expression('surprised'); });
    this.character.addEventListener('touchstart', (event) => {
      if (event.touches.length !== 1) return;
      const touch = event.touches[0];
      this.touchTrack = {
        startX: touch.clientX, startY: touch.clientY,
        x: touch.clientX, y: touch.clientY, distance: 0,
        direction: 0, strokeDistance: 0, turns: 0,
        startedAt: performance.now(), lastAt: performance.now(), petted: false
      };
    }, { passive: true });
    this.character.addEventListener('touchmove', (event) => {
      if (!this.touchTrack || event.touches.length !== 1) return;
      const touch = event.touches[0];
      const track = this.touchTrack;
      const dx = touch.clientX - track.x;
      const dy = touch.clientY - track.y;
      const distance = Math.hypot(dx, dy);
      const now = performance.now();
      const speed = distance / Math.max(1, now - track.lastAt);
      track.distance += distance;
      if (speed <= 1.15 && Math.abs(dx) > 2) {
        const direction = Math.sign(dx);
        if (track.direction && direction !== track.direction && track.strokeDistance >= 4) track.turns += 1;
        track.direction = direction;
        track.strokeDistance += Math.abs(dx);
      } else if (speed > 1.15) {
        track.turns = 0;
        track.strokeDistance = 0;
      }
      this.followAt(
        Math.max(-12, Math.min(12, (touch.clientX - track.startX) * 0.55)),
        Math.max(-10, Math.min(10, (touch.clientY - track.startY) * 0.55))
      );
      if (!track.petted && speed <= 1.15 && (track.distance >= 30 || track.turns >= 1)) {
        track.petted = true;
        this.expression('love');
      }
      track.x = touch.clientX;
      track.y = touch.clientY;
      track.lastAt = now;
    }, { passive: true });
    this.character.addEventListener('touchend', () => {
      if (!this.touchTrack) return;
      const track = this.touchTrack;
      const now = performance.now();
      if (track.distance < 8) {
        if (now - this.lastTap < 350) this.expression('surprised');
        this.lastTap = now;
      } else if (!track.petted && track.distance >= 24 && (now - track.startedAt) / track.distance >= 0.8) {
        this.expression('love');
      }
      this.touchTrack = null;
      this.resetFollow();
    }, { passive: true });
    window.addEventListener('mousemove', (event) => {
      if (!this.pointer.matches || this.motion.matches || this.state.resting || this.state.speaking || this.state.closed) return;
      this.followAt(
        (event.clientX / window.innerWidth - 0.5) * 24,
        (event.clientY / window.innerHeight - 0.5) * 18
      );
    });
    new MutationObserver(() => {
      if (this.state.resting) { this.renderControls(); return; }
      this.stopSpeech();
      this.renderWelcome();
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    this.motion.addEventListener('change', () => {
      if (this.state.phase === 'waking' && this.motion.matches) {
        this.wakeAnimation?.pause();
        this.completeWake();
      }
      this.reactToHover(false);
      this.stopRoaming(true);
      anime.remove([this.panel, this.bubble, ...this.root.querySelectorAll('.assistant-actions > *')]);
      [this.panel, this.bubble, this.follow, ...this.root.querySelectorAll('.assistant-actions > *')].forEach((element) => {
        element.style.removeProperty('transform'); element.style.removeProperty('opacity');
      });
      this.animateLoop();
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.state.speaking) { this.stopSpeech(); this.renderWelcome(); }
      if (document.hidden) this.resetFollow(true);
      this.animateLoop();
    });
    window.addEventListener('pagehide', () => this.stopSpeech());
    setInterval(() => { if (this.state.phase === 'welcome' && !this.state.closed) this.renderWelcome(); }, 60000);
    // Robot dilipat saat panel Q&A dibuka agar keduanya tidak bertumpuk.
    const chatButton = document.getElementById('chatbox-toggle');
    if (chatButton) new MutationObserver(() => {
      if (chatButton.getAttribute('aria-expanded') === 'true') this.close(false);
    }).observe(chatButton, { attributes: true, attributeFilter: ['aria-expanded'] });
  }
}

const root = document.getElementById('portfolio-assistant');
if (root) new PortfolioAssistant(root);
