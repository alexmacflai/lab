import { applyNotebookEdges, loadNotebookEdges } from './notebook-edge-assets.js';
import { NOTEBOOK_RECORDS } from './notebook-records.js';
import { seeded } from './receipts.js';
import { scaledCornerTexture } from './notebook-edge-baseline.js';
import { tornCornerTexture } from './notebook-edge-proof.js';
import { scrapTexture } from './notebook-texture.js';
import { referenceTearShape } from './notebook-tear-outline.js';
import { FACTORY_EDGES, scrapFolds } from './notebook-shapes.js';

// All dimensions describe the surviving scrap, not its original sheet.
function scrap(index, stock, handwriting, annotations, edges) {
  const random = seeded(6301 + index * 137), widthMm = 64 + index % 5 * 3;
  const record = NOTEBOOK_RECORDS[index], ratio = record.ratio;
  const atlas = handwriting[Math.floor(index / 20)];
  const seed = 6301 + index * 137;
  return { id: `notebook-${index + 1}`, name: record.name,
    edgeAlpha: true, paperType: 'notebook-scraps', widthMm, ratio, seed, edge: 'card', tint: [1, 1, 1],
    viewHeight: Math.max(1.8, ratio + .25), surfaceRefined: true, creaseSharp: true,
    condition: record.name,
    folds: scrapFolds(record.foldIndex, random),
    bumps: [{ u: .82, v: .87, radius: .065, amplitude: .00065 }],
    curl: .0007 + index % 3 * .0002, micro: .0001, phase: index,
    surfacePoint: referenceTearShape(index, seed, ratio),
    scaledEdgeTexture: () => scaledCornerTexture(scrapTexture(stock, atlas, index, widthMm, ratio, seed, record.family, annotations), seed),
    originalEdgeTexture: () => scrapTexture(stock, atlas, index, widthMm, ratio, seed, record.family, annotations),
    makeTexture: () => {
      const texture = scrapTexture(stock, atlas, index, widthMm, ratio, seed, record.family, annotations);
      const finished = edges ? applyNotebookEdges(texture, edges)
        : tornCornerTexture(texture, seed, FACTORY_EDGES[index], widthMm);
      texture.width = texture.height = 1; return finished;
    } };
}

let collection;

export function loadScraps({ procedural = false } = {}) {
  if (procedural) return prepareScraps(true);
  return collection ||= prepareScraps(false).catch(error => { collection = null; throw error; });
}

async function prepareScraps(procedural) {
  const stock = new Image(); stock.src = new URL('notebook-stock.webp', import.meta.url);
  const handwriting = ['notebook-handwriting.webp', 'notebook-handwriting-2.webp'].map(path => {
    const image = new Image(); image.src = new URL(path, import.meta.url); return image;
  });
  const annotations = new Image(); annotations.src = new URL('notebook-annotations.webp', import.meta.url);
  const [edges] = await Promise.all([procedural ? null : loadNotebookEdges(NOTEBOOK_RECORDS.length),
    annotations.decode(), stock.decode(), ...handwriting.map(image => image.decode())]);
  const papers = NOTEBOOK_RECORDS.map((_, index) => scrap(index, stock, handwriting, annotations, edges?.[index]));
  // Retain the procedural path for authoring and exact asset comparisons only.
  for (const paper of procedural ? papers : []) {
    const prepared = paper.makeTexture(); prepared.width = prepared.height = 1;
    await new Promise(resolve => setTimeout(resolve, 0));
  }
  return papers;
}
