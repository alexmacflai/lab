export const VERTEX = `#version 300 es
precision highp float;
in vec3 aPosition;
in vec2 aUV;
in vec3 aNormal;
uniform vec2 uView;
uniform vec3 uPose;
uniform vec3 uLight;
uniform bool uShadow;
out vec2 vUV;
out vec3 vNormal;
out vec3 vPosition;
void main() {
  float c = cos(uPose.z), s = sin(uPose.z);
  mat2 rotation = mat2(c, s, -s, c);
  vec3 p = aPosition;
  p.xy = rotation * p.xy + uPose.xy;
  vPosition = p;
  vNormal = vec3(rotation * aNormal.xy, aNormal.z);
  vUV = aUV;
  if (uShadow) {
    // Project each displaced vertex onto the tabletop along an area-light ray.
    p.xy -= uLight.xy / uLight.z * p.z;
    p.z = 0.0;
  }
  // Orthographic camera, tilted slightly from the vertical.
  vec2 screen = vec2(p.x, p.y * .996 - p.z * .087);
  gl_Position = vec4(screen / (uView * .5), -p.z * .1, 1.0);
}`;

export const FRAGMENT = `#version 300 es
precision highp float;
in vec2 vUV;
in vec3 vNormal;
in vec3 vPosition;
uniform sampler2D uPaper;
uniform sampler2D uPrint;
uniform vec3 uTint;
uniform vec3 uPrintPose;
uniform float uRatio;
uniform float uPrintOn;
uniform bool uShadow;
uniform int uInspect;
out vec4 outColor;
void main() {
  if (uShadow) { outColor = vec4(.17, .15, .11, .027); return; }
  // Geometry supplies the silhouette. Interior alpha is always one.
  if (uInspect == 1) { outColor = vec4(1); return; }
  vec3 normal = normalize(vNormal);
  if (uInspect == 2) { outColor = vec4(normal * .5 + .5, 1); return; }
  vec3 paper = texture(uPaper, vUV).rgb * uTint;
  vec2 local = vec2(vUV.x - .5, (vUV.y - .5) * uRatio);
  local -= uPrintPose.xy;
  float c = cos(uPrintPose.z), s = sin(uPrintPose.z);
  vec2 printUV = mat2(c, -s, s, c) * local / vec2(.94, 1.175) + .5;
  vec4 ink = texture(uPrint, clamp(printUV, 0., 1.));
  float inside = step(0., printUV.x) * step(printUV.x, 1.) * step(0., printUV.y) * step(printUV.y, 1.);
  // Linear-light reflectance multiplication: unprinted pixels add no white.
  vec3 reflectance = pow(paper, vec3(2.2));
  reflectance *= mix(vec3(1), pow(ink.rgb, vec3(2.2)), ink.a * inside * uPrintOn);
  vec3 light = normalize(vec3(-.65, .8, 1.5));
  float diffuse = max(0., dot(normal, light));
  float illumination = .34 + .79 * diffuse;
  float valley = 1. - .045 * (1. - normal.z);
  vec3 colour = pow(reflectance * illumination * valley, vec3(1. / 2.2));
  outColor = vec4(colour, 1);
}`;
