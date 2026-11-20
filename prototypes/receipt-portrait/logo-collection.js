import { FOOD_LOGOS } from './logo-food.js';
import { RETAIL_LOGOS } from './logo-retail.js';
import { SERVICE_LOGOS } from './logo-services.js';

export const COLLECTION_LOGOS = { ...FOOD_LOGOS, ...RETAIL_LOGOS, ...SERVICE_LOGOS };
// These ordinary payment slips keep their complete existing identities.
export const RETAINED_IDS = ['terminal-02', 'terminal-04'];

export function headerBaseline(receipt) {
  if (receipt.original) return 58;
  return { cafe: 74, restaurant: 69, books: 74, bakery: 85, deli: 74,
    pharmacy: 101, florist: 86, cinema: 72, takeaway: 67, pizza: 75,
    fish: 77, records: 75, garden: 75, pets: 70, repair: 68,
    laundry: 70, barber: 76, stationery: 79, museum: 77 }[receipt.family] || 58;
}

export function collectionLogo(receipt) {
  const identity = COLLECTION_LOGOS[receipt.id];
  if (!identity) return null;
  const baseline = headerBaseline(receipt);
  // Crumb's previous above-name wheat reaches y=35; the bakery preamble's
  // actual ink ends above that boundary. Other bakeries retain y=39 clearance.
  const top = receipt.family === 'bakery' ? (receipt.id === 'bakery-03' ? 35 : 39) : baseline - 55;
  return { ...identity, top, bottom: baseline + 23 };
}
