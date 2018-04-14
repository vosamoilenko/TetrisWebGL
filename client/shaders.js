/*
a01468749
Volodymyr Samoilenko
*/

// attr wil get data from buffer
// shader progt must have main function
// gl_Position - special vertix shaders var responses
// for position setting

// vec2 position = (umatrix * vec3(aposition, 1)).xy;
// vec2 position = (umatrix * vec3(aposition, 1)).xy;
// gl_Position = vec4(position,0,1);
// gl_Position = vec4(umatrix * vec3(aposition, 1)).xy, 0, 1);
const vsSource = `

  attribute vec4 aposition;
  uniform mat4 umatrix;
  varying vec4 vcolor;


  void main() {
    gl_Position = aposition * umatrix;
    vcolor = gl_Position * 0.5 + 0.5;
  }
`;

// fShader hasn't precision
// we need to define it
// highp || mediump || ..
// gl_FragColor - spec fragment shader var
// Resonse for setting color
// vec4(1.0/255.0,1.0,1.0,1.0);
const fsSource = `
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
