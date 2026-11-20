import { hash } from './conditions.js';
import { ageCoffee } from './aged-coffee.js';

const CELLS = { coffee: [0, 1, 2, 3, 4, 6, 7], 'pen-note': [8, 9, 10], pencil: [11, 14], doodle: [16, 17, 18, 19, 20, 21, 22, 23], marker: [15] };
let tiles = [], variants = new Map();

export async function loadMarkAssets(receipts) {
  const [atlas, doodles] = await Promise.all([loadImage('physical-marks-v1.png'), loadImage('doodle-marks-v1.png')]);
  tiles = [...sliceAtlas(atlas, 4, true), ...sliceAtlas(doodles, 2)];
  variants = new Map();
  for (const [kind, cells] of Object.entries(CELLS)) {
    if (kind === 'doodle') continue;
    receipts.filter(r => r.mark === kind).sort((a, b) => hash(a.id) - hash(b.id))
      .forEach((r, i) => variants.set(r.id, cells[i % cells.length]));
  }
  assignDoodles(receipts);
}

function assignDoodles(receipts) {
  const anchors = new Map([['florist-02', 16], ['hardware-03', 17], ['restaurant', 18]]);
  const available = CELLS.doodle.filter(cell => ![...anchors.values()].includes(cell));
  let next = 0;
  receipts.filter(r => r.mark === 'doodle').sort((a, b) => hash(a.id) - hash(b.id))
    .forEach(r => variants.set(r.id, anchors.get(r.id) ?? available[next++]));
}

async function loadImage(path) {
  const image = new Image(); image.src = path; await image.decode(); return image;
}

function sliceAtlas(image, rows, coffee = false) {
  const width = Math.floor(image.width / 4), height = Math.floor(image.height / rows);
  return Array.from({ length: rows * 4 }, (_, i) => cropMark(image, i % 4 * width, Math.floor(i / 4) * height, width, height, coffee && i < 8));
}

function cropMark(image, x, y, width, height, coffee) {
  const tile = document.createElement('canvas'); tile.width = width; tile.height = height;
  const ctx = tile.getContext('2d'); ctx.drawImage(image, x, y, width, height, 0, 0, width, height);
  const pixels = ctx.getImageData(0, 0, width, height);
  const data = pixels.data;
  let left = width, right = 0, top = height, bottom = 0;
  for (let py = 0; py < height; py++) for (let px = 0; px < width; px++) {
    const i = (py * width + px) * 4;
    if (data[i + 3] < 6 || Math.min(data[i], data[i + 1], data[i + 2]) > 242) continue;
    left = Math.min(left, px); right = Math.max(right, px); top = Math.min(top, py); bottom = Math.max(bottom, py);
  }
  if (coffee) { ageCoffee(pixels.data); ctx.putImageData(pixels, 0, 0); }
  return { image: tile, x: left, y: top, width: right - left + 1, height: bottom - top + 1 };
}

export function markWidth(receipt) {
  const seed = hash(receipt.id + '/mark-scale');
  return receipt.mark === 'coffee' ? 350 + seed % 76 : receipt.mark === 'doodle' ? 120 + seed % 21 : receipt.mark === 'marker' ? 72 + seed % 40 : 175 + seed % 26;
}

export function physicalMark(ctx, receipt, x, y) {
  const tile = tiles[variants.get(receipt.id)];
  if (!tile) return;
  const seed = hash(receipt.id + '/mark-scale');
  // Width is relative to the 400-unit / nominal 80 mm receipt, not to the screen.
  const width = markWidth(receipt);
  const height = width * tile.height / tile.width;
  ctx.save();
  if (receipt.mark === 'coffee') {
    x = 60 + hash(receipt.id + '/coffee-x') % 280;
    y = 90 + hash(receipt.id + '/coffee-y') % 650;
  }
  const rotation = (seed % 31 - 15) * .015;
  if (receipt.mark !== 'coffee') {
    const halfX = (Math.abs(Math.cos(rotation)) * width + Math.abs(Math.sin(rotation)) * height) / 2;
    const halfY = (Math.abs(Math.sin(rotation)) * width + Math.abs(Math.cos(rotation)) * height) / 2;
    const paperHeight = ctx.canvas.height / (ctx.canvas.width / 400);
    x = Math.max(halfX + 8, Math.min(392 - halfX, x));
    y = Math.max(halfY + 8, Math.min(paperHeight - 8 - halfY, y));
  }
  ctx.translate(x, y); ctx.rotate(rotation);
  ctx.drawImage(tile.image, tile.x, tile.y, tile.width, tile.height, -width / 2, -height / 2, width, height);
  ctx.restore();
}
