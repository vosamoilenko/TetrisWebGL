

main();

// https://webglfundamentals.org/webgl/lessons/ru/webgl-fundamentals.html
// I think this a good example of the right structure for setting a basic webGL things
// Taking out "Shader creating" and "Program creating" is a good way to have a clean code.

function createShader(gl, type, source) {
  var shader = gl.createShader(type);   // create shader
  gl.shaderSource(shader, source);      // set to shader his code
  gl.compileShader(shader);             // compile shader
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}


function main() {

  // get contex from html canvas, if browser doesn't support html - return
  const canvas = document.querySelector('#glCanvas');
  const gl = canvas.getContext('webgl');

  if (!gl) {
    alert("Unable to initialize WebGL. Your browser or machine may not support it.");
    return;
  }
  // attr wil get data from buffer
  // shader progt must have main function
  // gl_Position - special vertix shaders var responses
  // for position setting

  const vsSource = `
    attribute vec4 a_position;

    void main() {
      gl_Position = a_position;
    }
  `;
  // fShader hasn't precision
  // we need to define it
  // highp || mediump || ..
  // gl_FragColor - spec fragment shader var
  // Resonse for setting color
  const fsSource = `
    precision mediump float;

    void main() {
      gl_FragColor = vec4(1, 0, 0.5, 1);
    }
  `;
  //                           gl, type,            shader source
  const vShader = createShader(gl, gl.VERTEX_SHADER, vsSource)
  const fShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource)

  var program = gl.createProgram();

  gl.attachShader(program, vShader); // bind shader
  gl.attachShader(program, fShader);
  gl.linkProgram(program); // link them all together

  if ( !gl.getProgramParameter( program, gl.LINK_STATUS) ) {
    var info = gl.getProgramInfoLog(program);
    throw 'Could not compile WebGL program. \n\n' + info;
  }

  // getting attr reference
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

  var positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

  var positions = [
    0, 0,
    0, 0.5,
    0.7, 0,
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

};
