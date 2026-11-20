import { seeded } from './receipts.js';

const edgeCache = new Map();
let cachedBytes = 0;
const CACHE_BYTES = 96 * 1024 * 1024;

export function tornCornerTexture(source, seed, factory = [true, false, true, false], widthMm = 64) {
  const canvas = document.createElement('canvas'); canvas.width = source.width * 2; canvas.height = source.height * 2;
  const ctx = canvas.getContext('2d', { willReadFrequently: true }); ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  const mm = canvas.width / widthMm, random = seeded(seed + 723);
  const key = `${seed}/${source.width}/${source.height}/${widthMm}/${factory.join()}`;
  const cached = edgeCache.get(key);
  if (cached) {
    edgeCache.delete(key); edgeCache.set(key, cached);
    for (const { image, x, y } of cached.strips) {
      ctx.clearRect(x, y, image.width, image.height); ctx.drawImage(image, x, y);
    }
    return canvas;
  }
  for (const [sideIndex, side] of ['left', 'right', 'top', 'bottom'].entries()) {
    if (factory[sideIndex]) continue;
    ctx.save();
    if (side === 'right') { ctx.translate(canvas.width, 0); ctx.rotate(Math.PI / 2); }
    else if (side === 'bottom') { ctx.translate(0, canvas.height); ctx.scale(1, -1); }
    else if (side === 'left') { ctx.translate(0, canvas.height); ctx.rotate(-Math.PI / 2); }
    const length = side === 'right' || side === 'left' ? canvas.height : canvas.width;
    dryTear(ctx, length, mm, random, sideIndex < 2);
    ctx.restore();
  }
  cacheEdges(key, canvas, factory, Math.ceil(mm * 3.4));
  return canvas;
}

function field(length, pitch, random) {
  const values = Array.from({ length: Math.ceil(length / pitch) + 2 }, random);
  return x => {
    const p = Math.max(0, x / pitch), i = Math.min(values.length - 2, Math.floor(p));
    const t = p - i, f = t * t * (3 - 2 * t);
    return values[i] * (1 - f) + values[i + 1] * f;
  };
}

function ribbon(ctx, length, outer, inner) {
  const count = Math.ceil(length / 1.5);
  ctx.beginPath();
  for (let i = 0; i <= count; i++) {
    const x = i * length / count;
    if (!i) ctx.moveTo(x, outer(x)); else ctx.lineTo(x, outer(x));
  }
  for (let i = count; i >= 0; i--) {
    const x = i * length / count; ctx.lineTo(x, inner(x));
  }
  ctx.closePath();
}

function dryTear(ctx, length, mm, random, acrossGrain) {
  mm *= 1.8; // Retain the approved visible tear scale at full-scrap viewing size.
  const broad = field(length, mm * 2.8, random), clumps = field(length, mm * .55, random);
  const fine = field(length, mm * .075, random), split = field(length, mm * 1.1, random);
  const scale = acrossGrain ? 1 : .82;
  const root = x => mm * scale * (.15 + broad(x) * .37 + clumps(x) * .3 + fine(x) * .12);
  const core = x => root(x) + mm * (.14 + split(x) ** 2 * .65 + fine(x) * .08);
  // Actual voids and solid fibrous pulp; no faded perimeter or shaded frame.
  ribbon(ctx, length, () => 0, core);
  ctx.save(); ctx.clip(); ctx.clearRect(0, 0, length, mm * 3); ctx.restore();
  ribbon(ctx, length, root, core); ctx.fillStyle = '#eee9d8'; ctx.fill();
  pulp(ctx, length, mm, random, root, core);
  splitLips(ctx, length, mm, random, root, core);
  bundles(ctx, length, mm, random, root, core, clumps);
  flakes(ctx, length, mm, random, root, core);
}

function pulp(ctx, length, mm, random, root, core) {
  ctx.save(); ribbon(ctx, length, root, core); ctx.clip();
  // Fine fibres inside the exposed fracture, following differing local pull directions.
  for (let i = 0; i < length * 4; i++) {
    const x = random() * length, y = root(x) + random() * (core(x) - root(x));
    ctx.strokeStyle = i % 5 ? '#fffdf06b' : '#ad9f7d24';
    ctx.lineWidth = mm * (.006 + random() * .012);
    ctx.beginPath(); ctx.moveTo(x, y);
    ctx.lineTo(x + (random() - .5) * mm * .65, y + (random() - .5) * mm * .3); ctx.stroke();
  }
  ctx.restore();
}

