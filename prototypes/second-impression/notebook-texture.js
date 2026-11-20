import { drawNotebookNotes } from './notebook-annotations.js';
import { seeded } from './receipts.js';
import { FACTORY_EDGES } from './notebook-shapes.js';

function ruling(ctx, index, mm, width, height, family) {
  const spacing = [7, 5, 0, 6, 4][family] * mm;
  if (!spacing) return;
  const offset = (index * 13 % 19) * mm / 3;
  ctx.strokeStyle = ['#7495b36b', '#8c9c9460', '#829ca64a', '#9f8ab06b', '#76a5b170'][family];
  ctx.lineWidth = .14 * mm; ctx.beginPath();
  for (let y = offset; y < height; y += spacing) { ctx.moveTo(0, y); ctx.lineTo(width, y); }
  if (family === 1 || family === 4) {
    for (let x = offset; x < width; x += spacing) { ctx.moveTo(x, 0); ctx.lineTo(x, height); }
  }
  ctx.stroke();
  if (index % 4 === 1) {
    ctx.strokeStyle = '#bb77764d'; ctx.beginPath();
    ctx.moveTo(9 * mm, 0); ctx.lineTo(9 * mm, height); ctx.stroke();
  }
}

function tornFibres(ctx, index, mm, width, height, random) {
  FACTORY_EDGES[index].forEach((factory, side) => {
    if (factory) return;
    ctx.save();
    if (side === 1) { ctx.translate(width, 0); ctx.scale(-1, 1); }
    if (side === 2) { ctx.rotate(-Math.PI / 2); ctx.translate(-height, 0); }
    if (side === 3) { ctx.translate(0, height); ctx.rotate(-Math.PI / 2); ctx.scale(1, -1); }
    const length = side < 2 ? height : width;
    for (let i = 0; i < 180; i++) {
      const y = random() * length, reach = (.04 + random() * .22) * mm;
      ctx.strokeStyle = i % 4 ? '#fffdf0a0' : '#9c8f7625';
      ctx.lineWidth = .035 * mm;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(reach, y + (random() - .5) * mm * .2); ctx.stroke();
    }
    ctx.restore();
  });
}

export function scrapTexture(stock, handwriting, index, widthMm, ratio, seed, family = index % 5, annotations) {
  const canvas = document.createElement('canvas'); canvas.width = 800; canvas.height = Math.round(800 * ratio);
  const ctx = canvas.getContext('2d'), random = seeded(seed), mm = 800 / widthMm;
  ctx.drawImage(stock, 0, 0, canvas.width, canvas.height);
  ctx.fillStyle = ['#ead09d55', '#c1dbe52b', '#e8c78840', '#ffffff09', '#d7d3bb40'][index % 5];
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ruling(ctx, index, mm, canvas.width, canvas.height, family);
  drawNotebookNotes(ctx, handwriting, annotations, index, mm);
  tornFibres(ctx, index, mm, canvas.width, canvas.height, random);
  return canvas;
}
