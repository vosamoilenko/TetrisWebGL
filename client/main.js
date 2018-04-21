/*
a01468749
Volodymyr Samoilenko
*/
'use strict'



var glManager;
var game;

function main() {
  glManager = new GLManager();
  game = new Game(glManager);
  setEventListner(game);
  game.start()

};
