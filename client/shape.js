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
    this.degrees = 25.0

    this.animProps = {
      rotation: {
        inverse: false,
        to: this.degrees,
      },
      translation: {
        inverse: false,
        to: this.translation.slice(),
        animate: true,
        right: function() {
          if (this.to[0] + glManager.unitSize > 0.8) {
            this.to[0] = 0.8
          } else {
            this.to[0] += glManager.unitSize
          }
        },
        left: function() {
          if (this.to[0] - glManager.unitSize < -1.0) {
            this.to[0] = -1.0
          } else {
            this.to[0] -= glManager.unitSize
          }
        },
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
    let v = value.rotation()

    let rotationMatrix = this.rotate(v)
    // let translationMatrix = this.translate(value.translation())
    // let scalingMatrix = this.scale(value.scale())


    var matrix = [];
    matrix = mat4.identity(matrix);

    // mat4.multiply(matrix, matrix, translationMatrix);
    // mat4.multiply(matrix, translationMatrix, scalingMatrix)
    // mat4.multiply(matrix, matrix, rotationMatrix)
    return matrix;

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

  translate(value) {

    var translationAnimationFlags = this.animProps.translation
    if (!translationAnimationFlags.inverse) {

      if (this.translation[0] < translationAnimationFlags.to[0]) {
          this.translation[0] = this.translation[0] + value * 3
        }

      // }
    } else {
      if (this.translation[0] > translationAnimationFlags.to[0]) {
          this.translation[0] = this.translation[0] - value * 3
      }


      if (this.translation[1] > translationAnimationFlags.to[1]){
        this.translation[1] = this.translation[1] - value
      } else if (this.translation[1] < -1.8){
        this.translation[1] = -1.8
      }
    }

    // FIX
    // if (this.translation[1] - 0.2 > -2 && translationAnimationFlags.animate) {
    //   this.translation[1] -= 0.01
    // }


    return glManager.transformation.translation(
      this.translation[0],this.translation[1], this.translation[2]
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
      1,
      1,
      -(this.origin.z + (glManager.screen.unitSize / 2.0)),)

    //
    let toOrigin = glManager.transformation.translation(
      this.origin.x,
      this.origin.y,
      this.origin.z)



    var matrix = []
    var rotationMatrix = glManager.transformation.rotation(this.degrees,2)
    // mat4.multiply(rotationMatrix, rotationMatrix, glManager.transformation.rotation(this.degrees,1))
    // mat4.multiply(rotationMatrix, rotationMatrix, glManager.transformation.rotation(this.degrees,2))
    // mat4.multiply(rotationMatrix,rotationMatrix,glManager.transformation.rotation(this.degrees,1))
    // mat4.multiply(matrix, toOrigin, rotationMatrix)
    // mat4.multiply(matrix, rotationMatrix, toCenter )
    // mat4.multiply(matrix, matrix, toCenter)


    matrix = rotationMatrix
    // console.table(matrix);debugger;
    // console.table(matrix);
    // debugger;




    return matrix;
  }



};
