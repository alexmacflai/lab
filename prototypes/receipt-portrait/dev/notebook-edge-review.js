import { loadScraps } from '../notebook-scraps.js';
import { referenceTearShape } from '../notebook-tear-outline.js';
import { FACTORY_EDGES } from '../notebook-shapes.js';
import { tornCornerTexture } from '../notebook-edge-proof.js';
import { scaledCornerTexture } from '../notebook-edge-baseline.js';
import { PrintRenderer } from '../print-material/renderer.js';

const root = document.querySelector('#pairs');
let papers = [], dark = false;
function image(canvas, label, crop) {
  const view = document.createElement('canvas');
  view.width = crop ? crop[2] : canvas.width; view.height = crop ? crop[3] : canvas.height;
  const ctx = view.getContext('2d');
  if (crop) ctx.drawImage(canvas, ...crop, 0, 0, view.width, view.height);
  else ctx.drawImage(canvas, 0, 0);
  const img = document.createElement('img'); img.src = view.toDataURL(); img.alt = label;
  if (crop) img.className = 'detail';
  img.style.background = dark ? '#30302e' : '#c9c7bd';
  return img;
}

function render() {
  const index = Number(document.querySelector('#paper').value), source = papers[index];
  const factory = FACTORY_EDGES[index];
  const paper = { ...source, surfacePoint: referenceTearShape(index, source.seed, source.ratio), edgeAlpha: true, makeTexture: () => tornCornerTexture(source.originalEdgeTexture(), source.seed, factory, source.widthMm) };
  const original = { ...source, edgeAlpha: true, makeTexture: () => scaledCornerTexture(source.originalEdgeTexture(), source.seed, factory, source.widthMm) };
  root.replaceChildren();
  const canvas = document.createElement('canvas'); canvas.width = 1800; canvas.height = 2200;
  const renderer = new PrintRenderer(canvas, [original, paper], 2);
  for (let i = 0; i < 2; i++) {
    renderer.draw(i, null, { fit: true });
    const section = document.createElement('section'), title = document.createElement('h2');
    title.textContent = i ? 'Proposed torn edges' : 'Committed fibrous edges'; section.append(title);
    section.append(image(canvas, `${title.textContent}, complete scrap`));
    const scale = canvas.height / paper.viewHeight;
    const left = Math.round((canvas.width - scale) / 2), right = Math.round(left + scale);
    const top = Math.round((canvas.height - scale * paper.ratio * .996) / 2);
    const bottom = Math.round(top + scale * paper.ratio * .996);
    const crops = edgeCrops(canvas, left, top, right, bottom);
    for (const [label, crop] of crops) {
      const caption = document.createElement('p'); caption.textContent = label;
      section.append(caption, image(canvas, `${title.textContent}: ${label}`, crop));
    }
    root.append(section);
  }
  renderer.dispose(true); document.querySelector('#status').textContent = 'Reference-led outline and fine torn edges. Folds, lighting and print settings are unchanged.';
}
function edgeCrops(canvas, left, top, right, bottom) {
  // Use a 2D copy for alpha inspection; the casts remain below the solid-paper threshold.
  const copy = document.createElement('canvas'); copy.width = canvas.width; copy.height = canvas.height;
  const pixels = copy.getContext('2d'); pixels.drawImage(canvas, 0, 0);
  const rightBand = pixels.getImageData(right - 180, 760, 200, 220);
  let minRight = 200, maxRight = 0;
  for (let y = 0; y < 220; y++) for (let x = 199; x >= 0; x--) {
    if (rightBand.data[(y * 200 + x) * 4 + 3] > 210) {
      minRight = Math.min(minRight, x); maxRight = Math.max(maxRight, x); break;
    }
  }
  const bottomBand = pixels.getImageData(650, bottom - 180, 300, 200);
  let minBottom = 200, maxBottom = 0;
  for (let x = 0; x < 300; x++) for (let y = 199; y >= 0; y--) {
    if (bottomBand.data[(y * 300 + x) * 4 + 3] > 210) {
      minBottom = Math.min(minBottom, y); maxBottom = Math.max(maxBottom, y); break;
    }
  }
  return [
    ['Right torn edge · enlarged', [right - 180 + minRight - 32, 760, maxRight - minRight + 52, 220]],
    ['Bottom torn edge · enlarged', [650, bottom - 180 + minBottom - 32, 300, maxBottom - minBottom + 52]],
    ['Top-left corner · enlarged', [left - 10, top - 10, 180, 180]],
  ];
}

document.querySelector('#background').addEventListener('click', event => {
  dark = !dark; document.querySelectorAll('img').forEach(img => img.style.background = dark ? '#30302e' : '#c9c7bd');
  event.target.textContent = dark ? 'Switch to light background' : 'Switch to dark background';
});
document.querySelector('#paper').addEventListener('change', () => render());
loadScraps().then(loaded => { papers = loaded; document.querySelector('#paper').disabled = false; render(); }).catch(error => { document.querySelector('#status').textContent = 'Could not load the comparison. Refresh to try again.'; console.error(error); });
