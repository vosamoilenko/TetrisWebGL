/*
a01468749
Volodymyr Samoilenko
*/

class Square extends Shape {
  constructor(x, y, z, step) {
    super(x, y, z, step)
    this.updateFrame()
    this.setVerticiesAndBufferData = function(gl) {
      let step = glManager.unitSize
      var positions = unitBlock3d(this.origin.x, this.origin.y, this.origin.z, step)
      positions = positions.concat(unitBlock3d(this.origin.x+step, this.origin.y, this.origin.z, step))
      positions = positions.concat(unitBlock3d(this.origin.x, this.origin.y+step, this.origin.z, step))
      positions = positions.concat(unitBlock3d(this.origin.x+step, this.origin.y+step, this.origin.z, step))
      // console.log(positions.length);
      gl.bufferData(
        gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
    }
  }
};
