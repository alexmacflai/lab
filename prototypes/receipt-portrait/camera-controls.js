const $ = selector => document.querySelector(selector);
const wide = matchMedia('(min-width: 700px) and (min-height: 480px)');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let drawer, opener, animation, transition = 0, layout = 0;

async function openDrawer() {
  if (drawer.open && drawer.dataset.motion !== 'closing') return;
  const token = ++transition;
  const from = drawer.open ? { transform: getComputedStyle(drawer).transform }
    : { transform: 'translateY(calc(100% + 32px))' };
  animation?.cancel();
  if (!drawer.open) { drawer.dataset.motion = 'closed'; drawer.showModal(); }
  opener.setAttribute('aria-expanded', 'true');
  getComputedStyle(drawer, '::backdrop').opacity;
  requestAnimationFrame(() => { if (token === transition) drawer.dataset.motion = 'open'; });
  animation = drawer.animate([from, { transform: 'translateY(0)' }], {
    duration: reduced.matches ? 0 : 320, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'both',
  });
  await animation.finished.catch(() => {});
  if (token === transition) { animation.cancel(); animation = null; }
}

async function closeDrawer(restoreFocus = true) {
  if (!drawer.open) return;
  const token = ++transition;
  const from = { transform: getComputedStyle(drawer).transform };
  animation?.cancel(); drawer.dataset.motion = 'closing';
  animation = drawer.animate([from, { transform: 'translateY(calc(100% + 32px))' }], {
    duration: reduced.matches ? 0 : 240, easing: 'cubic-bezier(.4,0,1,1)', fill: 'both',
  });
  await animation.finished.catch(() => {});
  if (token !== transition) return;
  drawer.close(); animation.cancel(); animation = null;
  drawer.dataset.motion = 'closed'; opener.setAttribute('aria-expanded', 'false');
  if (restoreFocus && !wide.matches) opener.focus(); else $('#start').focus();
}

async function adaptLayout() {
  const token = ++layout, focus = document.activeElement;
  if (drawer.open) await closeDrawer(false);
  if (token !== layout) return;
  const options = [$('#auto-frame'), $('#subject-mask'), $('#back-camera')];
  (wide.matches ? $('#inline-options') : $('#drawer-options')).append(...options);
  if (options.includes(focus)) (wide.matches ? focus.id === 'back-camera' ? $('#start') : focus : opener).focus();
  if (wide.matches) for (const option of options) option.animate([{ transform: 'translateY(4px)' }, { transform: 'translateY(0)' }], { duration: reduced.matches ? 0 : 160 });
}

export function bindCameraControls(onChange) {
  drawer = $('#settings'); opener = $('#open-settings');
  opener.addEventListener('click', openDrawer);
  $('#close-settings').addEventListener('click', () => closeDrawer());
  drawer.addEventListener('cancel', event => { event.preventDefault(); closeDrawer(); });
  drawer.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const buttons = [...drawer.querySelectorAll('button:not(:disabled)')];
    if (event.shiftKey && document.activeElement === buttons[0]) { event.preventDefault(); buttons.at(-1).focus(); }
    else if (!event.shiftKey && document.activeElement === buttons.at(-1)) { event.preventDefault(); buttons[0].focus(); }
  });
  drawer.addEventListener('click', event => {
    const rect = drawer.getBoundingClientRect();
    if (event.target === drawer && (event.clientY < rect.top || event.clientX < rect.left || event.clientX > rect.right)) closeDrawer();
  });
  for (const id of ['auto-frame', 'subject-mask', 'back-camera']) $(`#${id}`).addEventListener('click', () => {
    const button = $(`#${id}`); button.setAttribute('aria-checked', String(button.getAttribute('aria-checked') !== 'true')); onChange(id);
  });
  wide.addEventListener('change', adaptLayout); adaptLayout();
}
