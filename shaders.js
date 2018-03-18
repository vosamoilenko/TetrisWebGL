// attr wil get data from buffer
// shader progt must have main function
// gl_Position - special vertix shaders var responses
// for position setting

const vsSource = `
  attribute vec4 a_position;
  attribute vec4 a_color;
  varying vec4 v_color;

  uniform float shiftX;

  void main() {
    gl_Position = vec4(a_position.x+shiftX, a_position.y, a_position.z, a_position.w);
    v_color = a_color;
  }
`;
// fShader hasn't precision
// we need to define it
// highp || mediump || ..
// gl_FragColor - spec fragment shader var
// Resonse for setting color
// uniform vec4 u_color;
const fsSource = `
  precision mediump float;
  varying vec4 v_color;

  void main() {
    gl_FragColor = v_color;
  }
`;
