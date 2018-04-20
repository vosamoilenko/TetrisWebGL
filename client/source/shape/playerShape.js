/*
a01468749
Volodymyr Samoilenko
*/
let cccc = 0
class PlayerShape extends Shape {
  constructor(x, y, z, step) {
    super(x, y, z, step)

    this.setVerticiesAndBufferData = function(gl) {
      let arr = [];
      let shape = game.player.activeShape;

      arr = mapVerticies(
        game.player.activeShape,
        game.player.position
      );
      return arr;
    }
    this.setColorAndBufferData = function(gl) {
      let arr = [];
      let shape = game.player.activeShape;

      arr = mapColor(
        shape
      );
      return arr;
    }
  }
};
