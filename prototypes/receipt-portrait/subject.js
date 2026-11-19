const PACKAGE = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.2.3';
const MODEL = 'https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/1/selfie_segmenter.tflite';

export class Subject {
  constructor(status) {
    this.status = status; this.model = null; this.loading = null;
    this.masked = false; this.framing = false; this.crop = null; this.last = -1;
    this.input = document.createElement('canvas'); this.input.width = 256; this.input.height = 192;
    this.mask = document.createElement('canvas');
    this.output = document.createElement('canvas');
  }

  async configure(masked, framing) {
    this.masked = masked; this.framing = framing; this.crop = null;
    if (!masked && !framing) { this.status.textContent = 'Person detection off.'; return; }
    if (this.model) { this.status.textContent = 'Person detection ready. Applies to camera prints.'; return; }
    this.status.textContent = 'Loading person detection…';
    if (!this.loading) this.loading = this.load().finally(() => { this.loading = null; });
    await this.loading;
    this.status.textContent = this.masked || this.framing ? 'Person detection ready. Applies to camera prints.' : 'Person detection off.';
  }

  async load() {
    const { FilesetResolver, ImageSegmenter } = await import(`${PACKAGE}/vision_bundle.mjs`);
    const vision = await FilesetResolver.forVisionTasks(`${PACKAGE}/wasm`);
    this.model = await ImageSegmenter.createFromOptions(vision, {
      baseOptions: { modelAssetPath: MODEL, delegate: 'CPU' }, runningMode: 'VIDEO',
      outputConfidenceMasks: true, outputCategoryMask: false,
    });
  }

  reset() { this.crop = null; this.last = -1; }

  prepare(video, time) {
    if (!this.masked && !this.framing) return { source: video };
    if (!this.model) return null;
    const ctx = this.input.getContext('2d'); ctx.drawImage(video, 0, 0, 256, 192);
    // Inference and masking use the same frozen frame, before mirroring or cropping.
    this.model.segmentForVideo(this.input, Math.max(time, this.last + 1), result => {
      this.last = Math.max(time, this.last + 1);
      const mask = result.confidenceMasks[0];
      this.updateMask(mask.getAsFloat32Array(), mask.width, mask.height);
    });
    const out = this.output.getContext('2d');
    out.clearRect(0, 0, 256, 192); out.drawImage(this.input, 0, 0);
    if (this.masked) {
      out.globalCompositeOperation = 'destination-in';
      out.drawImage(this.mask, 0, 0, 256, 192); out.globalCompositeOperation = 'source-over';
    }
    return { source: this.output, crop: this.framing ? this.crop : null };
  }

  updateMask(values, width, height) {
    this.mask.width = width; this.mask.height = height;
    this.output.width = 256; this.output.height = 192;
    const data = new ImageData(width, height); let left = width, right = 0, top = height, bottom = 0, count = 0;
    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
      const i = y * width + x, confidence = values[i];
      const a = Math.max(0, Math.min(1, (confidence - .25) / .5));
      data.data[i * 4 + 3] = 255 * a * a * (3 - 2 * a);
      if (confidence > .65) { left = Math.min(left, x); right = Math.max(right, x); top = Math.min(top, y); bottom = Math.max(bottom, y); count++; }
    }
    this.mask.getContext('2d').putImageData(data, 0, 0);
    if (count < width * height * .015) return; // Hold framing briefly rather than chase an empty frame.
    const target = { x: (left + right) / (2 * width), y: (top + bottom) / (2 * height),
      height: Math.max(.7, Math.min(1, (bottom - top) / height * 1.2)) };
    if (!this.crop) this.crop = target;
    else for (const key of ['x', 'y', 'height']) this.crop[key] += (target[key] - this.crop[key]) * .14;
  }
}
