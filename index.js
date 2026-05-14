const canvas = document.getElementById('starfield'), ctx = canvas.getContext('2d');
let W, H, stars = [], starsRunning = true, starAnimId = null;
function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
function initStars(n = 300) { stars = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.4 + 0.2, a: Math.random(), ts: Math.random() * 0.02 + 0.005, sp: Math.random() * 0.4 + 0.05 })); }
function drawStars() {
  if (!starsRunning) return;
  ctx.clearRect(0, 0, W, H);
  const sith = document.body.classList.contains('sith-mode');
  stars.forEach(s => {
    s.a += s.ts;
    const al = 0.4 + 0.6 * Math.abs(Math.sin(s.a));
    ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = sith && Math.random() < 0.003 ? `rgba(255,60,40,${al})` : `rgba(255,245,200,${al})`;
    ctx.fill(); s.y += s.sp * 0.1;
    if (s.y > H) { s.y = 0; s.x = Math.random() * W; }
  });
  starAnimId = requestAnimationFrame(drawStars);
}
resize(); initStars(); drawStars();
window.addEventListener('resize', () => { resize(); initStars(); });

const glow = document.getElementById('forceGlow');
document.addEventListener('mousemove', e => { glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; });

let dropOpen = false;
window.toggleAnimDropdown = function (e) {
  e.stopPropagation();
  dropOpen = !dropOpen;
  const dd = document.getElementById('animDropdown');
  const btn = document.getElementById('animToggleBtn');
  dd.classList.toggle('open', dropOpen);
  btn.classList.toggle('open', dropOpen);
  if (dropOpen) {
    const bar = document.getElementById('topBar');
    const barRect = bar.getBoundingClientRect();
    dd.style.top = (barRect.bottom + 8) + 'px';
    dd.style.left = (barRect.right - 250) + 'px';
  }
};
document.addEventListener('click', e => {
  if (dropOpen && !document.getElementById('animDropdown').contains(e.target)) {
    dropOpen = false;
    document.getElementById('animDropdown').classList.remove('open');
    document.getElementById('animToggleBtn').classList.remove('open');
  }
});

let dsEnabled = true;
window.toggleAnim = function (type, on) {
  if (type === 'stars') {
    starsRunning = on;
    if (on) { drawStars(); } else { cancelAnimationFrame(starAnimId); ctx.clearRect(0, 0, W, H); }
  }
  if (type === 'rays') {
    ['hr1', 'hr2', 'hr3'].forEach(id => {
      const el = document.getElementById(id);
      if (on) {
        el.classList.add('active');
      } else {
        el.style.transition = 'opacity 0.8s ease, height 0.8s ease';
        el.style.opacity = '0';
        el.style.height = '0';
        setTimeout(() => {
          el.classList.remove('active');
          el.style.transition = '';
          el.style.opacity = '';
          el.style.height = '';
        }, 850);
      }
    });
  }
  if (type === 'ship1') {
    const s = document.getElementById('ship1');
    s.style.animationPlayState = on ? 'running' : 'paused';
    s.style.opacity = on ? '0.55' : '0';
  }
  if (type === 'ship2') {
    const s = document.getElementById('ship2');
    s.style.animationPlayState = on ? 'running' : 'paused';
    s.style.opacity = on ? '0.55' : '0';
  }
  if (type === 'ship3') {
    const s = document.getElementById('ship3');
    s.style.animationPlayState = on ? 'running' : 'paused';
    s.style.opacity = on ? '0.3' : '0';
  }
  if (type === 'rings') {
    let st = document.getElementById('_ringPause');
    if (!on) {
      if (!st) { st = document.createElement('style'); st.id = '_ringPause'; document.head.appendChild(st); }
      st.textContent = '.char-frame::before,.char-frame::after{animation-play-state:paused!important;}';
    } else { if (st) st.textContent = ''; }
  }
  if (type === 'deathstar') {
    dsEnabled = on;
    const dsEl = document.getElementById('deathStar');
    if (!on) {
      dsEl.classList.remove('visible');
    } else {
      const currentSlide = filteredSlides[current];
      const theme = currentSlide && currentSlide.dataset.theme;
      if (theme === 'sith' || theme === 'empire') {
        dsEl.classList.add('visible');
      }
    }
  }
};

