class InfoShape extends Shape {
  constructor(x, y, z, step) {
    super(x, y, z,step)
    this.setVerticiesAndBufferData = function(gl) {
      // fill verticies
      var positions = [
        0.25, 1, 0,     1, -1, 0,     1, 1, 0,
        0.25, 1, 0,  0.25, -1, 0,    1, -1, 0,
      ]
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
    }
  }
};
