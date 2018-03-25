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

  const vShader = createShader(gl, gl.VERTEX_SHADER, vsSource)
  const fShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource)
  const vBShader = createShader(gl, gl.VERTEX_SHADER, vsBSource)
  const fBShader = createShader(gl, gl.FRAGMENT_SHADER, fsBSource)

  glManager.programs[0] = createProgram(gl, [vBShader, fBShader])

  glManager.positionBAttributeLocation = gl.getAttribLocation(glManager.programs[0], "aposition");
  glManager.textBAttributeLocation = gl.getAttribLocation(glManager.programs[0], "atexCoord");

  var background = new Square(-1, -1, 2.0)
  background.positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, background.positionBuffer)
  background.setVerticiesAndBufferData(gl)


  background.texture = GLManager.loadImageAndCreateTextureInfo(IMG_URL)
  background.texture.positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, background.texture.positionBuffer)
  background.setVerticiesAndBufferData(gl)
  glManager.background = background

  //////////////////////////////////////////////////////////////

  glManager.programs[1] = createProgram(gl, [vShader, fShader]);

  // getting attr reference (index)
  glManager.positionAttributeLocation = gl.getAttribLocation(glManager.programs[1], "aposition");
  glManager.matrixUniformLocation = gl.getUniformLocation(glManager.programs[1], "umatrix")

  glManager.shapes.push(new TShape(0, 0, glManager.unitSize))
  glManager.shapes.push(new LShape(0, 0, glManager.unitSize))

  for (let shape of glManager.shapes) {
    shape.positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, shape.positionBuffer)
    shape.setVerticiesAndBufferData(gl)
  }
}

function drawScene(now) {
  var gl = glManager.gl

  // get delta
  let delta = (now - glManager.then) * 0.001
  glManager.then = now

  let angle = delta * ROTATION_PER_SECOND
  let distance = delta * TRANSLATION_PER_SECOND
  var scale = 2.0 * SCALE_PER_SECOND

  gl.viewport(0,0,gl.canvas.width,gl.canvas.height)
  gl.clearColor(78/255.0,159/255.0,255/255.0,1.0)
  gl.clear(gl.COLOR_BUFFER_BIT || gl.COLOR_DEPTH_BIT)

  // drawing background
  gl.useProgram(glManager.programs[0])

  gl.enableVertexAttribArray(glManager.positionBAttributeLocation)
  gl.bindBuffer(gl.ARRAY_BUFFER, glManager.background.positionBuffer)

  gl.vertexAttribPointer(
    glManager.positionBAttributeLocation, 2,
    gl.FLOAT, false, 0, 0
  );

  gl.enableVertexAttribArray(glManager.textBAttributeLocation)
  gl.bindBuffer(gl.ARRAY_BUFFER, glManager.background.texture.positionBuffer)

  gl.vertexAttribPointer(
    glManager.textBAttributeLocation, 2,
    gl.FLOAT, false, 0, 0
  );
  gl.drawArrays(gl.TRIANGLES, 0, 6)


  gl.useProgram(glManager.programs[1])
  for (let shape of glManager.shapes) {

    //////////////////////////// Rotation

    // rotate(shape, dAngle)

    newRotationValues(shape, angle)
    let rotationMatrix = glManager.transformation.rotation(shape.degrees)

    // ///////////////////////////// Translation
    newTranslationValues(shape, distance)
    let translationMatrix = glManager.transformation.translation(
      shape.translation[0],shape.translation[1]
    )
    //
    //
    // ////////////////////////////// Scaling
    newScalingValues(shape, scale)
    var scalingMatrix = glManager.transformation.scaling(shape.scaling[0],shape.scaling[1])

    var matrix = [];
    // mat3.multiply(matrix, )


    mat3.multiply(matrix, translationMatrix, scalingMatrix)
    mat3.multiply(matrix, matrix, rotationMatrix)
    gl.uniformMatrix3fv(glManager.matrixUniformLocation, false, matrix)

    gl.enableVertexAttribArray(glManager.positionAttributeLocation)
    gl.bindBuffer(gl.ARRAY_BUFFER, shape.positionBuffer)

    var size = 2
    var type = gl.FLOAT
    var normalize = false
    var stride = 0
    var offset = 0

    gl.vertexAttribPointer(
      glManager.positionAttributeLocation,
      size,
      type,
      normalize,
      stride,
      offset
    )

    let verticiesCounter = 24
    var drawingOffset = 0
    gl.drawArrays(gl.TRIANGLES, drawingOffset , verticiesCounter)
  }

  requestAnimationFrame(drawScene)
}
