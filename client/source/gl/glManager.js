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

    this.initScene();
  }

  // First program for background
  // Second program for active shape
  // Third program for landed shapes
  initScene() {

    const canvas = document.querySelector('#glCanvas');

    this.gl = canvas.getContext('webgl');
    let gl = this.gl;

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
    this.programs[0] = createProgram(gl, [vBShader, fBShader])
    this.positionBAttributeLocation = gl.getAttribLocation(this.programs[0], "aposition");
    this.textBAttributeLocation = gl.getAttribLocation(this.programs[0], "atexCoord");

    let background = new Background(-1, -1, 1, 2.0)
    background.buffer.position = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, background.buffer.position)
    background.setVerticiesAndBufferData(gl)

    background.texture = loadImageAndCreateTextureInfo(gl, IMG_URL)
    background.buffer.texturePosition = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, background.buffer.texturePosition)
    background.setVerticiesAndBufferData(gl)
    this.background = background
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

  startHorizontalTransltion(direction) {
    this.shape.animProps.translation.inverse = direction < 0 ? true : false;
    this.shape.animProps.translation.direction = direction
    this.shape.animProps.translation.to = [
      this.shape.translation[0] + (this.screen.unitSize * direction),
      this.shape.translation[1],
      this.shape.translation[2]
    ]
    this.shape.isAnimated = true;
  }
  drawScene(delta) {
    let gl = this.gl;
    this.array = [];

    // CLEAN SCENE
    gl.viewport(0,0,gl.canvas.width,gl.canvas.height)
    gl.clearColor(78/255.0,159/255.0,255/255.0,1.0)
    gl.clear(gl.COLOR_BUFFER_BIT || gl.COLOR_DEPTH_BIT)

    // drawing background
    gl.useProgram(glManager.programs[0])

    gl.enableVertexAttribArray(this.positionBAttributeLocation)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.background.buffer.position)
    gl.vertexAttribPointer(
      this.positionBAttributeLocation,
      3,
      gl.FLOAT, false, 0, 0
    );

    gl.enableVertexAttribArray(this.textBAttributeLocation)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.background.buffer.texturePosition)

    gl.vertexAttribPointer(
      glManager.textBAttributeLocation, 3,
      gl.FLOAT, false, 0, 0
    );
    gl.drawArrays(gl.TRIANGLES, 0, 6)
    // -----------------------------------------------------
    // draw active shape
    let playerShapeAttributeLocations = {
      uniform: this.matrixUniformLocation,
      position: this.positionAttributeLocation,
      color: this.colorAttributeLocation,
    };
    setBuffersAndDraw(gl, this.programs[1], this.shape, playerShapeAttributeLocations, true);

    // -----------------------------------------------------
    // draw landed shape
    let landedShapeAttributeLocations = {
      position: this.positionLAttributeLocation,
      color: this.colorLAttributeLocation,
    }

    setBuffersAndDraw(gl, this.programs[2], this.landed, landedShapeAttributeLocations);
  }
}
