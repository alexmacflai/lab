import { SETTINGS } from './dev/settings.js';

// Preserve the regular receipt defaults; library cards use the saved dev preset.
const configured = new WeakSet();
let receiptDefaults;

function savedSection(section) {
  const override = SETTINGS.variants['library-cards']?.[section];
  return Object.fromEntries(Object.entries(SETTINGS.global[section]).map(([key, value]) =>
    [key, override?.enabled[key] ? override.values[key] : value]));
}

export function configurePaperPrint(player) {
  const renderer = player.renderer;
  if (!renderer || configured.has(renderer)) return;
  receiptDefaults ||= { imageSize: [...renderer.imageSize], imageGamma: renderer.imageGamma,
    imageBrightness: renderer.imageBrightness, printSize: renderer.printSize || [.94, 1.175], timing: { ...player.settings } };
  Object.assign(renderer, { imageSize: receiptDefaults.imageSize, imageGamma: receiptDefaults.imageGamma,
    imageBrightness: receiptDefaults.imageBrightness, printSize: receiptDefaults.printSize });
  Object.assign(player.settings, receiptDefaults.timing);
  if (player.papers[player.index].paperType === 'library-cards') {
    const image = savedSection('image');
    Object.assign(renderer, { imageSize: [image.resolution, Math.round(image.resolution / image.aspect)],
      imageGamma: image.gamma, imageBrightness: image.brightness, printSize: [image.size, image.size / image.aspect] });
    Object.assign(player.settings, savedSection('timing'));
  }
  configured.add(renderer);
}
