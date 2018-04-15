/*
a01468749
Volodymyr Samoilenko
*/

class LShape extends Shape {
  constructor(x, y, z, step) {
    super(x, y, z, step)
    this.size = {
      width: this.unitStep * 2,
      height: this.unitStep * 3,
    }
    this.updateFrame()
    this.setVerticiesAndBufferData = function(gl) {
      let step = glManager.unitSize
      var positions = []
      positions = unitBlock3d(x, y, z, step)
      positions = positions.concat(unitBlock3d(x, y + step, z, step))
      positions = positions.concat(unitBlock3d(x, y + step * 2, z, step))
      positions = positions.concat(unitBlock3d(x + step, y, z, step))

      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
    }
  }


};
