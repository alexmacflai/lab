import { loadPaper } from './paper.js';
import { PaperRenderer } from './renderer.js';
import { capturePrint } from './print.js';
import { samplePrint } from './sample.js';
import { Camera } from './camera.js';
import { Subject } from './subject.js';

const random = amount => (Math.random() - .5) * amount;

export class ReceiptPlayer {
  constructor(canvas, hooks = {}, fit = false) {
    this.canvas = canvas; this.hooks = hooks; this.fit = fit;
    this.settings = { fps: 12, delay: 500, jitter: 1 };
    this.index = 0; this.sequence = 0; this.loop = false; this.active = false;
    this.queue = []; this.printed = null; this.last = 0; this.sampleOn = true;
    this.zoom = false; this.inspect = 0; this.hold = null;
  }

  async load() {
    [this.papers, this.sample] = await Promise.all([loadPaper(), samplePrint()]);
    this.renderer = new PaperRenderer(this.canvas, this.papers); this.renderer.resize(this.fit);
    new ResizeObserver(() => { this.renderer?.resize(this.fit); this.draw(true); }).observe(this.canvas);
    this.canvas.addEventListener('webglcontextlost', event => {
      event.preventDefault(); this.camera?.stop(); this.loop = false; this.renderer = null;
      this.hooks.error?.('The graphics context was lost. Refresh to try again.');
    });
    document.addEventListener('visibilitychange', () => { this.queue = []; this.last = 0; });
    this.draw(true); this.tick = this.tick.bind(this); requestAnimationFrame(this.tick);
  }

  attachCamera(button, status, subjectStatus) {
    this.status = status; this.subject = new Subject(subjectStatus);
    this.camera = new Camera(button, status, active => {
      this.active = active; this.queue = []; this.loop = false; this.subject.reset();
      if (active) {
        this.hold = this.printed || (this.sampleOn ? this.sample : null);
        this.printed = null; this.sampleOn = false;
        this.configureSubject(this.subject.masked, this.subject.framing);
      }
      this.hooks.camera?.(active); this.draw(true);
    });
    button.addEventListener('click', () => {
      if (this.camera.pending) { this.loop = false; this.draw(true); }
    });
  }

  async configureSubject(masked, framing) {
    if (!this.subject) return;
    if (!this.active) { this.subject.masked = masked; this.subject.framing = framing; return; }
    this.hold = this.printed || this.hold; this.queue = []; this.printed = null; this.loop = false;
    try { await this.subject.configure(masked, framing); }
    catch { this.subjectFailed('Person detection could not load. Check your connection and try again.'); }
    this.draw(true);
  }

  subjectFailed(message) {
    this.subject.masked = false; this.subject.framing = false; this.queue = [];
    this.hooks.subjectError?.(message);
  }

  capture(time) {
    try {
      const frame = this.subject.prepare(this.camera.video, time);
      if (frame) this.queue.push({ at: time, image: capturePrint(frame.source, this.sequence, frame.crop) });
    } catch { this.subjectFailed('Person detection stopped. The full camera frame is still available.'); }
    const first = !this.printed;
    while (this.queue.length && time - this.queue[0].at >= this.settings.delay) this.printed = this.queue.shift().image;
    if (first && this.printed) { this.loop = true; this.hold = null; }
    if (this.printed) this.status.textContent = 'You, a moment ago.';
  }

  tick(time) {
    requestAnimationFrame(this.tick);
    if (!this.renderer || document.hidden || time - this.last < 1000 / this.settings.fps) return;
    this.last = time - (time - this.last) % (1000 / this.settings.fps);
    if (!this.active && !this.loop) return;
    if (this.active && this.camera.video.readyState >= 2) this.capture(time);
    this.sequence++;
    if (this.loop) this.index = (this.index + 1) % this.papers.length;
    this.draw();
  }

  draw(still = false) {
    if (!this.renderer) return;
    const amount = still || !this.loop ? 0 : this.settings.jitter;
    this.renderer.draw(this.index, this.printed || this.hold || (this.sampleOn ? this.sample : null), {
      pose: [random(.019125) * amount, random(.023375) * amount, random(.019125) * amount],
      printPose: [random(.0275) * amount, random(.035) * amount, random(.0275) * amount],
      zoom: this.zoom, inspect: this.inspect, fit: this.fit,
    });
    this.hooks.draw?.(this);
  }

  select(index) {
    this.index = (index + this.papers.length) % this.papers.length;
    this.loop = false; this.draw(true);
  }

  toggleProof() {
    if (this.camera?.pending || (this.active && !this.printed)) return;
    this.loop = !this.loop; this.draw(true);
  }
}
