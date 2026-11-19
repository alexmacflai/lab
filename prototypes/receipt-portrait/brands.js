import { drawMark } from './brand-marks.js';
import { hash } from './conditions.js';
const BRANDS = {
  grocer: [2, 'Arial Black, sans-serif'], terminal: [7, 'Courier New, monospace'], cafe: [3, 'Georgia, serif'],
  restaurant: [5, 'Georgia, serif'], hardware: [2, 'Impact, sans-serif'], coupon: [0, 'Georgia, serif'],
  books: [4, 'Georgia, serif'], bakery: [5, 'Georgia, serif'], petrol: [2, 'Impact, sans-serif'],
  deli: [3, 'Georgia, serif'], pharmacy: [1, 'Arial, sans-serif'], florist: [3, 'Apple Chancery, cursive'],
  cinema: [2, 'Impact, sans-serif'], takeaway: [5, 'Arial Black, sans-serif'], pizza: [0, 'Georgia, serif'],
  fish: [1, 'Georgia, serif'], records: [6, 'Arial Black, sans-serif'], garden: [0, 'Georgia, serif'],
  pets: [5, 'Arial Rounded MT Bold, sans-serif'], repair: [1, 'Impact, sans-serif'], laundry: [4, 'Helvetica Neue, sans-serif'],
  barber: [5, 'Georgia, serif'], stationery: [3, 'Georgia, serif'], museum: [6, 'Georgia, serif'],
};

function wordmark(ctx, title, x, y, font, size, width, align = 'center', italic = false) {
  ctx.font = `${italic ? 'italic' : 'bold'} ${size}px ${font}`;
  const scale = Math.min(1, width / ctx.measureText(title).width);
  ctx.save(); ctx.translate(x, y); ctx.scale(scale, 1); ctx.textAlign = align;
  ctx.fillText(title, 0, 0); ctx.restore();
}

function banner(ctx, r, font, y) {
  ctx.fillRect(23, y - 34, 354, 48);
  ctx.save(); ctx.globalCompositeOperation = 'destination-out';
  drawMark(ctx, r.family, 49, y - 10, .7);
  wordmark(ctx, r.title.toUpperCase(), 222, y, font, 30, 292);
  ctx.restore();
}

export function drawHeader(ctx, receipt, subtitle, y = 58) {
  const r = { ...receipt, title: receipt.family === 'terminal' && receipt.original ? 'STONE STREET' : receipt.title };
  const [baseStyle, font] = BRANDS[r.family];
  const style = r.variant === 3 ? (baseStyle + 1) % 8 : baseStyle;
  const size = 26 + hash(r.id + '/brand') % 12;
  ctx.save(); ctx.fillStyle = '#22251f'; ctx.strokeStyle = '#22251f'; ctx.lineWidth = 1;
  if (style === 2) banner(ctx, r, font, y);
  else if (style === 1 || style === 5) {
    if (style === 5) { ctx.beginPath(); ctx.arc(51, y - 10, 26, 0, Math.PI * 2); ctx.stroke(); }
    drawMark(ctx, r.family, 51, y - 10, .85);
    wordmark(ctx, style === 1 ? r.title : r.title.toUpperCase(), 88, y, font, size, 286, 'left');
  } else if (style === 4) {
    ctx.strokeRect(26, y - 47, 348, 68); drawMark(ctx, r.family, 54, y - 14, .65);
    const words = r.title.toUpperCase().split(' '), split = Math.ceil(words.length / 2);
    wordmark(ctx, words.slice(0, split).join(' '), 225, y - 18, font, Math.min(24, size - 2), 278);
    wordmark(ctx, words.slice(split).join(' '), 225, y + 5, font, Math.min(24, size - 2), 278);
  } else if (style === 7) {
    wordmark(ctx, r.title.toUpperCase(), 200, y - 7, font, 19, 346);
    ctx.font = '11px monospace'; ctx.textAlign = 'center'; ctx.fillText('•  PAYMENT SERVICES  •', 200, y + 11);
  } else if (style === 3) {
    wordmark(ctx, r.title, 200, y + 2, font, 38, 335, 'center', true);
    drawMark(ctx, r.family, 200, y - 39, .55);
  } else {
    drawMark(ctx, r.family, 200, y - 39, .6);
    wordmark(ctx, style === 6 ? r.title.toUpperCase() : r.title, 200, y + 4, font, size + 2, 348);
  }
  ctx.textAlign = 'center'; ctx.font = '10px monospace'; ctx.fillText(subtitle, 200, y + 33);
  ctx.font = '11px monospace'; ctx.fillText(r.address || '27 Station Road', 200, y + 53);
  ctx.setLineDash(r.design?.dashed ? [4, 3] : []); ctx.beginPath(); ctx.moveTo(28, y + 70); ctx.lineTo(372, y + 70); ctx.stroke();
  ctx.restore();
}

export const ORIGINAL_TAGS = { grocer: 'YOUR NEIGHBOURHOOD GROCER', terminal: 'MERCHANT COPY', cafe: 'COFFEE / KITCHEN',
  restaurant: 'DINING ROOM', hardware: 'TRADE / TOOLS / FIXINGS', coupon: 'SMALL FINDS. EVERY DAY.' };
