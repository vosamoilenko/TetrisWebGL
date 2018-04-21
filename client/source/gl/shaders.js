/*
a01468749
Volodymyr Samoilenko
*/

const vsSource = `
  attribute vec4 aposition;
  attribute vec4 acolor;
  uniform mat4 umatrix;
  varying vec4 vcolor;

  void main() {
    gl_Position = aposition * umatrix;
    vcolor = acolor;
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
  attribute vec4 acolor;
  varying vec4 vcolor;

  void main() {
    gl_Position = aposition;
    vcolor = acolor;
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
  attribute vec4 aposition;
  uniform vec4 ubcolor;
  varying vec4 vcolor;

  void main() {
    gl_Position = aposition;
    vcolor = ubcolor;
  }
`;
const fsBSource = `
precision mediump float;
varying vec4 vcolor;

void main() {
  gl_FragColor = vec4(0,0,0,0);
}
`;
// ------------------------
const vsInfoSource = `
  attribute vec4 aposition;
  varying vec4 vcolor;

  void main() {
    gl_Position = aposition;
  }
`;

const fsInfoSource = `
  precision mediump float;
  varying vec4 vcolor;

  void main() {
    gl_FragColor = vec4(vcolor.xyz, 0.7);
  }
`;



// const vsBSource = `
//   attribute vec2 aposition;
//   attribute vec2 atexCoord;
//   varying vec2 vtextCoord;
//   void main() {
//     gl_Position = vec4(aposition,0,1);
//     vtextCoord = atexCoord * 0.5 + 0.5;
//   }
// `;
