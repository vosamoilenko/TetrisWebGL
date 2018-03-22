'use strict'

var dps = 300
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
  // TODO: fix

  const vShader = createShader(gl, gl.VERTEX_SHADER, vsSource)
  const fShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource)
  const vBShader = createShader(gl, gl.VERTEX_SHADER, vsBSource)
  const fBShader = createShader(gl, gl.FRAGMENT_SHADER, fsBSource)

  glManager.programs[0] = gl.createProgram(); // bacgkround program
  checkGlError(gl)

  gl.attachShader(glManager.programs[0], vBShader); // bind shader
  gl.attachShader(glManager.programs[0], fBShader);
  gl.linkProgram(glManager.programs[0]); // link them all togethe

  if (!gl.getProgramParameter(glManager.programs[0], gl.LINK_STATUS)) {
    var info = gl.getProgramInfoLog(program);
    throw 'Could not compile WebGL program. \n\n' + info;
  }

  glManager.positionBAttributeLocation = gl.getAttribLocation(glManager.programs[0], "aposition");

  var background = new Shape(-1, -1, 2.0)
  background.positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, background.positionBuffer)
  setBackgroundVerticies(background.origin.x,background.origin.y)

  glManager.background = background

  //////////////////////////////////////////////////////////////

  glManager.programs[1] = gl.createProgram(); // components program
  checkGlError(gl)

  gl.attachShader(glManager.programs[1], vShader); // bind shader
  gl.attachShader(glManager.programs[1], fShader);
  gl.linkProgram(glManager.programs[1]); // link them all together

  // getting attr reference (index)
  glManager.positionAttributeLocation = gl.getAttribLocation(glManager.programs[1], "a_position");
  glManager.matrixUniformLocation = gl.getUniformLocation(glManager.programs[1], "u_matrix")

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
  let dAngle = delta * dps
  let distance = 0.5 * delta
  glManager.then = now

  var gl = glManager.gl
  var positionAttributeLocation = glManager.positionAttributeLocation

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
    // refactor
    var translationAnimationFlags = shape.animationFlags.translation
    if (!translationAnimationFlags.inverse) {
      if (shape.translation[0] < translationAnimationFlags.to[0]) {
          shape.translation[0] = shape.translation[0] + distance
      } else if (shape.translation[1] < translationAnimationFlags.to[1]){
          shape.translation[1] = shape.translation[1] + distance
      }
    } else {
      if (shape.translation[0] > translationAnimationFlags.to[0]) {
          shape.translation[0] = shape.translation[0] - distance
      } else if (shape.translation[1] > translationAnimationFlags.to[1]){
          shape.translation[1] = shape.translation[1] - distance
      }
    }

    let translationMatrix = glManager.transformation.translation(
      shape.translation[0],shape.translation[1]
    )

    //////////////////////////// Rotation
    var angle = shape.degrees;
    var rotationAnimationFlags = shape.animationFlags.rotation
    if (!rotationAnimationFlags.inverse) {
      if (angle < rotationAnimationFlags.to) {
          angle = (angle+dAngle)
      }
    } else {
      if (angle > rotationAnimationFlags.to) {
          angle = (angle-dAngle)
      }
    }

    let rotationMatrix = glManager.transformation.rotation(angle)
    shape.degrees = angle

    ////////////////////////////// Scaling
    var sps = 2.0 * delta
    var scalingAnimationFlags = shape.animationFlags.scaling
    if (!scalingAnimationFlags.inverse) {
      if (shape.scaling[0] < scalingAnimationFlags.to[0]) {
          shape.scaling[0] = shape.scaling[0] + sps
      }
      if (shape.scaling[1] < scalingAnimationFlags.to[1]){
          shape.scaling[1] = shape.scaling[1] + sps
      }
    } else {
      if (shape.scaling[0] > scalingAnimationFlags.to[0]) {
          shape.scaling[0] = shape.scaling[0] - sps
      }
      if (shape.scaling[1] > scalingAnimationFlags.to[1]){
          shape.scaling[1] = shape.scaling[1] - sps
      }
    }

    var scalingMatrix = glManager.transformation.scaling(shape.scaling[0],shape.scaling[1])

    var matrix = [];
    mat3.multiply(matrix, translationMatrix, scalingMatrix)
    mat3.multiply(matrix, matrix, rotationMatrix)
    gl.uniformMatrix3fv(glManager.matrixUniformLocation, false, matrix)

    gl.enableVertexAttribArray(positionAttributeLocation)
    gl.bindBuffer(gl.ARRAY_BUFFER, shape.positionBuffer)

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
      offset
    )

    let verticiesCounter = 24
    var drawingOffset = 0
    gl.drawArrays(gl.TRIANGLES, drawingOffset , verticiesCounter)
  }

  requestAnimationFrame(drawScene)
}
