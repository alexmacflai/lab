import { collectionLogo, headerBaseline } from './logo-collection.js';

// Authored merchant identities for visual review. Coordinates are in the existing
// 400 × 850 receipt space; no receipt furniture is moved to accommodate a logo.
const PILOT = {
  grocer: { top: 8, bottom: 80, draw: morningMarket },
  cafe: { top: 4, bottom: 80, draw: littleOak },
  'repair-01': { top: 12, bottom: 90, draw: secondLife },
  'grocer-01': { top: 8, bottom: 80, draw: brookside },
  'grocer-02': { top: 8, bottom: 80, draw: orchard },
  'cafe-01': { top: 19, bottom: 96, draw: fern },
  'cafe-02': { top: 19, bottom: 96, draw: earlyBird },
  'cafe-03': { top: 19, bottom: 96, draw: smallHours },
  'cafe-04': { top: 19, bottom: 96, draw: dailyGrind },
  hardware: { top: 8, bottom: 80, draw: harris },
  'books-01': { top: 19, bottom: 96, draw: chapterHouse },
  'bakery-01': { top: 39, bottom: 107, draw: flourWater },
  'bakery-02': { top: 39, bottom: 107, draw: morningLoaf },
  'records-03': { top: 20, bottom: 97, draw: waxWorks },
  'museum-03': { top: 22, bottom: 99, draw: archiveObject },
};

// The 16-merchant pilot retains Stone Street on both terminal receipts.
// Approved pilot artwork stays unchanged when extending the collection.
export const PILOT_IDS = ['grocer', 'grocer-01', 'grocer-02', 'cafe', 'cafe-01',
  'cafe-02', 'cafe-03', 'cafe-04', 'hardware', 'books-01', 'bakery-01',
  'bakery-02', 'records-03', 'museum-03', 'terminal', 'terminal-01', 'repair-01'];

export function logoRegion(receipt) {
  const entry = PILOT[receipt.id] || collectionLogo(receipt);
  return entry ? { x: 22, y: entry.top, width: 356, height: entry.bottom - entry.top } : null;
}

export function drawPilotLogo(ctx, receipt, baseline) {
  const entry = PILOT[receipt.id] || collectionLogo(receipt);
  if (!entry) return false;
  const region = logoRegion(receipt);
  ctx.save(); ctx.beginPath(); ctx.rect(region.x, region.y, region.width, region.height); ctx.clip();
  ctx.translate(0, baseline);
  entry.draw(ctx);
  ctx.restore(); return true;
}

// Preserve the original drawing sequence, including its canvas state and text
// rasterisation. Replace only integer pixels of logo ink before the existing
// ageing and paper composition; marks are still applied afterwards by paper.js.
export function replacePilotLogoInk(printer, receipt) {
  const region = logoRegion(receipt);
  if (!region) return;
  const ink = document.createElement('canvas');
  ink.width = printer.canvas.width; ink.height = printer.canvas.height;
  const c = ink.getContext('2d', { willReadFrequently: true });
  c.scale(2, ink.height / 850); c.fillStyle = '#22251f'; c.strokeStyle = '#22251f';
  const baseline = headerBaseline(receipt);
  drawPilotLogo(c, receipt, baseline);
  const x = region.x * 2, y = Math.floor(region.y * ink.height / 850);
  const width = region.width * 2, height = Math.ceil((region.y + region.height) * ink.height / 850) - y;
  printer.putImageData(c.getImageData(x, y, width, height), x, y);
}

function text(c, value, x, y, font, align = 'center') {
  c.font = font; c.textAlign = align; c.fillText(value, x, y);
}

