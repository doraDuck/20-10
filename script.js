'use strict';

/* =====================================================
   CẤU HÌNH — sửa nội dung lời chúc ở đây
   ===================================================== */
const CONFIG = {
  titleLines: ['Chúc mừng ngày Phụ nữ', 'Việt Nam 20/10'],
  wishes: [
    'Nhân ngày Phụ nữ Việt Nam 20/10, xin gửi những lời chúc tốt đẹp nhất đến tất cả những người phụ nữ tuyệt vời!',
    'Chúc bạn luôn xinh đẹp, tự tin và hạnh phúc, không chỉ trong hôm nay mà trong mọi khoảnh khắc của cuộc sống.',
    'Cảm ơn bạn vì đã luôn là nguồn cảm hứng, là điểm tựa yêu thương và là một phần không thể thiếu để thế giới trở nên tươi đẹp hơn. 🌷',
  ],
  closing: 'Chúc mừng 20/10! 💐',
  titleCharDelay: 48,   // ms giữa các chữ của tiêu đề
  wordDelay: 85,        // ms giữa các từ của lời chúc
};

/* ===================================================== */
const $ = (s) => document.querySelector(s);
const rand = (a, b) => Math.random() * (b - a) + a;
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const TAU = Math.PI * 2;

/* ---------- Hoa SVG ---------- */
let uid = 0;
function flowerSVG({ hue = 340, sat = 88, light = 70, petals = 9, white = false } = {}) {
  const id = 'f' + uid++;
  const layers = [
    { n: petals,     h: 96, w: 50, rot: 0,                  l: light + 12 },
    { n: petals,     h: 80, w: 44, rot: 180 / petals,       l: light + 4  },
    { n: petals - 1, h: 62, w: 38, rot: 10,                  l: light - 4  },
    { n: petals - 2, h: 44, w: 30, rot: 25,                  l: light - 12 },
    { n: 6,          h: 26, w: 20, rot: 5,                   l: light - 18 },
  ];
  const s = white ? 38 : sat;
  let defs = '';
  let body = '';
  layers.forEach((L, i) => {
    const tip = `hsl(${hue} ${s}% ${Math.min(L.l + 10, 97)}%)`;
    const base = `hsl(${hue} ${white ? 70 : s}% ${Math.max(L.l - 10, 30)}%)`;
    defs += `<radialGradient id="${id}-${i}" cx="50%" cy="100%" r="100%"><stop offset="0" stop-color="${base}"/><stop offset="1" stop-color="${tip}"/></radialGradient>`;
    const d = `M0 0C${-L.w} ${-L.h * 0.25} ${-L.w * 1.05} ${-L.h * 0.85} 0 ${-L.h}C${L.w * 1.05} ${-L.h * 0.85} ${L.w} ${-L.h * 0.25} 0 0Z`;
    const stroke = `hsl(${hue} ${s}% ${Math.max(L.l - 16, 25)}%)`;
    let ps = '';
    for (let k = 0; k < L.n; k++) {
      ps += `<path d="${d}" fill="url(#${id}-${i})" stroke="${stroke}" stroke-opacity=".35" stroke-width=".8" transform="rotate(${(L.rot + (k * 360) / L.n).toFixed(1)})"/>`;
    }
    // Quay chậm các lớp cánh (SMIL) để hoa "sống"
    const dir = i % 2 ? 360 : -360;
    const anim = i < 4 ? `<animateTransform attributeName="transform" type="rotate" from="0 0 0" to="${dir} 0 0" dur="${50 + i * 25}s" repeatCount="indefinite"/>` : '';
    body += `<g>${ps}${anim}</g>`;
  });
  let dots = '';
  for (let k = 0; k < 14; k++) {
    const a = (k / 14) * TAU, r = k % 2 ? 9 : 5;
    dots += `<circle cx="${(Math.cos(a) * r).toFixed(1)}" cy="${(Math.sin(a) * r).toFixed(1)}" r="1.6" fill="#b86a00" opacity=".55"/>`;
  }
  const center = `<circle r="11" fill="url(#${id}-c)"/>${dots}`;
  defs += `<radialGradient id="${id}-c"><stop offset="0" stop-color="#fff3b0"/><stop offset="1" stop-color="#f5b921"/></radialGradient>`;
  return `<svg viewBox="-100 -100 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>${defs}</defs>${body}${center}</svg>`;
}

/* Hoa lớn ở màn hình mở đầu */
$('#introFlower').innerHTML = flowerSVG({ hue: 338, petals: 10, light: 68 });

