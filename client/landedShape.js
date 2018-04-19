/*
a01468749
Volodymyr Samoilenko
*/
class LandedShape extends Shape {
  constructor(x, y, z, step) {
    super(x, y, z, step)
    this.updateFrame()

    this.setVerticiesAndBufferData = function(gl) {
      let arr = [];
      let shape = game.player.activeShape;

      arr = mapVerticies(
        game.landed,
        {x: 0, y: 0}
      );
      return arr;
      gl.bufferData(
        gl.ARRAY_BUFFER, new Float32Array(arr), gl.STATIC_DRAW
      );
    }
    this.setColorAndBufferData = function(gl) {
      let arr = [];
      let shape = game.landed;

      arr = mapColor(
        shape
      );
      // debugger;
      return arr;
    }

  }
};
