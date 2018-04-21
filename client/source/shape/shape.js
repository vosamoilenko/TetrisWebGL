/*
a01468749
Volodymyr Samoilenko
*/

class Shape {
  constructor(x,y,z,step) {
    this.positionBuffer = []
    this.colorBuffer = []
    this.indexBuffer = []
    this.buffer = {
      position: [],
      color: [],
    }
    this.bufferCoordinates = {
      position: [],
      color: [],
    }
    this.origin = {
      x:x,
      y:y,
      z:z,
    }
    this.center = {}
    this.size = {
      width: 0,
      height: 0,
      depth: 0,
    }
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

  updateMatrix() {


    let delta = game.props.delta;
    let matrix = [];
    matrix = mat4.identity(matrix);
    //
    if (this.animProps.translation.direction === 0) {
      this.translation = [
        0,
        this.translation[1],
        0]
      this.animProps.translation.to = [0,0,0]
    }

    // let rotationMatrix = this.rotate( delta * ROTATION_PER_SECOND );
    let translationMatrix = this.translate( delta * TRANSLATION_PER_SECOND )
    //
    // // let scalingMatrix = this.scale(value.scale())
    //
    mat4.multiply(matrix, matrix, translationMatrix);
    // debugger;
    // mat4.multiply(matrix, matrix, rotationMatrix)
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
            // this.translation[0] = 0
          }
      } else {
        if (this.translation[0] > translationAnimationFlags.to[0] ) {
            this.translation[0] += (value*10) * (translationAnimationFlags.direction);
          } else {
            game.player.position.x += translationAnimationFlags.direction;
            translationAnimationFlags.direction = 0
          }
      }

      // Animate gravity
      if (translationAnimationFlags.down && !game.timerOff) {
        this.translation[1] -= value
      } else {
        this.translation[1] = 0;
      }

    return transformationMatrix.translation(
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
    // BUG: I have some misunderstanding here.
    // For rotation about own axes I must translate my shape to center (0,0,z,w) and rotate it. After rotation move it back to it's position. Because order shold be vica versa I hold order:
    // matrix = toCenterMatrix * rotation
    // matrix = matrix * toCurrentPosition

    // But everything goes wrong.

    let toCenter = transformationMatrix.translation(
      -glManager.shape.array[0],
      -glManager.shape.array[1],
      -glManager.shape.array[2])

    let toOrigin = transformationMatrix.translation(
      glManager.shape.array[0],
      glManager.shape.array[1],
      glManager.shape.array[2])

    var matrix = []

    var rotationMatrix = transformationMatrix.rotation(this.degrees,0)
    matrix = rotationMatrix

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
    return transformationMatrix.scaling(
      this.scaling[0],this.scaling[1],this.scaling[2]
    )
  }

};
