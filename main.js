// If applied, this commit will
'use strict'
var dps = 300
var glManager = {
  then: 0,
  shapes : [],
  unitSize: 0.1,
  transformation: {
    translation: (tx, ty) => {
      return [
        1, 0, 0,
        0, 1, 0,
        tx, ty, 1
      ];
    },
    rotation: (degrees) => {
      let radians = degrees * Math.PI / 180.0
      let sin = Math.sin(radians)
      let cos = Math.cos(radians)
      // console.log('sin = ' + sin);
      // console.log('cos = ' + cos);

      return [
        cos, -sin, 0,
        sin,  cos, 0,
        0  ,   0,  1,
      ];
    },
  }
}

function main() {
  initScene()
  requestAnimationFrame(drawScene)
};

function initScene() {
  setEventListner()
  glManager.transformation.rotation()
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
  glManager.matrixUniformLocation = gl.getUniformLocation(program, "u_matrix")


  // var u1x4 = new Shape(0.1)
  var u2x2 = new Shape(0, 0, glManager.unitSize)

  // u1x4.positionBuffer = gl.createBuffer()
  // gl.bindBuffer(gl.ARRAY_BUFFER, u1x4.positionBuffer)
  // set1x4PrimitiveVerticies(u1x4.unitStep)
  //
  // u1x4.colorBuffer = gl.createBuffer()
  // glManager.gl.bindBuffer(gl.ARRAY_BUFFER, u1x4.colorBuffer)
  // setColors()

  u2x2.positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, u2x2.positionBuffer)
  set1x4PrimitiveVerticies(u2x2.origin.x, u2x2.origin.y, u2x2.unitStep)

  u2x2.colorBuffer = gl.createBuffer()
  glManager.gl.bindBuffer(gl.ARRAY_BUFFER, u2x2.colorBuffer)
  setColors()

  // glManager.shapes.push(u1x4)
  glManager.shapes.push(u2x2)


}

function drawScene(now) {
  var gl = glManager.gl
  var program = glManager.program
  var positionAttributeLocation = glManager.positionAttributeLocation
  var colorAttributeLocation = glManager.colorAttributeLocation

  gl.viewport(0,0,gl.canvas.width,gl.canvas.height)

  gl.clearColor(78/255.0,159/255.0,255/255.0,1.0)
  gl.clear(gl.COLOR_BUFFER_BIT || gl.COLOR_DEPTH_BIT)

  gl.useProgram(program)

  let delta = (now - glManager.then) * 0.001
  let dAngle = delta * dps
  glManager.then = now

  for (let shape of glManager.shapes) {

    let translationMatrix = glManager.transformation.translation(
      shape.translation[0],shape.translation[1]
    )

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

    var matrix = [];
    mat3.multiply(matrix, translationMatrix, rotationMatrix)
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

    gl.enableVertexAttribArray(colorAttributeLocation)
    gl.bindBuffer(gl.ARRAY_BUFFER, shape.colorBuffer)

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
      offset
    )

    let verticiesCounter = 24
    var drawingOffset = 0
    gl.drawArrays(gl.TRIANGLES, drawingOffset , verticiesCounter)
  }

  requestAnimationFrame(drawScene)
}
