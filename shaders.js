// attr wil get data from buffer
// shader progt must have main function
// gl_Position - special vertix shaders var responses
// for position setting
const vsSource = `
  attribute vec2 aposition;
  varying vec4 vcolor;

  uniform mat3 umatrix;

  void main() {
    vec2 position = (umatrix * vec3(aposition, 1)).xy;

    gl_Position = vec4(position,0,1);
    vcolor = gl_Position * 0.5 + 0.5;
  }
`;

// fShader hasn't precision
// we need to define it
// highp || mediump || ..
// gl_FragColor - spec fragment shader var
// Resonse for setting color
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
  varying vec4 vcolor;
  void main() {
    gl_Position = vec4(aposition,0,1);
  }
`;
const fsBSource = `
  precision mediump float;

  void main() {
    gl_FragColor = vec4(131.0/255.0,31.0/255.0,99.0/255.0,1.0);
  }
`;
