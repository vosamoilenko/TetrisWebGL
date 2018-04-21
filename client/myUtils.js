/*
a01468749
Volodymyr Samoilenko
*/
let leftPressed = false;
let rightPressed = false;
function setEventListner(game) {

  $(document).keyup(function(e) {
    switch (event.key) {
      case "ArrowLeft":
      case "a":
      case "A":
        leftPressed = false
      break;
      case "ArrowRight":
      case "d":
      case "D":
        rightPressed = false
      break;
      default:
        return;
      }
    });

  let down =  function (event) {
  if (event.defaultPrevented) {
    return; // Do nothing if the event was already processed
  }
  switch (event.key) {
    case "p":
    case "P":
    case "Escape":
      game.pause();
      break;
    case "3":
    case "0":
        game.player.rotate(1);
      break;
    case "1":
    case "8":
      game.player.rotate(-1);
      break;
    case "ArrowDown":
    case "s":
    case "S":
    if (game.timerOff) {
      game.timerOff = false;
    } else {
      let x = 0;
      while(!game.isCollide()) {
        game.player.position.y += 1;
      }
      game.player.position.y -= 1;
    }
      break;
    case "ArrowUp":
    case "w":
    case "W":
    game.timerOff = true;
      break;
    case "ArrowLeft":
    case "a":
    case "A":
    if (!leftPressed) {
      game.player.move(-1);
      leftPressed = true
    }
      break;
    case "ArrowRight":
    case "d":
    case "D":
    if (!rightPressed) {
      game.player.move(1);
      rightPressed = true
    }
      break;

    default:
      return;
  }

  event.preventDefault();
  }
  window.addEventListener("keydown", down, false);

}
