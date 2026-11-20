const motions = new WeakMap();

export function bindDisclosures() {
  document.addEventListener('click', async event => {
    const summary = event.target.closest('summary'); if (!summary) return;
    const details = summary.parentElement; if (details.tagName !== 'DETAILS') return;
    event.preventDefault();
    const previous = motions.get(details), opening = !details.open || previous?.closing;
    const from = details.getBoundingClientRect().height;
    previous?.animation.cancel();
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { details.open = opening; return; }
    details.open = true; details.style.overflow = 'hidden';
    const to = opening ? details.getBoundingClientRect().height : summary.getBoundingClientRect().height + 1;
    const animation = details.animate([{ height: `${from}px` }, { height: `${to}px` }],
      { duration: 220, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'both' });
    const motion = { animation, closing: !opening }; motions.set(details, motion);
    await animation.finished.catch(() => {});
    if (motions.get(details) !== motion) return;
    if (!opening) details.open = false;
    animation.cancel(); details.style.overflow = ''; motions.delete(details);
  });
}
