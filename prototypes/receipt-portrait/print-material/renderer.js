import { PaperRenderer } from '../renderer.js';
import { createImpression } from './impression.js';
import { SURFACE_FRAGMENT } from './surface-shader.js';
import { responseMap } from './response.js';
import { transferFilm } from './material.js';

function mapTexture(gl, source) {
  const texture = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source); return texture;
}

export class PrintRenderer extends PaperRenderer {
  constructor(canvas, papers, limit = 8, fragment = SURFACE_FRAGMENT) {
    super(canvas, papers, limit, fragment);
    const gl = this.gl; this.profile = -2; this.impression = null; this.proofView = 0; this.responses = new Map();
    this.surfaceUniform = gl.getUniformLocation(this.program, 'uSurfaceRefined');
    this.imageSize = [96,120]; this.imageGamma = 1.2;
    this.imageUniforms = { size:gl.getUniformLocation(this.program,'uImageSize'), gamma:gl.getUniformLocation(this.program,'uImageGamma') };
    this.proofUniforms = {};
    for (const name of ['On','View','Ink','Grain','Seed','Rare']) this.proofUniforms[name] = gl.getUniformLocation(this.program, `uProof${name}`);
    gl.uniform1i(gl.getUniformLocation(this.program,'uResponse'),3);
    gl.activeTexture(gl.TEXTURE3); this.neutralResponse = mapTexture(gl, new ImageData(new Uint8ClampedArray([224,0,0,255]),1,1));
    gl.uniform1i(gl.getUniformLocation(this.program,'uTransferFilm'),4);
    gl.activeTexture(gl.TEXTURE4); this.film = mapTexture(gl, transferFilm);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);
    gl.generateMipmap(gl.TEXTURE_2D);
  }

  response(index) {
    const gl = this.gl;
    if (this.responses.has(index)) {
      const texture = this.responses.get(index); this.responses.delete(index); this.responses.set(index,texture); return texture;
    }
    const texture = mapTexture(gl,responseMap(this.papers[index])); this.responses.set(index,texture);
    if (this.responses.size > this.cacheLimit) {
      const oldest = this.responses.keys().next().value; gl.deleteTexture(this.responses.get(oldest)); this.responses.delete(oldest);
    }
    return texture;
  }

  prepare(index) {
    super.prepare(index); this.gl.activeTexture(this.gl.TEXTURE3); this.response(index);
  }

  reroll() { this.impression = null; }

  draw(index, printed, options = {}) {
    if (!this.impression || this.appliedProfile !== this.profile || this.lastIndex !== index
      || (options.frame !== undefined && options.frame !== this.lastFrame)) {
      this.impression = createImpression(this.profile); this.appliedProfile = this.profile;
      this.lastIndex = index; if (options.frame !== undefined) this.lastFrame = options.frame;
    }
    const gl = this.gl, u = this.proofUniforms, profile = this.impression.profile >= 0 ? this.impression : null;
    gl.useProgram(this.program);
    gl.uniform1i(this.surfaceUniform, this.papers[index].surfaceRefined ? 1 : 0);
    gl.uniform2fv(this.imageUniforms.size,this.imageSize); gl.uniform1f(this.imageUniforms.gamma,this.imageGamma);
    gl.uniform1i(u.On,profile ? 1 : 0); gl.uniform1i(u.View,this.proofView);
    if (profile) {
      gl.uniform4fv(u.Ink,profile.ink); gl.uniform1f(u.Grain,profile.grain);
      gl.uniform1f(u.Seed,profile.seed);
      gl.uniform1f(u.Rare,profile.rare ? 1 : 0);
      gl.activeTexture(gl.TEXTURE3); gl.bindTexture(gl.TEXTURE_2D,this.response(index));
    }
    gl.activeTexture(gl.TEXTURE4); gl.bindTexture(gl.TEXTURE_2D,this.film);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D,this.print);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,profile && printed?.tone ? gl.LINEAR : gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,profile && printed?.tone ? gl.LINEAR : gl.NEAREST);
    gl.uniform1i(gl.getUniformLocation(this.program,'uContinuousTone'),profile && printed?.tone ? 1 : 0);
    super.draw(index,profile ? printed?.tone || printed : printed,options);
  }
}
