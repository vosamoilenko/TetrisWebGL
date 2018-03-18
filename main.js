// If applied, this commit will

// https://webglfundamentals.org/webgl/lessons/ru/webgl-fundamentals.html
// I think this a good example of the right structure for setting a basic webGL things
// Taking out "Shader creating" and "Program creating" is a good way to have a clean code.

var gl;
let width = 0.1
let height = 0.1

function createShader(type, source) {
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
  gl = canvas.getContext('webgl');

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
    attribute vec4 a_color;
    varying vec4 v_color;

    void main() {
      gl_Position = a_position;
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
  //                           gl, type,            shader source
  const vShader = createShader(gl.VERTEX_SHADER, vsSource)
  const fShader = createShader(gl.FRAGMENT_SHADER, fsSource)

  var program = gl.createProgram();
  checkGlError()
  gl.attachShader(program, vShader); // bind shader
  gl.attachShader(program, fShader);
  gl.linkProgram(program); // link them all together

  if ( !gl.getProgramParameter(program, gl.LINK_STATUS) ) {
    var info = gl.getProgramInfoLog(program);
    throw 'Could not compile WebGL program. \n\n' + info;
  }

  // getting attr reference (index)
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  var colorAttributeLocation = gl.getAttribLocation(program, "a_color");

  var positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  set2x2PrimitiveVerticies()
  // set1x4PrimitiveVerticies()


  var colorBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
  setColors(gl)

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

  gl.viewport(0,0,gl.canvas.width,gl.canvas.height)

  gl.clearColor(78/255.0,159/255.0,255/255.0,1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  gl.useProgram(program)

  // turns on the generic vertex attribute array
  // at the specified index into the list of attribute arrays.
  gl.enableVertexAttribArray(positionAttributeLocation)

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

  var size = 2
  var type = gl.FLOAT
  var normalize = false
  var stride = 0
  var offset = 0

  gl.vertexAttribPointer(
    positionAttributeLocation,
    size,
    type,
    normalize,
    stride,
    offset)

    gl.enableVertexAttribArray(colorAttributeLocation)
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)

    var size = 4
    var type = gl.FLOAT
    var normalize = false
    var stride = 0
    var offset = 0

    gl.vertexAttribPointer(
      colorAttributeLocation,
      size,
      type,
      normalize,
      stride,
      offset)

    let verticiesCounter = 24;
    var drawingOffset = 0;

    gl.drawArrays(gl.TRIANGLES, drawingOffset , verticiesCounter)

};

function checkGlError() {
  let err = gl.getError();
  if (err) {
    throw 'Could not enabler Vertex. With err: ' + err;
  }
}
function setColors(gl) {
  let r = Math.random()
  let g = Math.random()
  let b = Math.random()

  let colors = [];
  for (var i = 0; i < 96; i+=4) {
    colors[i] = r
    colors[i+1] = g
    colors[i+2] = b
    colors[i+3] = 1
  }

  gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(colors),
      gl.STATIC_DRAW);
}

function randomFloat() {
  let max = 1.0
  let min = -1.0

  return (Math.random() * (max - min) + min);
}

// function set2x2Primitive(gl) {
//   let x1 = -0.9
//   let y1 = 0.9
//   let
// }

function set1x4PrimitiveVerticies() {


  var x = randomFloat()
  var y = x + height
  if ((x + 0.5) < -1.0 || (x + 0.5) > 1.0 || (y + 0.5) < -1.0 || (y + 0.5) > 1.0) {
    x = 0;
    y = 0.2;
  }

  var positions = [];
  positions = unitBlock(x,y)
  positions = positions.concat(unitBlock(x+width,y))
  positions = positions.concat(unitBlock(x+0.2,y))
  positions = positions.concat(unitBlock(x+0.3,y))

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
}
function set2x2PrimitiveVerticies() {
  var x = randomFloat()
  var y = x + height

  var positions = [];
  positions = unitBlock(x,y)
  positions = positions.concat(unitBlock(x,y+width))
  positions = positions.concat(unitBlock(x+width,y))
  positions = positions.concat(unitBlock(x+width,y+width))


  // NOTE: gl.bufferData(gl.ARRAY_BUFFER, ...) will affect
  // whatever buffer is bound to the `ARRAY_BUFFER` bind point

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
}

function unitBlock(x, y) {
  var x1 = x;
  var x2 = x1 + width;
  let y1 = y;
  let y2 = y1 + height;

  return [
      x1, y1,
      x1, y2,
      x2, y1,

      x1, y2,
      x2, y2,
      x2, y1,
  ]
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
