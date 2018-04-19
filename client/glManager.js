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
    this.screen = {
      size: {w:600 ,h:600},
      playebleArea: {w:375, h: 600 },
      unitSize: 2.0 / 16,
    }
    this.colors = []
    // this.gl = undefined;

    this.transformation = {
      translation: (tx, ty, tz) => {
        return [
          1,  0,  0,  tx,
          0,  1,  0, ty,
          0,  0,  1,  tz,
          0, 0, 0, 1,
        ];
      },
      rotation: (degrees, axes) => {
        let radians = degrees * Math.PI / 180.0
        let sin = Math.sin(radians)
        let cos = Math.cos(radians)

        switch (axes) {
          // 0 == x axes
          case 0:
          return [
            1, 0, 0, 0,
            0, cos, sin, 0,
            0, -sin, cos, 0,
            0, 0, 0, 1,
            ];
          case 1:
          // 1 == y axes
          return [
            cos, 0, -sin, 0,
            0, 1, 0, 0,
            sin, 0, cos, 0,
            0, 0, 0, 1,
            ];
          default:
          // z axes
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
    this.initScene();
  }

  // First program for background
  // Second program for active shape
  // Third program for landed shapes
  initScene() {

    const canvas = document.querySelector('#glCanvas');

    this.gl = canvas.getContext('webgl');
    var gl = this.gl;

    if (!gl) {
      alert("Unable to initialize WebGL. Your browser or machine may not support it.");
      return;
    }

    const vShader = this.createShader(gl, gl.VERTEX_SHADER, vsSource)
    const fShader = this.createShader(gl, gl.FRAGMENT_SHADER, fsSource)
    const vBShader = this.createShader(gl, gl.VERTEX_SHADER, vsBSource)
    const fBShader = this.createShader(gl, gl.FRAGMENT_SHADER, fsBSource)
    const vLShader = this.createShader(gl, gl.VERTEX_SHADER, vsLandedSource)
    const fLShader = this.createShader(gl, gl.FRAGMENT_SHADER, fsLandedSource)
    // --------------------------------------------------
    this.programs[0] = this.createProgram(gl, [vBShader, fBShader])
    this.positionBAttributeLocation = gl.getAttribLocation(this.programs[0], "aposition");
    this.textBAttributeLocation = gl.getAttribLocation(this.programs[0], "atexCoord");

    var background = new Background(-1, -1, 0, 2.0)
    background.positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, background.positionBuffer)
    background.setVerticiesAndBufferData(gl)

    background.texture = this.loadImageAndCreateTextureInfo(IMG_URL)
    background.texture.positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, background.texture.positionBuffer)
    background.setVerticiesAndBufferData(gl)
    this.background = background
    // --------------------------------------------------
    this.programs[1] = this.createProgram(gl, [vShader, fShader]);
    this.positionAttributeLocation = gl.getAttribLocation(this.programs[1], "aposition");
    this.colorAttributeLocation = gl.getAttribLocation(this.programs[1], "acolor");
    this.matrixUniformLocation = gl.getUniformLocation(this.programs[1], "umatrix");

    this.shape = new PlayerShape(0,0,0,this.screen.unitSize);

    this.shape.positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.shape.positionBuffer);
    this.shape.colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.shape.colorBuffer);
    // --------------------------------------------------
    this.programs[2] = this.createProgram(gl, [vLShader, fLShader]);
    this.positionLAttributeLocation = gl.getAttribLocation(this.programs[2], "aposition");
    this.colorLAttributeLocation = gl.getAttribLocation(this.programs[2], "acolor");
    this.landed = new LandedShape(0,0,0,this.screen.unitSize);
    this.landed.positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.landed.positionBuffer);
    this.landed.colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.landed.colorBuffer);
  }


  drawScene(delta) {

    var gl = this.gl;
    this.array = [];

    var update = {
      rotation: () => {
        return delta * ROTATION_PER_SECOND;
      },
      translation: () => {
        return delta * TRANSLATION_PER_SECOND;
      },
      scale: () => {
        return delta * SCALE_PER_SECOND;
      },
    };

    // CLEAN SCENE
    gl.viewport(0,0,gl.canvas.width,gl.canvas.height)
    gl.clearColor(78/255.0,159/255.0,255/255.0,1.0)
    gl.clear(gl.COLOR_BUFFER_BIT || gl.COLOR_DEPTH_BIT)

    // ---------------------------------------------------------
    gl.useProgram(this.programs[0])

    gl.enableVertexAttribArray(this.positionBAttributeLocation)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.background.positionBuffer)

    gl.vertexAttribPointer(
      this.positionBAttributeLocation, 3,
      gl.FLOAT, false, 0, 0
    );

    gl.enableVertexAttribArray(this.textBAttributeLocation)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.background.texture.positionBuffer)

    gl.vertexAttribPointer(
      this.textBAttributeLocation, 3,
      gl.FLOAT, false, 0, 0
    );
    gl.drawArrays(gl.TRIANGLES, 0, 6 * 6)
    // -----------------------------------------------------
    // draw game elements

    gl.useProgram(this.programs[1])
    gl.bindBuffer(gl.ARRAY_BUFFER, this.shape.positionBuffer)
    this.shape.array = this.shape.setVerticiesAndBufferData(gl);
    gl.bufferData(
      gl.ARRAY_BUFFER, new Float32Array(this.shape.array), gl.STATIC_DRAW
    );

    gl.bindBuffer(gl.ARRAY_BUFFER, this.shape.colorBuffer)
    this.shape.arrayC = this.shape.setColorAndBufferData(gl);
    gl.bufferData(
      gl.ARRAY_BUFFER, new Uint8Array(this.shape.arrayC), gl.STATIC_DRAW
    );

    let matrix = this.shape.updateMatrix(update)
    gl.uniformMatrix4fv(
      this.matrixUniformLocation,
      false,
      matrix
    )
    let size = 3
    let type = gl.FLOAT
    let normalize = false
    let stride = 0
    let offset = 0

    gl.bindBuffer(gl.ARRAY_BUFFER, this.shape.positionBuffer)
    gl.vertexAttribPointer(
      this.positionAttributeLocation,
      size,
      type,
      normalize,
      stride,
      offset
    )
    gl.enableVertexAttribArray(this.positionAttributeLocation)

    gl.bindBuffer(gl.ARRAY_BUFFER, this.shape.colorBuffer)
    gl.vertexAttribPointer(
      this.colorAttributeLocation,
      3,
      gl.UNSIGNED_BYTE,
      true,
      stride,
      offset
    )
    gl.enableVertexAttribArray(this.colorAttributeLocation)

    let verticiesCounter = 6 * 6 * (this.shape.array.length / 108)
    let drawingOffset = 0
    gl.drawArrays(gl.TRIANGLES, drawingOffset, verticiesCounter)
    // -----------------------------------------------------
    this.landed.array = this.landed.setVerticiesAndBufferData(gl);

    if (this.landed.array.length > 0) {
      gl.useProgram(this.programs[2])
      gl.bindBuffer(gl.ARRAY_BUFFER, this.landed.positionBuffer)
      gl.bufferData(
        gl.ARRAY_BUFFER, new Float32Array(this.landed.array), gl.STATIC_DRAW
      );

      gl.bindBuffer(gl.ARRAY_BUFFER, this.landed.colorBuffer)
      this.landed.arrayC = this.landed.setColorAndBufferData(gl);
      gl.bufferData(
        gl.ARRAY_BUFFER, new Uint8Array(this.landed.arrayC), gl.STATIC_DRAW
      );

      size = 3
      type = gl.FLOAT
      normalize = false
      stride = 0
      offset = 0

      gl.bindBuffer(gl.ARRAY_BUFFER, this.landed.positionBuffer)
      gl.vertexAttribPointer(
        this.positionAttributeLocation,
        size,
        type,
        normalize,
        stride,
        offset
      )
      gl.enableVertexAttribArray(this.positionAttributeLocation)

      gl.bindBuffer(gl.ARRAY_BUFFER, this.landed.colorBuffer)
      gl.vertexAttribPointer(
        this.colorLAttributeLocation,
        3,
        gl.UNSIGNED_BYTE,
        true,
        stride,
        offset
      )
      gl.enableVertexAttribArray(this.colorLAttributeLocation)

      verticiesCounter = 6 * 6 * (this.landed.array.length / 108)
      drawingOffset = 0
      gl.drawArrays(gl.TRIANGLES, drawingOffset, verticiesCounter)
    }


    // game.shapes = [];
    // game.landedShapes = [];
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

  loadImageAndCreateTextureInfo(url) {
      var gl = this.gl
      // console.log(gl);
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
