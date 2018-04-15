class Game {
  constructor() {
    this.score = 0
    this.shapes = []
    this.landed = []
    this.player = undefined

    this.map = []
    for (var i = 0; i < 16; ++i) {
      this.map[i] = new Array(10).fill(0);
    }
    console.table(this.map)
  }
}
