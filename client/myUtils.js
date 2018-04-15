/*
a01468749
Volodymyr Samoilenko
*/

function unitBlock3d(x,y,z, step) {

  let x1 = x;
  let x2 = x + step;
  let y1 = y;
  let y2 = y + step;
  let z1 = z;
  let z2 = z + step * 2;

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


function getRandom() {
  var minus = Math.random()*10000

  var x = Math.random()

  if (x < 0) {x *= -1}
  if (x > 0.5) {x = 0.5}

  if (parseInt(minus)%2==0) {
    x *= -1
  }

  return x
}
// TODO: add source
function setEventListner() {
  // works
  // https://caniuse.com/#feat=keyboardevent-key
  // supported browsers
  window.addEventListener("keydown", function (event) {
  if (event.defaultPrevented) {
    return; // Do nothing if the event was already processed
  }

  var shape = glManager.shapes[0]


  switch (event.key) {
    case "+":
      shape.animationFlags.scaling.to = [
        shape.scaling[0]+0.1,
        shape.scaling[1]+0.1,
        shape.scaling[2]+0.1
      ]
      shape.animationFlags.scaling.inverse = false
      break;
    case "-":
      shape.animationFlags.scaling.to = [
        shape.scaling[0]-0.1,
        shape.scaling[1]-0.1,
        shape.scaling[2]-0.1]
      shape.animationFlags.scaling.inverse = true
      break;
    case "3":
    case "0":
      shape.animationFlags.rotation.to = (shape.degrees + 90)
      shape.animationFlags.rotation.inverse = false
      break;
    case "1":
    case "8":
    console.log(1);
      shape.animationFlags.rotation.to = (shape.degrees - 90)
      shape.animationFlags.rotation.inverse = true
      break;
    case "ArrowDown":
    case "s":
    case "S":
    shape.animationFlags.translation.to = shape.translation
    shape.animationFlags.translation.to[1] -= 0.1
    shape.animationFlags.translation.inverse = true
    shape.animationFlags.translation.animate = true;
      break;
    case "ArrowUp":
    case "w":
    case "W":
    shape.animationFlags.translation.to = shape.translation
    // shape.animationFlags.translation.to[1] += 0.1
      // shape.animationFlags.translation.inverse = false
    shape.animationFlags.translation.animate = false;
      break;
    case "ArrowLeft":
    case "a":
    case "A":
    shape.animationFlags.translation.to = shape.translation
    shape.animationFlags.translation.to[0] -= 0.1
    shape.animationFlags.translation.inverse = true
      break;
    case "ArrowRight":
    case "d":
    case "D":
    shape.animationFlags.translation.to = shape.translation
    shape.animationFlags.translation.to[0] += 0.1
    shape.animationFlags.translation.inverse = false
      break;
    case "Enter":
      break;
    case "Escape":
      break;
    default:
      return;
  }

  // Cancel the default action to avoid it being handled twice
  event.preventDefault();
}, true);
}
