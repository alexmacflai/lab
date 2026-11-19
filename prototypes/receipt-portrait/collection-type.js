import { typesetter } from './layouts.js';
import { drawHeader } from './brands.js';
export const money = cents => (cents / 100).toFixed(2);

export function receiptType(ctx, r) {
  const p = typesetter(ctx, r), d = r.design;
  const header = (subtitle, y = 58) => drawHeader(ctx, r, subtitle, y);
  const details = (y = 157) => {
    p.row(`18/11/26 ${r.time}`, `NO. ${r.seed}`, y, 11);
    if (d.heading === 2) p.centre('CUSTOMER COPY', y + 22, 10);
  };
  const items = (y, spacing = d.spacing, detailed = false) => {
    r.items.forEach((item, i) => {
      const line = y + i * spacing;
      const label = `${String(item.quantity).padStart(2)}  ${item.label}`;
      p.row(label, money(item.total), line, d.fontSize);
      if (detailed) p.text(`    ${item.code}  @ ${money(item.cents)}`, d.inset, line + 17, 10);
    });
    return y + r.items.length * spacing;
  };
  const total = (y, label = 'TOTAL') => {
    p.rule(y, d.dashed); p.row(label, `£${money(r.total)}`, y + 36, 23);
    p.row('CONTACTLESS', money(r.total), y + 66, 12);
  };
  const footer = y => {
    const messages = ['Thank you for shopping locally.', 'Please retain your receipt.', 'We hope to see you again.', 'Returns with receipt within 30 days.'];
    p.centre(messages[d.footer], y, 10);
    if (d.footer % 2 === 0) p.barcode(y + 22, `${r.seed} 181126 ${r.variant}`);
    else p.centre(`TRANSACTION ${String(r.seed).padStart(8, '0')}`, y + 24, 10);
  };
  return { ...p, header, details, items, total, footer };
}