function brookside(c) {
  // A B built from two bridge arches; broad piers survive thermal reduction.
  c.fillRect(37, -36, 8, 50);
  c.lineWidth = 8; c.beginPath(); c.moveTo(44, -32);
  c.bezierCurveTo(84, -39, 86, -10, 46, -10);
  c.bezierCurveTo(93, -18, 94, 17, 44, 10); c.stroke();
  text(c, 'Brookside', 100, -9, '500 34px "Trebuchet MS", sans-serif', 'left');
  text(c, 'FOODS', 103, 12, 'bold 14px "Trebuchet MS", sans-serif', 'left');
}
function orchard(c) {
  // One continuous canopy and tapering trunk; no detached stem or tangent joins.
  c.beginPath(); c.moveTo(195, -16); c.lineTo(196, -27);
  c.bezierCurveTo(181, -20, 174, -32, 182, -40);
  c.bezierCurveTo(184, -43, 188, -44, 191, -43);
  c.bezierCurveTo(189, -49, 207, -50, 209, -44);
  c.bezierCurveTo(223, -45, 226, -24, 211, -25);
  c.bezierCurveTo(207, -25, 204, -28, 202, -30);
  c.lineTo(203, -16); c.closePath(); c.fill();
  text(c, 'Orchard Stores', 200, 15, '32px Baskerville, Georgia, serif');
}
function fern(c) {
  // An unframed brush wordmark. The long F and descending p set its silhouette.
  text(c, 'Fern & Cup', 200, 9, '48px "Brush Script MT", cursive');
  c.lineCap = 'round'; c.beginPath(); c.moveTo(107, 17);
  c.bezierCurveTo(154, 23, 240, 20, 296, 13); c.lineWidth = 1.6; c.stroke();
}
function earlyBird(c) {
  // A substantial rising bird, with a wing cut out of its solid silhouette.
  c.beginPath(); c.moveTo(35, 3); c.quadraticCurveTo(66, 4, 74, -23);
  c.quadraticCurveTo(80, -39, 93, -32); c.lineTo(105, -26); c.lineTo(92, -23);
  c.quadraticCurveTo(91, 4, 69, 12); c.closePath(); c.fill();
  c.save(); c.globalCompositeOperation = 'destination-out';
  c.beginPath(); c.moveTo(52, -3); c.quadraticCurveTo(60, -22, 77, -26);
  c.quadraticCurveTo(75, -9, 52, -3); c.fill(); c.restore();
  text(c, 'early bird', 116, 6, 'bold 39px "Arial Rounded MT Bold", sans-serif', 'left');
}
function smallHours(c) {
  text(c, 'small hours', 200, 5, '500 39px Futura, sans-serif');
}
function dailyGrind(c) {
  // Ordinary till lettering, enlarged; two equal lines fit without compression.
  text(c, 'THE DAILY', 200, -16, 'bold 29px "Courier New", monospace');
  text(c, 'GRIND', 200, 14, 'bold 29px "Courier New", monospace');
}
function harris(c) {
  // Slotted H trade stamp: the letter, rather than a bolt, is the identifying mark.
  c.fillRect(33, -35, 13, 48); c.fillRect(69, -35, 13, 48); c.fillRect(46, -17, 23, 12);
  c.save(); c.globalCompositeOperation = 'destination-out'; c.fillRect(55, -36, 4, 50); c.restore();
  text(c, 'HARRIS', 102, -9, '38px Impact, sans-serif', 'left');
  text(c, 'HARDWARE', 103, 14, 'bold 17px "Arial Black", sans-serif', 'left');
}
function chapterHouse(c) {
  // A quiet bookseller: regular serif, deliberately unequal line lengths.
  text(c, 'Chapter', 200, -13, '36px Baskerville, Georgia, serif');
  text(c, 'House', 200, 18, '36px Baskerville, Georgia, serif');
}
function flourWater(c) {
  // A generous ampersand joins two ingredients; stays below the bakery preamble.
  text(c, 'Flour', 162, -10, '32px Georgia, serif', 'right');
  text(c, '&', 200, 8, 'italic 52px Baskerville, Georgia, serif');
  text(c, 'Water', 236, 13, '32px Georgia, serif', 'left');
}
function morningLoaf(c) {
  // An oval bakery stamp with broad lettering and one deliberate tonal fill.
  c.save(); c.globalAlpha = .19; c.beginPath(); c.ellipse(200, -10, 145, 31, 0, 0, Math.PI * 2); c.fill(); c.restore();
  text(c, 'THE MORNING', 200, -14, '20px Impact, sans-serif');
  text(c, 'LOAF', 200, 14, '29px Impact, sans-serif');
}
function waxWorks(c) {
  // A compact reverse record-shop wordmark; no inherited payment-service line.
  c.beginPath(); c.moveTo(69, -38); c.lineTo(342, -38); c.lineTo(330, 17); c.lineTo(57, 17); c.closePath(); c.fill();
  c.save(); c.globalCompositeOperation = 'destination-out';
  text(c, 'WAX WORKS', 200, 3, 'italic bold 33px "Arial Black", sans-serif'); c.restore();
}
function archiveObject(c) {
  // Typographic monogram: related A/O strokes and counters from one drawn face.
  text(c, 'AO', 81, 13, 'italic 53px Baskerville, Georgia, serif');
  text(c, 'Archive', 137, -11, '27px "Helvetica Neue", sans-serif', 'left');
  text(c, '& Object', 137, 16, '27px "Helvetica Neue", sans-serif', 'left');
}

function morningMarket(c) {
  c.fillRect(23, -34, 354, 48);
  c.save(); c.globalCompositeOperation = 'destination-out';
  c.font = 'bold 25px "Arial Black", sans-serif'; c.textAlign = 'left';
  const metrics = c.measureText('MORNING MARKET');
  const textWidth = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
  const left = (400 - (32 + 16 + textWidth)) / 2;
  c.save(); c.translate(left, 3);
  c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -25); c.lineTo(7, -25);
  c.lineTo(16, -12); c.lineTo(25, -25); c.lineTo(32, -25); c.lineTo(32, 0);
  c.lineTo(26, 0); c.lineTo(26, -15); c.lineTo(16, -2); c.lineTo(6, -15);
  c.lineTo(6, 0); c.closePath(); c.fill(); c.restore();
  text(c, 'MORNING MARKET', left + 48 + metrics.actualBoundingBoxLeft, 0,
    'bold 25px "Arial Black", sans-serif', 'left');
  c.restore();
}
function littleOak(c) {
  text(c, 'little / oak', 200, 2, 'italic 38px Georgia, serif');
}
function secondLife(c) {
  text(c, 'Second Life Repair', 200, 0, 'bold 35px Impact, sans-serif');
}
