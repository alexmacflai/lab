export const PAPER_TYPES = [
  { id: 'receipts', label: 'Receipts', count: 100, public: true,
    load: () => import('./paper.js').then(module => module.loadPaper()) },
  { id: 'library-cards', label: 'Library borrowing cards', shortLabel: 'Library cards', count: 40, public: true,
    load: () => import('./library-cards/collection.js').then(module => module.loadCards()) },
  { id: 'notebook-scraps', label: 'Torn notebook scraps', shortLabel: 'Notebook scraps', count: 40, public: true,
    load: () => import('./notebook-scraps.js').then(module => module.loadScraps()) },
];

export function paperType(id) { return PAPER_TYPES.find(type => type.id === id) || PAPER_TYPES[0]; }

export function fillPaperSelector(select, development = false) {
  select.replaceChildren(...PAPER_TYPES.map(type => {
    const option = document.createElement('option'); option.value = type.id;
    option.textContent = (development ? type.label : type.shortLabel || type.label) + (!type.public && !development ? ' · in review' : '');
    option.disabled = !development && !type.public; return option;
  }));
}
