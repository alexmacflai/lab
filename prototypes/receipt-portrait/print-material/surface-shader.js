import { PRINT_FRAGMENT } from './shader.js';

// Shared by the public print, dev preview and matched surface comparisons.
export const SURFACE_FRAGMENT = PRINT_FRAGMENT
  .replace('uniform float uRatio;', 'uniform float uRatio;\nuniform bool uSurfaceRefined;')
  .replace('float illumination = .34 + .79 * diffuse;',
    'float illumination = uSurfaceRefined ? .24 + .93 * diffuse : .34 + .79 * diffuse;')
  .replace('vec3 colour = pow(reflectance * illumination * valley, vec3(1. / 2.2));', `
  vec3 lit = reflectance * illumination * valley;
  if (uSurfaceRefined) {
    vec3 halfLight = normalize(light + vec3(0, 0, 1));
    float facing = max(0., dot(normal, halfLight));
    float sheen = max(0., pow(facing, 20.) - pow(halfLight.z, 20.));
    lit += vec3(.050 * sheen) * ink.a * inside * uPrintOn;
  }
  vec3 colour = pow(lit, vec3(1. / 2.2));`);
