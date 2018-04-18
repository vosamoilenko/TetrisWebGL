class Unit extends Shape {
  constructor(x, y, z, step) {
    super(x, y, z, step)

    this.updateFrame()
    this.setVerticiesAndBufferData = function(gl) {
      // let step = glManager.unitSize
      // console.log(this.origin.y); debugger;
      var positions = unitBlock3d(
        this.origin.x - 1,
        -this.origin.y + 1 - (2/16),
        this.origin.z,
        step)

      gl.bufferData(
        gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
    }
  }
};
