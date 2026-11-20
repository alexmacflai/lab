import { PaperRenderer } from './renderer.js';

export class ReceiptGallery {
  constructor(papers, sample, onSelect) {
    this.events = new AbortController();
    this.papers = papers; this.sample = sample; this.onSelect = onSelect;
    this.page = 0; this.size = 20; this.selected = 0; this.images = new Map(); this.generation = 0;
    const canvas = document.createElement('canvas'); canvas.width = 336; canvas.height = 416;
    this.thumbnail = document.createElement('canvas'); this.thumbnail.width = papers[0].paperType === 'library-cards' ? 336 : 168; this.thumbnail.height = papers[0].paperType === 'library-cards' ? 416 : 208;
    this.renderer = new PaperRenderer(canvas, papers, 2);
    document.querySelector('#gallery-previous').addEventListener('click', () => this.show(this.page - 1), { signal: this.events.signal });
    document.querySelector('#gallery-next').addEventListener('click', () => this.show(this.page + 1), { signal: this.events.signal });
  }

  highlight(index) {
    this.selected = index;
    document.querySelectorAll('[data-receipt]').forEach(button => {
      button.setAttribute('aria-pressed', String(Number(button.dataset.receipt) === index));
    });
  }

  async show(page = 0, selected = this.selected) {
    this.selected = selected;
    this.page = Math.max(0, Math.min(Math.ceil(this.papers.length / this.size) - 1, page));
    const generation = ++this.generation, start = this.page * this.size;
    const collection = document.querySelector('#receipts'); collection.replaceChildren();
    document.querySelector('#gallery-range').textContent = `${start + 1}–${Math.min(start + this.size, this.papers.length)} of ${this.papers.length}`;
    document.querySelector('#gallery-previous').disabled = this.page === 0;
    document.querySelector('#gallery-next').disabled = start + this.size >= this.papers.length;
    for (let index = start; index < Math.min(start + this.size, this.papers.length); index++) {
      if (generation !== this.generation) return;
      const paper = this.papers[index], button = document.createElement('button');
      button.dataset.receipt = index; button.setAttribute('aria-pressed', String(index === this.selected));
      const image = document.createElement('img'); image.alt = ''; image.loading = 'lazy';
      const label = document.createElement('span'); label.textContent = `${index + 1}. ${paper.name}`;
      button.append(image, label); button.addEventListener('click', () => this.onSelect(index)); collection.append(button);
      if (!this.images.has(index)) {
        this.renderer.draw(index, this.sample, { fit: paper.paperType === 'library-cards' });
        const preview = this.thumbnail.getContext('2d'); preview.imageSmoothingQuality = 'high';
        preview.clearRect(0, 0, this.thumbnail.width, this.thumbnail.height);
        preview.drawImage(this.renderer.canvas, 0, 0, this.thumbnail.width, this.thumbnail.height);
        this.images.set(index, this.thumbnail.toDataURL('image/png'));
      }
      image.src = this.images.get(index);
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }

  dispose() { this.generation++; this.events.abort(); this.renderer.dispose(true); }
}
