/*
a01468749
Volodymyr Samoilenko
*/

// This file contains all helper function that I need
// for managing webgl routine tasks

function bufferData(gl, shape) {
  gl.bindBuffer(gl.ARRAY_BUFFER, shape.buffer.position)
  shape.bufferCoordinates.position = shape.setVerticiesAndBufferData(gl);

  gl.bufferData(
    gl.ARRAY_BUFFER, new Float32Array(shape.bufferCoordinates.position), gl.STATIC_DRAW
  );

  gl.bindBuffer(gl.ARRAY_BUFFER, shape.buffer.color)
  shape.bufferCoordinates.color = shape.setColorAndBufferData(gl);

  gl.bufferData(
    gl.ARRAY_BUFFER, new Uint8Array(shape.bufferCoordinates.color), gl.STATIC_DRAW
  );
}
function createProgram(gl, shaders) {
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
function createShader(gl,type, source) {
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
function loadImageAndCreateTextureInfo(gl, url) {
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

  const transformationMatrix = {
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

  function unitBlock3d(x,y,z, step) {

    let x1 = x;
    let x2 = x + step;
    let y1 = y;
    let y2 = y + step;
    let z1 = z;
    let z2 = z + step;

    let positions = [
      // front
      x1,y1,z2,    x2,y1,z2,   x2,y2,z2,
      x1,y1,z2,    x2,y2,z2,   x1,y2,z2,

      // back
      x1,y1,z1,   x2,y1,z1,   x2,y2,z1,
      x1,y1,z1,   x2,y2,z1,   x1,y2,z1,

      // top
      x1,y1,z1,   x2,y1,z1,   x2,y1,z2,
      x1,y1,z1,   x2,y1,z2,   x1,y1,z2,

      //bottom
      x1,y2,z1,   x2,y2,z1,   x2,y2,z2,
      x1,y2,z1,   x2,y2,z2,   x1,y2,z2,

      // left
      x1,y1,z1,   x1,y1,z2,   x1,y2,z2,
      x1,y1,z1,   x1,y2,z2,   x1,y2,z1,

      // right
      x2,y1,z1,   x2,y1,z2,   x2,y2,z2,
      x2,y1,z1,   x2,y2,z2,   x2,y2,z1,
    ];

    return positions;
  }

  function mapVerticies(matrix, offset = {x: 0, y: 0}) {
    let step = glManager.screen.unitSize;
    let z = 0;
    let box = [];
    matrix.forEach( (row, y) => {
      row.forEach( (value, x) => {
        if (value !== 0) {
          let _x = ((x + offset.x) * step) - 1;
          let _y = -((y + offset.y) * step)  + 1 - (2/16)
          box = box.concat(
            unitBlock3d(_x, _y, z, step)
          );
        }
      });
    });
    return box;
  }

  function mapColor(matrix) {
    let result = [];
    matrix.forEach( (row, y) => {
      row.forEach( (value, x) => {
        if (value !== 0) {
          let counter = 36;
          while(counter--) {
            result = result.concat(colors[value-1]);
          }
        }
      });
    });
    return result;
  }
function rotateMatrix(matrix, dir) {
  for (let y = 0; y < matrix.length; ++y) {
    for (let x = 0; x < y; ++x) {
      [
        matrix[x][y],
        matrix[y][x],
      ] = [
        matrix[y][x],
        matrix[x][y],
      ];
    }
  }

  if (dir > 0) {
    matrix.forEach(row => row.reverse());
  } else {
    matrix.reverse();
  }
}
function setAndEnableVertex(gl, options, buffer, location) {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.vertexAttribPointer(
    location,
    options.size,
    options.type,
    options.normalize,
    options.stride,
    options.offset
  )
  gl.enableVertexAttribArray(location)
}
function setBuffersAndDraw(gl, program, shape, locations, flag ){

  // shape +
  //       |
  //       +---- buffer +
  //       |            |
  //       |            ----- position
  //       |            ----- color
  //       +---- bufferCoordinates +
  //                               |
  //                               ----- position
  //                               ----- color
  //
  gl.useProgram(program)
  bufferData(gl, shape);

  // return if there is no vertecies for drawing
  if (shape.bufferCoordinates.position.length === 0) {
    return;
  }

  if (locations.uniform !== undefined) {
    let transformationMatrix = shape.updateMatrix();
    gl.uniformMatrix4fv(
      locations.uniform,
      false,
      transformationMatrix
    )
  }

  setAndEnableVertex(
    gl,
    {
      size: 3,
      type: gl.FLOAT,
      normalize: false,
      stride: 0,
      offset: 0,
    },
    shape.buffer.position,
    locations.position
  );
  setAndEnableVertex(
    gl,
    {
      size: 3,
      type: gl.UNSIGNED_BYTE,
      normalize: true,
      stride: 0,
      offset: 0,
    },
    shape.buffer.color,
    locations.color
  );

  // debugger;
  let verticiesCounter = 6 * 6 * (shape.bufferCoordinates.position.length / 108)
  let drawingOffset = 0
  gl.drawArrays(gl.TRIANGLES, drawingOffset, verticiesCounter)
  // debugger;
}
