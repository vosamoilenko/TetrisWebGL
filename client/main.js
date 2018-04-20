/*
a01468749
Volodymyr Samoilenko
*/
'use strict'


let IMG_URL = "./res/background.jpg";
var glManager;
var game;

function main() {
  glManager = new GLManager();
  game = new Game(glManager);
  setEventListner(game);
  game.start()

};
