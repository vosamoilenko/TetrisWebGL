/*
a01468749
Volodymyr Samoilenko
*/

const vsSource = `
  attribute vec4 aposition;
  uniform mat4 umatrix;
  varying vec4 vcolor;

  void main() {
    gl_Position = aposition * umatrix;
    vcolor = gl_Position * 0.5 + 0.5;
  }
`;

const fsSource = `
  precision mediump float;
  varying vec4 vcolor;

  void main() {
    gl_FragColor = vcolor;
  }
`;

const vsLandedSource = `
  attribute vec4 aposition;
  varying vec4 vcolor;

  void main() {
    gl_Position = aposition;
    vcolor = gl_Position * 0.5 + 0.5;
  }
`;

const fsLandedSource = `
  precision mediump float;
  varying vec4 vcolor;

  void main() {
    gl_FragColor = vcolor;
  }
`;

///////////////// BG Shaders
const vsBSource = `
  attribute vec2 aposition;
  attribute vec2 atexCoord;
  varying vec2 vtextCoord;
  void main() {
    gl_Position = vec4(aposition,0,1);
    vtextCoord = atexCoord * 0.5 + 0.5;
  }
`;
const fsBSource = `
  precision mediump float;

  varying vec2 vtextCoord;
  uniform sampler2D uimage;

  void main() {
    gl_FragColor = texture2D(uimage, vtextCoord);
  }
`;
