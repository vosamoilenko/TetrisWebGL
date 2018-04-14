/*
a01468749
Volodymyr Samoilenko
*/

class Background extends Shape {
  constructor(x, y, step) {
    super(x, y, step)
    this.size = {
      width: this.unitStep * 2,
      height: this.unitStep * 2,
    }
    this.updateFrame()
    this.setVerticiesAndBufferData = function(gl) {
      // fill verticies
      var positions = []
      positions = unitBlock3d(x ,y, step)
      positions = positions.concat(unitBlock3d(x, y + step, step))
      positions = positions.concat(unitBlock3d(x + step, y, step))
      positions = positions.concat(unitBlock3d(x + step, y + step, step))

      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
    }
  }


};
