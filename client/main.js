/*
a01468749
Volodymyr Samoilenko
*/
'use strict'

var TRANSLATION_PER_SECOND = 0.8
let ROTATION_PER_SECOND = 90.0;
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
