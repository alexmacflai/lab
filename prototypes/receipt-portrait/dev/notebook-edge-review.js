import { loadScraps } from '../notebook-scraps.js';
import { PrintRenderer } from '../print-material/renderer.js';

const root = document.querySelector('#pairs');
function image(canvas, label, crop) {
  const view = document.createElement('canvas');
  view.width = crop ? crop[2] : canvas.width; view.height = crop ? crop[3] : canvas.height;
  const ctx = view.getContext('2d');
  if (crop) ctx.drawImage(canvas, ...crop, 0, 0, view.width, view.height);
  else ctx.drawImage(canvas, 0, 0);
  const img = document.createElement('img'); img.src = view.toDataURL(); img.alt = label;
  if (crop) img.className = 'detail';
  return img;
}

async function render() {
  const [paper] = await loadScraps();
  const original = { ...paper, edgeAlpha: false, makeTexture: paper.originalEdgeTexture };
  const canvas = document.createElement('canvas'); canvas.width = 1800; canvas.height = 2200;
  const renderer = new PrintRenderer(canvas, [original, paper], 2);
  for (let i = 0; i < 2; i++) {
    renderer.draw(i, null, { fit: true });
    const section = document.createElement('section'), title = document.createElement('h2');
    title.textContent = i ? 'Proposed torn edges' : 'Previous edges'; section.append(title);
    section.append(image(canvas, `${title.textContent}, complete scrap`));
    // Centred 1 × 1.22 sheet in a 1.8-unit-high orthographic view.
    const left = 289, top = 354, right = 1511, bottom = 1846;
    for (const [label, crop] of [
      ['Right torn edge · enlarged', [right - 45, 800, 65, 220]],
      ['Bottom torn edge · enlarged', [700, bottom - 45, 250, 65]],
      ['Factory corner · enlarged', [left - 10, top - 10, 180, 180]],
    ]) {
      const caption = document.createElement('p'); caption.textContent = label;
      section.append(caption, image(canvas, `${title.textContent}: ${label}`, crop));
    }
    root.append(section);
  }
  renderer.dispose(true); document.querySelector('#status').textContent = 'Same paper, same lighting. Paper only; print settings are unchanged.';
}
let dark = false;
document.querySelector('#background').addEventListener('click', event => {
  dark = !dark; document.querySelectorAll('img').forEach(img => img.style.background = dark ? '#30302e' : '#c9c7bd');
  event.target.textContent = dark ? 'Switch to light background' : 'Switch to dark background';
});
render().catch(error => { document.querySelector('#status').textContent = 'Could not load the comparison. Refresh to try again.'; console.error(error); });
