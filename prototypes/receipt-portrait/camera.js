export class Camera {
  constructor(button, status, onChange) {
    this.button = button; this.status = status; this.onChange = onChange;
    this.video = document.createElement('video');
    this.video.muted = true; this.video.playsInline = true;
    this.stream = null; this.pending = false; this.generation = 0;
    button.addEventListener('click', () => this.stream || this.pending ? this.stop() : this.start());
    window.addEventListener('pagehide', () => this.stop());
  }

  stop() {
    this.generation++; this.pending = false;
    this.stream?.getTracks().forEach(track => track.stop());
    this.stream = null; this.video.srcObject = null;
    this.button.textContent = 'Start camera'; this.button.disabled = false;
    this.status.textContent = 'The last impression stays.';
    this.onChange(false);
  }

  async start() {
    if (!navigator.mediaDevices?.getUserMedia) {
      this.status.textContent = 'Open on localhost or HTTPS to use your camera.'; return;
    }
    const attempt = ++this.generation;
    this.pending = true; this.button.textContent = 'Cancel';
    this.status.textContent = 'Waiting for your camera…';
    try {
      const next = await navigator.mediaDevices.getUserMedia({ audio: false,
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } } });
      if (attempt !== this.generation) { next.getTracks().forEach(track => track.stop()); return; }
      this.stream = next; this.video.srcObject = next; await this.video.play();
      if (attempt !== this.generation) return;
      next.getVideoTracks()[0].addEventListener('ended', () => this.stop(), { once: true });
      this.pending = false; this.button.textContent = 'Stop camera';
      this.status.textContent = 'Making your first impression…'; this.onChange(true);
    } catch (error) {
      if (attempt !== this.generation) return;
      this.stop();
      this.status.textContent = error.name === 'NotAllowedError'
        ? 'Camera access is off. Allow it in your browser, then try again.'
        : 'Your camera is unavailable. Check it is connected and try again.';
    }
  }
}
