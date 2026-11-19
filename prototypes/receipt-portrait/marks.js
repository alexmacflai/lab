import { hash } from './conditions.js';

function coffee(ctx, x, y, seed) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(seed % 7 * .15);
  ctx.strokeStyle = '#77502718'; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.ellipse(0, 0, 21, 16, 0, .1, Math.PI * 1.83); ctx.stroke();
  ctx.strokeStyle = '#7750270c'; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.ellipse(1, -1, 22, 17, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#77502712'; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(29 + i * 5, -16 + i * 7, 1.2 + i * .3, 0, 7); ctx.fill(); }
  ctx.restore();
}
function ink(ctx, x, y) {
  ctx.fillStyle = '#182c4e38'; ctx.beginPath(); ctx.ellipse(x, y, 2.2, 1.4, .4, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 5, y - 4, .7, 0, 7); ctx.fill();
}
function marker(ctx, x, y) {
  ctx.strokeStyle = '#3b484a24'; ctx.lineCap = 'round'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(x - 26, y + 3); ctx.quadraticCurveTo(x, y - 1, x + 24, y - 3); ctx.stroke();
}
function note(ctx, x, y, kind, seed) {
  ctx.save(); ctx.translate(x, y); ctx.rotate((seed % 5 - 2) * .025);
  ctx.fillStyle = kind === 'pencil' ? '#42413b55' : '#233b735c';
  ctx.font = 'italic 12px "Apple Chancery", cursive';
  ctx.fillText(['keep', 'paid ✓', 'for home', 'thanks!'][seed % 4], -17, 0); ctx.restore();
}
function doodle(ctx, x, y) {
  ctx.save(); ctx.translate(x, y); ctx.strokeStyle = '#203c6a55'; ctx.lineWidth = .8;
  ctx.beginPath(); for (let i = 0; i < 6; i++) { const a = i * Math.PI * 4 / 5 - Math.PI / 2; const px = Math.cos(a) * 7, py = Math.sin(a) * 7; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke();
  ctx.restore();
}
export function addMark(ctx, receipt) {
  if (!receipt.mark) return;
  const seed = hash(receipt.id + '/mark-position');
  const x = seed % 2 ? 62 + seed % 27 : 312 + seed % 21;
  const y = seed % 3 ? 754 + seed % 35 : 163 + seed % 32;
  ctx.save(); ctx.scale(ctx.canvas.width / 400, ctx.canvas.height / 850);
  ctx.globalCompositeOperation = 'multiply';
  if (receipt.mark === 'coffee') coffee(ctx, x, y, seed);
  else if (receipt.mark === 'ink') ink(ctx, x, y);
  else if (receipt.mark === 'marker') marker(ctx, x, y);
  else if (receipt.mark === 'doodle') doodle(ctx, x, y);
  else note(ctx, x, y, receipt.mark, seed);
  ctx.restore();
}
