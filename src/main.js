/* jshint esversion:6*/

import {BootScene} from "./scenes/BootScene.js";
import {WorldScene} from "./scenes/WorldScene.js";
import {UIScene} from "./scenes/UIScene.js";
import {LoadScene} from "./scenes/LoadScene.js";
import {HelpScene} from "./scenes/HelpScene.js";
import {EndScene} from "./scenes/EndScene.js";

var config = {
  type: Phaser.AUTO,
  width: 320,
  height: 240,
  zoom: 2,
  pixelArt: true,
  width:320,
  height:240,
  physics: {
      default: "arcade",
      arcade: {
          gravity: { y: 0},
          debug: false
      }
  },
  scene:[
    BootScene, LoadScene, WorldScene, UIScene, HelpScene, EndScene
  ],
  parent: 'game'
};

var game = new Phaser.Game(config);

export default game;