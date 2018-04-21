/*
a01468749
Volodymyr Samoilenko
*/

class Game {

  constructor(glManager) {
    this.glManager = glManager
    this.player = new Player()

    this.props = {
      // drop to the next row
      moveIntervall: 1.0,
      moveCounter: 0,
      delta: 0,
      then: 0,
    }
    this.isPause = false
    this.timerOff = false
    this.landed = createMatrix(
      screen.playableMatrixSize.w,
      screen.playableMatrixSize.h,
    );
  }

  start() {
    requestAnimationFrame( now => this.update(now));
  }

  isCollide() {
    let shape = this.player.activeShape;
    let pos = this.player.position;

    for (let y = 0; y < shape.length; ++y) {
      for (let x = 0; x < shape[y].length; ++x) {
        if ( shape[y][x] !== 0 && (this.landed[y + pos.y] && this.landed[y + pos.y][x + pos.x]) !== 0) {
          return true;
        }
      }
    }
    return false;
  }
  pause() {
    this.isPause = !this.isPause
  }
  merge() {
    this.player.activeShape.forEach((row, y)=> {
      row.forEach((value, x) => {
        if (value !== 0) {
          this.landed[y + this.player.position.y][x + this.player.position.x] = value;
        }
      });
    });
  }

  rowAbsorption() {
    let rowCount = 0;
    row: for (let y = this.landed.length -1; y > 0; --y) {
        for (let x = 0; x < this.landed[y].length; ++x) {
            if (this.landed[y][x] === 0) {
                continue row;
            }
        }

        const row = this.landed.splice(y, 1)[0].fill(0);
        this.landed.unshift(row);
        ++y;

        this.player.score += 10 * MULTIPLAYER;
        this.player.row += 1;
    }
  }

  update(now = 0) {
    if (!this.isPause) {

      glManager.shape.animProps.translation.down = true
      this.player.position.y += 1;
      if (this.isCollide()) {
        glManager.shape.animProps.translation.down = false
      }
      this.player.position.y -= 1;

      this.props.delta = (now - this.props.then) * 0.001;
      this.props.then = now;
      this.props.moveCounter += this.props.delta;
      if (this.props.moveCounter > this.props.moveIntervall / MULTIPLAYER) {
        this.player.drop();
      }
      glManager.drawScene(this.props.delta);

    }
    requestAnimationFrame( (now) => {this.update(now)});
  }

}
