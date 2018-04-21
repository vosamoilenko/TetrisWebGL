/*
a01468749
Volodymyr Samoilenko
*/

class Player {
  constructor() {
    this.name = "";
    this.score = 0;
    this.row = 0;
    this.position = {
      x: 5,
      y: 0
    }
    this.activeShape = randShape();
  }
  reset() {
    this.activeShape = randShape();
    this.position.y = 0;
    this.position.x = 5;
  }
  colorIndex() {
    let c = 0;
    this.activeShape.forEach( (row, y) => {
      row.forEach( (value, x) => {
        if (value !== 0) {
          c = value;
        }
      });
    });
    return c;
  }
  drop() {
    if (game.timerOff) {
      return;
    }

    this.position.y += 1;
    glManager.shape.translation = [
      glManager.shape.translation[0],
      0,
      0
    ];

    if (game.isCollide()) {
      this.position.y -= 1;
      game.merge();
      game.player.reset();
      game.rowAbsorption();
      if (game.isCollide()) {
        game.landed.forEach(row => row.fill(0))
      }
    }
    game.props.moveCounter = 0;
  }
  rotate(direction) {

    let offset = 1;
    rotateMatrix(this.activeShape, direction);
    while (game.isCollide()) {
        this.position.x += offset;
        offset = -(offset + ( offset > 0 ? 1 : -1 ));
        if (offset > this.activeShape[0].length) {
            rotateMatrix(this.activeShape, -direction);
            this.position.x = pos;
            return;
        }
    }
  }
  move(direction) {

    this.position.x += direction;
    if (game.isCollide()) {
      this.position.x -= direction;
      return;
    }

    this.position.x -= direction;
    glManager.startHorizontalTransltion(direction);
  }

  scale(direction) {

    glManager.shape.animProps.scaling.to[
      glManager.shape.scaling[0] + direction/10,
      glManager.shape.scaling[1] + direction/10,
      0
    ];
  }

};
