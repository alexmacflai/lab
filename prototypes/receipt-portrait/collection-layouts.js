import { receiptType, money } from './collection-type.js';

function grocer(p, r) {
  p.header('FRESH FOOD / LOCAL STORES'); p.details();
  p.text('QTY  DESCRIPTION                  GBP', 29, 201, 11);
  const end = p.items(229);
  p.rule(end + 2, true); p.row('ITEMS PURCHASED', String(r.items.reduce((s, i) => s + i.quantity, 0)), end + 29, 11);
  p.total(end + 52); p.row('VAT INCLUDED', money(Math.round(r.total / 12)), end + 145, 11);
  p.footer(Math.max(660, end + 179));
}
function terminal(p, r) {
  p.header(r.variant % 2 ? 'MERCHANT COPY' : 'CUSTOMER COPY');
  p.text('PURCHASE', 30, 189, 22, { bold: true }); p.text('CONTACTLESS', 30, 221, 14);
  const fields = [['TERMINAL', String(800000 + r.seed)], ['MERCHANT', `**** ${r.seed}`], ['DATE', '18/11/2026'],
    ['TIME', r.time], ['CARD', 'VISA DEBIT'], ['PAN', '**** **** **** 2041'], ['AUTH CODE', String(r.seed * 7)]];
  fields.forEach(([a, b], i) => {
    if (r.variant % 2) p.row(a, b, 268 + i * 35, 12);
    else { p.text(a, 30, 264 + i * 37, 11); p.text(b, 190, 264 + i * 37, 13); }
  });
  p.total(540, 'AMOUNT GBP'); p.centre('APPROVED', 677, 27, { bold: true });
  p.centre('NO SIGNATURE REQUIRED', 727, 12); p.centre('KEEP FOR YOUR RECORDS', 765, 11);
}
function cafe(p, r) {
  p.header('COFFEE / KITCHEN', 74); p.row(`ORDER #${r.variant * 37}`, r.variant % 2 ? 'TAKE AWAY' : 'EAT IN', 196, 17);
  p.text(`18 NOV 2026 / ${r.time}`, 29, 228, 11); p.rule(250, true);
  r.items.forEach((item, i) => {
    p.row(`${item.quantity}  ${item.label}`, money(item.total), 285 + i * 43, 14);
    p.text(['   oat milk', '   warmed, please', '   no additions'][i % 3], 29, 302 + i * 43, 10);
  });
  const end = 285 + r.items.length * 43;
  p.total(end + 8); p.centre('made here, enjoyed anywhere.', Math.min(785, end + 132), 15, { serif: true });
}
function restaurant(p, r) {
  p.header('DINING ROOM', 69); p.centre(`TABLE ${r.variant + 4} / ${2 + r.variant % 3} GUESTS`, 179, 13);
  p.row('SERVER: JO', r.time, 210, 11); p.rule(233);
  const end = p.items(270, 34);
  p.rule(end + 4); p.row('Subtotal', money(r.subtotal), end + 38, 14);
  p.row('Service charge 12.5%', money(r.service), end + 67, 12);
  p.total(end + 94); p.centre('Service charge is discretionary.', end + 190, 10);
  p.centre('Thank you for dining with us.', 792, 14, { serif: true });
}
function hardware(p, r) {
  p.header('TRADE / TOOLS / FIXINGS'); p.details(); p.text('CODE / QTY / UNIT / LINE TOTAL', 29, 203, 11);
  const end = p.items(239, 46, true);
  const net = Math.round(r.total / 1.2);
  p.rule(end + 4, true); p.row('NET', money(net), end + 34); p.row('VAT @ 20%', money(r.total - net), end + 60);
  p.total(end + 82); p.footer(Math.min(750, end + 190));
}
function coupon(p, r) {
  p.header('HOME / SMALL EVERYDAY FINDS'); p.details();
  const end = p.items(202, 23);
  p.row('MEMBER SAVING', `-${money(r.discount)}`, end + 12, 12); p.total(end + 35);
  p.rule(516, true); p.centre('A LITTLE SOMETHING FOR NEXT TIME', 551, 12);
  p.centre(`£${2 + r.variant % 3} OFF`, 616, 53, { bold: true });
  p.centre(`WHEN YOU SPEND £${15 + r.variant % 3 * 5}`, 652, 17);
  p.centre('Valid until 30 November 2026', 687, 10); p.barcode(712);
  p.centre('One voucher per purchase. Exclusions apply.', 792, 9);
}
function books(p, r) {
  p.header('INDEPENDENT BOOKSELLERS', 74); p.details(177);
  p.centre(r.variant % 2 ? 'NEW & SECONDHAND' : 'BOOKS / JOURNALS / STATIONERY', 212, 10);
  const end = p.items(255, 37, r.variant % 2 === 0);
  p.total(end + 22); p.centre('A good book goes a long way.', end + 143, 16, { serif: true });
  p.footer(Math.max(710, end + 185));
}
function bakery(p, r) {
  p.centre('—  FRESH FROM THE OVEN  —', 34, 10); p.header('BAKED HERE THIS MORNING', 85);
  p.centre(`ORDER ${String(r.seed % 999).padStart(3, '0')}`, 203, 24, { bold: true });
  p.rule(232, true); const end = p.items(272, 39);
  p.total(end + 24); p.centre('Flour, water, time.', end + 149, 17, { serif: true });
  p.centre(`18/11/2026  ${r.time}`, 782, 11);
}
function petrol(p, r) {
  p.header('FORECOURT / OPEN 24 HOURS'); p.details();
  const item = r.items[0];
  p.centre(`PUMP ${1 + r.variant % 8}`, 224, 28, { bold: true }); p.rule(257);
  p.row('FUEL', item.label, 298, 16); p.row('VOLUME', `${item.quantity}.00 L`, 344, 17);
  p.row('PRICE / LITRE', `${money(item.cents)}`, 390, 16);
  p.total(444); p.row('VAT INCLUDED', money(r.total - Math.round(r.total / 1.2)), 557, 12);
  p.centre('VEHICLE REG: __________', 615, 14); p.barcode(666);
  p.centre('SAFE JOURNEY', 772, 18, { bold: true });
}
function deli(p, r) {
  p.header('CHEESE / OLIVES / GOOD THINGS', 74); p.details(178); p.rule(208);
  r.items.forEach((item, i) => {
    p.row(item.label, money(item.total), 248 + i * 40, 14);
    p.text(`  ${item.quantity} x ${money(item.cents)}   COUNTER ${1 + i % 3}`, 29, 265 + i * 40, 10);
  });
  const end = 248 + r.items.length * 40;
  p.total(end + 20); p.centre('Keep refrigerated. Enjoy soon.', Math.min(790, end + 148), 12);
}
function pharmacy(p, r) {
  p.centre('+', 51, 40, { bold: true }); p.header('COMMUNITY PHARMACY', 101);
  p.details(207); p.text('PRODUCT                       PRICE', 29, 251, 11);
  const end = p.items(287, 31);
  p.total(end + 25); p.centre('RETAIL PURCHASE / CUSTOMER COPY', end + 138, 10);
  p.rule(725, true); p.centre('Ask our team if you need advice.', 755, 12);
  p.centre('Keep this receipt for your records.', 783, 10);
}
function florist(p, r) {
  p.header('FLOWERS FOR THE EVERYDAY', 86); p.centre('YOUR FLOWERS', 202, 13);
  p.rule(229); const end = p.items(270, 40);
  p.total(end + 29);
  p.centre('Trim stems. Change water often.', Math.min(750, end + 149), 12, { serif: true });
  p.centre('Thank you for choosing us.', 790, 13, { serif: true });
}
const DRAW = { grocer, terminal, cafe, restaurant, hardware, coupon, books, bakery, petrol, deli, pharmacy, florist };
export function drawCollection(ctx, receipt) { DRAW[receipt.family](receiptType(ctx, receipt), receipt); }