/* Hoa quanh viền: x,y (% màn hình), s (vmin), hue */
const FLOWER_SET = [
  // góc trên trái
  { x: 3,   y: 4,   s: 38, hue: 335, rot: -10, petals: 10 },
  { x: 22,  y: -3,  s: 26, hue: 348, rot: 20,  white: true, light: 88, petals: 9 },
  { x: -3,  y: 27,  s: 28, hue: 342, rot: 35,  petals: 9 },
  // góc trên phải
  { x: 97,  y: 5,   s: 40, hue: 340, rot: 15,  petals: 10, white: true, light: 90 },
  { x: 79,  y: -2,  s: 28, hue: 330, rot: -25, petals: 9 },
  { x: 102, y: 28,  s: 26, hue: 352, rot: 40,  petals: 8 },
  // góc dưới trái
  { x: 4,   y: 96,  s: 40, hue: 338, rot: 10,  petals: 10 },
  { x: 24,  y: 103, s: 28, hue: 345, rot: -30, petals: 9, white: true, light: 88 },
  { x: -3,  y: 72,  s: 26, hue: 332, rot: 25,  petals: 9 },
  // góc dưới phải
  { x: 96,  y: 95,  s: 38, hue: 335, rot: -15, petals: 10, white: true, light: 90 },
  { x: 77,  y: 102, s: 30, hue: 350, rot: 30,  petals: 9 },
  { x: 103, y: 70,  s: 28, hue: 340, rot: -20, petals: 8 },
  // giữa cạnh trên / dưới
  { x: 50,  y: -4,  s: 20, hue: 342, rot: 0,   petals: 8 },
  { x: 50,  y: 104, s: 20, hue: 346, rot: 15,  petals: 8, white: true, light: 88 },
  // hoa nhỏ rải thêm
  { x: 9,   y: 16,  s: 13, hue: 345, rot: 10,  petals: 7 },
  { x: 91,  y: 17,  s: 13, hue: 335, rot: -10, petals: 7 },
  { x: 8,   y: 85,  s: 13, hue: 340, rot: 20,  petals: 7 },
  { x: 92,  y: 83,  s: 13, hue: 350, rot: -20, petals: 7 },
];

const flowersEl = $('#flowers');
FLOWER_SET.forEach((f, i) => {
  f.delay = 0.15 + i * 0.09;
  const el = document.createElement('div');
  el.className = 'flower';
  el.style.cssText =
    `left:${f.x}%;top:${f.y}%;--s:${f.s};--rot:${f.rot || 0}deg;--delay:${f.delay.toFixed(2)}s;` +
    `--sd:${rand(5, 9).toFixed(1)}s;--sdel:${(-rand(0, 6)).toFixed(1)}s`;
  el.innerHTML = `<div class="sway">${flowerSVG(f)}</div>`;
  flowersEl.appendChild(el);
});

/* =====================================================
   CANVAS: cánh hoa, tim, lấp lánh
   ===================================================== */
const cv = $('#fx');
const ctx = cv.getContext('2d');
let W = 0, H = 0, level = 1;
const P = [];

function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  W = window.innerWidth;
  H = window.innerHeight;
  cv.width = W * dpr;
  cv.height = H * dpr;
  cv.style.width = W + 'px';
  cv.style.height = H + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener('resize', resize);
resize();

function mkPetal(spread) {
  return {
    t: 'petal', amb: true,
    x: rand(0, W), y: spread ? rand(0, H) : rand(-H * 0.8, -10),
    s: rand(7, 15), vy: rand(0.5, 1.4), vx: rand(-0.3, 0.3),
    ph: rand(0, TAU), sw: rand(0.4, 1.3),
    r: rand(0, TAU), vr: rand(-0.03, 0.03),
    fl: rand(0, TAU), vf: rand(0.02, 0.06),
    h: rand(325, 355), l: rand(70, 87), a: rand(0.65, 0.95),
  };
}
function mkHeart(spread) {
  return {
    t: 'heart', amb: true,
    x: rand(0, W), y: spread ? rand(0, H) : rand(H, H * 1.6),
    s: rand(5, 12), vy: -rand(0.6, 1.5), vx: 0,
    ph: rand(0, TAU), sw: rand(0.3, 0.9),
    r: 0, vr: 0, fl: 0, vf: 0,
    h: rand(332, 350), l: rand(58, 72), a: rand(0.55, 0.9),
  };
}
function mkBurst(x, y, speed = 1) {
  const a = rand(0, TAU), sp = rand(1.5, 7.5) * speed, k = Math.random();
  const max = rand(70, 130);
  const base = {
    x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - rand(0, 2), g: 0.07,
    life: max, max, r: rand(0, TAU), vr: rand(-0.15, 0.15),
    fl: rand(0, TAU), vf: rand(0.05, 0.15), a: 1,
  };
  if (k < 0.4)  return { ...base, t: 'petal', s: rand(6, 13), h: rand(325, 355), l: rand(68, 86) };
  if (k < 0.65) return { ...base, t: 'heart', s: rand(5, 10), h: rand(330, 350), l: rand(58, 72) };
  return { ...base, t: 'spark', s: rand(4, 10), col: pick(['#ffffff', '#fff2a8', '#ffd0e4']) };
}
function mkTwinkle(x, y) {
  const max = rand(60, 140);
  return {
    t: 'spark', tw: true, x, y, vx: 0, vy: 0, g: 0, life: max, max,
    r: rand(0, 1), vr: 0.01, s: rand(4, 11), a: 1, col: pick(['#ffffff', '#fff2a8']),
  };
}

