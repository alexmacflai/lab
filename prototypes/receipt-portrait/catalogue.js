import { EXTRA_MERCHANTS, EXTRA_STOCK, EXTRA_PRODUCTS } from './extra-families.js';
// Explicit merchant lists keep every receipt addressable and reviewable.
const MERCHANTS = {
  grocer: ['Brookside Foods', 'Orchard Stores', 'Elm Road Market', 'Green Basket'],
  terminal: ['Stone Street', 'The Old Ferry', 'New Town Garage', 'Market Kiosk'],
  cafe: ['Fern & Cup', 'Early Bird', 'Small Hours', 'The Daily Grind'],
  restaurant: ['Copper Table', 'The Salt House', 'Fig & Vine', 'Old Mill Kitchen'],
  hardware: ['Union Tools', 'Bolt & Brush', 'Station Supplies', 'Oak Lane DIY'],
  coupon: ['Hearth Goods', 'Everyday Finds', 'The Linen Cupboard', 'Willow Home'],
  books: ['Chapter House', 'The Reading Room', 'Paper Lantern Books', 'Margin Notes'],
  bakery: ['Flour & Water', 'The Morning Loaf', 'Crumb Bakery', 'Four Seeds'],
  petrol: ['North Road Fuel', 'Mill Lane Service', 'A38 Forecourt', 'Valley Motors'],
  deli: ['The Olive Counter', 'Market Deli', 'Salt & Rind', 'The Cheese Room'],
  pharmacy: ['Abbey Pharmacy', 'Town Hall Chemist', 'Beechwood Health', 'Canal Pharmacy'],
  florist: ['Stem & Leaf', 'The Flower Stand', 'Wild Bunch', 'Petal House'],
  ...EXTRA_MERCHANTS,
};
const STOCK = {
  grocer: [2.28, [1, .995, .97]], terminal: [2.18, [.985, .992, 1]], cafe: [2.24, [1, .975, .925]],
  restaurant: [2.30, [1, .995, .975]], hardware: [2.20, [.97, .98, .94]], coupon: [2.27, [1, .987, .95]],
  books: [2.25, [1, .99, .975]], bakery: [2.20, [1, .98, .95]], petrol: [2.30, [.985, .99, 1]],
  deli: [2.28, [1, .982, .95]], pharmacy: [2.26, [.99, 1, .985]], florist: [2.22, [1, .985, .965]],
  ...EXTRA_STOCK,
};
const PRODUCTS = {
  grocer: [['WHOLE MILK 2L', 155], ['SOURDOUGH', 285], ['LEMONS', 40], ['GROUND COFFEE', 475], ['ROLLED OATS', 180], ['FREE RANGE EGGS', 240], ['MUSHROOMS', 165], ['APPLES', 60]],
  terminal: [['PURCHASE', 680]],
  cafe: [['FLAT WHITE', 360], ['FILTER COFFEE', 340], ['ALMOND CROISSANT', 380], ['ESPRESSO', 260], ['BANANA BREAD', 350], ['TEA', 280], ['TOASTED SANDWICH', 620]],
  restaurant: [['Sourdough & butter', 550], ['Roast squash', 1600], ['Market fish', 2400], ['Seasonal greens', 500], ['House white 175ml', 750], ['Sparkling water', 400], ['Chocolate tart', 850]],
  hardware: [['HEX BOLT M8 X 40', 40], ['WOODSCREW BOX', 695], ['MASKING TAPE', 265], ['SANDPAPER 120G', 80], ['WALL PLUGS 6MM', 190], ['PAINT BRUSH 25MM', 345], ['CABLE TIES 100PK', 425]],
  coupon: [['COTTON TEA TOWEL', 450], ['STONEWARE CUP', 600], ['PAPER NAPKINS', 225], ['LINEN CLOTH', 850], ['GLASS TUMBLER', 375], ['CANDLE', 700], ['STORAGE JAR', 525]],
  books: [['PAPERBACK FICTION', 1099], ['LITERARY JOURNAL', 650], ['POETRY COLLECTION', 1299], ['SECONDHAND BOOK', 450], ['NOTEBOOK A5', 595], ['ART QUARTERLY', 1200], ['POSTCARD', 150]],
  bakery: [['COUNTRY LOAF', 480], ['CROISSANT', 260], ['CINNAMON BUN', 320], ['RYE ROLL', 110], ['FOCACCIA SLICE', 350], ['PAIN AU CHOCOLAT', 280], ['BAGUETTE', 240]],
  petrol: [['UNLEADED', 147], ['DIESEL', 153]],
  deli: [['MATURE CHEDDAR', 625], ['MIXED OLIVES', 390], ['ARTICHOKE HEARTS', 425], ['HUMMUS', 350], ['SLICED HAM', 580], ['SOURDOUGH CRACKERS', 295], ['CHUTNEY', 465]],
  pharmacy: [['COTTON PADS', 185], ['TOOTHPASTE', 295], ['HAND SOAP', 225], ['SUN CREAM SPF50', 895], ['PLASTERS 20PK', 245], ['SHAMPOO', 450], ['TISSUES', 125]],
  florist: [['SEASONAL BUNCH', 1800], ['TULIPS 10 STEMS', 1250], ['EUCALYPTUS', 650], ['GIFT WRAP', 200], ['GLASS VASE', 950], ['GREETING CARD', 325], ['RIBBON', 150]],
  ...EXTRA_PRODUCTS,
};
const STREETS = ['Station Road', 'Mill Lane', 'High Street', 'Bridge Street', 'Market Place', 'Church Road', 'North Street', 'Harbour Road'];

