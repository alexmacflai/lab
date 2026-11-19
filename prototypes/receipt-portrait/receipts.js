import { expandCatalogue } from './catalogue.js';

// Each layout has its own stock, cutting profile, folds and printer behaviour.
const ORIGINALS = [
  { id: 'grocer', name: 'Supermarket', title: 'MORNING MARKET', ratio: 2.28,
    tint: [1, .995, .97], seed: 17, ink: .86, edge: 'cut', curl: .012,
    folds: [[.37, .08, .019, .009], [.71, -.12, .009, .018]] },
  { id: 'terminal', name: 'Card terminal', title: 'MERCHANT COPY', ratio: 2.18,
    tint: [.985, .992, 1], seed: 41, ink: .76, edge: 'serrated', curl: .023,
    folds: [[.51, -.04, .028, .008]] },
  { id: 'cafe', name: 'Café order', title: 'little / oak', ratio: 2.24,
    tint: [1, .975, .925], seed: 73, ink: .9, edge: 'torn', curl: .016,
    folds: [[.31, .23, .012, .013], [.66, -.25, .018, .01]] },
  { id: 'restaurant', name: 'Restaurant', title: 'BELL & ANCHOR', ratio: 2.33,
    tint: [1, .995, .975], seed: 107, ink: .83, edge: 'cut', curl: .027,
    folds: [[.48, .07, .021, .009], [.8, -.3, .01, .016]] },
  { id: 'hardware', name: 'Hardware shop', title: 'HARRIS / HARDWARE', ratio: 2.2,
    tint: [.97, .98, .94], seed: 149, ink: .95, edge: 'torn', curl: .018,
    folds: [[.24, -.15, .016, .01], [.58, .08, .024, .008], [.77, -.1, .012, .01]] },
  { id: 'coupon', name: 'Shop and coupon', title: 'PENNY & CO.', ratio: 2.27,
    tint: [1, .987, .95], seed: 197, ink: .81, edge: 'serrated', curl: .009,
    folds: [[.4, -.05, .015, .013], [.69, .12, .02, .01]] },
];

export const RECEIPTS = expandCatalogue(ORIGINALS);

export function seeded(seed) {
  let value = seed;
  return () => ((value = (Math.imul(value, 1664525) + 1013904223) >>> 0) / 4294967296);
}

export function heightAt(u, v, receipt) {
  let height = .0018;
  for (const [centre, slope, amplitude, width] of receipt.folds) {
    const d = v - centre - slope * (u - .5);
    height += amplitude * Math.exp(-d * d / (2 * width * width));
    height += amplitude * .22 * Math.exp(-d * d / (width * width * 18));
  }
  height += receipt.curl * Math.pow(Math.abs(u - .5) * 2, 7)
    * (.35 + .65 * Math.pow(Math.cos(v * 4 + receipt.seed), 2));
  height += receipt.curl * .6 * Math.exp(-Math.pow(v - .025, 2) / .0015) * u * u;
  height += .0015 * Math.sin(u * 15 + v * 22 + receipt.seed) ** 2;
  return height;
}

function edgeAt(t, side, receipt) {
  const seed = receipt.seed + side * 31;
  const ragged = Math.sin(t * 437 + seed) * Math.sin(t * 179 + seed * 2);
  const fine = .0008 * ragged;
  if (side < 2) return fine + .001 * Math.sin(t * 23 + seed);
  if (receipt.edge === 'serrated') return .003 * Math.abs(Math.sin(t * 180)) + fine;
  if (receipt.edge === 'torn') return .005 * Math.sin(t * 29 + seed) + fine * 2;
  return .0015 * t + fine;
}

function surfaceAt(u, v, receipt) {
  let compression = 0;
  for (const [centre, slope, amplitude, width] of receipt.folds) {
    const d = v - centre - slope * (u - .5);
    compression += amplitude * .3 * Math.tanh(d / (width * 2));
  }
  return [
    u - .5 + (1 - u) * edgeAt(v, 0, receipt) + u * edgeAt(v, 1, receipt),
    (.5 - v) * receipt.ratio + compression + (1 - v) * edgeAt(u, 2, receipt) + v * edgeAt(u, 3, receipt),
    heightAt(u, v, receipt),
  ];
}

function normalAt(u, v, receipt) {
  const a = surfaceAt(u + .001, v, receipt), b = surfaceAt(u - .001, v, receipt);
  const c = surfaceAt(u, v + .001, receipt), d = surfaceAt(u, v - .001, receipt);
  const du = a.map((n, i) => n - b[i]), dv = c.map((n, i) => n - d[i]);
  const normal = [dv[1] * du[2] - dv[2] * du[1], dv[2] * du[0] - dv[0] * du[2], dv[0] * du[1] - dv[1] * du[0]];
  const length = Math.hypot(...normal);
  return normal.map(n => n / length);
}

export function makeMesh(receipt, columns = 64, rows = 144) {
  const vertices = [];
  for (let y = 0; y <= rows; y++) for (let x = 0; x <= columns; x++) {
    const u = x / columns, v = y / rows;
    vertices.push(...surfaceAt(u, v, receipt), u, v, ...normalAt(u, v, receipt));
  }
  return new Float32Array(vertices);
}

export function meshIndices(columns = 64, rows = 144) {
  const indices = [];
  for (let y = 0; y < rows; y++) for (let x = 0; x < columns; x++) {
    const i = y * (columns + 1) + x;
    indices.push(i, i + 1, i + columns + 1, i + 1, i + columns + 2, i + columns + 1);
  }
  return new Uint16Array(indices);
}