function burst(x, y, n = 30, speed = 1) {
  for (let i = 0; i < n; i++) P.push(mkBurst(x, y, speed));
  if (P.length > 700) P.splice(0, P.length - 700);
}
function sparkle(x, y, n = 3) {
  for (let i = 0; i < n; i++) {
    const p = mkBurst(x, y, 0.35);
    p.t = 'spark'; p.col = pick(['#ffffff', '#fff2a8']); p.s = rand(3, 7); p.max = p.life = rand(30, 60); p.g = 0.01;
    P.push(p);
  }
}

function ensureAmbient() {
  const want = level === 2 ? { petal: 38, heart: 12 } : { petal: 14, heart: 4 };
  const have = { petal: 0, heart: 0 };
  P.forEach((p) => { if (p.amb) have[p.t]++; });
  const first = P.length === 0;
  for (; have.petal < want.petal; have.petal++) P.push(mkPetal(first));
  for (; have.heart < want.heart; have.heart++) P.push(mkHeart(first));
}

function petalPath(s) {
  ctx.beginPath();
  ctx.moveTo(0, -s);
  ctx.bezierCurveTo(s * 0.8, -s * 0.6, s * 0.6, s * 0.7, 0, s);
  ctx.bezierCurveTo(-s * 0.6, s * 0.7, -s * 0.8, -s * 0.6, 0, -s);
  ctx.closePath();
}
function heartPath(s) {
  ctx.beginPath();
  ctx.moveTo(0, s * 0.9);
  ctx.bezierCurveTo(-s * 1.3, s * 0.1, -s * 0.9, -s * 0.9, 0, -s * 0.35);
  ctx.bezierCurveTo(s * 0.9, -s * 0.9, s * 1.3, s * 0.1, 0, s * 0.9);
  ctx.closePath();
}
function starPath(s) {
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4, r = i % 2 ? s * 0.28 : s;
    ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  ctx.closePath();
}

function draw(p) {
  let alpha;
  if (p.amb) alpha = p.a;
  else if (p.tw) alpha = Math.sin(Math.PI * (1 - p.life / p.max));
  else alpha = Math.min(1, p.life / (p.max * 0.35));
  if (alpha <= 0) return;

  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.t === 'spark' && p.tw ? p.r * TAU : p.r);
  ctx.globalAlpha = alpha;
  if (p.t === 'petal') {
    ctx.scale(Math.abs(Math.cos(p.fl)) * 0.75 + 0.25, 1);
    ctx.fillStyle = `hsl(${p.h} 85% ${p.l}%)`;
    petalPath(p.s); ctx.fill();
  } else if (p.t === 'heart') {
    ctx.fillStyle = `hsl(${p.h} 88% ${p.l}%)`;
    heartPath(p.s); ctx.fill();
  } else {
    ctx.fillStyle = p.col;
    starPath(p.s); ctx.fill();
    ctx.globalAlpha = alpha * 0.3;
    starPath(p.s * 1.9); ctx.fill();
  }
  ctx.restore();
}

function frame() {
  ctx.clearRect(0, 0, W, H);

  // lấp lánh ngẫu nhiên khắp màn hình
  if (Math.random() < (opened ? 0.3 : 0.1)) P.push(mkTwinkle(rand(0, W), rand(0, H)));

  for (let i = P.length - 1; i >= 0; i--) {
    const p = P[i];
    if (p.amb) {
      p.ph += 0.02;
      p.x += p.vx + Math.sin(p.ph) * p.sw;
      p.y += p.vy;
      p.r += p.vr; p.fl += p.vf;
      if (p.t === 'petal' && p.y > H + 30) { p.y = rand(-60, -10); p.x = rand(0, W); }
      if (p.t === 'heart' && p.y < -30) { p.y = H + rand(10, 80); p.x = rand(0, W); }
    } else {
      p.life--;
      if (p.life <= 0) { P.splice(i, 1); continue; }
      p.vx *= 0.985;
      p.vy += p.g;
      p.x += p.vx; p.y += p.vy;
      p.r += p.vr; p.fl += p.vf;
    }
    draw(p);
  }
  requestAnimationFrame(frame);
}
ensureAmbient();
requestAnimationFrame(frame);

