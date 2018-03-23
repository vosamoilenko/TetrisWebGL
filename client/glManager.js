class GLManager {
  constructor() {
    this.then = 0
    this.shapes = []
    this.programs = []
    this.unitSize = 0.1;
    this.transformation = {
      translation: (tx, ty) => {
        return [
          1, 0, 0,
          0, 1, 0,
          tx, ty, 1
        ];
      },
      rotation: (degrees) => {
        let radians = degrees * Math.PI / 180.0
        let sin = Math.sin(radians)
        let cos = Math.cos(radians)

        return [
          cos, -sin, 0,
          sin,  cos, 0,
          0  ,   0,  1,
        ];
      },
      scaling: (sx, sy) => {
        return [
          sx, 0, 0,
          0, sy, 0,
          0, 0, 1,
        ];
      }
    }
  }
}
