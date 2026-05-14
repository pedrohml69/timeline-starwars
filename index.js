
const canvas = document.getElementById('starfield'), ctx = canvas.getContext('2d');
let W, H, stars = [];
function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
function initStars(n = 300) { stars = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.4 + 0.2, a: Math.random(), ts: Math.random() * 0.02 + 0.005, sp: Math.random() * 0.4 + 0.05 })); }
function drawStars() {
    ctx.clearRect(0, 0, W, H);
    const sith = document.body.classList.contains('sith-mode');
    stars.forEach(s => {
        s.a += s.ts;
        const al = 0.4 + 0.6 * Math.abs(Math.sin(s.a));
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = sith && Math.random() < 0.003 ? `rgba(255,60,40,${al})` : `rgba(255,245,200,${al})`;
        ctx.fill(); s.y += s.sp * 0.1; if (s.y > H) { s.y = 0; s.x = Math.random() * W; }
    });
    requestAnimationFrame(drawStars);
}
resize(); initStars(); drawStars();
window.addEventListener('resize', () => { resize(); initStars(); });

const glow = document.getElementById('forceGlow');
document.addEventListener('mousemove', e => { glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; });

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
const btnPrev = document.getElementById('btnPrev');
const btnNext = document.getElementById('btnNext');
const indEl = document.getElementById('indicators');
const badge = document.getElementById('episodeBadge');
const track = document.getElementById('timelineTrack');
const prog = document.getElementById('timelineProgress');
const ds = document.getElementById('deathStar');
const laser = document.getElementById('laser');
const flash = document.getElementById('sithFlash');

const allSlides = Array.from(wrapper.querySelectorAll('.slide'));
let filteredSlides = [...allSlides];
let current = 0;

const nodeData = [
    { ep: 'EP. I', date: '32 BBY' }, { ep: 'EP. II', date: '22 BBY' }, { ep: 'EP. III', date: '19 BBY' },
    { ep: 'EP. IV', date: '0 BBY' }, { ep: 'EP. V', date: '3 ABY' }, { ep: 'EP. VI', date: '4 ABY' },
];

const nodes = nodeData.map((d, i) => {
    const pct = (i / (allSlides.length - 1)) * 100;
    const nd = document.createElement('div');
    nd.className = 'tl-node'; nd.style.left = pct + '%';
    nd.innerHTML = `<span class="tl-ep-label">${d.ep}</span><div class="tl-dot"></div><span class="tl-date-label">${d.date}</span>`;
    nd.addEventListener('click', () => {
        const fi = filteredSlides.findIndex(s => allSlides.indexOf(s) === i);
        if (fi >= 0) goTo(fi);
    });
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
    ds.classList.add('visible');
    if (laserTimer) clearTimeout(laserTimer);
    laserTimer = setTimeout(() => {
        laser.style.animation = 'none'; laser.offsetHeight;
        laser.style.animation = 'fireLaser 2.2s ease forwards';
    }, 2400);
}

function triggerSithExit() {
    ds.classList.remove('visible');
    laser.style.animation = 'none';
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
    else if (isSith) ds.classList.add('visible');

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
    current = 0;
    goTo(0);
};

goTo(0);
