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

  initScene() {

    // setEventListner()
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
    // const vPrShader = this.createShader(gl, gl.FRAGMENT_SHADER, vsPreviewSource)
    // const fPrShader = this.createShader(gl, gl.FRAGMENT_SHADER, fsPreviewSource)

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

    this.programs[1] = this.createProgram(gl, [vShader, fShader]);

    // getting attr reference (index)
    this.positionAttributeLocation = gl.getAttribLocation(this.programs[1], "aposition");
    this.matrixUniformLocation = gl.getUniformLocation(this.programs[1], "umatrix")
  }


  drawScene(now, player) {

    var gl = this.gl;

    // return;

    game.player.activeShape.forEach( (row, y) => {
      row.forEach( (value, x) => {
        if (value !== 0) {

          let _x = (x + game.player.position.x) * glManager.screen.unitSize
          let _y = (y + game.player.position.y) * glManager.screen.unitSize
          // console.log(_x,_y);debugger;
          // console.log(_x, _y);
          // debugger;
          let shape = new Unit(
            _x,
            _y,
            0, glManager.screen.unitSize)
          game.shapes.push(shape);
          shape.positionBuffer = gl.createBuffer()
          gl.bindBuffer(gl.ARRAY_BUFFER, shape.positionBuffer)
          shape.setVerticiesAndBufferData(gl)
        }
      });
    });

    // game.landed.forEach( (row, y) => {
    //   row.forEach( (value, x) => {
    //     if (value !== 0) {
    //       console.log(x, y);
    //       let shape = new Unit(
    //         x/10 * glManager.screen.unitSize,
    //         y/10 * glManager.screen.unitSize,
    //          0, glManager.screen.unitSize)
    //       game.shapes.push(shape);
    //       shape.positionBuffer = gl.createBuffer()
    //       gl.bindBuffer(gl.ARRAY_BUFFER, shape.positionBuffer)
    //       shape.setVerticiesAndBufferData(gl)
    //     }
    //   });
    // });

    // get delta
    // console.log(now);
    // let delta = (now - this.then) * 0.001
    this.then = now

    var update = {
      rotation: () => {
        return now * ROTATION_PER_SECOND;
      },
      translation: () => {
        return now * TRANSLATION_PER_SECOND;
      },
      scale: () => {
        return now * SCALE_PER_SECOND;
      },
    };


    gl.viewport(0,0,gl.canvas.width,gl.canvas.height)
    gl.clearColor(78/255.0,159/255.0,255/255.0,1.0)
    gl.clear(gl.COLOR_BUFFER_BIT || gl.COLOR_DEPTH_BIT)
    //
    // // drawing background
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

    // draw game elements
    gl.useProgram(this.programs[1])
    for (let shape of game.shapes) {

      gl.uniformMatrix4fv(
        this.matrixUniformLocation,
        false,
        shape.updateMatrix(update)
      )

      {
      var size = 3
      var type = gl.FLOAT
      var normalize = false
      var stride = 0
      var offset = 0

      gl.bindBuffer(gl.ARRAY_BUFFER, shape.positionBuffer)
      gl.vertexAttribPointer(
        this.positionAttributeLocation,
        size,
        type,
        normalize,
        stride,
        offset
      )
      gl.enableVertexAttribArray(this.positionAttributeLocation)
    }
      let verticiesCounter = 6 * 6
      var drawingOffset = 0
      gl.drawArrays(gl.TRIANGLES, drawingOffset, verticiesCounter)

    }
    game.shapes = [];
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
