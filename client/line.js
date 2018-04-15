/*
a01468749
Volodymyr Samoilenko
*/

class Line extends Shape {
  constructor(x, y, z, step) {
    super(x, y, z, step)
    this.size = {
      width: this.unitStep * 4,
      height: this.unitStep * 1,
    }
    this.updateFrame()
    this.setVerticiesAndBufferData = function(gl) {
      var values = [1,2,3,4];
      let step = glManager.unitSize
      var positions = []
      for (var i of values) {
          positions = positions.concat(unitBlock3d(x + (step * i), y, z, step))
      }
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
    }
  }


};
