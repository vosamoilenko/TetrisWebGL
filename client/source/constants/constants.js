// Animation values
const TRANSLATION_PER_SECOND = 0.125
const ROTATION_PER_SECOND = 180.0;
const SCALE_PER_SECOND = 2.0;


// Game contants
const screen = {
  size: {w:600 ,h:600},
  playableArea: {w:375 ,h:600},
  playableMatrixSize: {w: 10, h: 16},
};

const tetrominos = {
  str: "ILJOTSZ",
  1: [
    [0, 0, 0],
    [1, 1, 1],
    [0, 1, 0],
  ],
  2: [
    [2, 2],
    [2, 2],
  ],
  3: [
    [0, 3, 0],
    [0, 3, 0],
    [0, 3, 3],
  ],
  4: [
    [0, 4, 0],
    [0, 4, 0],
    [4, 4, 0],
  ],
  5: [
    [0, 5, 0, 0],
    [0, 5, 0, 0],
    [0, 5, 0, 0],
    [0, 5, 0, 0],
  ],
  6: [
    [0, 6, 6],
    [6, 6, 0],
    [0, 0, 0],
  ],
  7: [
    [7, 7, 0],
    [0, 7, 7],
    [0, 0, 0],
  ]
}

// Shape constants
const colors = [
  [243,   116,   171], // pink
  [236,    76,    40], // red
   [23,    79,    22], // orange
  [234,   201,    27], // yellow
   [98,   155,   201], // blue
   [65,   107,   183], // blue + green
  [128,   107,    83], // green
];
