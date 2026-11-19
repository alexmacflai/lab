// Condition belongs to the physical ticket; its normals never animate independently.
export function hash(value) {
  let h = 2166136261;
  for (const c of value) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  h = Math.imul(h ^ (h >>> 16), 0x85ebca6b);
  return (h ^ (h >>> 13)) >>> 0;
}
function randomFor(id) {
  let s = hash(id);
  return () => { s += 0x6d2b79f5; let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const MIX = [['pristine', 24], ['single-fold', 22], ['three-fold', 20], ['five-fold', 12], ['crumpled', 14], ['handled', 8]];
const MARKS = [['coffee', 7], ['ink', 3], ['marker', 3], ['pencil', 6], ['pen-note', 6], ['doodle', 8]];

function profile(id, condition) {
  const random = randomFor(id + '/surface');
  const count = { pristine: 0, 'single-fold': 1, 'three-fold': 3, 'five-fold': 5, crumpled: 12 + Math.floor(random() * 9), handled: 2 }[condition];
  const folds = Array.from({ length: count }, (_, i) => ({
    u: .12 + random() * .76,
    v: condition === 'single-fold' ? .38 + random() * .24 : .08 + random() * .84,
    angle: condition === 'single-fold' ? Math.PI / 2 + (random() - .5) * .08 : random() * Math.PI,
    amplitude: condition === 'crumpled' ? .004 + random() * .01 : .008 + random() * .016,
    width: condition === 'handled' ? .045 + random() * .03 : .018 + random() * .024,
    length: condition === 'crumpled' ? .09 + random() * .3 : .45 + random() * 1.6,
  }));
  const bumps = condition === 'crumpled' ? Array.from({ length: 7 }, () => ({
    u: random(), v: random(), radius: .08 + random() * .15, amplitude: .003 + random() * .009,
  })) : [];
  return { condition, folds, bumps, curl: condition === 'pristine' ? .001 + random() * .003 : .004 + random() * .018,
    micro: condition === 'pristine' ? .00012 : condition === 'crumpled' ? .0016 : .0005,
    phase: random() * Math.PI * 2 };
}

export function assignConditions(receipts) {
  const ranked = [...receipts].sort((a, b) => hash(a.id + '/condition') - hash(b.id + '/condition'));
  const conditions = MIX.flatMap(([name, count]) => Array(count).fill(name));
  const map = new Map(ranked.map((receipt, i) => [receipt.id, profile(receipt.id, conditions[i])]));
  const marks = MARKS.flatMap(([kind, count]) => Array(count).fill(kind));
  const marked = [...receipts].sort((a, b) => hash(a.id + '/marks') - hash(b.id + '/marks'));
  const markMap = new Map(marked.slice(0, marks.length).map((receipt, i) => [receipt.id, marks[i]]));
  return receipts.map(receipt => ({ ...receipt, ...map.get(receipt.id), mark: markMap.get(receipt.id) || null }));
}

export function foldSample(u, v, ratio, fold) {
  const c = Math.cos(fold.angle), s = Math.sin(fold.angle);
  const x = u - fold.u, y = (fold.v - v) * ratio;
  const d = x * c + y * s, along = -x * s + y * c;
  const envelope = Math.exp(-Math.pow(along / fold.length, 4));
  const ridge = Math.exp(-d * d / (2 * fold.width * fold.width));
  return { c, s, envelope, ridge, d };
}
