/*
a01468749
Volodymyr Samoilenko
*/

class Shape {
  constructor(x,y,z,step, offset) {
    this.positionBuffer = []
    this.colorBuffer = []
    this.indexBuffer = []

    this.origin = {
      x:x,
      y:y,
      z:0}
    this.cetner = {}
    this.size = {}
    this.translation = [0,0,0]
    this.rotation = [0,1,0]
    this.scaling = [1,1,1]
    this.degrees = 0.0
    this.isAnimated = false

    this.animProps = {
      rotation: {
        inverse: false,
        to: this.degrees,
      },
      translation: {
        inverse: false,
        to: this.translation.slice(),
        animate: true,
        direction: 0,
        down: true
      },
      scaling: {
        inverse: false,
        to: this.scaling.slice(),
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
    if (this.animProps.translation.direction === 0) {
      this.translation = [
        0,
        this.translation[1],
        0]
      this.animProps.translation.to = [0,0,0]
    }

    let matrix = [];
    matrix = mat4.identity(matrix);
    // if (this.animProps.translation.direction === 0) {
        // return matrix;
    // }


    let rotationMatrix = this.rotate(value.translation())
    let translationMatrix = this.translate(value.translation())

    // let scalingMatrix = this.scale(value.scale())

    mat4.multiply(matrix, matrix, translationMatrix);
    mat4.multiply(matrix, matrix, rotationMatrix)
    // mat4.multiply(matrix, translationMatrix, scalingMatrix)
    return matrix;

  }

  translate(value) {

    var translationAnimationFlags = this.animProps.translation

        if (!translationAnimationFlags.inverse) {
          if (this.translation[0] < translationAnimationFlags.to[0] ) {
              this.translation[0] += (value*10) * (translationAnimationFlags.direction);

            } else {
              game.player.position.x += translationAnimationFlags.direction;
              translationAnimationFlags.direction = 0
            }
        } else {
          if (this.translation[0] > translationAnimationFlags.to[0] ) {
              this.translation[0] += (value*10) * (translationAnimationFlags.direction);
            } else {
              game.player.position.x += translationAnimationFlags.direction;
              translationAnimationFlags.direction = 0
            }
        }
        if (translationAnimationFlags.down) {
          this.translation[1] -= value
        } else {
          this.translation[1] = 0;
        }


    return glManager.transformation.translation(
      this.translation[0],this.translation[1], this.translation[2]
    )
  }

  scale(value) {
    var scalingAnimationFlags = this.animProps.scaling
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



  rotate(value) {

    var rotationAnimationFlags = this.animProps.rotation

    if (!rotationAnimationFlags.inverse) {

      // console.log(this.degrees, rotationAnimationFlags.to); debugger;
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
      -glManager.shape.array[0],
      -glManager.shape.array[1],
      -glManager.shape.array[2])

    //
    let toOrigin = glManager.transformation.translation(
      glManager.shape.array[0],
      glManager.shape.array[1],
      glManager.shape.array[2])

    var matrix = []
    // this.degrees -= 0.1
    var rotationMatrix = glManager.transformation.rotation(this.degrees,0)
    // console.table(rotationMatrix);
    // mat4.multiply(rotationMatrix, rotationMatrix, glManager.transformation.rotation(this.degrees,1))
    // mat4.multiply(rotationMatrix, rotationMatrix, glManager.transformation.rotation(this.degrees,2))
    // mat4.multiply(rotationMatrix,rotationMatrix,glManager.transformation.rotation(this.degrees,1))
    // mat4.multiply(matrix, toOrigin, rotationMatrix)
    // mat4.multiply(matrix, rotationMatrix, toCenter )
    // mat4.multiply(matrix, matrix, toCenter)
    // console.table(matrix);debugger;


    matrix = rotationMatrix
    // console.table(matrix);debugger;
    // console.table(matrix);
    // debugger;




    return matrix;
  }



};
