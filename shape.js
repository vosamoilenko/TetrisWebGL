class Shape {
  constructor(x, y, unitStep) {
    this.unitStep = unitStep
    this.positionBuffer = []
    this.colorBuffer = []
    this.origin = {
      x: x,
      y: y
    }
    this.translation = [0,0]
    this.rotation = [0,1]
    this.scaling = [1,1]
    this.degrees = 0.0
    this.animationFlags = {
      rotation: {
        inverse: false,
        to: this.degrees,
      },
      translation: {
        inverse: false,
        to: this.translation,
      },
      scaling: {
        inverse: false,
        to: this.scaling,
      }
    }
  }
}
