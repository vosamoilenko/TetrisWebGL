function loadImageAndCreateTextureInfo(url) {
    var gl = glManager.gl
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    // Fill the texture with a 1x1 blue pixel.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                  new Uint8Array([0, 0, 255, 255]));

    // let's assume all images are not a power of 2
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    var textureInfo = {
      width: 1,   // we don't know the size until it loads
      height: 1,
      texture: tex,
    };
    var img = new Image();
    img.addEventListener('load', function() {
      textureInfo.width = img.width;
      textureInfo.height = img.height;

      gl.bindTexture(gl.TEXTURE_2D, textureInfo.texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    });
    requestCORSIfNotSameOrigin(img, url);
    // img.crossOrigin = "null";
    img.src = url;

    return textureInfo;
  }

  function requestCORSIfNotSameOrigin(img, url) {
  if ((new URL(url)).origin !== window.location.origin) {
    img.crossOrigin = "";
  }
}

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
