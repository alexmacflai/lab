// Adjust pigment coverage rather than darkening the white carrier around a stain.
export function ageCoffee(pixels) {
  for (let i = 0; i < pixels.length; i += 4) {
    const grey = pixels[i] * .2126 + pixels[i + 1] * .7152 + pixels[i + 2] * .0722;
    for (let channel = 0; channel < 3; channel++) {
      const pigment = (255 - pixels[i + channel]) * .88 + (255 - grey) * .12;
      pixels[i + channel] = Math.max(0, 255 - pigment * 1.10);
    }
  }
}
