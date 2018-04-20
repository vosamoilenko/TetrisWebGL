/*
a01468749
Volodymyr Samoilenko
*/


class GLManager {
  constructor() {
    this.then = 0
    this.shapes = []
    this.programs = []
    this.screen = {
      playebleArea: {w:375, h: 600 },
      unitSize: 2.0 / 16,
    }
    // this.gl = undefined;


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

    const vShader = createShader(gl, gl.VERTEX_SHADER, vsSource)
    const fShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource)
    const vBShader = createShader(gl, gl.VERTEX_SHADER, vsBSource)
    const fBShader = createShader(gl, gl.FRAGMENT_SHADER, fsBSource)
    const vLShader = createShader(gl, gl.VERTEX_SHADER, vsLandedSource)
    const fLShader = createShader(gl, gl.FRAGMENT_SHADER, fsLandedSource)
    // --------------------------------------------------
    // this.programs[0] = createProgram(gl, [vBShader, fBShader])
    // this.positionBAttributeLocation = gl.getAttribLocation(this.programs[0], "aposition");
    // this.textBAttributeLocation = gl.getAttribLocation(this.programs[0], "atexCoord");
    //
    // var background = new Background(-1, -1, 0, 2.0)
    // background.positionBuffer = gl.createBuffer()
    // gl.bindBuffer(gl.ARRAY_BUFFER, background.positionBuffer)
    // background.setVerticiesAndBufferData(gl)
    //
    // background.texture = loadImageAndCreateTextureInfo(gl, IMG_URL)
    // background.texture.positionBuffer = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, background.texture.positionBuffer)
    // background.setVerticiesAndBufferData(gl)
    // this.background = background
    // --------------------------------------------------
    this.programs[1] = createProgram(gl, [vShader, fShader]);
    this.positionAttributeLocation = gl.getAttribLocation(this.programs[1], "aposition");
    this.colorAttributeLocation = gl.getAttribLocation(this.programs[1], "acolor");
    this.matrixUniformLocation = gl.getUniformLocation(this.programs[1], "umatrix");
    // debugger;

    this.shape = new PlayerShape(0,0,0,this.screen.unitSize);

    this.shape.buffer.position = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.shape.buffer.position);
    this.shape.buffer.color = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.shape.buffer.color);
    // --------------------------------------------------
    this.programs[2] = createProgram(gl, [vLShader, fLShader]);
    this.positionLAttributeLocation = gl.getAttribLocation(this.programs[2], "aposition");
    this.colorLAttributeLocation = gl.getAttribLocation(this.programs[2], "acolor");

    this.landed = new LandedShape(0,0,0,this.screen.unitSize);

    this.landed.buffer.position = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.landed.buffer.position);
    this.landed.buffer.color = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.landed.buffer.color);
  }


  drawScene(delta) {

    var gl = this.gl;
    this.array = [];


    // CLEAN SCENE
    gl.viewport(0,0,gl.canvas.width,gl.canvas.height)
    gl.clearColor(78/255.0,159/255.0,255/255.0,1.0)
    gl.clear(gl.COLOR_BUFFER_BIT || gl.COLOR_DEPTH_BIT)

    // -----------------------------------------------------
    // draw game elements
    let playerShapeAttributeLocations = {
      uniform: this.matrixUniformLocation,
      position: this.positionAttributeLocation,
      color: this.colorAttributeLocation,
    };
    setBuffersAndDraw(gl, this.programs[1], this.shape, playerShapeAttributeLocations, false);

// -----------------------------------------------------
    let landedShapeAttributeLocations = {
      position: this.positionLAttributeLocation,
      color: this.colorLAttributeLocation,
    }

    setBuffersAndDraw(gl, this.programs[2], this.landed, landedShapeAttributeLocations, true);

    // this.landed.array = this.landed.setVerticiesAndBufferData(gl);
    //
    // if (this.landed.array.length > 0) {
    //   gl.useProgram(this.programs[2])
    //   gl.bindBuffer(gl.ARRAY_BUFFER, this.landed.positionBuffer)
    //   gl.bufferData(
    //     gl.ARRAY_BUFFER, new Float32Array(this.landed.array), gl.STATIC_DRAW
    //   );
    //
    //   gl.bindBuffer(gl.ARRAY_BUFFER, this.landed.colorBuffer)
    //   this.landed.arrayC = this.landed.setColorAndBufferData(gl);
    //   gl.bufferData(
    //     gl.ARRAY_BUFFER, new Uint8Array(this.landed.arrayC), gl.STATIC_DRAW
    //   );
    //
    //   size = 3
    //   type = gl.FLOAT
    //   normalize = false
    //   stride = 0
    //   offset = 0
    //
    //   gl.bindBuffer(gl.ARRAY_BUFFER, this.landed.positionBuffer)
    //   gl.vertexAttribPointer(
    //     this.positionAttributeLocation,
    //     size,
    //     type,
    //     normalize,
    //     stride,
    //     offset
    //   )
    //   gl.enableVertexAttribArray(this.positionAttributeLocation)
    //
    //   gl.bindBuffer(gl.ARRAY_BUFFER, this.landed.colorBuffer)
    //   gl.vertexAttribPointer(
    //     this.colorLAttributeLocation,
    //     3,
    //     gl.UNSIGNED_BYTE,
    //     true,
    //     stride,
    //     offset
    //   )
    //   gl.enableVertexAttribArray(this.colorLAttributeLocation)
    //
    //   verticiesCounter = 6 * 6 * (this.landed.array.length / 108)
    //   drawingOffset = 0
    //   gl.drawArrays(gl.TRIANGLES, drawingOffset, verticiesCounter)
    // }
  }





}
