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
uniform bool uContinuousTone;
uniform vec2 uImageSize;
uniform float uImageGamma;
float proofRadius;
float proofMask;
float proofWet;
vec3 proofResponse;
float proofHash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7)) + uProofSeed) * 43758.5453); }
float materialHash(vec2 p) {
  uvec2 q=uvec2(ivec2(floor(p)));
  uint h=q.x*0x8da6b343u ^ q.y*0xd8163841u ^ uint(uProofSeed*4096.);
  h^=h>>16; h*=0x7feb352du; h^=h>>15; h*=0x846ca68bu; h^=h>>16;
  return float(h>>8)*(1./16777216.);
}
float proofNoise(vec2 p) {
  vec2 i=floor(p),f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(materialHash(i),materialHash(i+vec2(1,0)),f.x),
    mix(materialHash(i+vec2(0,1)),materialHash(i+vec2(1)),f.x),f.y);
}
float printerThreshold(vec2 uv,float fine) {
  const float bayer[16]=float[16](0.,8.,2.,10.,12.,4.,14.,6.,3.,11.,1.,9.,15.,7.,13.,5.);
  ivec2 pixel=ivec2(floor(uv*uImageSize));
  float ordered=(bayer[(pixel.y%4)*4+pixel.x%4]+.5)/16.;
  // Keep the cheap printer's ordered dots; only a little finer deposit variation.
  return clamp(ordered+(fine-.5)*.28,.015,.985);
}
${TRANSFER}

