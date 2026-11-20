import { hash } from './conditions.js';
import { physicalMark } from './mark-assets.js';

function ink(ctx, x, y) {
  ctx.fillStyle = '#182c4e38'; ctx.beginPath(); ctx.ellipse(x, y, 2.2, 1.4, .4, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 5, y - 4, .7, 0, 7); ctx.fill();
}

export function addMark(ctx, receipt) {
  if (!receipt.mark) return;
  const seed = hash(receipt.id + '/mark-position');
  const x = seed % 2 ? 62 + seed % 27 : 312 + seed % 21;
  const y = seed % 3 ? 700 + seed % 105 : 160 + seed % 90;
  ctx.save(); ctx.scale(ctx.canvas.width / 400, ctx.canvas.width / 400);
  ctx.globalCompositeOperation = 'multiply';
  if (receipt.mark === 'ink') ink(ctx, x, y);
  else physicalMark(ctx, receipt, x, y);
  ctx.restore();
}
