import { FRAGMENT } from '../shaders.js';
import { TRANSFER } from './transfer.js';

const declarations = `
uniform int uProofOn;
uniform int uProofView;
uniform vec4 uProofInk;
uniform float uProofGrain;
uniform float uProofSeed;
uniform float uProofRare;
uniform sampler2D uResponse;
float proofRadius;
float proofMask;
vec3 proofResponse;
float proofHash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7)) + uProofSeed) * 43758.5453); }
float proofNoise(vec2 p) {
  vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(proofHash(i),proofHash(i+vec2(1,0)),f.x),mix(proofHash(i+vec2(0,1)),proofHash(i+vec2(1)),f.x),f.y);
}
float proofFbm(vec2 p) { return .55*proofNoise(p)+.28*proofNoise(p*2.07+3.)+.17*proofNoise(p*4.13+7.); }
float proofSource(vec2 p) {
  if (any(lessThan(p,vec2(0))) || any(greaterThan(p,vec2(1)))) return 0.;
  vec4 s=texture(uPrint,p); return s.a*(1.-dot(s.rgb,vec3(.299,.587,.114)));
}
${TRANSFER}
float proofInk(vec2 uv) {
  vec2 mm=vec2(vUV.x,vUV.y*uRatio)*80.;
  proofResponse=texture(uResponse,(vUV*vec2(64.,144.)+.5)/vec2(65.,145.)).rgb;
  float ridge=proofResponse.g, valley=proofResponse.b;
  vec2 warp=vec2(proofNoise(mm/13.),proofNoise(mm/13.+39.))*1.2;
  float base=proofSource(uv),weak=0.;
  if(uProofInk.y>0.) {
    vec2 dotSize=vec2(1./144.,1./180.);
    float load=(base+proofSource(uv+vec2(dotSize.x,0))+proofSource(uv-vec2(dotSize.x,0))
      +proofSource(uv+vec2(0,dotSize.y))+proofSource(uv-vec2(0,dotSize.y)))/5.;
    weak=proofBlotch(mm,load);
  }
  float absorb=proofFbm(mm*.8+warp);
  float burst=smoothstep(.50,.66,proofFbm(mm/12.+vec2(17,3)));
  float radius=mix(uProofInk.x,mix(.08,uProofInk.x,burst),uProofRare);
  radius*=mix(.45,1.35,absorb)*(1.+valley*uProofInk.z*.8)*(1.-ridge*uProofInk.z*.7);
  proofRadius=radius;
  float spread=0.;
  float angle=.22+uProofSeed*.01;
  mat2 direction=mat2(cos(angle),sin(angle),-sin(angle),cos(angle));
  float wick=proofNoise(direction*mm*vec2(5.,26.));
  if(radius>.05) for(int i=0;i<12;i++) {
    float a=float(i)*.5235988;
    float r=mod(float(i),2.)==0. ? .38 : 1.;
    vec2 offset=direction*(vec2(cos(a),sin(a))*vec2(1.25,.65))*radius*r;
    float deposit=proofSource(uv+offset/vec2(75.2,94.));
    spread=max(spread,deposit*exp(-r*r*1.6)*mix(.22,1.,wick));
  }
  float ink=max(base,spread*.95);
  if(uProofInk.w>0.) {
    float dragged=max(proofSource(uv+vec2(0,.6/94.)),proofSource(uv+vec2(0,1.5/94.)));
    ink=max(ink,dragged*ridge*uProofInk.w*.85);
  }
  float grit=proofHash(floor(mm*14.));
  float pores=mix(1.,mix(.14,1.,smoothstep(.025,.085,grit)),uProofGrain);
  float transfer=1.-valley*uProofInk.z*.76;
  float loss=mix(uProofInk.y,1.-pow(1.-uProofInk.y,4.),smoothstep(.15,.6,uProofInk.y));
  loss*=mix(1.,.94,smoothstep(.15,.6,uProofInk.y));
  proofMask=loss*weak;
  float density=(1.-loss*weak)*transfer*mix(.985,1.,proofFbm(mm*1.8));
  return clamp(ink*density*pores,0.,1.);
}
`;

const start = FRAGMENT.indexOf('  // Imperfections live in paper coordinates');
const end = FRAGMENT.indexOf('  float inside', start);
const legacy = FRAGMENT.slice(start, end);
const branch = `  if (uProofOn == 1) { ink.rgb=vec3(0); ink.a=proofInk(printUV); } else {\n${legacy}\n  }\n`;
const diagnostic = `
  if (uProofOn == 1 && uProofView > 0) {
    if(uProofView==1) outColor=vec4(vec3(1.-ink.a*inside*uPrintOn),1);
    else if(uProofView==2) outColor=vec4(clamp(proofRadius/.8,0.,1.),.15,1.-clamp(proofRadius/.8,0.,1.),1);
    else if(uProofView==3) outColor=vec4(proofResponse,1);
    else outColor=vec4(vec3(1.-proofMask),1);
    return;
  }
`;
export const PRINT_FRAGMENT = (FRAGMENT.slice(0,start)+branch+FRAGMENT.slice(end))
  .replace('precision highp float;', 'precision highp float;\nprecision highp int;')
  .replace('void main() {',declarations+'\nvoid main() {')
  .replace('  // Linear-light reflectance multiplication:',diagnostic+'\n  // Linear-light reflectance multiplication:');
