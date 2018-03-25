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
      img.crossOrigin = "null";
      img.src = url;

      return textureInfo;
    }



}
