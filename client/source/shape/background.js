/*
a01468749
Volodymyr Samoilenko
*/

class Background extends Shape {
  constructor(x, y, z, step) {
    super(x, y, z, step)
    this.setVerticiesAndBufferData = function(gl) {
      // fill verticies
      var positions = []
      var positions = unitBlock3d(this.origin.x, this.origin.y, this.origin.z, step)

      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
    }
  }


};
