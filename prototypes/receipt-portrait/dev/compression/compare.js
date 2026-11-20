const $ = selector => document.querySelector(selector);
const descriptions = {
  webp75: 'A keeps 800 × 1333 pixels and lowers WebP quality from 90 to 75. Look at fibres, pencil strokes and the edges of the ruling.',
  webp640: 'B keeps WebP quality 90 but reduces the image to 640 × 1067 pixels. It is shown at the same size as the reference.',
  jpeg80: 'C uses JPEG quality 80 at 800 × 1333 pixels. Look for ringing around lettering, small blocks and changes in coloured ink.',
};
const labels = { webp75: 'A · WebP 75', webp640: 'B · Smaller WebP 90', jpeg80: 'C · JPEG 80' };
const names = { 1: 'The wild garden', 7: 'The wind in the willows', 12: 'The poetics of space' };
const bytes = value => `${(value / 1000).toFixed(1)} kB`;
const saving = (value, baseline) => `${((1 - value / baseline) * 100).toFixed(1)}% smaller`;
let records, selected = 1;

function update() {
  const record = records.find(row => row.number === selected), id = $('#method').value;
  const variant = record.variants.find(item => item.id === id);
  $('#before').src = $('#before-link').href = `assets/${record.file}`;
  $('#after').src = $('#after-link').href = `assets/${variant.file}`;
  $('#before').alt = `${names[selected]} · WebP 90 reference`; $('#after').alt = `${names[selected]} · ${labels[id]}`;
  $('#before-size').textContent = `${bytes(record.bytes)} · 800 × 1333`;
  $('#after-title').textContent = `After · ${labels[id]}`;
  $('#after-size').textContent = `${bytes(variant.bytes)} · ${variant.width} × ${variant.height} · ${saving(variant.bytes, record.bytes)}`;
  $('#description').textContent = descriptions[id];
  document.querySelectorAll('[data-card]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.card) === selected)));
}

function initialise(data) {
  records = data;
  for (const row of records) {
    const tr = document.createElement('tr');
    const cells = [`${String(row.number).padStart(2, '0')} · ${names[row.number]}`, bytes(row.bytes),
      ...row.variants.map(item => `${bytes(item.bytes)} (${saving(item.bytes, row.bytes)})`)];
    for (const text of cells) { const td = document.createElement('td'); td.textContent = text; tr.append(td); }
    $('#sizes').append(tr);
  }
  $('[data-card="1"]').parentElement.addEventListener('click', event => {
    const button = event.target.closest('[data-card]'); if (!button) return;
    selected = Number(button.dataset.card); update();
  });
  $('#method').addEventListener('change', update);
  $('.modes').addEventListener('click', event => {
    const button = event.target.closest('[data-mode]'); if (!button) return;
    $('.pair').dataset.mode = button.dataset.mode;
    document.querySelectorAll('.modes button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    document.querySelectorAll('.image-window').forEach(item => { item.scrollTop = 0; item.scrollLeft = 0; });
  });
  const windows = [...document.querySelectorAll('.image-window')];
  windows.forEach((item, i) => item.addEventListener('scroll', () => {
    const other = windows[1 - i];
    if (other.scrollTop !== item.scrollTop) other.scrollTop = item.scrollTop;
    if (other.scrollLeft !== item.scrollLeft) other.scrollLeft = item.scrollLeft;
  }));
  update();
}
fetch('results.json').then(response => { if (!response.ok) throw Error(); return response.json(); }).then(initialise)
  .catch(() => { $('#error').textContent = 'The comparison files could not load. Refresh to try again.'; });
