import { PaperRenderer } from '../renderer.js';
import { createImpression } from './impression.js';
import { PRINT_FRAGMENT } from './shader.js';
import { responseMap } from './response.js';

function mapTexture(gl, source) {
  const texture = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source); return texture;
}

export class PrintRenderer extends PaperRenderer {
  constructor(canvas, papers, limit = 8) {
    super(canvas, papers, limit, PRINT_FRAGMENT);
    const gl = this.gl; this.profile = -2; this.impression = null; this.proofView = 0; this.responses = new Map();
    this.proofUniforms = {};
    for (const name of ['On','View','Ink','Grain','Seed','Rare']) this.proofUniforms[name] = gl.getUniformLocation(this.program, `uProof${name}`);
    gl.uniform1i(gl.getUniformLocation(this.program,'uResponse'),3);
    gl.activeTexture(gl.TEXTURE3); this.neutralResponse = mapTexture(gl, new ImageData(new Uint8ClampedArray([224,0,0,255]),1,1));
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
    gl.useProgram(this.program); gl.uniform1i(u.On,profile ? 1 : 0); gl.uniform1i(u.View,this.proofView);
    if (profile) {
      gl.uniform4fv(u.Ink,profile.ink); gl.uniform1f(u.Grain,profile.grain);
      gl.uniform1f(u.Seed,profile.seed);
      gl.uniform1f(u.Rare,profile.rare ? 1 : 0);
      gl.activeTexture(gl.TEXTURE3); gl.bindTexture(gl.TEXTURE_2D,this.response(index));
    }
    super.draw(index,printed,options);
  }
}
