function unitBlock(x, y, step) {
  var x1 = x;
  var x2 = x1 + step;
  let y1 = y;
  let y2 = y1 + step;

  return [
      x1, y1,
      x1, y2,
      x2, y1,

      x1, y2,
      x2, y2,
      x2, y1,
  ]
}

function randomFloat() {
  let max = 1.0
  let min = -1.0

  return (Math.random() * (max - min) + min);
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
  // var shape1 = glManager.shapes[0]

  switch (event.key) {
    case "1":
      shape.animationFlags.rotation.to = (shape.degrees + 90)
      shape.animationFlags.rotation.inverse = false
      break;
    case "3":
      shape.animationFlags.rotation.to = (shape.degrees - 90)
      shape.animationFlags.rotation.inverse = true
      break;
    case "ArrowDown":
      shape.animationFlags.translation.to = [shape.translation[0], shape.translation[1] - 0.1]
      shape.animationFlags.translation.inverse = true
      break;
    case "ArrowUp":
      shape.animationFlags.translation.to = [shape.translation[0], shape.translation[1] + 0.1]
      shape.animationFlags.translation.inverse = false
      break;
    case "ArrowLeft":
    shape.animationFlags.translation.to = [shape.translation[0] - 0.1, shape.translation[1]]
    shape.animationFlags.translation.inverse = true
      break;
    case "ArrowRight":
    shape.animationFlags.translation.to = [shape.translation[0] + 0.1, shape.translation[1]]
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
