export const PAPER_TYPES = [
  { id: 'receipts', label: 'Receipts', count: 100, public: true,
    load: () => import('./paper.js').then(module => module.loadPaper()) },
  { id: 'library-cards', label: 'Library borrowing cards', count: 20, public: false,
    load: () => import('./library-cards/collection.js').then(module => module.loadCards()) },
];

export function paperType(id) { return PAPER_TYPES.find(type => type.id === id) || PAPER_TYPES[0]; }

export function fillPaperSelector(select, development = false) {
  select.replaceChildren(...PAPER_TYPES.map(type => {
    const option = document.createElement('option'); option.value = type.id;
    option.textContent = type.label + (!type.public && !development ? ' · in review' : '');
    option.disabled = !development && !type.public; return option;
  }));
}
