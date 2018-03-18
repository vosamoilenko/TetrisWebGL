// If applied, this commit will
'use strict'
var glManager = {
  size: {
    width: 0.1,
    height: 0.1
  },
  translation: [0,0],
}

glManager.unitSize = prompt("Set unit block [0...10]")
glManager.size.width *= glManager.unitSize/10
glManager.size.height *= glManager.unitSize/10

var xxxx = 0.0

let width = 0.1
let height = 0.1

function main() {
  // get contex from html canvas, if browser doesn't support html - return
  initScene(glManager)
  drawScene(glManager)
};

function initScene(glManager) {
  setEventListner()
  const canvas = document.querySelector('#glCanvas');
  glManager.gl = canvas.getContext('webgl');
  var gl = glManager.gl

  if (!gl) {
    alert("Unable to initialize WebGL. Your browser or machine may not support it.");
    return;
  }

  //                         gl, type,            shader source
  const vShader = createShader(gl, gl.VERTEX_SHADER, vsSource)
  const fShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource)

  glManager.program = gl.createProgram();
  var program = glManager.program
  checkGlError(gl)

  gl.attachShader(program, vShader); // bind shader
  gl.attachShader(program, fShader);
  gl.linkProgram(program); // link them all together

  if ( !gl.getProgramParameter(program, gl.LINK_STATUS) ) {
    var info = gl.getProgramInfoLog(program);
    throw 'Could not compile WebGL program. \n\n' + info;
  }

  // getting attr reference (index)
  glManager.positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  glManager.colorAttributeLocation = gl.getAttribLocation(program, "a_color");
  glManager.shiftUniformLocation = gl.getUniformLocation(program, "shiftX")


  glManager.positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, glManager.positionBuffer)

  glManager.colorBuffer = gl.createBuffer()
  glManager.gl.bindBuffer(gl.ARRAY_BUFFER, glManager.colorBuffer)

  drawScene(glManager)
}

function drawScene(glManager) {
  var gl = glManager.gl
  var program = glManager.program
  var positionAttributeLocation = glManager.positionAttributeLocation
  var positionBuffer = glManager.positionBuffer
  var colorAttributeLocation = glManager.colorAttributeLocation
  var colorBuffer = glManager.colorBuffer

  gl.viewport(0,0,gl.canvas.width,gl.canvas.height)

  gl.clearColor(78/255.0,159/255.0,255/255.0,1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  gl.useProgram(program)
  gl.uniform1f(glManager.shiftUniformLocation, xxxx)

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


  // draw 1x4
  gl.bindBuffer(gl.ARRAY_BUFFER, glManager.positionBuffer)
  set1x4PrimitiveVerticies(glManager)

  gl.bindBuffer(gl.ARRAY_BUFFER, glManager.colorBuffer)
  setColors(gl)

  let verticiesCounter = 24;
  var drawingOffset = 0;
  gl.drawArrays(gl.TRIANGLES, drawingOffset , verticiesCounter)

  // draw 2x2
  gl.bindBuffer(gl.ARRAY_BUFFER, glManager.positionBuffer)
  set2x2PrimitiveVerticies(glManager)

  gl.bindBuffer(gl.ARRAY_BUFFER, glManager.colorBuffer)
  setColors(gl)

  gl.drawArrays(gl.TRIANGLES, drawingOffset , verticiesCounter)

}
