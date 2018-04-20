class Game {

  constructor(glManager) {
    this.glManager = glManager
    this.player = new Player(this.createPiece("L"))

    this.props = {
      // size of array (2d array for saving tetris shapes like 1 or 0)
      size: {w: 10, h: 16},
      // drop to the next row
      moveIntervall: 1.0,
      moveCounter: 0,
      delta: 0,
      then: 0,
    }
    this.timerOff = false
    this.landed = this.createMatrix(
      this.props.size.w, this.props.size.h
    );
  }

  start() {
    requestAnimationFrame( now => this.update(now));
  }

  arenaSweep() {
    let rowCount = 1;
    outer: for (let y = this.landed.length -1; y > 0; --y) {
        for (let x = 0; x < this.landed[y].length; ++x) {
            if (this.landed[y][x] === 0) {
                continue outer;
            }
        }

        const row = this.landed.splice(y, 1)[0].fill(0);
        this.landed.unshift(row);
        ++y;

        // player.score += rowCount * 10;
        // rowCount *= 2;
    }
}

  collide(landed, player) {
    const [m,o] = [player.activeShape, player.position];
    for (let y = 0; y < m.length; ++y) {
      for (let x = 0; x < m[y].length; ++x) {
        if ( m[y][x] !== 0 && (landed[y + o.y] && landed[y + o.y][x + o.x]) !== 0) {
          return true;
        }
      }
    }
    return false;
  }

  playerMoveH(dir) {

    this.player.position.x += dir;

    if (this.collide(this.landed, this.player)) {
      this.player.position.x -= dir;
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

  playerRotate(dir) {
      // this.animation.rotation.to += 90

      const pos = this.player.position.x;
      let offset = 1;
      this.rotate(this.player.activeShape, dir);
      while (this.collide(this.landed, this.player)) {
          this.player.position.x += offset;
          offset = -(offset + (offset > 0 ? 1 : -1));
          if (offset > this.player.activeShape[0].length) {
              // this.rotate(this.player.activeShape, -dir);
              this.player.position.x = pos;
              return;
          }
      }
  }

  rotate(matrix, dir) {
    for (let y = 0; y < matrix.length; ++y) {
      for (let x = 0; x < y; ++x) {
        [
          matrix[x][y],
          matrix[y][x],
        ] = [
          matrix[y][x],
          matrix[x][y],
        ];
      }
    }

    if (dir > 0) {
      matrix.forEach(row => row.reverse());
    } else {
      matrix.reverse();
    }
  }


  playerMove() {

    if (this.timerOff) {
      return;
    }
    this.player.position.y += 1;
    glManager.shape.translation = [
      glManager.shape.translation[0],
      0,
      0
    ];

    if (this.collide(this.landed, this.player)) {

      this.player.position.y--;
      this.merge(this.landed, this.player);
      this.playerReset();
      this.arenaSweep();
      if (this.collide(this.landed, this.player)) {
        this.landed.forEach(row => row.fill(0))
      }
    }
    this.props.moveCounter = 0;
  }

  playerReset() {
    const pieces = "ILJOTSZ";

    this.player.activeShape = this.createPiece(
      pieces[pieces.length * Math.random() | 0]
    );
    this.player.position.y = 0;
    this.player.position.x = (this.landed[0].length / 2 | 0) -
                   (this.player.activeShape[0].length / 2 | 0);
  }
  createPiece(type) {
    if (type === 'T') {
      return [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0],
      ];
    } else if (type === 'O') {
      return [
        [2, 2],
        [2, 2],
      ]
    } else if (type === 'L') {
      return [
        [0, 3, 0],
        [0, 3, 0],
        [0, 3, 3],
      ]
    } else if (type === 'J') {
      return [
        [0, 4, 0],
        [0, 4, 0],
        [4, 4, 0],
      ]
    } else if (type === 'I') {
      return [
        [0, 5, 0, 0],
        [0, 5, 0, 0],
        [0, 5, 0, 0],
        [0, 5, 0, 0],
      ]
    } else if (type === 'S') {
      return [
        [0, 6, 6],
        [6, 6, 0],
        [0, 0, 0],
      ]
    } else if (type === 'Z') {
      return [
        [7, 7, 0],
        [0, 7, 7],
        [0, 0, 0],
      ]
    }
  }
  createMatrix(w, h) {
    const matrix = [];
    while (h--) {
      matrix.push(new Array(w).fill(0));
    }
    return matrix;
  }
  merge(landed, player) {
    player.activeShape.forEach((row, y)=> {
      row.forEach((value, x) => {
        if (value !== 0) {
          landed[y + player.position.y][x + player.position.x] = value;
        }
      });
    });
  }

  update(now = 0) {
    glManager.shape.animProps.translation.down = true
    this.player.position.y += 1;
    if (this.collide(this.landed, this.player)) {
      // this.player.position.y -= 1;
      glManager.shape.animProps.translation.down = false
    }
    this.player.position.y -= 1;

    this.props.delta = (now - this.props.then) * 0.001;
    this.props.then = now;
    this.props.moveCounter += this.props.delta;
    if (this.props.moveCounter > this.props.moveIntervall) {
      this.playerMove();
    }
    glManager.drawScene(this.props.delta);

    requestAnimationFrame( (now) => {this.update(now)});
  }

}
