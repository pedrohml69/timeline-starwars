const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');

let W;
let H;
let stars = [];

function resizeCanvas() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

function initStars(n = 280) {
  stars = Array.from({ length: n }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 1.4 + 0.2,
    a: Math.random(),
    speed: Math.random() * 0.4 + 0.05,
    twinkleSpeed: Math.random() * 0.02 + 0.005
  }));
}

function drawStars() {
  ctx.clearRect(0, 0, W, H);

  stars.forEach(s => {
    s.a += s.twinkleSpeed;

    const alpha = 0.4 + 0.6 * Math.abs(Math.sin(s.a));

    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);

    ctx.fillStyle = `rgba(255,245,200,${alpha})`;

    ctx.fill();

    s.y += s.speed * 0.1;

    if (s.y > H) {
      s.y = 0;
      s.x = Math.random() * W;
    }
  });

  requestAnimationFrame(drawStars);
}

resizeCanvas();
initStars();
drawStars();

window.addEventListener('resize', () => {
  resizeCanvas();
  initStars();
});

const glow = document.getElementById('forceGlow');

document.addEventListener('mousemove', e => {
  glow.style.left = e.clientX + 'px';
  glow.style.top = e.clientY + 'px';
});

const charIds = [44];
const charNames = ['Anakin Skywalker'];

async function loadCharImage(index) {
  const id = charIds[index];

  const container = document.getElementById(`img-container-${index}`);
  const nameEl = document.getElementById(`char-name-${index}`);

  try {
    const res = await fetch(
      `https://akabab.github.io/starwars-api/api/id/${id}.json`
    );

    const data = await res.json();

    const img = document.createElement('img');

    img.src = data.image;
    img.alt = data.name;
    img.className = 'char-img';

    img.onload = () => {
      container.parentNode.replaceChild(img, container);
      nameEl.textContent = data.name;
    };

  } catch {
    container.textContent = charNames[index];
    nameEl.textContent = charNames[index];
  }
}

charIds.forEach((_, i) => loadCharImage(i));

const wrapper = document.getElementById('slidesWrapper');
const btnPrev = document.getElementById('btnPrev');
const btnNext = document.getElementById('btnNext');

const slides = wrapper.querySelectorAll('.slide');

const total = slides.length;

let current = 0;

function goTo(idx) {
  wrapper.style.transform = `translateX(-${current * 100}%)`;
}

btnPrev.addEventListener('click', () => {
  if (current > 0) {
    current--;
    goTo(current);
  }
});

btnNext.addEventListener('click', () => {
  if (current < total - 1) {
    current++;
    goTo(current);
  }
});