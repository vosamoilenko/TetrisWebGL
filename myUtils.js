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
      console.log(123);
      break;
    case "3":
      shape.animationFlags.rotation.to = (shape.degrees - 90)
      shape.animationFlags.rotation.inverse = true
      console.log(123);
      break;
    case "ArrowDown":
      // shape.translation[1] -= 0.1
      // drawScene(glManager)
      // Do something for "down arrow" key press.
      break;
    case "ArrowUp":
      // drawScene(glManager)
      break;
    case "ArrowLeft":
      // shape.translation[0] -= 0.1
      // drawScene(glManager)
      // Do something for "left arrow" key press.
      break;
    case "ArrowRight":
      // shape.translation[0] += 0.1
      // drawScene(glManager)
      // Do something for "right arrow" key press.
      break;
    case "Enter":
      // Do something for "enter" or "return" key press.
      break;
    case "Escape":
      // Do something for "esc" key press.
      break;
    default:
      return; // Quit when this doesn't handle the key event.
  }

  // Cancel the default action to avoid it being handled twice
  event.preventDefault();
}, true);
}
