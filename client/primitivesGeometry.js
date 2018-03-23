// set a 1x4 block
function set1x4PrimitiveVerticies(_x ,_y, unitStep) {
  var gl = glManager.gl
  var step = unitStep
  var x = _x
  var y = _y

  var positions = []
  positions = unitBlock(x, y, step)
  positions = positions.concat(unitBlock(x + step, y, step))
  positions = positions.concat(unitBlock(x + (step + step), y, step))
  positions = positions.concat(unitBlock(x + (step + step + step), y, step))

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
}
// set a 2x2 block
function set2x2PrimitiveVerticies(_x, _y, unitStep) {
  var gl = glManager.gl
  var step = unitStep
  var x = _x
  var y = _y

  var positions = []
  positions = unitBlock(x ,y, step)
  positions = positions.concat(unitBlock(x, y + step, step))
  positions = positions.concat(unitBlock(x + step, y, step))
  positions = positions.concat(unitBlock(x + step, y + step, step))

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
}

function setBackgroundVerticies(_x, _y) {
  var gl = glManager.gl
  var step = 2.0
  var x = _x
  var y = _y

  var positions = []
  positions = unitBlock(x ,y, step)

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
}
