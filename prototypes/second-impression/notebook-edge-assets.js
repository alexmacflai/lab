export function loadNotebookEdges(count) {
  return Promise.all(Array.from({ length: count }, async (_, index) => {
    const url = new URL(`notebook-edges/scrap-${String(index + 1).padStart(2, '0')}.bin`, import.meta.url);
    const response = await fetch(url); if (!response.ok) throw new Error('Notebook edges could not load');
    const buffer = await new Response(response.body.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
    return decodePatch(buffer);
  }));
}

function decodePatch(buffer) {
  const view = new DataView(buffer), width = view.getUint32(0,true), height = view.getUint32(4,true);
  const count = view.getUint32(8,true), runs = []; let offset = 12;
  for (let i = 0; i < count; i++) {
    const start = view.getUint32(offset,true) * 4, encoded = view.getUint32(offset + 4,true);
    const clear = Boolean(encoded >>> 31), length = (encoded & 0x7fffffff) * 4;
    if (start + length > width * height * 4 || length % 4) throw new Error('Invalid notebook edge patch');
    runs.push({ start, length, data: clear ? null : new Uint8Array(buffer,offset + 8,length) });
    offset += 8 + (clear ? 0 : length);
  }
  if (offset !== buffer.byteLength) throw new Error('Invalid notebook edge patch');
  return { width, height, runs };
}

export function applyNotebookEdges(source, patch) {
  const canvas = document.createElement('canvas'); canvas.width = source.width * 2; canvas.height = source.height * 2;
  if (canvas.width !== patch.width || canvas.height !== patch.height) throw new Error('Notebook edge dimensions changed');
  const ctx = canvas.getContext('2d', { willReadFrequently: true }); ctx.drawImage(source,0,0,canvas.width,canvas.height);
  const image = ctx.getImageData(0,0,canvas.width,canvas.height);
  for (const { start, length, data } of patch.runs) {
    if (!data) image.data.fill(0,start,start + length);
    else for (let i = 0; i < length; i += 4) {
      const green = data[i];
      image.data[start + i] = (green + data[i + 1]) & 255;
      image.data[start + i + 1] = green;
      image.data[start + i + 2] = (green + data[i + 2]) & 255;
      image.data[start + i + 3] = data[i + 3];
    }
  }
  ctx.putImageData(image,0,0); return canvas;
}
