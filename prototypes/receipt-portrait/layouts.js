export function typesetter(ctx, receipt) {
  ctx.fillStyle = '#242720'; ctx.strokeStyle = '#242720';
  function text(value, x, y, size = 13, options = {}) {
    ctx.save();
    ctx.font = `${options.bold ? 'bold ' : ''}${size}px ${options.serif ? 'Georgia' : '"Courier New", monospace'}`;
    ctx.textAlign = options.align || 'left';
    ctx.fillText(value, x, y); ctx.restore();
  }
  function rule(y, dash = false, x = 28, width = 344) {
    ctx.save(); ctx.lineWidth = .8; ctx.setLineDash(dash ? [4, 3] : []);
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + width, y); ctx.stroke(); ctx.restore();
  }
  function row(label, price, y, size = 13) {
    text(label, 29, y, size); text(price, 371, y, size, { align: 'right' });
  }
  const centre = (value, y, size, options = {}) => text(value, 200, y, size, { ...options, align: 'center' });
  const barcode = (y, digits = '5 014982 170034') => {
    let seed = receipt.seed, x = 61;
    for (let i = 0; i < 91; i++) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      const w = 1 + seed % 3;
      if (i % 2 === 0) ctx.fillRect(x, y, w, 38);
      x += w + 1;
    }
    centre(digits, y + 52, 10);
  };
  return { text, rule, row, centre, barcode };
}

function supermarket(p) {
  p.centre('MORNING', 53, 29, { bold: true }); p.centre('M A R K E T', 78, 19);
  p.centre('YOUR NEIGHBOURHOOD GROCER', 103, 9); p.centre('27 Station Road · Bristol', 126, 11);
  p.rule(143); p.row('18 NOV 2026  14:32', 'STORE 004', 163, 11);
  p.text('QTY  DESCRIPTION                 GBP', 29, 193, 12);
  ['2    BRITISH WHOLE MILK|3.10', '1    SOURDOUGH / WHITE|2.85', '1    CHESTNUT MUSHROOMS|1.65', '3    LOOSE LEMONS|1.20',
    '1    GROUND COFFEE 250G|4.75', '1    ROLLED OATS 1KG|1.80', '1    FREE RANGE EGGS 6|2.40', '1    BAG FOR LIFE|0.30',
    '     MULTIBUY SAVING|-0.60'].forEach((s, i) => p.row(...s.split('|'), 222 + i * 24));
  p.rule(449, true); p.row('TOTAL', '£17.45', 480, 23); p.row('VISA DEBIT', '17.45', 513);
  p.row('VAT INCLUDED', '1.06', 540, 11); p.text('Card ending 2041  ·  APPROVED', 29, 566, 11);
  p.rule(589); p.centre('YOU SAVED £0.60 TODAY', 621, 15, { bold: true });
  p.barcode(666); p.centre('Thank you for shopping locally.', 761, 11);
  p.centre('Keep this receipt for returns.', 785, 10);
}

function terminal(p) {
  p.centre('S T O N E   S T R E E T', 59, 17, { bold: true });
  p.centre('MERCHANT COPY', 103, 18, { bold: true }); p.rule(130, true);
  p.text('PURCHASE', 34, 172, 20, { bold: true });
  p.text('CONTACTLESS', 34, 203, 14);
  [['TERMINAL ID', '08371002'], ['MERCHANT ID', '**** **** 7148'], ['DATE', '18/11/2026'], ['TIME', '12:08:41'],
    ['CARD', 'VISA DEBIT'], ['PAN', '**** **** **** 2041'], ['AUTH CODE', '094183'], ['ENTRY', 'CONTACTLESS']]
    .forEach(([a, b], i) => { p.text(a, 34, 251 + i * 36, 12); p.text(b, 34, 269 + i * 36, 13); });
  p.rule(563, true); p.row('AMOUNT GBP', '6.80', 608, 25);
  p.centre('APPROVED', 663, 25, { bold: true }); p.centre('PLEASE RETAIN FOR YOUR RECORDS', 733, 11);
  p.centre('NO SIGNATURE REQUIRED', 759, 12); p.centre('CUSTOMER PRESENT', 800, 10);
}

