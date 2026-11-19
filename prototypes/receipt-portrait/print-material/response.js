import { makeMesh } from '../receipts.js';

// Use the exact mesh normals used to light and bend the receipt and its print.
export function responseMap(receipt) {
  const width = 65, height = 145, vertices = makeMesh(receipt);
  const pixels = new ImageData(width, height), sx = 80 / 64, sy = receipt.ratio * 80 / 144;
  const normal = (x, y, axis) => vertices[(y * width + x) * 8 + 5 + axis];
  const clamp = n => Math.max(0, Math.min(1, n));
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const left = Math.max(0, x - 1), right = Math.min(width - 1, x + 1);
    const top = Math.max(0, y - 1), bottom = Math.min(height - 1, y + 1);
    // Divergence of the surface normal: convex ridges versus concave recesses.
    const curvature = (normal(right,y,0) - normal(left,y,0)) / ((right-left)*sx)
      - (normal(x,bottom,1) - normal(x,top,1)) / ((bottom-top)*sy);
    const ridge = clamp(curvature * 2), valley = clamp(-curvature * 2.2);
    const i = (y * width + x) * 4;
    pixels.data[i] = 255 * clamp(.88 + ridge * .12 - valley * .74);
    pixels.data[i + 1] = 255 * ridge;
    pixels.data[i + 2] = 255 * valley;
    pixels.data[i + 3] = 255;
  }
  const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
  canvas.getContext('2d').putImageData(pixels, 0, 0); return canvas;
}
