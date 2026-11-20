import { seeded } from './receipts.js';

import { NOTEBOOK_RECORDS } from './notebook-records.js';

const FACTORY = NOTEBOOK_RECORDS.map(record => record.factory);

function smoothSamples(values, t) {
  const p = Math.max(0, Math.min(.999999, t)) * (values.length - 1), i = Math.floor(p);
  const f = p - i, blend = f * f * (3 - 2 * f);
  return values[i] * (1 - blend) + values[i + 1] * blend;
}

export function scrapShape(index, seed, ratio) {
  const random = seeded(seed), factory = FACTORY[index];
  const paths = Array.from({ length: 4 }, () => ({
    broad: Array.from({ length: 7 }, () => (random() - .5) * .009),
    fine: Array.from({ length: 129 }, () => (random() - .5) * .002),
    slope: (random() - .5) * .014,
  }));
  const tear = (t, side) => {
    if (factory[side]) return 0;
    const path = paths[side];
    return .006 + (t - .5) * path.slope + smoothSamples(path.broad, t)
      + smoothSamples(path.fine, t);
  };
  return (u, v, point) => {
    // At most 1.4 mm of boundary influence; the sheet's ruling stays straight.
    const edge = d => { const t = Math.max(0, 1 - d / .018); return t * t * (3 - 2 * t); };
    point[0] += edge(u) * tear(v, 0) - edge(1 - u) * tear(v, 1);
    point[1] -= edge(v * ratio) * tear(u, 2);
    point[1] += edge((1 - v) * ratio) * tear(u, 3);
    return point;
  };
}

export function scrapFolds(index) {
  if (index === 0 || index === 4) return [];
  const horizontal = { u: .5, v: .5, angle: Math.PI / 2,
    amplitude: .0045, width: .025, length: 1, fullWidth: true };
  const vertical = { u: .5, v: .5, angle: 0,
    amplitude: .0035, width: .023, length: 1.5, fullWidth: true };
  return index === 1 || index === 5 ? [horizontal, vertical] : [horizontal];
}

export const FACTORY_EDGES = FACTORY;
