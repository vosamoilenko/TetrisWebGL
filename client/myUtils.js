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
function setEventListner(game) {
  // works
  // https://caniuse.com/#feat=keyboardevent-key
  // supported browsers
  window.addEventListener("keydown", function (event) {
  if (event.defaultPrevented) {
    return; // Do nothing if the event was already processed
  }

  // var shape = game.shapes[0]


  switch (event.key) {
    // case "+":
      // shape.animProps.scaling.to = [
    //     shape.scaling[0]+0.1,
    //     shape.scaling[1]+0.1,
    //     shape.scaling[2]+0.1
    //   ]
    //   shape.animProps.scaling.inverse = false
    //   break;
    // case "-":
    //   shape.animProps.scaling.to = [
    //     shape.scaling[0]-0.1,
    //     shape.scaling[1]-0.1,
    //     shape.scaling[2]-0.1]
    //   shape.animProps.scaling.inverse = true
    //   break;
    case "3":
    case "0":
        game.playerRotate(1);
        // game.animation.rotation.to = game.animation.rotation.current + 90;
      // shape.animProps.rotation.to = (shape.degrees + 90)
      // shape.animProps.rotation.inverse = false
      break;
    case "1":
    case "8":
      game.playerRotate(-1);
      // shape.animProps.rotation.to = (shape.degrees - 90)
      // shape.animProps.rotation.inverse = true
      break;
    case "ArrowDown":
    case "s":
    case "S":

    // if (shape.animProps.translation.animate) {
      // shape.translation[1] = -1.8
    // } else {
      // shape.animProps.translation.animate = true;
    // }
      break;
    case "ArrowUp":
    case "w":
    case "W":
    // shape.animProps.translation.animate = false;
      break;
    case "ArrowLeft":
    case "a":
    case "A":
    // game.player.position.x -= 1;
    game.playerMoveH(-1);
    // shape.animProps.translation.left()
    // shape.animProps.translation.inverse = true
      break;
    case "ArrowRight":
    game.playerMoveH(1);
    // game.player.position.x += 1;
    case "d":
    case "D":
    // shape.animProps.translation.right()
    // shape.animProps.translation.inverse = false
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
