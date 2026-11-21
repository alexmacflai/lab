import { scrapTexture } from '../../notebook-texture.js';
import { NOTEBOOK_RECORDS } from '../../notebook-records.js';

const $ = selector => document.querySelector(selector);
const labels = { webp85: 'A · WebP 85', webp65: 'B · WebP 65', 'webp-small': 'C · Half-size WebP 85', jpeg80: 'D · JPEG 80' };
const descriptions = {
  jpeg80: 'D keeps the original source dimensions and uses JPEG quality 80. Compare ringing around dark handwriting, small blocks and changes in the paper grain.',
  webp85: 'A keeps the original source dimensions and uses WebP quality 85. Compare paper grain and fine handwriting.',
  webp65: 'B keeps the original source dimensions and uses WebP quality 65. Compare faint strokes, white space around ink and paper texture.',
  'webp-small': 'C halves each source’s width and height, then uses WebP quality 85. The paper is still rendered at the same size. Compare small letters and diagram labels.',
};
const names = ['Paper stock', 'Handwriting atlas 1', 'Handwriting atlas 2', 'Passages and diagrams'];
const bytes = value => value >= 1000000 ? `${(value / 1000000).toFixed(2)} MB` : `${(value / 1000).toFixed(1)} kB`;
const saving = (value, baseline) => `${((1 - value / baseline) * 100).toFixed(1)}% smaller`;
const images = new Map();
let records, selected = 0, token = 0;

function image(file) {
  if (!images.has(file)) images.set(file, (async () => {
    const img = new Image(); img.src = file; await img.decode(); return img;
  })().catch(error => { images.delete(file); throw error; }));
  return images.get(file);
}

async function surface(method, index) {
  const files = records.map(row => method ? row.variants.find(item => item.id === method).file : row.file);
  const [stock, first, second, annotations] = await Promise.all(files.map(image));
  const record = NOTEBOOK_RECORDS[index];
  return scrapTexture(stock, index < 20 ? first : second, index, 64 + index % 5 * 3,
    record.ratio, 6301 + index * 137, record.family, annotations);
}

function paint(id, source) {
  const canvas = $(id); canvas.width = source.width; canvas.height = source.height;
  canvas.getContext('2d').drawImage(source, 0, 0);
}

async function update() {
  const current = ++token, method = $('#method').value, index = selected;
  $('.pair').setAttribute('aria-busy', 'true'); $('#status').textContent = 'Loading comparison…';
  document.querySelectorAll('[data-sample]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.sample) === index)));
  try {
    const [before, after] = await Promise.all([surface(null, index), surface(method, index)]);
    if (current !== token) return;
    paint('#before', before); paint('#after', after);
    const baseline = records.reduce((sum, row) => sum + row.bytes, 0);
    const candidate = records.reduce((sum, row) => sum + row.variants.find(item => item.id === method).bytes, 0);
    $('#before-size').textContent = `${bytes(baseline)} shared source download`;
    $('#after-title').textContent = `After · ${labels[method]}`;
    $('#after-size').textContent = `${bytes(candidate)} shared source download · ${saving(candidate, baseline)}`;
    $('#description').textContent = descriptions[method];
    $('#total').textContent = `All 40 scraps: ${bytes(baseline)} → ${bytes(candidate)} · ${saving(candidate, baseline)}`;
    $('#status').textContent = '';
  } catch {
    if (current === token) $('#status').textContent = 'The comparison could not load. Choose the paper or compression option again to retry.';
  } finally { if (current === token) $('.pair').setAttribute('aria-busy', 'false'); }
}

function sizeCell(item, baseline) {
  const cell = document.createElement('td'), link = document.createElement('a'), dimensions = document.createElement('small');
  link.href = item.file; link.target = '_blank'; link.rel = 'noopener';
  link.textContent = bytes(item.bytes) + (baseline ? ` · ${saving(item.bytes, baseline)}` : '');
  dimensions.textContent = `${item.width} × ${item.height}`; cell.append(link, dimensions); return cell;
}

function table() {
  records.forEach((row, index) => {
    const tr = document.createElement('tr'), name = document.createElement('th'); name.scope = 'row'; name.textContent = names[index];
    tr.append(name, sizeCell(row), ...row.variants.map(item => sizeCell(item, row.bytes))); $('#sizes').append(tr);
  });
  const baseline = records.reduce((sum, row) => sum + row.bytes, 0), tr = document.createElement('tr');
  const totals = ['All shared textures', bytes(baseline), ...Object.keys(labels).map(id => {
    const total = records.reduce((sum, row) => sum + row.variants.find(item => item.id === id).bytes, 0);
    return `${bytes(total)} · ${saving(total, baseline)}`;
  })];
  totals.forEach(text => { const td = document.createElement('td'); td.textContent = text; tr.append(td); }); $('#totals').append(tr);
}

function bindControls() {
  $('.samples').addEventListener('click', event => {
    const button = event.target.closest('[data-sample]'); if (!button) return;
    selected = Number(button.dataset.sample); update();
  });
  $('#method').addEventListener('change', update);
  $('.modes').addEventListener('click', event => {
    const button = event.target.closest('[data-mode]'); if (!button) return;
    $('.pair').dataset.mode = button.dataset.mode;
    document.querySelectorAll('.modes button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    document.querySelectorAll('.image-window').forEach(item => { item.scrollTop = 0; item.scrollLeft = 0; });
  });
  const windows = [...document.querySelectorAll('.image-window')];
  windows.forEach((item, index) => item.addEventListener('scroll', () => {
    const other = windows[1 - index];
    if (other.scrollTop !== item.scrollTop) other.scrollTop = item.scrollTop;
    if (other.scrollLeft !== item.scrollLeft) other.scrollLeft = item.scrollLeft;
  }));
}

fetch('results.json').then(response => { if (!response.ok) throw Error(); return response.json(); })
  .then(data => { records = data; table(); bindControls(); return update(); })
  .catch(() => { $('#status').textContent = 'The comparison files could not load. Refresh to try again.'; });
