import { SETTINGS } from './dev/settings.js';

const configured = new WeakSet();

function savedSection(section, type) {
  const override = SETTINGS.variants[type]?.[section];
  return Object.fromEntries(Object.entries(SETTINGS.global[section]).map(([key, value]) =>
    [key, override?.enabled[key] ? override.values[key] : value]));
}

export function configurePaperPrint(player) {
  const renderer = player.renderer;
  if (!renderer || configured.has(renderer)) return;
  const type = player.papers[player.index].paperType || 'receipts';
  const image = savedSection('image', type);
  Object.assign(renderer, { imageSize: [image.resolution, Math.round(image.resolution / image.aspect)],
    imageGamma: image.gamma, imageBrightness: image.brightness, printSize: [image.size, image.size / image.aspect] });
  Object.assign(player.settings, savedSection('timing', type));
  configured.add(renderer);
}
