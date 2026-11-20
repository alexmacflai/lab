import { expandCatalogue } from './catalogue.js';
import { assignConditions, foldSample } from './conditions.js';

// Each layout has its own stock, cutting profile, folds and printer behaviour.
const ORIGINALS = [
  { id: 'grocer', name: 'Supermarket', title: 'MORNING MARKET', ratio: 2.28,
    tint: [1, .995, .97], seed: 17, ink: .86, edge: 'cut',
  },
  { id: 'terminal', name: 'Card terminal', title: 'MERCHANT COPY', ratio: 2.18,
    tint: [.985, .992, 1], seed: 41, ink: .76, edge: 'serrated',
  },
  { id: 'cafe', name: 'Café order', title: 'little / oak', ratio: 2.24,
    tint: [1, .975, .925], seed: 73, ink: .9, edge: 'torn',
  },
  { id: 'restaurant', name: 'Restaurant', title: 'BELL & ANCHOR', ratio: 2.33,
    tint: [1, .995, .975], seed: 107, ink: .83, edge: 'cut',
  },
  { id: 'hardware', name: 'Hardware shop', title: 'HARRIS / HARDWARE', ratio: 2.2,
    tint: [.97, .98, .94], seed: 149, ink: .95, edge: 'torn',
  },
  { id: 'coupon', name: 'Shop and coupon', title: 'PENNY & CO.', ratio: 2.27,
    tint: [1, .987, .95], seed: 197, ink: .81, edge: 'serrated',
  },
];

export const RECEIPTS = assignConditions(expandCatalogue(ORIGINALS));

export function seeded(seed) {
  let value = seed;
  return () => ((value = (Math.imul(value, 1664525) + 1013904223) >>> 0) / 4294967296);
}

export function heightAt(u, v, receipt) {
  let height = .0015;
  for (const fold of receipt.folds) {
    const f = foldSample(u, v, receipt.ratio, fold);
    const ridge = receipt.surfaceRefined ? .7 * Math.exp(-f.d * f.d / (2 * fold.width * fold.width * .64)) + .3 * f.ridge : f.ridge;
    height += fold.amplitude * f.envelope * (ridge + .16 * Math.exp(-f.d * f.d / (fold.width * fold.width * 12)));
  }
  for (const bump of receipt.bumps) {
    const distance = (u - bump.u) ** 2 + ((v - bump.v) * receipt.ratio) ** 2;
    height += bump.amplitude * Math.exp(-distance / (bump.radius * bump.radius));
  }
  height += receipt.curl * Math.pow(Math.abs(u - .5) * 2, 7)
    * (.35 + .65 * Math.pow(Math.cos(v * 4 + receipt.phase), 2));
  height += receipt.curl * .6 * Math.exp(-Math.pow(v - .025, 2) / .0015) * u * u;
  if (receipt.surfaceRefined) {
    // Small, local handling dents rather than a repeating corrugated surface.
    height += receipt.micro * .18 * Math.exp(-((u - .32) ** 2 * 31 + (v - .61) ** 2 * 73));
    height += receipt.micro * .11 * Math.exp(-((u - .73) ** 2 * 57 + (v - .26) ** 2 * 41));
  } else height += receipt.micro * Math.sin(u * 19 + v * 27 + receipt.phase) ** 2;
  return height;
}

function edgeAt(t, side, receipt) {
  const seed = receipt.seed + side * 31;
  const ragged = Math.sin(t * 437 + seed) * Math.sin(t * 179 + seed * 2);
  const fine = .0008 * ragged;
  if (receipt.edge === 'card') return fine * .12;
  if (side < 2) return fine + .001 * Math.sin(t * 23 + seed);
  if (receipt.edge === 'serrated') return .003 * Math.abs(Math.sin(t * 180)) + fine;
  if (receipt.edge === 'torn') return .005 * Math.sin(t * 29 + seed) + fine * 2;
  return .0015 * t + fine;
}

function edgeWeight(distance) {
  // A compact 3.2 mm perimeter strip on 80 mm stock; zero influence beyond it.
  const t = Math.max(0, 1 - distance / .04);
  return t * t * (3 - 2 * t);
}

function surfaceAt(u, v, receipt) {
  let dx = 0, dy = 0;
  for (const fold of receipt.folds) {
    // Compose the sharper creases instead of adding contractions at intersections.
    const f = foldSample(u + (receipt.creaseSharp ? dx : 0), v - (receipt.creaseSharp ? dy / receipt.ratio : 0), receipt.ratio, fold);
    const compression = receipt.creaseSharp
      ? Math.min(fold.amplitude * .9, fold.width * .36) * Math.tanh(f.d / (fold.width * .45)) * f.envelope
      : fold.amplitude * (receipt.surfaceRefined ? .55 : .12)
        * Math.tanh(f.d / (fold.width * (receipt.surfaceRefined ? .8 : 2))) * f.envelope;
    dx -= f.c * compression; dy -= f.s * compression;
  }
  // The old interpolation warped every row and column, including the photograph.
  // Keep it only for the explicitly labelled dev regression comparison.
  const edges = receipt.legacyEdgeSpread ? [1 - u, u, 1 - v, v]
    : [edgeWeight(u), edgeWeight(1 - u), edgeWeight(v * receipt.ratio), edgeWeight((1 - v) * receipt.ratio)];
  const radius = receipt.cornerRadius || 0, end = Math.min(v, 1 - v) * receipt.ratio;
  const corner = end < radius ? radius - Math.sqrt(Math.max(0, radius * radius - (radius - end) ** 2)) : 0;
  return [
    (u - .5) * (1 - corner * 2) + dx + edges[0] * edgeAt(v, 0, receipt) + edges[1] * edgeAt(v, 1, receipt),
    (.5 - v) * receipt.ratio + dy + edges[2] * edgeAt(u, 2, receipt) + edges[3] * edgeAt(u, 3, receipt),
    heightAt(u, v, receipt),
  ];
}

export function makeMesh(receipt, columns = 64, rows = 144) {
  const positions = [];
  for (let y = 0; y <= rows; y++) for (let x = 0; x <= columns; x++) positions.push(surfaceAt(x / columns, y / rows, receipt));
  const vertices = [];
  for (let y = 0; y <= rows; y++) for (let x = 0; x <= columns; x++) {
    const index = y * (columns + 1) + x;
    const a = positions[y * (columns + 1) + Math.min(columns, x + 1)];
    const b = positions[y * (columns + 1) + Math.max(0, x - 1)];
    const c = positions[Math.min(rows, y + 1) * (columns + 1) + x];
    const d = positions[Math.max(0, y - 1) * (columns + 1) + x];
    const du = a.map((n, i) => n - b[i]), dv = c.map((n, i) => n - d[i]);
    const normal = [dv[1] * du[2] - dv[2] * du[1], dv[2] * du[0] - dv[0] * du[2], dv[0] * du[1] - dv[1] * du[0]];
    const length = Math.hypot(...normal);
    vertices.push(...positions[index], x / columns, y / rows, ...normal.map(n => n / length));
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
