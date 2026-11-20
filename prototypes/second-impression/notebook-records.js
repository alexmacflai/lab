const FAMILIES = ['Ruled', 'Squared', 'Plain', 'Narrow ruled', 'Graph'];
const ORIGINAL_NAMES = ['Page corner · almost flat', 'Page corner · quarter fold', 'Side edge · half fold',
  'Top edge · half fold', 'Four tears · almost flat', 'Four tears · quarter fold'];
const ORIGINAL_EDGES = [[true,false,true,false], [false,true,false,true], [true,false,false,false],
  [false,false,true,false], [false,false,false,false], [false,false,false,false]];
const EDGES = [[true,false,true,false], [false,true,false,false], [false,false,true,false],
  [true,false,false,false], [false,false,false,false], [false,false,false,true]];
const counts = [0,0,0,0,0];
export const NOTEBOOK_RECORDS = Array.from({ length: 40 }, (_, index) => {
  const family = index < 6 ? index % 5 : counts.indexOf(Math.min(...counts));
  counts[family]++;
  return { family, name: ORIGINAL_NAMES[index] || `${FAMILIES[family]} notebook · scrap ${counts[family]}`,
    factory: ORIGINAL_EDGES[index] || EDGES[(index * 7 + Math.floor(index / 5)) % EDGES.length],
    ratio: index < 6 ? [1.22,1.28,1.18,1.3,1.15,1.25][index] : 1.15 + ((index * 7) % 16) / 100,
    foldIndex: index < 6 ? index : index % 10 < 5 ? 0 : index % 10 < 9 ? 2 : 1 };
});
