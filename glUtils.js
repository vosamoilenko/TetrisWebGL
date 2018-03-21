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
