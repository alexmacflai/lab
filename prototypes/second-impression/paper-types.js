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

export function fillPaperChoices(group) {
  group.replaceChildren(...PAPER_TYPES.filter(type => type.public).map(type => {
    const label = document.createElement('label'); label.className = 'paper-chip';
    const input = document.createElement('input'); input.type = 'radio';
    input.name = 'paper-type'; input.value = type.id; input.checked = type.id === 'receipts';
    const text = document.createElement('span'); text.textContent = type.shortLabel || type.label;
    label.append(input, text); return label;
  }));
}
