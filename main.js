// If applied, this commit will
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

    uniform vec4 u_color;

    void main() {
      gl_FragColor = u_color;
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
  var colorUnformLocation = gl.getUniformLocation(program, "u_color")

  var positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

  //////// This is redundant now
  // var positions = [
  //   -0.5,0.5,
  //   -0.5,-0.5,
  //   0.5,0.5,
  //
  //   -0.5,-0.5,
  //   0.5,-0.5,
  //   0.5,0.5,
  // ];

  // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  ////////

  gl.viewport(0,0,gl.canvas.width,gl.canvas.height)

  gl.clearColor(78/255.0,159/255.0,255/255.0,1.0)
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

  let size = 2
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

  for (var i = 0; i < 30; ++i) {

    let x = randomFloat()
    let y = randomFloat()
    let width = randomFloat()
    let height = randomFloat()

    setRectangle(gl, x, y, width, height)
    gl.uniform4f(
      colorUnformLocation, Math.random(), Math.random(), Math.random(), Math.random()
    )
    let verticiesCounter = 6;
    var drawingOffset = 0;

    gl.drawArrays(gl.TRIANGLES, drawingOffset , verticiesCounter)
  }

};


function randomFloat() {
  let max = 1.0
  let min = -1.0

  return (Math.random() * (max - min) + min);
}
function setRectangle(gl, x, y, width, height) {
  let x1 = x;
  let x2 = x + width;
  let y1 = y;
  let y2 = y + height;

  // NOTE: gl.bufferData(gl.ARRAY_BUFFER, ...) will affect
  // whatever buffer is bound to the `ARRAY_BUFFER` bind point
  // but so far we only have one buffer. If we had more than one
  // buffer we'd want to bind that buffer to `ARRAY_BUFFER` first.

  let positions = [
    x1, y1,
    x2, y1,
    x1, y2,
    x1, y2,
    x2, y1,
    x2, y2
  ]
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
}
function setEventListner() {
  // works
  // https://caniuse.com/#feat=keyboardevent-key
  // supported browsers
  window.addEventListener("keydown", function (event) {
  if (event.defaultPrevented) {
    return; // Do nothing if the event was already processed
  }

  switch (event.key) {
    case "ArrowDown":
    // console.log(1);
      // Do something for "down arrow" key press.
      break;
    case "ArrowUp":
      // Do something for "up arrow" key press.
      break;
    case "ArrowLeft":
      // Do something for "left arrow" key press.
      break;
    case "ArrowRight":
      // Do something for "right arrow" key press.
      break;
    case "Enter":
      // Do something for "enter" or "return" key press.
      break;
    case "Escape":
      // Do something for "esc" key press.
      break;
    default:
      return; // Quit when this doesn't handle the key event.
  }

  // Cancel the default action to avoid it being handled twice
  event.preventDefault();
}, true);
}
