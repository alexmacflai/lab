import { SETTINGS } from './dev/settings.js';

// Preserve the regular receipt defaults; library cards use the saved dev preset.
const configured = new WeakSet();
let receiptDefaults;

function savedSection(section, type = 'library-cards') {
  const override = SETTINGS.variants[type]?.[section];
  return Object.fromEntries(Object.entries(SETTINGS.global[section]).map(([key, value]) =>
    [key, override?.enabled[key] ? override.values[key] : value]));
}

export function configurePaperPrint(player) {
  const renderer = player.renderer;
  if (!renderer || configured.has(renderer)) return;
  receiptDefaults ||= { imageSize: [...renderer.imageSize], imageGamma: renderer.imageGamma,
    imageBrightness: renderer.imageBrightness, printSize: renderer.printSize || [.94, 1.175] };
  Object.assign(renderer, { imageSize: receiptDefaults.imageSize, imageGamma: receiptDefaults.imageGamma,
    imageBrightness: receiptDefaults.imageBrightness, printSize: receiptDefaults.printSize });
  const type = player.papers[player.index].paperType || 'receipts';
  Object.assign(player.settings, savedSection('timing', type));
  if (player.papers[player.index].paperType === 'library-cards') {
    const image = savedSection('image');
    Object.assign(renderer, { imageSize: [image.resolution, Math.round(image.resolution / image.aspect)],
      imageGamma: image.gamma, imageBrightness: image.brightness, printSize: [image.size, image.size / image.aspect] });
  }
  configured.add(renderer);
}
