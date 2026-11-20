import { money } from './collection-type.js';

function cinema(p, r) {
  p.header('BOX OFFICE / CONCESSIONS', 72); p.details(178);
  p.centre(`SALE ${String(r.seed).padStart(5, '0')}`, 219, 19, { bold: true }); p.rule(242, true);
  const end = p.items(277, 32);
  p.total(end + 23); p.centre('THIS IS YOUR PAYMENT RECEIPT', end + 129, 10);
  p.centre('Please keep admission tickets separately.', end + 150, 10);
  p.barcode(699); p.centre('ENJOY THE SHOW', 790, 16, { bold: true });
}
function takeaway(p, r) {
  p.header('FRESH FROM THE WOK', 67); p.centre(`ORDER ${r.variant * 51}`, 205, 35, { bold: true });
  p.row('COLLECTION', r.time, 247, 15); p.rule(274, true);
  r.items.forEach((item, i) => {
    p.row(`${item.quantity}  ${item.label}`, money(item.total), 307 + i * 38, 14);
    if (i === 0) p.text('   no cutlery requested', 29, 325, 10);
  });
  const end = 307 + r.items.length * 38;
  p.total(end + 13); p.centre('PACKED  [ ]    CHECKED  [ ]', Math.min(778, end + 139), 13);
}
function pizza(p, r) {
  p.header('WOOD FIRED / MADE TO ORDER', 75); p.centre('COLLECTION ORDER', 191, 16, { bold: true });
  p.row(`NO. ${r.seed}`, `READY ${r.time}`, 225, 13); p.rule(248);
  const end = p.items(281, 36);
  p.total(end + 21); p.centre('ALL PIZZAS / 12 INCH', end + 128, 11);
  p.centre('straight from our oven to your table', 784, 14, { serif: true });
}
function fish(p, r) {
  p.header('FRESH FISH / DAILY LANDINGS', 77); p.details(180);
  p.text('COUNTER SALE · PRICED BY PORTION', 29, 219, 11); p.rule(241, true);
  r.items.forEach((item, i) => {
    p.row(item.label, money(item.total), 280 + i * 39, 14);
    p.text(`   ${item.quantity} @ ${money(item.cents)}`, 29, 298 + i * 39, 10);
  });
  const end = 280 + r.items.length * 39;
  p.total(end + 18); p.centre('KEEP CHILLED / ENJOY FRESH', Math.min(785, end + 145), 12);
}
function records(p, r) {
  p.header('RECORDS / TAPES / GOOD NOISE', 75); p.details(180); p.rule(210);
  r.items.forEach((item, i) => {
    p.row(`${item.quantity}  ${item.label}`, money(item.total), 248 + i * 44, 14);
    p.text(`   CAT. ${item.code}   ${i % 2 ? 'USED / VG+' : 'NEW / SEALED'}`, 29, 266 + i * 44, 10);
  });
  const end = 248 + r.items.length * 44;
  p.total(end + 12); p.centre('KEEP SPINNING.', Math.min(785, end + 145), 20, { bold: true });
}
function garden(p, r) {
  p.header('PLANTS / POTS / GARDEN SUPPLIES', 75); p.details(177);
  p.text('QTY  PLANT / PRODUCT              GBP', 29, 216, 11);
  const end = p.items(254, 36);
  p.total(end + 22); p.rule(701, true);
  p.centre('A LITTLE ROOM TO GROW', 738, 16, { serif: true }); p.centre('Thank you for visiting our nursery.', 778, 10);
}
function pets(p, r) {
  p.header('FOR VERY GOOD COMPANIONS', 70); p.details(173); p.rule(207, true);
  const end = p.items(244, 33);
  p.total(end + 21); p.centre('LOYALTY /  ★  ★  ★  ☆  ☆', end + 137, 17);
  p.footer(Math.max(711, end + 185));
}
function repair(p, r) {
  p.header('REPAIRS / SPARES / SECOND CHANCES', 68); p.centre(`JOB ${r.seed}`, 190, 28, { bold: true });
  p.row('WORK COMPLETED', '18/11/2026', 232, 12); p.rule(254);
  const end = p.items(289, 34);
  p.total(end + 22); p.centre('PAID / COLLECTED', end + 147, 20, { bold: true });
  p.text('PARTS AND LABOUR AS LISTED ABOVE', 29, 790, 10);
}
function laundry(p, r) {
  p.header('CLEANING / PRESSING / CARE', 70);
  p.row('BAG / TAG NO.', String(r.seed), 184, 17); p.row('READY TO COLLECT', 'FRI 16:00', 222, 13);
  p.rule(247, true); const end = p.items(283, 36);
  p.total(end + 23); p.centre('BRING THIS RECEIPT FOR COLLECTION', end + 139, 11);
  p.barcode(716); p.centre('Thank you for trusting us with your clothes.', 800, 9);
}
function barber(p, r) {
  p.header('BARBERING / GROOMING', 76); p.details(180);
  p.row('YOUR BARBER', ['SAM', 'JO', 'ALEX', 'LEE'][r.variant % 4], 220, 12); p.rule(247);
  const end = p.items(286, 34);
  p.row('SERVICES & PRODUCTS', money(r.subtotal), end + 22, 12);
  p.row('TIP', money(r.service), end + 51, 12); p.total(end + 78);
  p.centre('looking sharp. see you soon.', Math.min(800, end + 206), 16, { serif: true });
}
function stationery(p, r) {
  p.header('PAPER / INK / IDEAS', 79); p.details(184);
  p.text('PRODUCT                 QTY     GBP', 29, 228, 11); p.rule(248, true);
  r.items.forEach((item, i) => {
    p.row(item.label, money(item.total), 285 + i * 36, 13);
    p.text(`   ${item.code}       ${item.quantity}`, 29, 301 + i * 36, 10);
  });
  const end = 285 + r.items.length * 36;
  p.total(end + 24); p.centre('MAKE SOMETHING.', Math.min(790, end + 152), 20, { bold: true });
}
function museum(p, r) {
  p.header('EDITIONS / BOOKS / OBJECTS', 77); p.centre('SHOP PURCHASE', 185, 16);
  p.details(218); p.rule(241); const end = p.items(280, 35);
  p.total(end + 25); p.centre('Your purchase supports the collection.', end + 145, 12, { serif: true });
  p.centre('SHOP RECEIPT / NOT VALID FOR ADMISSION', 794, 10);
}
export const EXTRA_LAYOUTS = { cinema, takeaway, pizza, fish, records, garden, pets, repair, laundry, barber, stationery, museum };
