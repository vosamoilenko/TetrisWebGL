'use strict'

var dps = 300
let glManager;
var image;

function main() {

  glManager = new GLManager()
  // image = new Image();
  // image.src = "file:///Users/vladimir/Developer/JavaScript/TetrisWebGL/res/background.jpg";  // MUST BE SAME  DOMAIN!!!
  // image.onload = function() {
    initScene()
    requestAnimationFrame(drawScene)
  };
// };

function initScene() {
  setEventListner()
  const canvas = document.querySelector('#glCanvas');
  glManager.gl = canvas.getContext('webgl');
  var gl = glManager.gl

  if (!gl) {
    alert("Unable to initialize WebGL. Your browser or machine may not support it.");
    return;
  }

  /////////////////////// Texture setting





  //////////////////////////////////////

  const vShader = createShader(gl, gl.VERTEX_SHADER, vsSource)
  const fShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource)
  const vBShader = createShader(gl, gl.VERTEX_SHADER, vsBSource)
  const fBShader = createShader(gl, gl.FRAGMENT_SHADER, fsBSource)

  glManager.programs[0] = createProgram(gl, [vBShader, fBShader])

  glManager.positionBAttributeLocation = gl.getAttribLocation(glManager.programs[0], "aposition");

  var background = new Shape(-1, -1, 2.0)
  background.positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, background.positionBuffer)
  setBackgroundVerticies(background.origin.x,background.origin.y)

  // background.texture = gl.createTexture();
  // gl.bindTexture(gl.TEXTURE_2D, background.texture);
  //
  // // Set the parameters so we can render any size image.
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  //
  // // Upload the image into the texture.
  // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  let url = "file:///Users/vladimir/Developer/JavaScript/TetrisWebGL/res/background.jpg"
  background.texture = loadImageAndCreateTextureInfo(url)

  glManager.background = background

  //////////////////////////////////////////////////////////////

  glManager.programs[1] = createProgram(gl, [vShader, fShader]);

  // getting attr reference (index)
  glManager.positionAttributeLocation = gl.getAttribLocation(glManager.programs[1], "aposition");
  glManager.matrixUniformLocation = gl.getUniformLocation(glManager.programs[1], "umatrix")

  var u1x4 = new Shape(0, 0, glManager.unitSize)
  var u2x2 = new Shape(0, 0, glManager.unitSize)

  u1x4.positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, u1x4.positionBuffer)
  set1x4PrimitiveVerticies(u1x4.origin.x, u1x4.origin.y,u1x4.unitStep)

  u2x2.positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, u2x2.positionBuffer)
  set2x2PrimitiveVerticies(u2x2.origin.x, u2x2.origin.y, u2x2.unitStep)

  glManager.shapes.push(u2x2)
  glManager.shapes.push(u1x4)

}

function drawScene(now) {
  // get delta
  let delta = (now - glManager.then) * 0.001
  glManager.then = now

  let dAngle = delta * dps
  let distance = 0.5 * delta
  var sps = 2.0 * delta

  var gl = glManager.gl

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
  gl.drawArrays(gl.TRIANGLES, 0, 6)

  gl.useProgram(glManager.programs[1])

  for (let shape of glManager.shapes) {
    ///////////////////////////// Translation

    newTranslationValues(shape, distance)

    let translationMatrix = glManager.transformation.translation(
      shape.translation[0],shape.translation[1]
    )

    //////////////////////////// Rotation
    newRotationValues(shape, dAngle)
    let rotationMatrix = glManager.transformation.rotation(shape.degrees)


    ////////////////////////////// Scaling
    newScalingValues(shape, sps)
    var scalingMatrix = glManager.transformation.scaling(shape.scaling[0],shape.scaling[1])

    var matrix = [];
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
