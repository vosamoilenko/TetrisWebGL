/*
a01468749
Volodymyr Samoilenko
*/

// This class managed gl routine work and setups
// Matrix's was taken from lecture slides
class GLManager {
  constructor() {
    this.then = 0
    this.shapes = []
    this.programs = []
    this.unitSize = 0.1

    this.transformation = {
      translation: (tx, ty, tz) => {
        return [
          1,  0,  0,  0,
          0,  1,  0,  0,
          0,  0,  1,  0,
          tx, ty, tz, 1,
        ];
      },
      // 0 == x axes
      // 1 == y axes
      // 2 == z axes
      rotation: (degrees, axes) => {
        let radians = degrees * Math.PI / 180.0
        let sin = Math.sin(radians)
        let cos = Math.cos(radians)

        switch (axes) {
          case 0:
          return [
            1, 0, 0, 0,
            0, cos, sin, 0,
            0, -sin, cos, 0,
            0, 0, 0, 1,
            ];
          case 1:
          return [
            cos, 0, -sin, 0,
            0, 1, 0, 0,
            sin, 0, cos, 0,
            0, 0, 0, 1,
            ];
          default:
          return [
              cos, sin, 0, 0,
             -sin, cos, 0, 0,
              0, 0, 1, 0,
              0, 0, 0, 1,
           ];
        }
      },
      scaling: (sx, sy, sz) => {
        return [
          sx, 0,  0,  0,
          0, sy,  0,  0,
          0,  0, sz,  0,
          0,  0,  0,  1,
        ];
      }
    }
  }
  createProgram(gl, shaders) {
    let program = gl.createProgram()

    for (let shader of shaders) {
      if (shader != undefined) {
        gl.attachShader(program, shader)
      }
    }
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      var info = gl.getProgramInfoLog(program);
      throw 'Could not compile WebGL program. \n\n' + info;
    }
    return program
  }
  createShader(gl,type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
  }

  static loadImageAndCreateTextureInfo(url) {
      var gl = glManager.gl
      var tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);

      // Fill the texture with a 1x1 blue pixel.
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                    new Uint8Array([0, 0, 255, 255]));

      // Because in webgl by design texture loads upside down i need to flip it.
      // For flipping im usingg this func gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      // https://www.khronos.org/webgl/public-mailing-list/public_webgl/1212/msg00009.php
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

      var textureInfo = {
        width: 1,   // we don't know the size until it loads
        height: 1,
        texture: tex,
      };

      var img = new Image();
      img.addEventListener('load', function() {
        textureInfo.width = img.width;
        textureInfo.height = img.height;

        gl.bindTexture(gl.TEXTURE_2D, textureInfo.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

      });
      // crossOrigin is used for avoiding gl warning
      img.crossOrigin = "null";
      img.src = url;

      return textureInfo;
    }
}
