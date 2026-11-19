import { PROFILES } from './profiles.js';

// Independent impressions, never a receipt-to-condition assignment.
export const WEIGHTS = [50, 35, 3, 3, 3, 2, 3, 1];

export function createImpression(mode, random = Math.random) {
  let profile = mode;
  if (mode === -2) {
    let choice = random() * 100;
    profile = WEIGHTS.findIndex(weight => (choice -= weight) < 0);
  }
  const source = PROFILES[profile];
  if (!source) return { profile: -1 };
  const vary = value => value * (.8 + random() * .4);
  return { profile, seed: random() * 1000,
    ink: source.ink.map((value, index) => index === 0 ? vary(value) : Math.min(.98, vary(value))),
    grain: Math.min(1, vary(source.grain)), rare: Boolean(source.rare),
  };
}
