import { PrintRenderer } from '../../print-material/renderer.js';
import { createImpression } from '../../print-material/impression.js';
import { capturePrint } from '../../print.js';

function gridPrint() {
  const canvas = document.createElement('canvas'); canvas.width = 576; canvas.height = 720;
  const ctx = canvas.getContext('2d'); ctx.fillStyle = 'white'; ctx.fillRect(0, 0, 576, 720);
  ctx.strokeStyle = 'black'; ctx.lineWidth = 10;
  for (let x = 0; x <= 576; x += 36) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 720); ctx.stroke(); }
  for (let y = 0; y <= 720; y += 36) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(576, y); ctx.stroke(); }
  ctx.fillStyle = 'black';
  for (const y of [108, 324, 540]) ctx.fillRect(72, y, 432, 72);
  ctx.fillRect(216, 0, 144, 720);
  return capturePrint(canvas, 0, null, false);
}

export class SurfaceProof {
  constructor(player, comparison = null) {
    this.comparison = comparison;
    this.events = new AbortController();
    this.player = player; this.root = document.querySelector('#surface-proof');
    this.root.innerHTML = `<summary>Surface comparisons</summary>
      <p>${comparison?.description || 'The Small Hours pair isolates the edge fix. Further pairs compare the previous and sharper crease compression, with the same height, highlight shader, ink and placement. Sharper creases and highlights are also used in the public view.'}</p>
      <div class="proof-controls"><label>Image <select id="surface-source"><option value="portrait">Portrait</option><option value="grid">Grid and solid ink</option><option value="paper">Paper only</option></select></label>
      <label>View <select id="surface-view"><option value="0">Paper and ink</option><option value="2">Surface normals</option></select></label>
      <label><input id="surface-detail" type="checkbox"> Close-up</label></div>
      <div id="surface-cards"></div>`;
    this.root.addEventListener('toggle', () => { if (this.root.open) this.rebuild(); }, { signal: this.events.signal });
    this.root.querySelectorAll('select,input').forEach(control => control.addEventListener('change', () => this.rebuild(), { signal: this.events.signal }));
  }

  initialise() {
    if (this.comparison) this.papers = this.comparison.papers;
    else {
      const cases = [this.player.papers.find(p => p.name === 'Noodle House'),
        ...['pristine', 'single-fold', 'crumpled', 'neat-one', 'neat-two', 'neat-three'].map(condition => this.player.papers.find(p => p.condition === condition))];
      const affected = this.player.papers.find(p => p.name === 'Small Hours');
      this.papers = [{ ...affected, legacyEdgeSpread: true, comparisonLabel: 'Small Hours · Before edge fix' },
        { ...affected, comparisonLabel: 'Small Hours · Fixed edges' }, ...cases.flatMap(paper => {
        const title = paper.name + ({ 'neat-one': ' · Neat 1 fold', 'neat-two': ' · Neat 2 folds', 'neat-three': ' · Neat 3 folds' }[paper.condition] || '');
        return [{ ...paper, surfaceRefined: true, creaseSharp: false, comparisonLabel: `${title} · Previous crease` },
          { ...paper, surfaceRefined: true, creaseSharp: true, comparisonLabel: `${title} · Sharper crease` }];
      })];
    }
    const canvas = document.createElement('canvas'); canvas.width = 672; canvas.height = 832;
    this.renderer = new PrintRenderer(canvas, this.papers, 2);
    this.impression = createImpression(1); this.grid = gridPrint();
  }

  async rebuild() {
    if (!this.renderer) this.initialise();
    const generation = this.generation = (this.generation || 0) + 1;
    const cards = document.querySelector('#surface-cards');
    const choice = document.querySelector('#surface-source').value;
    const source = choice === 'paper' ? null : choice === 'grid' ? this.grid : this.player.sample;
    this.renderer.imageSize = this.player.renderer.imageSize;
    this.renderer.imageGamma = this.player.renderer.imageGamma;
    this.renderer.imageBrightness = this.player.renderer.imageBrightness;
    this.renderer.printSize = this.player.renderer.printSize;
    for (let i = 0; i < this.papers.length; i++) {
      if (generation !== this.generation || !this.root.open) return;
      // Hold the exact same impression across both sides and all three papers.
      Object.assign(this.renderer, { profile: 1, appliedProfile: 1, lastIndex: i, impression: this.impression });
      this.renderer.draw(i, source, { fit: this.comparison?.fit, inspect: Number(document.querySelector('#surface-view').value),
        zoom: document.querySelector('#surface-detail').checked });
      const card = cards.children[i] || document.createElement('figure'), paper = this.papers[i];
      const image = document.createElement('img'); image.src = this.renderer.canvas.toDataURL();
      const condition = { pristine: 'Tidy', 'single-fold': 'Single fold', crumpled: 'Crumpled' }[paper.condition];
      const label = paper.comparisonLabel || `${condition} · ${i % 2 ? 'Proposed' : 'Current'}`;
      image.alt = label; const caption = document.createElement('figcaption'); caption.textContent = label;
      card.replaceChildren(image, caption); if (!card.isConnected) cards.append(card);
      await new Promise(resolve => requestAnimationFrame(resolve));
    }
  }

  dispose() { this.generation = (this.generation || 0) + 1; this.events.abort(); this.renderer?.dispose(true); }
}
