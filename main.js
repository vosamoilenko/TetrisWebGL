// If applied, this commit will
'use strict'

var glManager = {
  size: {
    width: 0.1,
    height: 0.1
  }
}

let width = 0.1
let height = 0.1

function main() {
  // get contex from html canvas, if browser doesn't support html - return
  const canvas = document.querySelector('#glCanvas');
  glManager.gl = canvas.getContext('webgl');

  if (!glManager.gl) {
    alert("Unable to initialize WebGL. Your browser or machine may not support it.");
    return;
  }

  //                         gl, type,            shader source
  const vShader = createShader(glManager.gl, glManager.gl.VERTEX_SHADER, vsSource)
  const fShader = createShader(glManager.gl, glManager.gl.FRAGMENT_SHADER, fsSource)

  var program = glManager.gl.createProgram();
  checkGlError(glManager.gl)

  glManager.gl.attachShader(program, vShader); // bind shader
  glManager.gl.attachShader(program, fShader);
  glManager.gl.linkProgram(program); // link them all together

  if ( !glManager.gl.getProgramParameter(program, glManager.gl.LINK_STATUS) ) {
    var info = glManager.gl.getProgramInfoLog(program);
    throw 'Could not compile WebGL program. \n\n' + info;
  }

  // getting attr reference (index)
  var positionAttributeLocation = glManager.gl.getAttribLocation(program, "a_position");
  var colorAttributeLocation = glManager.gl.getAttribLocation(program, "a_color");

  var positionBuffer = glManager.gl.createBuffer()
  glManager.gl.bindBuffer(glManager.gl.ARRAY_BUFFER, positionBuffer)

  set2x2PrimitiveVerticies(glManager)
  // set1x4PrimitiveVerticies(glManager)

  var colorBuffer = glManager.gl.createBuffer()
  glManager.gl.bindBuffer(glManager.gl.ARRAY_BUFFER, colorBuffer)
  setColors(glManager.gl)

  glManager.gl.viewport(0,0,glManager.gl.canvas.width,glManager.gl.canvas.height)

  glManager.gl.clearColor(78/255.0,159/255.0,255/255.0,1.0)
  glManager.gl.clear(glManager.gl.COLOR_BUFFER_BIT)

  glManager.gl.useProgram(program)

  // turns on the generic vertex attribute array
  // at the specified index into the list of attribute arrays.
  glManager.gl.enableVertexAttribArray(positionAttributeLocation)

  glManager.gl.bindBuffer(glManager.gl.ARRAY_BUFFER, positionBuffer)

  var size = 2
  var type = glManager.gl.FLOAT
  var normalize = false
  var stride = 0
  var offset = 0

  glManager.gl.vertexAttribPointer(
    positionAttributeLocation,
    size,
    type,
    normalize,
    stride,
    offset)

    glManager.gl.enableVertexAttribArray(colorAttributeLocation)
    glManager.gl.bindBuffer(glManager.gl.ARRAY_BUFFER, colorBuffer)

    var size = 4
    var type = glManager.gl.FLOAT
    var normalize = false
    var stride = 0
    var offset = 0

    glManager.gl.vertexAttribPointer(
      colorAttributeLocation,
      size,
      type,
      normalize,
      stride,
      offset)

    let verticiesCounter = 24;
    var drawingOffset = 0;

    glManager.gl.drawArrays(glManager.gl.TRIANGLES, drawingOffset , verticiesCounter)

};
