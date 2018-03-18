// set a 1x4 block
function set1x4PrimitiveVerticies(glManager) {

  var gl = glManager.gl
  var step = glManager.size.width
  var x = randomFloat()
  var y = x + step

  if ((x + 0.5) < -1.0 || (x + 0.5) > 1.0 || (y + 0.5) < -1.0 || (y + 0.5) > 1.0) {
    x = 0;
    y = 0.2;
  }

  var positions = [];
  positions = unitBlock(x, y)
  positions = positions.concat(unitBlock(x + step, y, step))
  positions = positions.concat(unitBlock(x + (step + step), y, step))
  positions = positions.concat(unitBlock(x + (step + step + step), y, step))

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
}

// set a 2x2 block
function set2x2PrimitiveVerticies(glManager) {
  var gl = glManager.gl
  var step = glManager.size.width
  var x = randomFloat()
  var y = x + step

  var positions = [];
  positions = unitBlock(x ,y, step)
  positions = positions.concat(unitBlock(x, y + step, step))
  positions = positions.concat(unitBlock(x + step, y, step))
  positions = positions.concat(unitBlock(x + step, y + step, step))

  console.log(x);
  console.log(y);
  console.log(step);

  // positions.forEach(function(element) {
  //     console.log(element);
  // })


  // NOTE: gl.bufferData(gl.ARRAY_BUFFER, ...) will affect
  // whatever buffer is bound to the `ARRAY_BUFFER` bind point

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
}
