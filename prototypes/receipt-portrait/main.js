import { ReceiptPlayer } from './player.js';
import { PrintRenderer } from './print-material/renderer.js';
import { bindCameraControls } from './camera-controls.js';

const $ = selector => document.querySelector(selector);
const start = $('#start'), status = $('#status');
let player, noticeAnimation, noticeToken = 0;
const enabled = id => $(`#${id}`).getAttribute('aria-checked') === 'true';

function showError(message) {
  const notice = $('#notice'); noticeToken++;
  const opacity = notice.hidden ? 0 : getComputedStyle(notice).opacity;
  noticeAnimation?.cancel(); notice.textContent = message; notice.hidden = false;
  noticeAnimation = notice.animate([{ opacity }, { opacity: 1 }], { duration: 180, easing: 'ease-out' });
}

async function hideError() {
  const notice = $('#notice'); if (notice.hidden) return;
  const token = ++noticeToken, opacity = getComputedStyle(notice).opacity;
  noticeAnimation?.cancel();
  noticeAnimation = notice.animate([{ opacity }, { opacity: 0 }], { duration: 140, fill: 'both' });
  await noticeAnimation.finished.catch(() => {});
  if (token === noticeToken) { notice.hidden = true; noticeAnimation.cancel(); }
}

async function configureControl(id) {
  if (id !== 'back-camera') return player?.configureSubject(enabled('subject-mask'), enabled('auto-frame'));
  if (!player?.camera) return;
  await player.camera.setFacing(enabled(id) ? 'environment' : 'user');
  $('#back-camera').setAttribute('aria-checked', String(player.camera.facing === 'environment'));
}

async function initialise() {
  bindCameraControls(configureControl);
  try {
    player = new ReceiptPlayer($('#portrait'), {
      Renderer: PrintRenderer,
      draw: p => { start.setAttribute('aria-busy', String(p.active && !p.printed)); },
      camera: active => {
        start.dataset.active = String(active); if (active) hideError();
        $('#back-camera').setAttribute('aria-checked', String(player.camera?.facing === 'environment'));
      },
      subjectError: message => {
        $('#auto-frame').setAttribute('aria-checked', 'false'); $('#subject-mask').setAttribute('aria-checked', 'false');
        showError(message);
      },
      error: message => { start.disabled = true; showError(message); },
    }, true);
    await player.load(); player.attachCamera(start, status, $('#subject-status'));
    player.camera.setFacing(enabled('back-camera') ? 'environment' : 'user');
    start.addEventListener('click', () => { start.dataset.active = String(player.active || player.camera.pending); });
    player.configureSubject(enabled('subject-mask'), enabled('auto-frame'));
    start.disabled = false; start.textContent = 'Start camera'; status.textContent = 'Camera off.';
    new MutationObserver(() => {
      if (/access is off|unavailable|HTTPS/.test(status.textContent)) showError(status.textContent);
    }).observe(status, { childList: true });
  } catch (error) {
    start.textContent = 'Unavailable'; showError('The receipt could not load. Refresh to try again.'); console.error(error);
  }
}
initialise();
