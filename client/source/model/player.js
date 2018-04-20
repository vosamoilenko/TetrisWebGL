class Player {
  constructor() {
    this.name = "";
    this.score = 0;''
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
      // game.playerReset();
      game.arenaSweep();
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

    // this.player.position.x -= dir;

    // debugger;

    // glManager.shape.animProps.translation.inverse = dir < 0 ? true : false;
    // glManager.shape.animProps.translation.direction = dir
    // glManager.shape.animProps.translation.to = [
    //   glManager.shape.translation[0] + glManager.screen.unitSize * dir,
    //   glManager.shape.translation[1],
    //   glManager.shape.translation[2]
    // ]
    // glManager.shape.isAnimated = true;

  }

};
