class Shape {
  constructor(unitStep) {
    this.unitStep = unitStep
    this.positionBuffer = []
    this.colorBuffer = []
    this.size = {
      width: this.unitStep,
      height: this.unitStep
    }
    this.translation = [0,0]
    this.rotation = [0,1]
    this.degrees = 0
  }
  // get degrees() {return this._degrees}
  // set degrees(value) {
  //   this._degrees = value
  //   var radians = this.degrees * Math.PI / 180
  //   var cos = Math.cos(radians)
  //   var sin = Math.sin(radians)
  //   this.translation[0] = sin
  //   this.translation[1] = cos
  // }
}