vec2 proofPaper(vec2 uv) {
  float c=cos(uPrintPose.z),s=sin(uPrintPose.z);
  vec2 p=mat2(c,s,-s,c)*((uv-.5)*vec2(.94,1.175))+uPrintPose.xy;
  return vec2(p.x,p.y/uRatio)+.5;
}
float proofSource(vec2 uv) {
  if(any(lessThan(uv,vec2(0))) || any(greaterThan(uv,vec2(1)))) return 0.;
  vec2 paperUV=proofPaper(uv),mm=paperUV*vec2(80.,80.*uRatio);
  vec3 response=texture(uResponse,(paperUV*vec2(64.,144.)+.5)/vec2(65.,145.)).rgb;
  float weak=uProofInk.y>0. ? proofBlotch(mm) : 0.;
  float loss=weak*uProofInk.y*(1.-proofWet*.8);
  float contact=1.-response.b*uProofInk.z*.36;
  vec2 sourceUV=uContinuousTone ? (floor(uv*uImageSize)+.5)/uImageSize : uv;
  vec4 source=texture(uPrint,sourceUV);
  float tone=source.a*(1.-dot(source.rgb,vec3(.299,.587,.114)));
  if(uContinuousTone) tone=1.-pow(max(0.,1.-tone),1./uImageGamma);
  if(!uContinuousTone) return tone*(1.-loss)*contact;
  vec2 cell=floor(uv*vec2(600.,750.));
  float fine=materialHash(cell+vec2(19,71));
  float image=smoothstep(printerThreshold(uv,fine)-.018,printerThreshold(uv,fine)+.018,tone);
  float retained=smoothstep(fine-.018,fine+.018,(1.-loss)*contact);
  return image*retained*step(.002,tone);
}
float heavyEdge(vec2 uv) {
  if(any(lessThan(uv,vec2(0))) || any(greaterThan(uv,vec2(1)))) return 0.;
  vec2 sourceUV=uContinuousTone ? (floor(uv*uImageSize)+.5)/uImageSize : uv;
  vec4 source=texture(uPrint,sourceUV);
  float tone=source.a*(1.-dot(source.rgb,vec3(.299,.587,.114)));
  if(uContinuousTone) tone=1.-pow(max(0.,1.-tone),1./uImageGamma);
  if(!uContinuousTone) return tone;
  float fine=materialHash(floor(uv*vec2(600.,750.))+vec2(19,71));
  return smoothstep(printerThreshold(uv,fine)-.018,printerThreshold(uv,fine)+.018,tone)*step(.002,tone);
}
float heavyBleed(vec2 uv,vec2 mm,float radius,float base) {
  vec2 pitch=vec2(75.2,94.)/uImageSize,position=uv*vec2(75.2,94.);
  vec2 cell=floor(uv*uImageSize);
  // Grow only narrow exterior edges; never fill a halftone cell from its centre.
  float fibre=texture(uTransferFilm,mm/8.+vec2(fract(uProofSeed*.137),fract(uProofSeed*.719))).r;
  float reach=min(radius*.14,.12*min(pitch.x,pitch.y))*mix(.72,1.,fibre);
  float aa=min(max(length(dFdx(position)),length(dFdy(position)))*.65,.15*min(pitch.x,pitch.y));
  proofRadius=radius>.12 ? reach : 0.;
  if(radius<=.12) return base;
  float ink=base;
  vec2 side=step(vec2(.5),fract(uv*uImageSize))*2.-1.;
  for(int i=0;i<3;i++) {
    vec2 offset=i==0 ? vec2(side.x,0.) : i==1 ? vec2(0.,side.y) : side;
    vec2 donor=cell+offset;
    vec2 q=abs(position-(donor+.5)*pitch)-pitch*.5;
    float distance=length(max(q,0.));
    if(distance>reach+aa) continue;
    vec2 edge=clamp(position,(donor+.02)*pitch,(donor+.98)*pitch);
    float deposit=heavyEdge(edge/vec2(75.2,94.));
    ink=max(ink,deposit*(1.-smoothstep(reach-aa,reach+aa,distance)));
  }
  return mix(base,ink,smoothstep(.12,.24,radius));
}
float proofInk(vec2 uv) {
  vec2 mm=vec2(vUV.x,vUV.y*uRatio)*80.;
  proofResponse=texture(uResponse,(vUV*vec2(64.,144.)+.5)/vec2(65.,145.)).rgb;
  float ridge=proofResponse.g,valley=proofResponse.b;
  float absorb=proofNoise(mm*1.8);
  float burst=smoothstep(.43,.66,proofNoise(mm/7.+vec2(17,3)));
  proofWet=burst*uProofRare;
  float base=proofSource(uv);
  float radius=mix(uProofInk.x,mix(.025,uProofInk.x,burst),uProofRare);
  radius*=mix(.55,1.3,absorb)*(1.+valley*uProofInk.z*.8)*(1.-ridge*uProofInk.z*.65);
  proofRadius=radius;
  float ink=base;
  // Fibre-led growth of the deposited ink, not a low-opacity blur of the whole photograph.
  if(uProofRare>.5) ink=heavyBleed(uv,mm,radius,base);
  else if(radius>.12) for(int i=0;i<6;i++) {
    float a=float(i)*1.047198+uProofSeed;
    vec2 fibre=vec2(cos(a),sin(a))*vec2(1.,.72);
    float wick=proofNoise((mm+vec2(uProofSeed,float(i)*17.))*vec2(6.,28.));
    vec2 offset=fibre*radius*mix(.25,1.,wick);
    float deposit=proofSource(uv+offset/vec2(75.2,94.));
    float flooding=smoothstep(.25,.7,radius);
    float adhesion=smoothstep(mix(.66,.36,flooding),mix(.82,.60,flooding),wick);
    ink=max(ink,deposit*adhesion*.97);
  }
  if(uProofInk.w>0.) {
    float drag=max(proofSource(uv-vec2(0,.45/94.))*.93,
      max(proofSource(uv-vec2(0,.95/94.))*.74,proofSource(uv-vec2(0,1.65/94.))*.38));
    float pressure=ridge*uProofInk.w;
    float moved=step(proofHash(floor(uv*vec2(600.,750.))+113.),pressure);
    float retained=ink*step(proofHash(floor(uv*vec2(600.,750.))+67.),.55);
    float deposited=step(proofHash(floor(uv*vec2(600.,750.))+251.),drag)*step(.001,drag);
    ink=mix(ink,max(retained,deposited),moved);
  }
  float grit=proofHash(floor(mm*14.));
  float pores=uProofRare>.5 ? 1. : mix(1.,mix(.14,1.,smoothstep(.025,.085,grit)),uProofGrain);
  proofMask=uProofInk.y>0. ? proofBlotch(mm)*uProofInk.y*(1.-proofWet*.8) : 0.;
  return clamp(ink*pores,0.,1.);
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
  .replace('  // Linear-light reflectance multiplication:', '  if(uProofOn==1) inside=1.;\n  // Linear-light reflectance multiplication:')
  .replace('  // Linear-light reflectance multiplication:',diagnostic+'\n  // Linear-light reflectance multiplication:');
