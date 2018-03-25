/*
a01468749
Volodymyr Samoilenko
*/

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
  }
  updateFrame() {
    this.center = {
      x: this.origin.x + (this.size.width/2.0),
      y: this.origin.y + (this.size.height/2.0),
    }
  }

  updateMatrix(value) {
    let rotationMatrix = this.rotate(value.rotation())
    let translationMatrix = this.translate(value.translation())
    let scalingMatrix = this.scale(value.scale())

    var matrix = [];
    mat3.multiply(matrix, translationMatrix, scalingMatrix)
    mat3.multiply(matrix, matrix, rotationMatrix)
    return matrix;
  }

  scale(value) {
    var scalingAnimationFlags = this.animationFlags.scaling
    if (!scalingAnimationFlags.inverse) {
      if (this.scaling[0] < scalingAnimationFlags.to[0]) {
          this.scaling[0] = this.scaling[0] + value
      }
      if (this.scaling[1] < scalingAnimationFlags.to[1]){
          this.scaling[1] = this.scaling[1] + value
      }
    } else {
      if (this.scaling[0] > scalingAnimationFlags.to[0]) {
          this.scaling[0] = this.scaling[0] - value
      }
      if (this.scaling[1] > scalingAnimationFlags.to[1]){
          this.scaling[1] = this.scaling[1] - value
      }
    }
    return glManager.transformation.scaling(
      this.scaling[0],this.scaling[1]
    )
  }

  translate(value) {
    var translationAnimationFlags = this.animationFlags.translation
    if (!translationAnimationFlags.inverse) {
      if (this.translation[0] < translationAnimationFlags.to[0]) {
          this.translation[0] = this.translation[0] + value
      }
      if (this.translation[1] < translationAnimationFlags.to[1]){
          this.translation[1] = this.translation[1] + value
      }
    } else {
      if (this.translation[0] > translationAnimationFlags.to[0]) {
          this.translation[0] = this.translation[0] - value
      }
       if (this.translation[1] > translationAnimationFlags.to[1]){
          this.translation[1] = this.translation[1] - value
      }
    }

    return glManager.transformation.translation(
      this.translation[0],this.translation[1]
    )
  }

  rotate(value) {
    var rotationAnimationFlags = this.animationFlags.rotation
    if (!rotationAnimationFlags.inverse) {
      if (this.degrees < rotationAnimationFlags.to) {
          this.degrees = this.degrees + value
      }
    } else {
      if (this.degrees > rotationAnimationFlags.to) {
          this.degrees = this.degrees - value
      }
    }
    return this.getRotationMatrix()
  }
  getRotationMatrix() {
    let toCenter = glManager.transformation.translation(
      -(this.origin.x + (this.size.width / 2.0)),
      -(this.origin.y + (this.size.height / 2.0)))

    let toOrigin = glManager.transformation.translation(
      this.origin.x,
      this.origin.y)

    var matrix = []
    var rotationMatrix = glManager.transformation.rotation(this.degrees)
    mat3.multiply(matrix, toOrigin, rotationMatrix)
    mat3.multiply(matrix, matrix, toCenter)

    return matrix;
  }



};
