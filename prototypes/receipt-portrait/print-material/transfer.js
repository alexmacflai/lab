// Paper-space dry-transfer footprints, separate from the existing microscopic pores.
export const TRANSFER = `
float transferHash(vec2 cell) {
  uvec2 q=uvec2(ivec2(floor(cell)));
  uint h=q.x*0x8da6b343u ^ q.y*0xd8163841u ^ uint(uProofSeed*4096.);
  h^=h>>16; h*=0x7feb352du; h^=h>>15; h*=0x846ca68bu; h^=h>>16;
  return float(h>>8)*(1./16777216.);
}
float transferNoise(vec2 p) {
  vec2 i=floor(p),f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(transferHash(i),transferHash(i+vec2(1,0)),f.x),
    mix(transferHash(i+vec2(0,1)),transferHash(i+vec2(1)),f.x),f.y);
}
float transferFootprint(vec2 p) {
  vec2 cell=floor(p/vec2(6.,9.)-.5);
  float nearest=20.;
  for(int y=0;y<2;y++) for(int x=0;x<2;x++) {
    vec2 id=cell+vec2(x,y);
    if(transferHash(id+31.)<.45) continue;
    vec2 centre=(id+.4+.2*vec2(transferHash(id),transferHash(id+13.)))*vec2(6.,9.);
    vec2 radius=vec2(.9+transferHash(id+47.)*1.7,1.5+transferHash(id+83.)*3.);
    vec2 delta=p-centre;
    delta.x+=.25*sin(delta.y*.6+transferHash(id+91.)*6.28);
    vec2 q=abs(delta)/radius;
    float d=(pow(q.x*q.x*q.x+q.y*q.y*q.y,1./3.)-1.)*min(radius.x,radius.y);
    nearest=min(nearest,d);
  }
  return nearest;
}
float transferEdge(vec2 mm) {
  float detail=0.,frequency=.8,amplitude=1.8;
  float pixel=max(length(dFdx(mm)),length(dFdy(mm)));
  for(int i=0;i<4;i++) {
    float visible=1.-smoothstep(.3,.7,frequency*pixel);
    if(visible>.001) detail+=(transferNoise(mm*vec2(frequency,frequency*2.7))-.5)*amplitude*visible;
    frequency*=3.; amplitude*=.36;
  }
  float drag=smoothstep(.65,.85,transferNoise(mm*vec2(3.5,.12)))*.45;
  return detail+drag;
}
float transferFilm(vec2 mm) {
  float field=0.,weight=0.,frequency=1.6,amplitude=1.;
  float pixel=max(length(dFdx(mm)),length(dFdy(mm)));
  for(int i=0;i<3;i++) {
    float visible=1.-smoothstep(.3,.7,frequency*pixel);
    if(visible>.001) field+=transferNoise(mm*vec2(frequency,frequency*2.7))*amplitude*visible;
    weight+=amplitude*visible; frequency*=2.7; amplitude*=.45;
  }
  return weight>.01 ? field/weight : .5;
}
float proofBlotch(vec2 mm,float load) {
  mm*=2.; // Half-sized coverage features; the original microscopic pores are separate.
  if(uProofInk.y<.35) {
    float region=transferNoise(mm*vec2(.13,.19));
    float film=transferNoise(mm*vec2(1.6,4.3));
    return smoothstep(.64,.74,region)*smoothstep(.48,.62,film);
  }
  float footprint=transferFootprint(mm/1.5)*1.5;
  // Contact changes the footprint; fragmented dry deposits supply its internal detail.
  float contact=(proofResponse.r-.88)*1.6;
  float distance=footprint+transferEdge(mm)+contact;
  float worn=1.-smoothstep(-1.,1.,distance);
  float threshold=mix(.8,.38,worn)-load*worn*.05;
  float film=transferFilm(mm);
  float edge=max(fwidth(film)*.4,.012);
  return smoothstep(threshold-edge,threshold+edge,film);
}
`;
