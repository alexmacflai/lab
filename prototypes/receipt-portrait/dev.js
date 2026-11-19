import { ReceiptPlayer } from './player.js';
import { ReceiptGallery } from './gallery.js';
import { PrintRenderer } from './print-material/renderer.js';
import { PrintProof } from './dev/print-proof/panel.js';

const $ = selector => document.querySelector(selector);
let player, gallery, proof;

function update(p) {
  $('#counter').textContent = `${String(p.index + 1).padStart(3, '0')} / ${p.papers.length}`;
  $('#receipt-name').textContent = p.papers[p.index].name;
  $('#play').textContent = p.loop ? 'Pause proof' : 'Play proof';
  gallery?.highlight(p.index);
  proof?.sync(p);
  $('#values').textContent = `${p.settings.fps} fps · ${p.settings.delay} ms delay\n${p.queue.length} frames buffered\n${p.papers[p.index].id}\n${p.papers[p.index].condition} · ${p.papers[p.index].folds.length} folds\nMark: ${p.papers[p.index].mark || 'none'}\n${p.canvas.width} × ${p.canvas.height} display pixels`;
}

function select(index) {
  player.select(index);
  const page = Math.floor(player.index / gallery.size);
  if (gallery.page !== page) gallery.show(page, player.index);
}

function bindImageControls() {
  const refresh = () => {
    const width = Number($('#print-resolution').value), gamma = Number($('#image-gamma').value);
    const size = [width,Math.round(width*1.25)];
    $('#print-resolution-value').textContent = `${size[0]} × ${size[1]}`;
    $('#image-gamma-value').textContent = gamma.toFixed(2);
    for (const renderer of [player.renderer,proof.renderer]) {
      renderer.imageSize = size; renderer.imageGamma = gamma;
    }
    player.draw(true); proof.rebuild();
  };
  for (const id of ['print-resolution','image-gamma']) $(`#${id}`).addEventListener('input',refresh);
}

function bindControls() {
  $('#previous').addEventListener('click', () => select(player.index - 1));
  $('#next').addEventListener('click', () => select(player.index + 1));
  $('#play').addEventListener('click', () => player.toggleProof());
  $('#back-camera').addEventListener('change', async () => {
    await player.camera.setFacing($('#back-camera').checked ? 'environment' : 'user');
    $('#back-camera').checked = player.camera.facing === 'environment';
  });
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
    player = new ReceiptPlayer($('#portrait'), { draw: update, Renderer: PrintRenderer,
      camera: active => {
        $('#sample').disabled = active; if (active) $('#sample').checked = false;
        $('#back-camera').checked = player.camera?.facing === 'environment';
      },
      subjectError: message => {
        $('#subject-mask').checked = false; $('#auto-frame').checked = false;
        $('#subject-status').textContent = message;
      },
      error: message => { $('#start').disabled = true; $('#status').textContent = message; },
    });
    await player.load();
    gallery = new ReceiptGallery(player.papers, player.sample, select); gallery.show(Math.floor(player.index / gallery.size), player.index);
    player.attachCamera($('#start'), $('#status'), $('#subject-status'));
    $('#start').disabled = false; $('#start').textContent = 'Start camera'; bindControls();
    proof = new PrintProof(player); bindImageControls();
  } catch (error) {
    $('#start').textContent = 'Preview unavailable';
    $('#status').textContent = 'The proof could not load. It needs WebGL 2 and its image assets. Refresh to try again.';
    console.error(error);
  }
}
initialise();
