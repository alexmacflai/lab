import { seeded } from './receipts.js';

// The existing mesh remains the outer envelope. Only its right and bottom
// perimeter become a feathered fringe; factory edges and opaque interiors stay intact.
export function scaledCornerTexture(source, seed, factory = [true, false, true, false], widthMm = 64) {
  const canvas = document.createElement('canvas'); canvas.width = source.width * 2; canvas.height = source.height * 2;
  const ctx = canvas.getContext('2d'); ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  const mm = canvas.width / widthMm, random = seeded(seed + 519);
  for (const [sideIndex, side] of ['left', 'right', 'top', 'bottom'].entries()) {
    if (factory[sideIndex]) continue;
    ctx.save();
    if (side === 'right') { ctx.translate(canvas.width, 0); ctx.rotate(Math.PI / 2); }
    else if (side === 'bottom') { ctx.translate(0, canvas.height); ctx.scale(1, -1); }
    else if (side === 'left') { ctx.translate(0, canvas.height); ctx.rotate(-Math.PI / 2); }
    feather(ctx, side === 'right' || side === 'left' ? canvas.height : canvas.width, mm, random, side === 'right');
    ctx.restore();
  }
  return canvas;
}

function feather(ctx, length, mm, random, acrossGrain) {
  // Art-directed edge scale for a handheld 64 mm scrap, judged at normal size.
  // Scale fracture depth, peel and fibre length together; retain fine strand widths.
  const strandMm = mm;
  mm *= 2.8;
  const samples = Math.ceil(length / 2), front = [];
  // Unequal, overlapping fracture fronts: a pale exposed interior, then sparse fibres.
  for (let i = 0; i <= samples; i++) {
    const x = i * length / samples;
    const wander = .5 + .25 * Math.sin(x / (mm * 1.7)) + .18 * Math.sin(x / (mm * .43) + 2);
    front.push((acrossGrain ? .22 + .55 * wander : .12 + .28 * wander) * mm);
  }
  ctx.beginPath(); ctx.moveTo(0, 0);
  front.forEach((depth, i) => ctx.lineTo(i * length / samples, depth));
  ctx.lineTo(length, 0); ctx.closePath();
  ctx.save(); ctx.clip();
  // Erase the solid face at the perimeter, then deposit a broken fibre network.
  ctx.clearRect(0, 0, length, mm * 1.2);
  for (let i = 0; i < length * 2; i++) {
    const x = random() * length, depth = front[Math.min(samples, Math.floor(x / length * samples))];
    const tip = random() * depth * .6, spread = (random() - .5) * mm * .7;
    ctx.strokeStyle = i % 7 ? `rgba(249,246,233,${.25 + random() * .65})` : '#b7ac9055';
    ctx.lineWidth = (.018 + random() * .035) * strandMm;
    ctx.beginPath(); ctx.moveTo(x, depth + .08 * mm);
    ctx.quadraticCurveTo(x + spread * .3, depth * .55, x + spread, tip); ctx.stroke();
  }
  ctx.restore();
  // Thin surface peel of changing width: expose stock beneath the tint and ruling.
  ctx.beginPath(); front.forEach((depth, i) => {
    const x = i * length / samples;
    if (!i) ctx.moveTo(x, depth); else ctx.lineTo(x, depth);
  });
  for (let i = samples; i >= 0; i--) {
    const x = i * length / samples;
    ctx.lineTo(x, front[i] + mm * (.12 + .18 * (1 + Math.sin(x / (mm * .8))) / 2));
  }
  ctx.closePath(); ctx.fillStyle = '#f7f3e4d9'; ctx.fill();
  // A very weak lip shadow, interrupted rather than a continuous dark outline.
  for (let i = 0; i < samples; i++) {
    if (random() > .3) continue;
    ctx.strokeStyle = '#91897822'; ctx.lineWidth = .025 * mm;
    ctx.beginPath(); ctx.moveTo(i * length / samples, front[i] + .2 * mm);
    ctx.lineTo((i + 1) * length / samples, front[i + 1] + .2 * mm); ctx.stroke();
  }
}