const shipSVGs = {
  xwing: {
    w: 90, h: 44, vb: '0 0 90 44', name: 'X-WING',
    html: `<polygon points="45,20 0,44 10,22 0,0" fill="#c0b080" opacity="0.9"/>
          <polygon points="45,20 90,44 80,22 90,0" fill="#c0b080" opacity="0.9"/>
          <rect x="15" y="19" width="60" height="5" rx="2" fill="#d4c890"/>
          <circle cx="45" cy="21" r="5" fill="#ffe81f" opacity="0.6"/>
          <rect x="12" y="20" width="4" height="3" fill="#ffe81f" opacity="0.5"/>
          <rect x="74" y="20" width="4" height="3" fill="#ffe81f" opacity="0.5"/>`
  },
  tie: {
    w: 80, h: 60, vb: '0 0 80 60', name: 'TIE FIGHTER',
    html: `<rect x="0" y="10" width="22" height="40" rx="2" fill="#556" opacity="0.85"/>
          <rect x="58" y="10" width="22" height="40" rx="2" fill="#556" opacity="0.85"/>
          <line x1="22" y1="30" x2="32" y2="30" stroke="#778" stroke-width="2"/>
          <line x1="48" y1="30" x2="58" y2="30" stroke="#778" stroke-width="2"/>
          <circle cx="40" cy="30" r="12" fill="#445" stroke="#667" stroke-width="1.5"/>
          <circle cx="40" cy="30" r="6" fill="#ffe81f" opacity="0.2"/>`
  },
  falcon: {
    w: 100, h: 70, vb: '0 0 100 70', name: 'MILLENNIUM FALCON',
    html: `<ellipse cx="48" cy="38" rx="44" ry="26" fill="#8a8070" opacity="0.9"/>
          <ellipse cx="48" cy="36" rx="28" ry="16" fill="#9a9080"/>
          <rect x="60" y="24" width="22" height="14" rx="4" fill="#7a7060"/>
          <circle cx="34" cy="34" r="10" fill="#6a6050" stroke="#aaa090" stroke-width="1"/>
          <circle cx="34" cy="34" r="5" fill="#555045"/>
          <rect x="10" y="34" width="8" height="4" rx="1" fill="#ffe81f" opacity="0.4"/>`
  }
};

window.previewShip = function (key) {
  const s = shipSVGs[key];
  const el = document.getElementById('shipPreviewEl');
  el.setAttribute('width', s.w * 2.2);
  el.setAttribute('height', s.h * 2.2);
  el.setAttribute('viewBox', s.vb);
  el.innerHTML = s.html;
  document.getElementById('previewName').textContent = s.name;
  document.getElementById('previewLabel').textContent = 'VISUALIZAÇÃO DA NAVE';
  document.getElementById('shipPreviewStage').style.display = 'block';
  document.getElementById('dsPreviewStage').style.display = 'none';
  document.getElementById('previewOverlay').classList.add('active');
  closeDropdown();
};

window.previewDeathStar = function () {
  document.getElementById('previewLabel').textContent = 'VISUALIZAÇÃO — ESTRELA DA MORTE';
  document.getElementById('previewName').textContent = 'DEATH STAR';
  document.getElementById('shipPreviewStage').style.display = 'none';
  document.getElementById('dsPreviewStage').style.display = 'flex';
  document.getElementById('dsPreviewStage').style.flexDirection = 'column';
  document.getElementById('dsPreviewStage').style.alignItems = 'center';
  document.getElementById('dsPreviewStage').style.position = 'relative';
  document.getElementById('previewOverlay').classList.add('active');
  closeDropdown();
};

let laserCooldownInterval = null;
const LASER_COOLDOWN_MS = 4000;
window.triggerMainLaser = function () {
  const btn = document.getElementById('dropLaserBtn');
  if (btn.classList.contains('laser-cooling')) return;
  laser.style.animation = 'none';
  laser.offsetHeight;
  laser.style.animation = 'fireLaser 2.2s ease forwards';
  btn.classList.add('laser-cooling');
  btn.innerHTML = '<span>⏳</span> RECARREGANDO...';
  let remaining = LASER_COOLDOWN_MS;
  const step = 50;
  if (laserCooldownInterval) clearInterval(laserCooldownInterval);
  laserCooldownInterval = setInterval(() => {
    remaining -= step;
    const secs = Math.ceil(remaining / 1000);
    if (remaining <= 0) {
      clearInterval(laserCooldownInterval);
      btn.classList.remove('laser-cooling');
      btn.innerHTML = '<span>🔴</span> DISPARAR SUPERLASER';
    } else {
      btn.innerHTML = `<span>⏳</span> RECARREGANDO... ${secs}s`;
    }
  }, step);
};

