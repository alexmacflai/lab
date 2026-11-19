import { RECEIPTS, seeded } from './receipts.js';
import { LAYOUTS, typesetter } from './layouts.js';
import { drawCollection } from './collection-layouts.js';
import { drawHeader, ORIGINAL_TAGS } from './brands.js';
import { addMark } from './marks.js';

export async function loadPaper() {
  const material = new Image();
  material.src = 'thermal-paper.png';
  await material.decode();
  return RECEIPTS.map(receipt => ({ ...receipt, makeTexture: () => makeTexture(material, receipt) }));
}

function makeTexture(material, receipt) {
  const canvas = document.createElement('canvas');
  canvas.width = 800; canvas.height = Math.round(800 * receipt.ratio);
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(material, 0, 0, canvas.width, canvas.height);
  addStockVariation(ctx, receipt);
  const ink = document.createElement('canvas'); ink.width = canvas.width; ink.height = canvas.height;
  const printer = ink.getContext('2d');
  printer.scale(2, canvas.height / 850);
  if (receipt.original) {
    LAYOUTS[receipt.family](typesetter(printer, receipt));
    printer.save(); printer.globalCompositeOperation = 'destination-out'; printer.fillRect(0, 0, 400, 144); printer.restore();
    drawHeader(printer, receipt, ORIGINAL_TAGS[receipt.family]);
  }
  else drawCollection(printer, receipt);
  ageInk(printer, receipt);
  ctx.globalAlpha = receipt.ink; ctx.drawImage(ink, 0, 0);
  ctx.globalAlpha = 1; addMark(ctx, receipt);
  return canvas;
}

function addStockVariation(ctx, receipt) {
  const random = seeded(receipt.seed);
  const { width, height } = ctx.canvas;
  const pixels = ctx.getImageData(0, 0, width, height);
  for (let i = 0; i < pixels.data.length; i += 4) {
    const grain = (random() - .5) * 2.2;
    for (let c = 0; c < 3; c++) pixels.data[i + c] += grain;
    pixels.data[i + 3] = 255;
  }
  ctx.putImageData(pixels, 0, 0);
  const edge = ctx.createLinearGradient(0, 0, width, 0);
  edge.addColorStop(0, '#9e8b6010'); edge.addColorStop(.07, '#9e8b6000');
  edge.addColorStop(.92, '#9e8b6000'); edge.addColorStop(1, '#9e8b600c');
  ctx.fillStyle = edge; ctx.fillRect(0, 0, width, height);
}

function ageInk(ctx, receipt) {
  const random = seeded(receipt.seed * 23);
  ctx.save(); ctx.globalCompositeOperation = 'destination-out';
  // Fixed printer-head streaks and occasional missing dots, never a moving overlay.
  ctx.fillStyle = '#00000029';
  for (let i = 0; i < 6; i++) ctx.fillRect(20 + random() * 360, 0, .25 + random() * .45, 850);
  ctx.fillStyle = '#00000038';
  for (let i = 0; i < 2300; i++) ctx.fillRect(random() * 400, random() * 850, .35, .35);
  ctx.restore();
}
