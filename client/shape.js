/*
a01468749
Volodymyr Samoilenko
*/

class Shape {
  constructor(x,y,z,step) {
    this.positionBuffer = []
    this.colorBuffer = []
    this.indexBuffer = []

    this.origin = {x:x, y:y, z:z}
    this.cetner = {}
    this.size = {}
    this.translation = [0,0,0]
    this.rotation = [0,1,0]
    this.scaling = [1,1,1]
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
      z: this.origin.z + (this.size.height/2.0),
    }
  }

  updateMatrix(value) {
    let rotationMatrix = this.rotate(value.rotation())
    let translationMatrix = this.translate(value.translation())
    let scalingMatrix = this.scale(value.scale())
    // console.log(translationMatrix);

    var matrix = [];
    matrix = mat4.identity(matrix);
    // console.log(matrix);
    // return;
    matrix = mat4.multiply(matrix, matrix, translationMatrix);


    // this.degrees += 1;

    mat4.multiply(matrix, translationMatrix, scalingMatrix)
    mat4.multiply(matrix, matrix, rotationMatrix)
    return matrix;

    // return translationMatrix;
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
      if (this.scaling[2] < scalingAnimationFlags.to[2]){
          this.scaling[2] = this.scaling[2] + value
      }
    } else {
      if (this.scaling[0] > scalingAnimationFlags.to[0]) {
          this.scaling[0] = this.scaling[0] - value
      }
      if (this.scaling[1] > scalingAnimationFlags.to[1]){
          this.scaling[1] = this.scaling[1] - value
      }
      if (this.scaling[2] > scalingAnimationFlags.to[2]){
          this.scaling[2] = this.scaling[2] - value
      }
    }
    return glManager.transformation.scaling(
      this.scaling[0],this.scaling[1],this.scaling[2]
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
      if (this.translation[2] < translationAnimationFlags.to[2]){
          this.translation[2] = this.translation[2] + value
      }
    } else {
      if (this.translation[0] > translationAnimationFlags.to[0]) {
          this.translation[0] = this.translation[0] - value
      }
       if (this.translation[1] > translationAnimationFlags.to[1]){
          this.translation[1] = this.translation[1] - value
      }
      if (this.translation[2] > translationAnimationFlags.to[1]){
         this.translation[2] = this.translation[2] - value
     }
    }

    return glManager.transformation.translation(
      this.translation[0],this.translation[1], this.translation[2]
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
    // TODO

    let toCenter = glManager.transformation.translation(
      -(this.origin.x + (glManager.unitStep / 2.0)),
      -(this.origin.y + (glManager.unitStep / 2.0)),
      -(this.origin.z + (glManager.unitStep / 2.0)),)
    //
    let toOrigin = glManager.transformation.translation(
      this.origin.x,
      this.origin.y,
      this.origin.z)

    // this.degrees += 0.5

    var matrix = []
    var rotationMatrix = glManager.transformation.rotation(this.degrees,0)
    mat4.multiply(rotationMatrix, rotationMatrix, glManager.transformation.rotation(this.degrees,1))
    mat4.multiply(rotationMatrix, rotationMatrix, glManager.transformation.rotation(this.degrees,2))
    // mat4.multiply(rotationMatrix,rotationMatrix,glManager.transformation.rotation(this.degrees,1))
    // mat4.multiply(matrix, toOrigin, rotationMatrix)
    // console.log(matrix);
    // mat4.multiply(matrix, matrix, toCenter)
    // console.log(matrix);
    matrix = rotationMatrix


    return matrix;
  }



};