window.closePreview = function () {
  document.getElementById('previewOverlay').classList.remove('active');
};

function closeDropdown() {
  dropOpen = false;
  document.getElementById('animDropdown').classList.remove('open');
  document.getElementById('animToggleBtn').classList.remove('open');
}

const expCanvas = document.getElementById('explosionCanvas');
const expCtx = expCanvas.getContext('2d');
let expParticles = [], expAnimId = null, expRunning = false;
let cooldownTimer = null, cooldownInterval = null;
const COOLDOWN_MS = 8000; 

function resizeExp() { expCanvas.width = window.innerWidth; expCanvas.height = window.innerHeight; }
resizeExp(); window.addEventListener('resize', resizeExp);

function startCooldown() {
  const btn = document.getElementById('explodeBtn');
  const bar = document.getElementById('explodeCooldownBar');
  const txt = document.getElementById('explodeCooldownText');
  const icon = document.getElementById('explodeBtnIcon');
  const label = document.getElementById('explodeBtnText');
  btn.classList.add('cooling');
  let remaining = COOLDOWN_MS;
  const step = 50;
  bar.style.width = '100%';

  cooldownInterval = setInterval(() => {
    remaining -= step;
    const pct = Math.max(0, (remaining / COOLDOWN_MS) * 100);
    bar.style.width = pct + '%';
    const secs = Math.ceil(remaining / 1000);
    txt.textContent = secs > 0 ? secs + 's' : '';
    if (remaining <= 0) {
      clearInterval(cooldownInterval);
      bar.style.width = '0%';
      txt.textContent = '';
      btn.classList.remove('cooling');
      icon.textContent = '💥';
      label.textContent = 'EXPLODIR A DEATH STAR';
    }
  }, step);
}

function createExplosion() {
  const cx = window.innerWidth * 0.80;
  const cy = window.innerHeight * 0.50;
  expParticles = [];

  for (let i = 0; i < 80; i++) {
    const angle = Math.random() * Math.PI * 2, spd = Math.random() * 5 + 1;
    expParticles.push({ x: cx, y: cy, vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd, r: Math.random() * 18 + 6, alpha: 1, decay: 0.022 + Math.random() * 0.015, color: '#ffffff', type: 'flash' });
  }
  const fireColors = ['#ff9900', '#ff6600', '#ff3300', '#ffcc44', '#ffaa00', '#ff5500'];
  for (let i = 0; i < 160; i++) {
    const angle = Math.random() * Math.PI * 2, spd = Math.random() * 11 + 3;
    expParticles.push({ x: cx + (Math.random() - 0.5) * 20, y: cy + (Math.random() - 0.5) * 20, vx: Math.cos(angle) * spd * (Math.random() * 0.6 + 0.5), vy: Math.sin(angle) * spd * (Math.random() * 0.6 + 0.5), r: Math.random() * 9 + 2, alpha: 1, decay: Math.random() * 0.010 + 0.005, color: fireColors[Math.floor(Math.random() * fireColors.length)], type: 'fire', glow: true });
  }
  for (let i = 0; i < 55; i++) {
    const angle = Math.random() * Math.PI * 2, spd = Math.random() * 8 + 2;
    expParticles.push({ x: cx + (Math.random() - 0.5) * 60, y: cy + (Math.random() - 0.5) * 60, vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd - Math.random() * 1.5, r: Math.random() * 16 + 5, alpha: 1, decay: Math.random() * 0.006 + 0.003, color: Math.random() < 0.5 ? '#331100' : '#552200', type: 'debris', rot: Math.random() * Math.PI * 2, rotSpeed: (Math.random() - 0.5) * 0.12 });
  }
  for (let i = 0; i < 120; i++) {
    const angle = Math.random() * Math.PI * 2, spd = Math.random() * 18 + 4;
    expParticles.push({ x: cx, y: cy, vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd, r: Math.random() * 2.5 + 0.5, alpha: 1, decay: Math.random() * 0.014 + 0.006, color: Math.random() < 0.6 ? '#ffee88' : '#ff9922', type: 'ember' });
  }
  expParticles.push({ x: cx, y: cy, r: 10, alpha: 0.9, decay: 0.009, color: '#ffcc44', type: 'ring', grow: 13 });
  expParticles.push({ x: cx, y: cy, r: 5, alpha: 0.65, decay: 0.006, color: '#ff7700', type: 'ring', grow: 19 });
  expParticles.push({ x: cx, y: cy, r: 2, alpha: 0.4, decay: 0.004, color: '#ff3300', type: 'ring', grow: 26 });
}

