/*
a01468749
Volodymyr Samoilenko
*/

class Line extends Shape {
  constructor(x, y, step) {
    super(x, y, step)
    this.size = {
      width: this.unitStep * 4,
      height: this.unitStep * 1,
    }
    this.updateFrame()
    this.setVerticiesAndBufferData = function(gl) {
      var values = [1,2,3,4];
      var positions = []
      positions = unitBlock3d(x, y, step)
      for (var i of values) {
          positions = positions.concat(unitBlock3d(x + (step * i), y, step))
      }
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
    }
  }


};
