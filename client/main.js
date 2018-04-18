/*
a01468749
Volodymyr Samoilenko
*/
'use strict'

// let game = new Game();
//
// function main() {
//
// }

var TRANSLATION_PER_SECOND = 0.5
let ROTATION_PER_SECOND = 300;
let SCALE_PER_SECOND = 2.0;
let IMG_URL = "./res/background.jpg";
var glManager;
var game;

function main() {
  glManager = new GLManager();
  game = new Game(glManager);
  setEventListner(game);
  game.start()

};