function animateExplosion() {
  expCtx.clearRect(0, 0, expCanvas.width, expCanvas.height);
  let alive = false;
  expParticles.forEach(p => {
    if (p.alpha <= 0) return;
    alive = true;
    p.alpha -= p.decay; if (p.alpha < 0) p.alpha = 0;
    expCtx.save(); expCtx.globalAlpha = Math.max(0, p.alpha);
    if (p.type === 'ring') {
      p.r += p.grow; expCtx.beginPath(); expCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      expCtx.strokeStyle = p.color; expCtx.lineWidth = 3; expCtx.stroke();
    } else if (p.type === 'debris') {
      p.x += p.vx; p.y += p.vy; p.vy += 0.06; p.vx *= 0.99; p.vy *= 0.99; p.rot += p.rotSpeed;
      expCtx.translate(p.x, p.y); expCtx.rotate(p.rot); expCtx.fillStyle = p.color;
      expCtx.beginPath(); expCtx.moveTo(-p.r / 2, -p.r / 3); expCtx.lineTo(p.r / 2, -p.r / 4); expCtx.lineTo(p.r / 3, p.r / 3); expCtx.lineTo(-p.r / 2, p.r / 4); expCtx.closePath(); expCtx.fill();
    } else if (p.type === 'flash') {
      p.x += p.vx; p.y += p.vy; p.vx *= 0.88; p.vy *= 0.88;
      const grad = expCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
      grad.addColorStop(0, 'rgba(255,255,220,1)'); grad.addColorStop(0.4, 'rgba(255,180,80,0.7)'); grad.addColorStop(1, 'rgba(255,80,0,0)');
      expCtx.fillStyle = grad; expCtx.beginPath(); expCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2); expCtx.fill();
    } else if (p.type === 'fire') {
      p.x += p.vx; p.y += p.vy; p.vx *= 0.96; p.vy *= 0.96;
      expCtx.beginPath(); expCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2); expCtx.fillStyle = p.color; expCtx.fill();
      if (p.glow) { expCtx.globalAlpha *= 0.2; expCtx.beginPath(); expCtx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2); expCtx.fillStyle = p.color; expCtx.fill(); }
    } else {
      p.x += p.vx; p.y += p.vy; p.vx *= 0.97; p.vy *= 0.97;
      expCtx.beginPath(); expCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2); expCtx.fillStyle = p.color; expCtx.fill();
    }
    expCtx.restore();
  });
  if (alive) { expAnimId = requestAnimationFrame(animateExplosion); }
  else { expCanvas.style.display = 'none'; expRunning = false; }
}

window.triggerExplosion = function () {
  const btn = document.getElementById('explodeBtn');
  if (btn.classList.contains('cooling') || expRunning) return;
  expRunning = true;
  expCanvas.style.display = 'block';
  createExplosion();
  animateExplosion();
  document.getElementById('explodeBtnIcon').textContent = '☄️';
  document.getElementById('explodeBtnText').textContent = 'RECARREGANDO...';
  startCooldown();
};

const charIds = [44, 11, 4, 1, 3, 2];
const charNames = ['Anakin Skywalker', 'Obi-Wan Kenobi', 'Darth Vader', 'Luke Skywalker', 'Yoda', 'Luke Skywalker'];
async function loadImg(i) {
  const c = document.getElementById('ic' + i), n = document.getElementById('cn' + i);
  try {
    const r = await fetch(`https://akabab.github.io/starwars-api/api/id/${charIds[i]}.json`);
    const d = await r.json();
    const img = document.createElement('img');
    img.src = d.image; img.alt = d.name; img.className = 'char-img';
    img.onload = () => { c.parentNode.replaceChild(img, c); n.textContent = d.name; };
    img.onerror = () => { c.textContent = d.name || '???'; n.textContent = charNames[i]; };
  } catch { c.textContent = charNames[i]; n.textContent = charNames[i]; }
}
charIds.forEach((_, i) => loadImg(i));

const wrapper = document.getElementById('slidesWrapper');
const btnPrev = document.getElementById('btnPrev'), btnNext = document.getElementById('btnNext');
const indEl = document.getElementById('indicators');
const badge = document.getElementById('episodeBadge');
const track = document.getElementById('timelineTrack'), prog = document.getElementById('timelineProgress');
const ds = document.getElementById('deathStar'), laser = document.getElementById('laser'), flash = document.getElementById('sithFlash');
const allSlides = Array.from(wrapper.querySelectorAll('.slide'));
let filteredSlides = [...allSlides], current = 0;

