import { seeded } from './receipts.js';

export function scaledCornerTexture(source, seed, factory = [true, false, true, false], widthMm = 64) {
  const canvas = document.createElement('canvas'); canvas.width = source.width * 2; canvas.height = source.height * 2;
  const ctx = canvas.getContext('2d'); ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  const mm = canvas.width / widthMm, random = seeded(seed + 723);
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
  const core = x => root(x) + mm * (.18 + split(x) ** 2 * 1.05 + fine(x) * .12);
  // Actual voids and solid fibrous pulp; no faded perimeter or shaded frame.
  ribbon(ctx, length, () => 0, core);
  ctx.save(); ctx.clip(); ctx.clearRect(0, 0, length, mm * 3); ctx.restore();
  ribbon(ctx, length, root, core); ctx.fillStyle = '#eee9d8'; ctx.fill();
  pulp(ctx, length, mm, random, root, core);
  bundles(ctx, length, mm, random, root, core, clumps);
  flakes(ctx, length, mm, random, root, core);
}

function pulp(ctx, length, mm, random, root, core) {
  ctx.save(); ribbon(ctx, length, root, core); ctx.clip();
  // Fine fibres inside the exposed fracture, following differing local pull directions.
  for (let i = 0; i < length * 4; i++) {
    const x = random() * length, y = root(x) + random() * (core(x) - root(x));
    ctx.strokeStyle = i % 5 ? '#fffdf0a0' : '#ad9f7d39';
    ctx.lineWidth = mm * (.008 + random() * .022);
    ctx.beginPath(); ctx.moveTo(x, y);
    ctx.lineTo(x + (random() - .5) * mm * .65, y + (random() - .5) * mm * .3); ctx.stroke();
  }
  ctx.restore();
}

function bundles(ctx, length, mm, random, root, core, density) {
  for (let i = 0; i < length * 1.2; i++) {
    const x = random() * length;
    if (random() > .16 + density(x) * .8) continue;
    const start = root(x) + mm * (.04 + random() * .13), end = Math.max(.015 * mm, root(x) - mm * (.08 + random() ** 2 * .7));
    const lean = (random() - .5) * mm * .75;
    const strands = 2 + Math.floor(random() * 6);
    for (let j = 0; j < strands; j++) {
      const spread = (random() - .5) * mm * .09;
      ctx.strokeStyle = j % 4 ? '#f9f5e6e0' : '#e3ddc9bd';
      ctx.lineWidth = mm * (.012 + random() * .024);
      ctx.beginPath(); ctx.moveTo(x + spread, start);
      ctx.bezierCurveTo(x + spread + lean * .15, root(x), x + lean * .6, end + mm * .12,
        x + lean + spread, end + random() * mm * .12); ctx.stroke();
    }
  }
}

function flakes(ctx, length, mm, random, root, core) {
  // Short asymmetric lifted fibre tongues, separated by untouched fracture sections.
  for (let x = mm; x < length - mm; x += mm * (2.5 + random() * 5.8)) {
    if (random() > .24) continue;
    const width = mm * (.1 + random() * .22), start = core(x);
    const tip = Math.max(mm * .03, root(x) - mm * (.08 + random() * .26));
    ctx.beginPath(); ctx.moveTo(x - width * .5, start);
    ctx.lineTo(x - width * .3, root(x)); ctx.lineTo(x + width * .15, tip);
    ctx.lineTo(x + width * .35, root(x + width)); ctx.lineTo(x + width * .6, start);
    ctx.closePath(); ctx.fillStyle = '#f8f3e3'; ctx.fill();
    ctx.strokeStyle = '#9e90751c'; ctx.lineWidth = mm * .02;
    ctx.beginPath(); ctx.moveTo(x - width * .4, start); ctx.lineTo(x + width * .5, start); ctx.stroke();
  }
}
