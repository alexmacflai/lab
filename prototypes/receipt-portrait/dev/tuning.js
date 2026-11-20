import { SETTINGS } from './settings.js';
import { paperType } from '../paper-types.js';

const $ = id => document.getElementById(id);
const fields = {
  image: { resolution: 'print-resolution', gamma: 'image-gamma', brightness: 'image-brightness', aspect: 'print-aspect', size: 'print-size' },
  timing: { fps: 'fps', delay: 'delay', jitter: 'jitter' },
};

export class TuningControls {
  constructor(player, changed) {
    this.player = player; this.changed = changed;
    this.values = structuredClone(SETTINGS); this.mode = 'global';
    this.upgradeOverrides();
    player.hooks.configure = () => this.apply();
    $('tuning-mode').addEventListener('change', event => {
      this.mode = event.target.value; this.sync(true);
    });
    for (const [section, controls] of Object.entries(fields)) this.bindSection(section, controls);
    $('save-tuning').addEventListener('click', () => this.save());
    $('copy-tuning').addEventListener('click', () => this.copy());
    this.apply(); this.sync(true); player.draw(true);
  }

  key() {
    return this.player.papers[this.player.index].paperType || 'receipts';
  }

  variant() {
    return this.values.variants[this.key()] ||= {};
  }

  upgradeOverrides() {
    for (const variant of Object.values(this.values.variants)) {
      for (const [section, override] of Object.entries(variant)) {
        if (typeof override.enabled === 'boolean') {
          override.enabled = Object.fromEntries(Object.keys(fields[section]).map(key => [key, override.enabled]));
        }
      }
    }
  }

  effective(section) {
    const override = this.values.variants[this.key()]?.[section];
    return Object.fromEntries(Object.entries(this.values.global[section]).map(([key, value]) =>
      [key, override?.enabled[key] ? override.values[key] : value]));
  }

  editing(section) {
    if (this.mode === 'global') return this.values.global[section];
    const variant = this.variant();
    variant[section] ||= { enabled: {}, values: structuredClone(this.values.global[section]) };
    return variant[section].values;
  }

  bindSection(section, controls) {
    for (const [key, id] of Object.entries(controls)) {
      const checkbox = $(`specific-${id}`);
      const label = document.querySelector(`label[for="${id}"]`).firstChild.textContent.trim();
      const name = { fps: 'frame rate', delay: 'delay' }[key] || label.toLowerCase();
      checkbox.title = `Override global ${name} for this paper type`;
      checkbox.setAttribute('aria-label', checkbox.title);
      checkbox.addEventListener('change', event => {
        this.editing(section);
        this.variant()[section].enabled[key] = event.target.checked; this.refresh();
      });
      $(id).addEventListener('input', event => {
        this.editing(section)[key] = Number(event.target.value); this.refresh();
      });
    }
  }

  apply(renderer = this.player.renderer) {
    const image = this.effective('image');
    renderer.imageSize = [image.resolution, Math.round(image.resolution / image.aspect)];
    renderer.imageGamma = image.gamma; renderer.imageBrightness = image.brightness;
    renderer.printSize = [image.size, image.size / image.aspect];
    if (renderer === this.player.renderer) Object.assign(this.player.settings, this.effective('timing'));
  }

  refresh() {
    this.apply(); this.sync(true); this.player.draw(true); this.changed();
    $('tuning-status').textContent = 'Unsaved changes.';
  }

  sync(force = false) {
    const signature = `${this.key()}/${this.mode}`;
    if (!force && this.signature === signature) return;
    this.signature = signature;
    $('tuning-target').textContent = this.mode === 'global' ? 'Editing shared defaults for every paper.' : `Editing all ${paperType(this.key()).label.toLowerCase()}.`;
    for (const [section, controls] of Object.entries(fields)) {
      const variant = this.values.variants[this.key()]?.[section];
      const values = this.mode === 'global' ? this.values.global[section] : variant?.values || this.values.global[section];
      for (const [key, id] of Object.entries(controls)) {
        const specific = $(`specific-${id}`);
        specific.checked = Boolean(variant?.enabled[key]); specific.hidden = this.mode === 'global';
        $(id).value = values[key];
      }
    }
    const image = this.mode === 'global' ? this.values.global.image : this.values.variants[this.key()]?.image?.values || this.values.global.image;
    $('print-resolution-value').textContent = `${image.resolution} × ${Math.round(image.resolution / image.aspect)}`;
    $('image-gamma-value').textContent = image.gamma.toFixed(2);
    $('image-brightness-value').textContent = `${Math.round(image.brightness * 100)}%`;
    $('print-size-value').textContent = `${Math.round(image.size * 100)}%`;
  }

  source() {
    return `// Saved by the local development server. Camera images are never included.\nexport const SETTINGS = ${JSON.stringify(this.values, null, 2)};\n`;
  }

  async save() {
    const button = $('save-tuning'); button.disabled = true;
    try {
      const response = await fetch('/__receipt-settings', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(this.values),
      });
      if (!response.ok) throw new Error('Save failed');
      $('tuning-status').textContent = 'Saved to dev/settings.js in the project.';
    } catch {
      $('tuning-status').textContent = 'Could not save. Run python3 tools/receipt-dev-server.py and open its URL, then try again. Copy values is also available.';
    } finally { button.disabled = false; }
  }

  async copy() {
    try { await navigator.clipboard.writeText(this.source()); $('tuning-status').textContent = 'Settings code copied.'; }
    catch { $('tuning-status').textContent = 'Clipboard access was blocked. Allow clipboard access and try again.'; }
  }
}
