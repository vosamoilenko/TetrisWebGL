/*
a01468749
Volodymyr Samoilenko
*/

class Background extends Shape {
  constructor(x, y, z, step) {
    super(x, y, z, step)
    this.size = {
      width: this.unitStep * 2,
      height: this.unitStep * 2,
    }
    this.updateFrame()
    this.setVerticiesAndBufferData = function(gl) {
      // fill verticies
      var positions = []
      var positions = unitBlock3d(this.origin.x, this.origin.y, this.origin.z, 2)
      positions = positions.concat(unitBlock3d(this.origin.x+step, this.origin.y, this.origin.z, 2))
      positions = positions.concat(unitBlock3d(this.origin.x, this.origin.y+step, this.origin.z, 2))
      positions = positions.concat(unitBlock3d(this.origin.x+step, this.origin.y+step, this.origin.z, 2))


      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
    }
  }


};
