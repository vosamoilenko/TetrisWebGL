// set a 1x4 block
function set1x4PrimitiveVerticies(unitStep) {

  var gl = glManager.gl
  var step = unitStep
  var x = -0.8
  var y = 0

  if ((x + 0.5) < -1.0 || (x + 0.5) > 1.0 || (y + 0.5) < -1.0 || (y + 0.5) > 1.0) {
    x = 0;
    y = 0.2;
  }

  var positions = [];
  positions = unitBlock(x, y, step)
  positions = positions.concat(unitBlock(x + step, y, step))
  positions = positions.concat(unitBlock(x + (step + step), y, step))
  positions = positions.concat(unitBlock(x + (step + step + step), y, step))

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
}

// set a 2x2 block
function set2x2PrimitiveVerticies(unitStep) {
  var gl = glManager.gl
  var step = unitStep
  var x = 0.2
  var y = 0

  var positions = [];
  positions = unitBlock(x ,y, step)
  positions = positions.concat(unitBlock(x, y + step, step))
  positions = positions.concat(unitBlock(x + step, y, step))
  positions = positions.concat(unitBlock(x + step, y + step, step))

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
}