function cafe(p) {
  p.centre('little / oak', 80, 39, { serif: true }); p.centre('COFFEE  ·  KITCHEN', 112, 11);
  p.rule(146); p.row('ORDER #047', 'TAKE AWAY', 183, 18);
  p.text('BARISTA: SAM', 29, 218, 11); p.text('18 NOV  /  09:42', 29, 238, 11);
  p.rule(266, true); p.row('2  FLAT WHITE', '7.20', 307, 18); p.text('   oat milk / extra hot', 29, 334, 12);
  p.row('1  FILTER COFFEE', '3.40', 383, 18); p.row('1  ALMOND CROISSANT', '3.80', 435, 16);
  p.text('   warmed, please', 29, 463, 12); p.rule(501);
  p.row('TOTAL', '14.40', 549, 25); p.row('CARD', '14.40', 590, 14);
  p.centre('good coffee. good morning.', 695, 18, { serif: true });
  p.centre('18 Mill Lane / Bath', 731, 11); p.centre('VAT INCLUDED · THANK YOU', 758, 10);
}

function restaurant(p) {
  p.centre('BELL & ANCHOR', 63, 28, { serif: true }); p.centre('DINING ROOM', 91, 12);
  p.centre('────────────', 122, 13); p.centre('TABLE 12   /   2 GUESTS', 161, 13);
  p.row('SERVER: JO', '18/11/26', 194, 11); p.rule(217);
  [['Sourdough & butter', '5.50'], ['Roast squash', '16.00'], ['Market fish', '24.00'], ['Seasonal greens', '5.00'],
    ['House white 175ml', '7.50'], ['Sparkling water', '4.00']].forEach(([a, b], i) => p.row(a, b, 259 + i * 39, 15));
  p.rule(495); p.row('Subtotal', '62.00', 530, 14); p.row('Service charge 12.5%', '7.75', 561, 13);
  p.row('TOTAL', '£69.75', 614, 24); p.text('Service charge is discretionary.', 29, 649, 11);
  p.centre('Thank you. See you again soon.', 732, 15, { serif: true });
  p.centre('NOT A VAT INVOICE', 777, 11); p.centre('Check 001284 / Printed 21:38', 803, 10);
}

function hardware(p) {
  p.text('HARRIS', 29, 61, 40, { bold: true }); p.text('HARDWARE & SUPPLIES', 31, 88, 17, { bold: true });
  p.rule(108); p.text('TRADE COUNTER 02', 29, 139, 12); p.row('INVOICE 000581', '18 NOV 2026', 166, 12);
  p.rule(191); p.text('CODE      QTY   UNIT      LINE TOTAL', 29, 217, 12);
  [['430281  HEX BOLT M8 X 40', '4.80'], ['        12 @ 0.40', ''], ['107734  WOODSCREW 4 X 50', '6.95'],
    ['        1 BOX / 200 PCS', ''], ['889103  MASKING TAPE 25MM', '2.65'], ['        1 @ 2.65', ''],
    ['300251  SANDPAPER 120 GRIT', '3.20'], ['        4 @ 0.80', '']].forEach(([a, b], i) => p.row(a, b, 253 + i * 28, 12));
  p.rule(492, true); p.row('NET', '14.67', 523); p.row('VAT @ 20%', '2.93', 549);
  p.row('TOTAL', '17.60', 591, 24); p.text('VAT REG: GB 000 0000 00', 29, 632, 11);
  p.barcode(677, '430281 107734 889103'); p.text('RETURNS: 30 DAYS WITH RECEIPT', 29, 775, 11);
}

function coupon(p) {
  p.centre('PENNY & CO.', 67, 33, { bold: true }); p.centre('SMALL FINDS. EVERY DAY.', 95, 10);
  p.row('18/11/26  11:54', 'TILL 03', 143, 11); p.rule(164, true);
  [['COTTON TEA TOWEL', '4.50'], ['STONEWARE CUP', '6.00'], ['PAPER NAPKINS', '2.25'], ['MEMBER SAVING', '-1.25']]
    .forEach(([a, b], i) => p.row(a, b, 203 + i * 30, 14));
  p.rule(334); p.row('TOTAL', '£11.50', 373, 23); p.row('CARD PAYMENT', '11.50', 408);
  p.centre('REWARDS BALANCE: 145 POINTS', 451, 12); p.rule(484, true);
  p.centre('YOUR NEXT LITTLE FIND', 530, 16, { bold: true }); p.centre('£2 OFF', 593, 56, { bold: true });
  p.centre('WHEN YOU SPEND £15', 629, 18); p.centre('Valid until 30 November 2026', 664, 11);
  p.barcode(696, '90 002000 150026'); p.centre('One voucher per purchase. Exclusions apply.', 789, 9);
  p.rule(820, true);
}

export const LAYOUTS = { grocer: supermarket, terminal, cafe, restaurant, hardware, coupon };
