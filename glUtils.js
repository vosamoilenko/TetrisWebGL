function newRotationValues(shape, deltaValue) {
  var rotationAnimationFlags = shape.animationFlags.rotation
  if (!rotationAnimationFlags.inverse) {
    if (shape.degrees < rotationAnimationFlags.to) {
        shape.degrees = shape.degrees + deltaValue
    }
  } else {
    if (shape.degrees > rotationAnimationFlags.to) {
        shape.degrees = shape.degrees - deltaValue
    }
  }
}

function newTranslationValues(shape, deltaValue) {
  var translationAnimationFlags = shape.animationFlags.translation
  if (!translationAnimationFlags.inverse) {
    if (shape.translation[0] < translationAnimationFlags.to[0]) {
        shape.translation[0] = shape.translation[0] + deltaValue
    }
    if (shape.translation[1] < translationAnimationFlags.to[1]){
        shape.translation[1] = shape.translation[1] + deltaValue
    }
  } else {
    if (shape.translation[0] > translationAnimationFlags.to[0]) {
        shape.translation[0] = shape.translation[0] - deltaValue
    }
     if (shape.translation[1] > translationAnimationFlags.to[1]){
        shape.translation[1] = shape.translation[1] - deltaValue
    }
  }
}

function newScalingValues(shape, deltaValue) {
  var scalingAnimationFlags = shape.animationFlags.scaling
  if (!scalingAnimationFlags.inverse) {
    if (shape.scaling[0] < scalingAnimationFlags.to[0]) {
        shape.scaling[0] = shape.scaling[0] + deltaValue
    }
    if (shape.scaling[1] < scalingAnimationFlags.to[1]){
        shape.scaling[1] = shape.scaling[1] + deltaValue
    }
  } else {
    if (shape.scaling[0] > scalingAnimationFlags.to[0]) {
        shape.scaling[0] = shape.scaling[0] - deltaValue
    }
    if (shape.scaling[1] > scalingAnimationFlags.to[1]){
        shape.scaling[1] = shape.scaling[1] - deltaValue
    }
  }
}

function createProgram(gl, shaders) {
  let program = gl.createProgram()

  for (let shader of shaders) {
    if (shader != undefined) {
      gl.attachShader(program, shader)
    }
  }
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    var info = gl.getProgramInfoLog(program);
    throw 'Could not compile WebGL program. \n\n' + info;
  }
  return program
}
function createShader(gl,type, source) {
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

function checkGlError(gl) {
  let err = gl.getError();
  if (err) {
    throw 'Could not enabler Vertex. With err: ' + err;
  }
}

function setColors() {
  var gl = glManager.gl
  let r = Math.random()
  let g = Math.random()
  let b = Math.random()

  let colors = [];
  for (var i = 0; i < 96*2; i+=4) {
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
