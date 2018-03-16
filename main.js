
// If applied, this commit will inplement a base code for initialize shared programs
// and gl program with configuration of a buffer
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

  // getting attr reference (index)
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

  var positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

  var positions = [
    0, 0,
    0, 0.5,
    0.7, 0,
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  gl.viewport(0,0,gl.canvas.width,gl.canvas.height)

  gl.clearColor(0,0,0,0)
  gl.clear(gl.COLOR_BUFFER_BIT)


  gl.useProgram(program)

  // turns on the generic vertex attribute array
  // at the specified index into the list of attribute arrays.
  gl.enableVertexAttribArray(positionAttributeLocation)

/* Constant	             Description
   gl.NO_ERROR	         No error has been recorded.
                         The value of this constant is 0.

   gl.INVALID_ENUM	     An unacceptable value has been specified
                         for an enumerated argument.
                         The command is ignored and the error flag is set.

   gl.INVALID_VALUE	     A numeric argument is out of range.
                         The command is ignored and the error flag is set.

   gl.INVALID_OPERATION	 The specified command is not allowed for the
                         current state. The command is ignored and the
                         error flag is set.

  gl.INVALID_FRAMEBUFFER_OPERATION
                         The currently bound framebuffer is not framebuffer
                         complete when trying to render to or to read from it.

  gl.OUT_OF_MEMORY	     Not enough memory is left to execute the command.

  gl.CONTEXT_LOST_WEBGL	 If the WebGL context is lost,
                         this error is returned on the first call to
                         getError. Afterwards and until the context has
                         been restored, it returns 4gl.NO_ERROR.
*/
  let err = gl.getError();
  if (err) {
    throw 'Could not enabler Vertex. With err: ' + err;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

  let size = positions.length / 3
  let type = gl.FLOAT
  let normalize = false
  let stride = 0
  let offset = 0

  gl.vertexAttribPointer(
    positionBuffer,
    size,
    type,
    normalize,
    stride,
    offset)

    gl.drawArrays(gl.TRIANGLES, 0, 3)

};