/* =====================================================
   HIỆN TIÊU ĐỀ + LỜI CHÚC TRẢI DẦN
   ===================================================== */
let timers = [];
const later = (fn, ms) => timers.push(setTimeout(fn, ms));

function centerOf(el) {
  const r = el.getBoundingClientRect();
  return [r.left + r.width / 2, r.top + r.height / 2];
}

function makeWords(text, parent, t0, wordDelay, sparkEvery) {
  let t = t0;
  text.split(' ').forEach((word, idx, arr) => {
    const w = document.createElement('span');
    w.className = 'w';
    w.textContent = word;
    w.style.animationDelay = t + 'ms';
    parent.appendChild(w);
    if (idx < arr.length - 1) parent.appendChild(document.createTextNode(' '));
    if (idx % sparkEvery === 0) {
      later(() => { const [x, y] = centerOf(w); sparkle(x, y, 3); }, t + 250);
    }
    t += wordDelay;
  });
  return t;
}

function playText() {
  timers.forEach(clearTimeout);
  timers = [];

  const title = $('#title'), wishes = $('#wishes'), replay = $('#replay'), divider = $('#divider');
  title.innerHTML = '';
  wishes.innerHTML = '';
  title.classList.remove('done');
  replay.classList.remove('show');
  divider.classList.remove('grow');
  title.setAttribute('aria-label', CONFIG.titleLines.join(' '));

  let t = 200;
  let count = 0;

  // Tiêu đề: từng chữ rơi xuống
  CONFIG.titleLines.forEach((line) => {
    const row = document.createElement('span');
    row.className = 't-line';
    row.setAttribute('aria-hidden', 'true');
    line.split(' ').forEach((word, wi, arr) => {
      const tw = document.createElement('span');
      tw.className = 'tw';
      [...word].forEach((c) => {
        const s = document.createElement('span');
        s.className = 'ch';
        s.textContent = c;
        s.style.animationDelay = t + 'ms';
        if (count++ % 2 === 0) {
          later(() => { const [x, y] = centerOf(s); sparkle(x, y, 3); }, t + 350);
        }
        t += CONFIG.titleCharDelay;
        tw.appendChild(s);
      });
      row.appendChild(tw);
      if (wi < arr.length - 1) row.appendChild(document.createTextNode(' '));
    });
    title.appendChild(row);
  });

  // Đường kẻ
  t += 250;
  later(() => divider.classList.add('grow'), t);
  t += 600;

  // Lời chúc: từng từ hiện dần
  CONFIG.wishes.forEach((text) => {
    const p = document.createElement('p');
    p.className = 'wish';
    wishes.appendChild(p);
    t = makeWords(text, p, t, CONFIG.wordDelay, 5) + 260;
  });

  // Câu kết
  if (CONFIG.closing) {
    const p = document.createElement('p');
    p.className = 'wish closing';
    wishes.appendChild(p);
    const end = makeWords(CONFIG.closing, p, t, CONFIG.wordDelay * 2, 1);
    later(() => { const [x, y] = centerOf(p); burst(x, y, 40, 1.1); }, end + 300);
    t = end;
  }

  later(() => {
    title.classList.add('done');
    replay.classList.add('show');
  }, t + 900);
}

/* =====================================================
   MỞ THIỆP + TƯƠNG TÁC
   ===================================================== */
let opened = false;

function openCard(x, y) {
  if (opened) return;
  opened = true;
  document.body.classList.add('opened');

  burst(x, y, 45);
  setTimeout(() => burst(W / 2, H / 2, 80, 1.2), 250);

  // mỗi bông hoa nở kèm một chùm cánh hoa
  FLOWER_SET.forEach((f) => {
    const cx = Math.min(Math.max((f.x / 100) * W, 20), W - 20);
    const cy = Math.min(Math.max((f.y / 100) * H, 20), H - 20);
    setTimeout(() => burst(cx, cy, 12, 0.8), f.delay * 1000 + 450);
  });

  level = 2;
  ensureAmbient();
  setTimeout(playText, 1000);

  // pháo cánh hoa ngẫu nhiên
  setInterval(() => {
    if (document.hidden) return;
    burst(rand(W * 0.1, W * 0.9), rand(H * 0.1, H * 0.85), 16);
  }, 2600);
}

document.addEventListener('pointerdown', (e) => {
  if (e.target.closest && e.target.closest('#replay')) return;
  if (!opened) openCard(e.clientX, e.clientY);
  else burst(e.clientX, e.clientY, 24);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    if (!opened) openCard(W / 2, H / 2);
  }
});

$('#replay').addEventListener('click', (e) => {
  e.stopPropagation();
  burst(W / 2, H / 2, 50, 1.1);
  playText();
});
