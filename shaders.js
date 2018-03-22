// attr wil get data from buffer
// shader progt must have main function
// gl_Position - special vertix shaders var responses
// for position setting

const vsSource = `
  attribute vec2 a_position;
  varying vec4 v_color;

  uniform mat3 u_matrix;

  void main() {
    vec2 position = (u_matrix * vec3(a_position, 1)).xy;

    gl_Position = vec4(position,0,1);
    v_color = gl_Position * 0.5 + 0.5;
  }
`;



// fShader hasn't precision
// we need to define it
// highp || mediump || ..
// gl_FragColor - spec fragment shader var
// Resonse for setting color
const fsSource = `
  precision mediump float;
  varying vec4 v_color;

  void main() {
    gl_FragColor = v_color;
  }
`;
