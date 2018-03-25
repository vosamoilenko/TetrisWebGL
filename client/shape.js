class Shape {
  constructor(x,y,unitStep) {
    this.positionBuffer = []
    this.colorBuffer = []

    this.unitStep = unitStep
    this.origin = {x:x, y:y}
    this.cetner = {}
    this.size = {}
    this.translation = [getRandom(),getRandom()]
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
    this.updateFrame = function() {
      this.center = {
        x: this.origin.x + (this.size.width/2.0),
        y: this.origin.y + (this.size.height/2.0),
      }
      console.log(this.center);
    }
  }



};