const nodeData = [
  { ep: 'EP. I', date: '32 BBY' }, { ep: 'EP. II', date: '22 BBY' }, { ep: 'EP. III', date: '19 BBY' },
  { ep: 'EP. IV', date: '0 BBY' }, { ep: 'EP. V', date: '3 ABY' }, { ep: 'EP. VI', date: '4 ABY' },
];
const nodes = nodeData.map((d, i) => {
  const pct = (i / (allSlides.length - 1)) * 100;
  const nd = document.createElement('div');
  nd.className = 'tl-node'; nd.style.left = pct + '%';
  nd.innerHTML = `<span class="tl-ep-label">${d.ep}</span><div class="tl-dot"></div><span class="tl-date-label">${d.date}</span>`;
  nd.addEventListener('click', () => { const fi = filteredSlides.findIndex(s => allSlides.indexOf(s) === i); if (fi >= 0) goTo(fi); });
  track.appendChild(nd); return nd;
});
allSlides.forEach((_, i) => {
  const r = document.createElement('div');
  r.className = 'retangle' + (i === 0 ? ' ativo' : '');
  r.addEventListener('click', () => goTo(i));
  indEl.appendChild(r);
});

let laserTimer = null;
function triggerSithEntry() {
  flash.style.animation = 'none'; flash.offsetHeight;
  flash.style.animation = 'sithFlash 0.9s ease forwards';
  if (dsEnabled) ds.classList.add('visible');
  if (laserTimer) clearTimeout(laserTimer);
  laserTimer = setTimeout(() => { laser.style.animation = 'none'; laser.offsetHeight; laser.style.animation = 'fireLaser 2.2s ease forwards'; }, 2400);
}
function triggerSithExit() {
  ds.classList.remove('visible'); laser.style.animation = 'none';
  if (laserTimer) { clearTimeout(laserTimer); laserTimer = null; }
}

function goTo(idx) {
  filteredSlides[current].classList.remove('active');
  current = idx;
  const slide = filteredSlides[current];
  const gi = allSlides.indexOf(slide);
  const theme = slide.dataset.theme;
  slide.classList.add('active');
  wrapper.style.transform = `translateX(-${gi * 100}%)`;
  badge.textContent = slide.dataset.ep;

  const isSith = theme === 'sith' || theme === 'empire';
  const wasSith = document.body.classList.contains('sith-mode');
  document.body.classList.toggle('sith-mode', isSith);
  if (isSith && !wasSith) triggerSithEntry();
  else if (!isSith && wasSith) triggerSithExit();
  else if (isSith && dsEnabled) ds.classList.add('visible');

  if (slide.dataset.explode === 'true') {
    setTimeout(() => triggerExplosion(), 1100);
  }

  indEl.querySelectorAll('.retangle').forEach((r, i) => {
    const s = filteredSlides[i];
    r.style.display = s ? 'block' : 'none';
    r.classList.toggle('ativo', i === current);
  });
  nodes.forEach((n, i) => {
    n.classList.remove('active-node', 'visited');
    if (i === gi) n.classList.add('active-node');
    else if (i < gi) n.classList.add('visited');
  });
  prog.style.width = (gi === 0 ? 0 : (gi / (allSlides.length - 1)) * 100) + '%';
  btnPrev.disabled = current === 0;
  btnNext.disabled = current === filteredSlides.length - 1;
}

btnPrev.addEventListener('click', () => { if (current > 0) goTo(current - 1); });
btnNext.addEventListener('click', () => { if (current < filteredSlides.length - 1) goTo(current + 1); });
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' && current < filteredSlides.length - 1) goTo(current + 1);
  if (e.key === 'ArrowLeft' && current > 0) goTo(current - 1);
});

window.setFilter = function (filter, btn) {
  document.querySelectorAll('.fbtn').forEach(b => { b.classList.remove('on', 'sith-on'); });
  if (filter === 'sith') btn.classList.add('sith-on'); else btn.classList.add('on');
  if (filter === 'all') filteredSlides = [...allSlides];
  else if (filter === 'prequel') filteredSlides = allSlides.filter(s => s.dataset.era === 'prequel');
  else if (filter === 'original') filteredSlides = allSlides.filter(s => s.dataset.era === 'original');
  else if (filter === 'sith') filteredSlides = allSlides.filter(s => s.dataset.theme === 'sith' || s.dataset.theme === 'empire');
  current = 0; goTo(0);
};

goTo(0);
