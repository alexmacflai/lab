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
uniform vec2 uPrintSize;
uniform float uPrintOn;
uniform bool uShadow;
uniform bool uEdgeAlpha;
uniform int uInspect;
out vec4 outColor;
float grain(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
float inkCoverage(vec2 uv) {
  return texture(uPrint, clamp(uv, 0., 1.)).a;
}
void main() {
  float paperAlpha = uEdgeAlpha ? texture(uPaper, vUV).a : 1.;
  if (paperAlpha < .01) discard;
  if (uShadow) { outColor = vec4(.17, .15, .11, .027 * paperAlpha); return; }
  // Geometry supplies the silhouette. Only the opt-in torn fringe has partial alpha.
  if (uInspect == 1) { outColor = vec4(1); return; }
  vec3 normal = normalize(vNormal);
  if (uInspect == 2) { outColor = vec4(normal * .5 + .5, 1); return; }
  vec3 paper = texture(uPaper, vUV).rgb * uTint;
  if (uEdgeAlpha) paper /= max(paperAlpha, .001);
  vec2 local = vec2(vUV.x - .5, (vUV.y - .5) * uRatio);
  local -= uPrintPose.xy;
  float c = cos(uPrintPose.z), s = sin(uPrintPose.z);
  vec2 printUV = mat2(c, -s, s, c) * local / uPrintSize + .5;
  vec4 ink = texture(uPrint, clamp(printUV, 0., 1.));
  // Imperfections live in paper coordinates, so ink follows its folds and never swims.
  vec2 fibre = floor(vUV * vec2(800., 1800.));
  float grit = grain(fibre);
  float cloud = grain(floor(vUV * vec2(37., 73.)));
  float feed = .985 + .015 * sin(floor(printUV.y * 180.) * 1.71);
  float dropout = mix(.14, 1., smoothstep(.025, .085, grit));
  float density = mix(.965, 1., cloud) * feed * dropout;
  float missingLine = mix(.62, 1., step(.018, grain(vec2(floor(printUV.y * 180.), 4.))));
  // Sub-dot feathering into neighbouring fibres, rather than blurring the portrait.
  vec2 bleed = vec2(.0018, .0014);
  float fringe = max(max(inkCoverage(printUV + vec2(bleed.x, 0.)), inkCoverage(printUV - vec2(bleed.x, 0.))),
    max(inkCoverage(printUV + vec2(0., bleed.y)), inkCoverage(printUV - vec2(0., bleed.y))));
  ink.a = max(ink.a, fringe * .2 * grit) * density * missingLine;
  float inside = step(0., printUV.x) * step(printUV.x, 1.) * step(0., printUV.y) * step(printUV.y, 1.);
  // Linear-light reflectance multiplication: unprinted pixels add no white.
  vec3 reflectance = pow(paper, vec3(2.2));
  reflectance *= mix(vec3(1), pow(ink.rgb, vec3(2.2)), ink.a * inside * uPrintOn);
  vec3 light = normalize(vec3(-.65, .8, 1.5));
  float diffuse = max(0., dot(normal, light));
  float illumination = .34 + .79 * diffuse;
  float valley = 1. - .045 * (1. - normal.z);
  vec3 colour = pow(reflectance * illumination * valley, vec3(1. / 2.2));
  outColor = vec4(colour, paperAlpha);
}`;