function transaction(family, variant) {
  const pool = PRODUCTS[family], count = family === 'terminal' || family === 'petrol' ? 1 : 3 + variant % 5;
  const items = Array.from({ length: count }, (_, i) => {
    const [label, cents] = pool[(i + variant * 2) % pool.length];
    const quantity = family === 'petrol' ? 21 + variant * 3 : 1 + ((variant + i) % 4 === 0 ? 1 : 0);
    return { label, quantity, cents, total: quantity * cents, code: String(430281 + variant * 317 + i * 169) };
  });
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const discount = family === 'coupon' ? 125 : 0;
  const service = family === 'restaurant' ? Math.round(subtotal * .125) : family === 'barber' && variant % 2 ? 200 : 0;
  return { items, subtotal, discount, service, total: subtotal - discount + service };
}

function record(family, merchant, variant, ordinal) {
  const [ratio, tint] = STOCK[family];
  const seed = 271 + ordinal * 101;
  return { id: `${family}-${String(variant).padStart(2, '0')}`, family, name: merchant, title: merchant,
    ratio: Math.max(2.18, Math.min(2.33, ratio + (variant % 5 - 2) * .012)),
    tint: tint.map((v, i) => Math.min(1, v - ((ordinal + i) % 4) * .0015)), seed,
    ink: .77 + (ordinal % 9) * .022, edge: ['cut', 'serrated', 'torn'][(ordinal + variant) % 3],
    variant,
    address: `${12 + ordinal % 79} ${STREETS[ordinal % STREETS.length]}`,
    time: `${String(8 + ordinal % 13).padStart(2, '0')}:${String(ordinal * 7 % 60).padStart(2, '0')}`,
    design: { heading: variant % 4, spacing: 22 + variant % 4 * 3, inset: 24 + variant % 3 * 4,
      serif: ['books', 'florist', 'restaurant', 'cafe'].includes(family) && variant % 2 === 1,
      fontSize: 11 + variant % 3, footer: variant % 4, dashed: variant % 2 === 0 },
    ...transaction(family, variant) };
}

export function expandCatalogue(originals) {
  const receipts = originals.map(p => ({ ...p, family: p.id, original: true }));
  for (let variant = 1; variant <= 4; variant++) {
    for (const [family, names] of Object.entries(MERCHANTS)) {
      if (names[variant - 1]) receipts.push(record(family, names[variant - 1], variant, receipts.length));
    }
  }
  if (receipts.length !== 100) throw new Error('Expected 100 receipt records');
  return receipts;
}
