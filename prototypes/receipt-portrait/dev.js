import { ReceiptPlayer } from './player.js';
import { ReceiptGallery } from './gallery.js';

const $ = selector => document.querySelector(selector);
let player, gallery;

function update(p) {
  $('#counter').textContent = `${String(p.index + 1).padStart(3, '0')} / ${p.papers.length}`;
  $('#receipt-name').textContent = p.papers[p.index].name;
  $('#play').textContent = p.loop ? 'Pause proof' : 'Play proof';
  gallery?.highlight(p.index);
  $('#values').textContent = `${p.settings.fps} fps · ${p.settings.delay} ms delay\n${p.queue.length} frames buffered\n${p.papers[p.index].id}\n${p.papers[p.index].condition} · ${p.papers[p.index].folds.length} folds\nMark: ${p.papers[p.index].mark || 'none'}\n${p.canvas.width} × ${p.canvas.height} display pixels`;
}

function select(index) {
  player.select(index);
  const page = Math.floor(player.index / gallery.size);
  if (gallery.page !== page) gallery.show(page, player.index);
}

function bindControls() {
  $('#previous').addEventListener('click', () => select(player.index - 1));
  $('#next').addEventListener('click', () => select(player.index + 1));
  $('#play').addEventListener('click', () => player.toggleProof());
  for (const id of ['subject-mask', 'auto-frame']) $(`#${id}`).addEventListener('change', () => {
    player.configureSubject($('#subject-mask').checked, $('#auto-frame').checked);
  });
  for (const id of ['sample', 'zoom', 'surface']) $(`#${id}`).addEventListener('change', () => {
    if (id === 'sample') {
      player.printed = null; player.hold = null; player.sampleOn = $('#sample').checked;
      $('#status').textContent = player.sampleOn ? 'Sample print · camera off.' : 'Camera off.';
    }
    player.zoom = $('#zoom').checked; player.inspect = Number($('#surface').value); player.draw(true);
  });
  $('#background').addEventListener('change', event => { $('.stage').dataset.background = event.target.value; });
  for (const key of Object.keys(player.settings)) $(`#${key}`).addEventListener('input', event => {
    player.settings[key] = Number(event.target.value); player.draw(true);
  });
  document.addEventListener('keydown', event => {
    if (['INPUT', 'SELECT', 'TEXTAREA'].includes(event.target.tagName)) return;
    if (event.key.toLowerCase() === 'd') $('#debug').hidden = !$('#debug').hidden;
    if (event.key === 'ArrowRight') { event.preventDefault(); select(player.index + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); select(player.index - 1); }
  });
}

async function initialise() {
  try {
    player = new ReceiptPlayer($('#portrait'), { draw: update,
      camera: active => { $('#sample').disabled = active; if (active) $('#sample').checked = false; },
      subjectError: message => {
        $('#subject-mask').checked = false; $('#auto-frame').checked = false;
        $('#subject-status').textContent = message;
      },
      error: message => { $('#start').disabled = true; $('#status').textContent = message; },
    });
    await player.load();
    gallery = new ReceiptGallery(player.papers, player.sample, select); gallery.show(0, 0);
    player.attachCamera($('#start'), $('#status'), $('#subject-status'));
    $('#start').disabled = false; $('#start').textContent = 'Start camera'; bindControls();
  } catch (error) {
    $('#start').textContent = 'Preview unavailable';
    $('#status').textContent = 'The proof could not load. It needs WebGL 2 and its image assets. Refresh to try again.';
    console.error(error);
  }
}
initialise();
