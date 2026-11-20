import { seeded } from './receipts.js';
import { scaledCornerTexture } from './notebook-edge-baseline.js';
import { tornCornerTexture } from './notebook-edge-proof.js';
import { scrapTexture } from './notebook-texture.js';
import { scrapShape, scrapFolds } from './notebook-shapes.js';

const NAMES = ['Page corner · almost flat', 'Page corner · quarter fold', 'Side edge · half fold',
  'Top edge · half fold', 'Four tears · almost flat', 'Four tears · quarter fold'];

// All dimensions describe the surviving scrap, not its original sheet.
function scrap(index, stock, handwriting) {
  const random = seeded(6301 + index * 137), widthMm = 64 + index % 5 * 3;
  const ratio = [1.22, 1.28, 1.18, 1.3, 1.15, 1.25][index];
  const seed = 6301 + index * 137;
  return { id: `notebook-${index + 1}`, name: NAMES[index],
    edgeAlpha: index === 0, paperType: 'notebook-scraps', widthMm, ratio, seed, edge: 'card', tint: [1, 1, 1],
    viewHeight: Math.max(1.8, ratio + .25), surfaceRefined: true, creaseSharp: true,
    condition: NAMES[index],
    folds: scrapFolds(index, random),
    bumps: [{ u: .82, v: .87, radius: .065, amplitude: .00065 }],
    curl: .0007 + index % 3 * .0002, micro: .0001, phase: index,
    surfacePoint: scrapShape(index, seed, ratio),
    scaledEdgeTexture: () => scaledCornerTexture(scrapTexture(stock, handwriting, index, widthMm, ratio, seed), seed),
    originalEdgeTexture: () => scrapTexture(stock, handwriting, index, widthMm, ratio, seed),
    makeTexture: () => {
      const texture = scrapTexture(stock, handwriting, index, widthMm, ratio, seed);
      return index === 0 ? tornCornerTexture(texture, seed) : texture;
    } };
}

export async function loadScraps() {
  const stock = new Image(); stock.src = new URL('notebook-stock.png', import.meta.url);
  const handwriting = new Image(); handwriting.src = new URL('notebook-handwriting.png', import.meta.url);
  await Promise.all([stock.decode(), handwriting.decode()]);
  return Array.from({ length: 6 }, (_, index) => scrap(index, stock, handwriting));
}
