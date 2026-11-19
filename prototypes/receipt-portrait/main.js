import { loadPaper } from './paper.js';
import { PaperRenderer } from './renderer.js';
import { capturePrint } from './print.js';
import { samplePrint } from './sample.js';
import { Camera } from './camera.js';
import { Subject } from './subject.js';
import { ReceiptGallery } from './gallery.js';

const $ = selector => document.querySelector(selector);
const canvas = $('#portrait'), status = $('#status'), start = $('#start');
const settings = { fps: 12, delay: 500, jitter: 1 };
const state = { index: 0, sequence: 0, loop: false, queue: [], printed: null, last: 0, camera: false };
let renderer, papers, camera, gallery, subject, sample;
const random = amount => (Math.random() - .5) * amount;

function options(still = false) {
  const amount = still || !state.loop ? 0 : settings.jitter;
  return {
    pose: [random(.018) * amount, random(.022) * amount, random(.018) * amount],
    printPose: [random(.022) * amount, random(.028) * amount, random(.022) * amount],
    zoom: $('#zoom').checked, inspect: Number($('#surface').value),
  };
}

function draw(still = false) {
  if (!renderer) return;
  const ink = state.printed || ($('#sample').checked ? sample : null);
  renderer.draw(state.index, ink, options(still));
  $('#counter').textContent = `${String(state.index + 1).padStart(3, '0')} / ${papers.length}`;
  $('#receipt-name').textContent = papers[state.index].name;
  gallery?.highlight(state.index);
  $('#values').textContent = `${settings.fps} fps · ${settings.delay} ms delay\n${state.queue.length} frames buffered\n${papers[state.index].id}\n${papers[state.index].condition} · ${papers[state.index].folds.length} folds\nMark: ${papers[state.index].mark || 'none'}\n${canvas.width} × ${canvas.height} display pixels`;
}

function select(index) {
  state.index = (index + papers.length) % papers.length; state.loop = false; updatePlay();
  if (gallery && gallery.page !== Math.floor(state.index / gallery.size)) gallery.show(Math.floor(state.index / gallery.size), state.index);
  draw(true);
}

function updatePlay() { $('#play').textContent = state.loop ? 'Pause proof' : 'Play proof'; }

function cameraChanged(active) {
  state.camera = active; state.queue = []; subject.reset();
  $('#sample').disabled = active;
  state.loop = false;
  if (active) { state.printed = null; $('#sample').checked = false; }
  updatePlay(); draw();
}

function tick(time) {
  requestAnimationFrame(tick);
  if (!renderer || document.hidden || time - state.last < 1000 / settings.fps) return;
  state.last = time - (time - state.last) % (1000 / settings.fps);
  if (!state.camera && !state.loop) return;
  if (state.camera && camera.video.readyState >= 2) {
    try {
      const frame = subject.prepare(camera.video, time);
      if (frame) state.queue.push({ at: time, image: capturePrint(frame.source, state.sequence, frame.crop) });
    } catch (error) {
      $('#subject-mask').checked = false; $('#auto-frame').checked = false;
      subject.masked = false; subject.framing = false; state.queue = [];
      $('#subject-status').textContent = 'Person detection stopped. The full camera frame is still available.';
      console.error(error);
    }
    const firstPrint = !state.printed;
    while (state.queue.length && time - state.queue[0].at >= settings.delay) state.printed = state.queue.shift().image;
    if (firstPrint && state.printed) { state.loop = true; updatePlay(); }
    if (state.printed) status.textContent = 'You, a moment ago.';
  }
  state.sequence++;
  if (state.loop) state.index = (state.index + 1) % papers.length;
  draw();
}


function bindControls() {
  for (const id of ['subject-mask', 'auto-frame']) $(`#${id}`).addEventListener('change', async () => {
    state.queue = []; state.printed = null;
    try {
      await subject.configure($('#subject-mask').checked, $('#auto-frame').checked);
    } catch {
      $('#subject-mask').checked = false; $('#auto-frame').checked = false;
      subject.masked = false; subject.framing = false;
      $('#subject-status').textContent = 'Person detection could not load. Check your connection and try again.';
    }
  });
  $('#previous').addEventListener('click', () => select(state.index - 1));
  $('#next').addEventListener('click', () => select(state.index + 1));
  $('#play').addEventListener('click', () => {
    if (state.camera && !state.printed) return;
    state.loop = !state.loop; updatePlay();
  });
  for (const id of ['sample', 'zoom', 'surface']) $( `#${id}`).addEventListener('change', () => {
    if (id === 'sample') {
      state.printed = null; status.textContent = $('#sample').checked ? 'Sample print · camera off.' : 'Camera off.';
    }
    draw(true);
  });
  $('#background').addEventListener('change', event => { $('.stage').dataset.background = event.target.value; });
  for (const key of Object.keys(settings)) $(`#${key}`).addEventListener('input', event => {
    settings[key] = Number(event.target.value); draw(true);
  });
  document.addEventListener('keydown', event => {
    if (['INPUT', 'SELECT', 'TEXTAREA'].includes(event.target.tagName)) return;
    if (event.key.toLowerCase() === 'd') $('#debug').hidden = !$('#debug').hidden;
    if (event.key === 'ArrowRight') { event.preventDefault(); select(state.index + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); select(state.index - 1); }
  });
  document.addEventListener('visibilitychange', () => { state.queue = []; state.last = 0; });
}

async function initialise() {
  try {
    [papers, sample] = await Promise.all([loadPaper(), samplePrint()]); renderer = new PaperRenderer(canvas, papers); renderer.resize();
    gallery = new ReceiptGallery(papers, sample, select); gallery.show(0, 0); draw(true);
    subject = new Subject($('#subject-status'));
    camera = new Camera(start, status, cameraChanged); start.disabled = false; start.textContent = 'Start camera';
    bindControls();
    new ResizeObserver(() => { renderer.resize(); draw(true); }).observe(canvas);
    canvas.addEventListener('webglcontextlost', event => {
      event.preventDefault(); camera.stop(); state.loop = false;
      start.disabled = true; renderer = null;
      status.textContent = 'The graphics context was lost. Refresh to try again.';
    });
    requestAnimationFrame(tick);
  } catch (error) {
    start.textContent = 'Preview unavailable';
    status.textContent = 'The proof could not load. It needs WebGL 2 and its image assets. Refresh to try again.';
    console.error(error);
  }
}
initialise();
