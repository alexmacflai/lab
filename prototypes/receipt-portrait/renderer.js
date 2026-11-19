import { makeMesh, meshIndices } from './receipts.js';
import { VERTEX, FRAGMENT } from './shaders.js';

function compile(gl, type, code) {
  const shader = gl.createShader(type); gl.shaderSource(shader, code); gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
  return shader;
}

function program(gl) {
  const p = gl.createProgram();
  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
  gl.attachShader(p, vertex); gl.attachShader(p, fragment); gl.linkProgram(p);
  gl.deleteShader(vertex); gl.deleteShader(fragment);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
  gl.useProgram(p); return p;
}

function texture(gl, source, nearest = false) {
  const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, nearest ? gl.NEAREST : gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, nearest ? gl.NEAREST : gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
  if (!nearest) gl.generateMipmap(gl.TEXTURE_2D);
  return t;
}

export class PaperRenderer {
  constructor(canvas, papers, cacheLimit = 8) {
    this.canvas = canvas;
    this.gl = canvas.getContext('webgl2', { alpha: true, antialias: true, premultipliedAlpha: true, preserveDrawingBuffer: true });
    if (!this.gl) throw new Error('WebGL 2 is unavailable');
    const gl = this.gl;
    this.program = program(gl); this.uniforms = {};
    for (const name of ['View', 'Pose', 'Light', 'Shadow', 'Paper', 'Print', 'Tint', 'PrintPose', 'Ratio', 'PrintOn', 'Inspect']) {
      this.uniforms[name] = gl.getUniformLocation(this.program, `u${name}`);
    }
    this.papers = papers;
    this.surfaces = new Map(); this.textures = new Map(); this.cacheLimit = cacheLimit;
    const indices = meshIndices(); this.indexCount = indices.length;
    this.indices = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indices);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    const blank = document.createElement('canvas'); blank.width = 144; blank.height = 180;
    this.print = texture(gl, blank, true); this.lastPrint = null;
    gl.enable(gl.BLEND); gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.uniform1i(this.uniforms.Paper, 0); gl.uniform1i(this.uniforms.Print, 1);
  }

  surface(index) {
    if (this.surfaces.has(index)) return this.surfaces.get(index);
    const gl = this.gl, vertices = makeMesh(this.papers[index]);
    const vao = gl.createVertexArray(); gl.bindVertexArray(vao);
    const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    for (const [name, size, offset] of [['aPosition', 3, 0], ['aUV', 2, 12], ['aNormal', 3, 20]]) {
      const location = gl.getAttribLocation(this.program, name);
      gl.enableVertexAttribArray(location); gl.vertexAttribPointer(location, size, gl.FLOAT, false, 32, offset);
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indices);
    const surface = { vao, count: this.indexCount, buffer };
    this.surfaces.set(index, surface); return surface;
  }

  paperTexture(index) {
    const gl = this.gl;
    if (this.textures.has(index)) {
      const cached = this.textures.get(index);
      this.textures.delete(index); this.textures.set(index, cached); return cached;
    }
    gl.activeTexture(gl.TEXTURE0);
    const image = texture(gl, this.papers[index].makeTexture());
    this.textures.set(index, image);
    if (this.textures.size > this.cacheLimit) {
      const oldest = this.textures.keys().next().value;
      gl.deleteTexture(this.textures.get(oldest)); this.textures.delete(oldest);
    }
    return image;
  }

  resize() {
    const bounds = this.canvas.getBoundingClientRect();
    const scale = Math.min(bounds.width / 840, bounds.height / 1040);
    const density = Math.min(window.devicePixelRatio || 1, 3);
    this.canvas.width = Math.round(840 * scale * density);
    this.canvas.height = Math.round(1040 * scale * density);
  }

  draw(index, printed, options = {}) {
    const gl = this.gl, u = this.uniforms, surface = this.surface(index);
    gl.viewport(0, 0, this.canvas.width, this.canvas.height); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(this.program); gl.bindVertexArray(surface.vao);
    const viewHeight = options.zoom ? 1.48 : 2.75;
    gl.uniform2f(u.View, viewHeight * 840 / 1040, viewHeight);
    gl.uniform3fv(u.Pose, options.pose || [0, 0, 0]);
    gl.uniform3fv(u.PrintPose, options.printPose || [0, 0, 0]);
    gl.uniform3fv(u.Tint, this.papers[index].tint); gl.uniform1f(u.Ratio, this.papers[index].ratio);
    gl.uniform1i(u.Inspect, options.inspect || 0);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this.paperTexture(index));
    this.uploadPrint(printed);
    gl.uniform1f(u.PrintOn, printed ? 1 : 0);
    this.drawShadow(surface, options.inspect || 0);
    gl.uniform1i(u.Shadow, 0); gl.drawElements(gl.TRIANGLES, surface.count, gl.UNSIGNED_SHORT, 0);
  }

  uploadPrint(printed) {
    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, this.print);
    if (printed && printed !== this.lastPrint) {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, printed);
      this.lastPrint = printed;
    }
  }

  drawShadow(surface, inspect) {
    if (inspect) return;
    const gl = this.gl, u = this.uniforms;
    gl.uniform1i(u.Shadow, 1);
    // Sixteen samples across a broad light: softness grows with local paper height.
    for (let i = 0; i < 16; i++) {
      const angle = i * 2.399963, radius = Math.sqrt((i + .5) / 16) * .95;
      gl.uniform3f(u.Light, -.65 + Math.cos(angle) * radius, .8 + Math.sin(angle) * radius, 1.5);
      gl.drawElements(gl.TRIANGLES, surface.count, gl.UNSIGNED_SHORT, 0);
    }
  }
}
