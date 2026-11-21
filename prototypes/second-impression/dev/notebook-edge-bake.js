import { loadScraps } from '../notebook-scraps.js';

// Lossless pixel patches omit the unchanged stock inside each perimeter strip.
// Regenerate after changing notebook stock, notes, dimensions or tear drawing.
export async function* bakeNotebookEdges() {
  const papers = await loadScraps({ procedural: true });
  for (let index = 0; index < papers.length; index++) {
    const paper = papers[index], source = paper.originalEdgeTexture();
    const base = document.createElement('canvas'); base.width = source.width * 2; base.height = source.height * 2;
    const ctx = base.getContext('2d', { willReadFrequently: true }); ctx.drawImage(source,0,0,base.width,base.height);
    const original = ctx.getImageData(0,0,base.width,base.height).data;
    const finished = paper.makeTexture();
    const pixels = finished.getContext('2d').getImageData(0,0,finished.width,finished.height).data;
    const runs = [];
    for (let pixel = 0; pixel < pixels.length / 4;) {
      if (same(original,pixels,pixel)) { pixel++; continue; }
      const start = pixel++, clear = pixels[start * 4 + 3] === 0;
      while (pixel < pixels.length / 4 && !same(original,pixels,pixel) && (pixels[pixel * 4 + 3] === 0) === clear) pixel++;
      const data = clear ? null : new Uint8Array(pixels.slice(start * 4,pixel * 4));
      if (data) for (let i = 0; i < data.length; i += 4) {
        const red = data[i], green = data[i + 1], blue = data[i + 2];
        data[i] = green; data[i + 1] = red - green; data[i + 2] = blue - green;
      }
      runs.push({ start, length: pixel - start, data });
    }
    const bytes = new Uint8Array(12 + runs.reduce((sum,run) => sum + 8 + (run.data?.length || 0),0));
    const view = new DataView(bytes.buffer); view.setUint32(0,base.width,true); view.setUint32(4,base.height,true);
    view.setUint32(8,runs.length,true); let offset = 12;
    for (const run of runs) {
      view.setUint32(offset,run.start,true); view.setUint32(offset + 4,run.length | (run.data ? 0 : 0x80000000),true);
      if (run.data) bytes.set(run.data,offset + 8); offset += 8 + (run.data?.length || 0);
    }
    const compressed = await new Response(new Blob([bytes]).stream().pipeThrough(new CompressionStream('gzip'))).arrayBuffer();
    source.width = source.height = base.width = base.height = finished.width = finished.height = 1;
    yield { index, bytes: new Uint8Array(compressed) };
  }
}

function same(a,b,pixel) {
  const i = pixel * 4;
  return a[i] === b[i] && a[i + 1] === b[i + 1] && a[i + 2] === b[i + 2] && a[i + 3] === b[i + 3];
}
