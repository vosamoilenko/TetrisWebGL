/*
a01468749
Volodymyr Samoilenko
*/

class TShape extends Shape {
  constructor(x, y, z, step) {
    super(x, y, z, step)
    this.size = {
      width: this.unitStep * 3,
      height: this.unitStep * 2,
    }
    this.updateFrame()
    this.setVerticiesAndBufferData = function(gl) {
      // fill verticies
      let step = glManager.unitSize
      var positions = []
      positions = unitBlock3d(x, y, z, step)
      positions = positions.concat(unitBlock3d(x + step, y, z, step))
      positions = positions.concat(unitBlock3d(x + (step * 2), y, z, step))
      positions = positions.concat(unitBlock3d(x + step, y + step, z, step))

      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
    }
  }
};
