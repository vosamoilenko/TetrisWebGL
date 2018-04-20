function createMatrix(w, h) {
  const matrix = [];
  while (h--) {
    matrix.push(new Array(w).fill(0));
  }
  return matrix;
}
function randShape() {
  let index = Math.floor(Math.random()*(7-1+1)+1)
  return tetrominos[index];
}
