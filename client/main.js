/*
a01468749
Volodymyr Samoilenko
*/

'use strict'

let TRANSLATION_PER_SECOND = 0.5;
let ROTATION_PER_SECOND = 300;
let SCALE_PER_SECOND = 2.0;
let IMG_URL = "./res/background.jpg";
let glManager;

function main() {
  glManager = new GLManager()
  initScene()
  requestAnimationFrame(drawScene)
};

function initScene() {
  setEventListner()
  const canvas = document.querySelector('#glCanvas');

  glManager.gl = canvas.getContext('webgl');
  var gl = glManager.gl

  if (!gl) {
    alert("Unable to initialize WebGL. Your browser or machine may not support it.");
    return;
  }

  const vShader = glManager.createShader(gl, gl.VERTEX_SHADER, vsSource)
  const fShader = glManager.createShader(gl, gl.FRAGMENT_SHADER, fsSource)
  const vBShader = glManager.createShader(gl, gl.VERTEX_SHADER, vsBSource)
  const fBShader = glManager.createShader(gl, gl.FRAGMENT_SHADER, fsBSource)

  glManager.programs[0] = glManager.createProgram(gl, [vBShader, fBShader])

  glManager.positionBAttributeLocation = gl.getAttribLocation(glManager.programs[0], "aposition");
  glManager.textBAttributeLocation = gl.getAttribLocation(glManager.programs[0], "atexCoord");

  var background = new Background(-1, -1, 0, 2.0)
  background.positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, background.positionBuffer)
  background.setVerticiesAndBufferData(gl)

  background.texture = GLManager.loadImageAndCreateTextureInfo(IMG_URL)
  background.texture.positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, background.texture.positionBuffer)
  background.setVerticiesAndBufferData(gl)
  glManager.background = background

  glManager.programs[1] = glManager.createProgram(gl, [vShader, fShader]);

  // getting attr reference (index)
  glManager.positionAttributeLocation = gl.getAttribLocation(glManager.programs[1], "aposition");
  glManager.matrixUniformLocation = gl.getUniformLocation(glManager.programs[1], "umatrix")
  glManager.shapes.push(new TShape(0, 0, 0, glManager.unitSize))
  glManager.shapes.push(new Square(0, 0, 0, glManager.unitSize))
  // glManager.shapes.push(new TShape(0, 0, glManager.unitSize))
  // glManager.shapes.push(new LShape(0, 0, glManager.unitSize))

  for (let shape of glManager.shapes) {
    shape.positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, shape.positionBuffer)
    shape.setVerticiesAndBufferData(gl)


  }
}

function drawScene(now) {
  var gl = glManager.gl;

  // get delta
  let delta = (now - glManager.then) * 0.001
  glManager.then = now

  var update = {
    rotation: () => {
      return delta * ROTATION_PER_SECOND;
    },
    translation: () => {
      return delta * TRANSLATION_PER_SECOND;
    },
    scale: () => {
      return delta * SCALE_PER_SECOND;
    },
  };


  gl.viewport(0,0,gl.canvas.width,gl.canvas.height)
  gl.clearColor(78/255.0,159/255.0,255/255.0,1.0)
  gl.clear(gl.COLOR_BUFFER_BIT || gl.COLOR_DEPTH_BIT)
  //
  // // drawing background
  gl.useProgram(glManager.programs[0])

  gl.enableVertexAttribArray(glManager.positionBAttributeLocation)
  gl.bindBuffer(gl.ARRAY_BUFFER, glManager.background.positionBuffer)

  gl.vertexAttribPointer(
    glManager.positionBAttributeLocation, 3,
    gl.FLOAT, false, 0, 0
  );

  gl.enableVertexAttribArray(glManager.textBAttributeLocation)
  gl.bindBuffer(gl.ARRAY_BUFFER, glManager.background.texture.positionBuffer)

  gl.vertexAttribPointer(
    glManager.textBAttributeLocation, 3,
    gl.FLOAT, false, 0, 0
  );
  gl.drawArrays(gl.TRIANGLES, 0, 6 * 6 * 4)

  // draw game elements
  gl.useProgram(glManager.programs[1])
  for (let shape of glManager.shapes) {

    gl.uniformMatrix4fv(
      glManager.matrixUniformLocation,
      false,
      shape.updateMatrix(update)
    )

    {
    var size = 3
    var type = gl.FLOAT
    var normalize = false
    var stride = 0
    var offset = 0

    gl.bindBuffer(gl.ARRAY_BUFFER, shape.positionBuffer)
    gl.vertexAttribPointer(
      glManager.positionAttributeLocation,
      size,
      type,
      normalize,
      stride,
      offset
    )
    gl.enableVertexAttribArray(glManager.positionAttributeLocation)
  }

    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, shape.indexBuffer)

    let verticiesCounter = 6 * 6 * 4
    var drawingOffset = 0
    gl.drawArrays(gl.TRIANGLES, drawingOffset, verticiesCounter)
    // gl.drawElements(gl.TRIANGLES, verticiesCounter, gl.UNSIGNED_BYTE, drawingOffset)
  }

  requestAnimationFrame(drawScene)
}