function bundles(ctx, length, mm, random, root, core, density) {
  for (let i = 0; i < length * 1.2; i++) {
    const x = random() * length;
    if (random() > .09 + density(x) * .48) continue;
    const start = root(x) + mm * (.04 + random() * .13), end = Math.max(.015 * mm, root(x) - mm * (.035 + random() ** 2 * .22));
    const lean = (random() - .5) * mm * .28;
    const strands = 1 + Math.floor(random() * 3);
    for (let j = 0; j < strands; j++) {
      const spread = (random() - .5) * mm * .045;
      ctx.strokeStyle = j % 4 ? '#f9f5e6e0' : '#e3ddc9bd';
      ctx.lineWidth = mm * (.007 + random() * .012);
      ctx.beginPath(); ctx.moveTo(x + spread, start);
      ctx.bezierCurveTo(x + spread + lean * .15, root(x), x + lean * .6, end + mm * .12,
        x + lean + spread, end + random() * mm * .12); ctx.stroke();
    }
  }
}

function flakes(ctx, length, mm, random, root, core) {
  // Short asymmetric lifted fibre tongues, separated by untouched fracture sections.
  for (let x = mm; x < length - mm; x += mm * (2.5 + random() * 5.8)) {
    if (random() > .14) continue;
    const width = mm * (.1 + random() * .22), start = core(x);
    const tip = Math.max(mm * .03, root(x) - mm * (.04 + random() * .11));
    ctx.beginPath(); ctx.moveTo(x - width * .5, start);
    ctx.lineTo(x - width * .3, root(x)); ctx.lineTo(x + width * .15, tip);
    ctx.lineTo(x + width * .35, root(x + width)); ctx.lineTo(x + width * .6, start);
    ctx.closePath(); ctx.fillStyle = '#f8f3e3'; ctx.fill();
    ctx.strokeStyle = '#9e90751c'; ctx.lineWidth = mm * .02;
    ctx.beginPath(); ctx.moveTo(x - width * .4, start); ctx.lineTo(x + width * .5, start); ctx.stroke();
  }
}

function splitLips(ctx, length, mm, random, root, core) {
  // Local overlaps of the fracture surface, separated by ordinary fine tears.
  for (let x = mm * .3; x < length - mm; x += mm * (.7 + random() * 2.5)) {
    if (random() > .55) continue;
    const width = mm * (.15 + random() * .7), depth = core(x) - root(x);
    const y = root(x) + depth * (.25 + random() * .45);
    ctx.beginPath(); ctx.moveTo(x, y);
    ctx.lineTo(x + width * .28, y - depth * .16);
    ctx.lineTo(x + width * .8, y - depth * .07);
    ctx.lineTo(x + width, y + depth * .15);
    ctx.lineTo(x + width * .25, y + depth * .13); ctx.closePath();
    ctx.fillStyle = random() > .35 ? '#faf6e4aa' : '#c5bba12b'; ctx.fill();
    ctx.strokeStyle = '#a99e821b'; ctx.lineWidth = mm * .012;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + width * .28, y - depth * .16); ctx.stroke();
  }
}

function cacheEdges(key, canvas, factory, depth) {
  const { width, height } = canvas;
  const rectangles = [[0,0,depth,height], [width-depth,0,depth,height],
    [0,0,width,depth], [0,height-depth,width,depth]];
  let bytes = 0;
  const strips = rectangles.flatMap(([x,y,w,h], side) => {
    if (factory[side]) return [];
    const image = document.createElement('canvas'); image.width = w; image.height = h;
    image.getContext('2d', { willReadFrequently: true }).drawImage(canvas,x,y,w,h,0,0,w,h);
    bytes += w * h * 4; return [{image,x,y}];
  });
  edgeCache.set(key, { strips, bytes }); cachedBytes += bytes;
  while (cachedBytes > CACHE_BYTES) {
    const oldest = edgeCache.keys().next().value, entry = edgeCache.get(oldest);
    cachedBytes -= entry.bytes; edgeCache.delete(oldest);
    entry.strips.forEach(({image}) => { image.width = image.height = 1; });
  }
}
