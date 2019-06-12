/* jshint esversion:6*/

import {BootScene} from "./scenes/BootScene.js";
import {WorldScene} from "./scenes/WorldScene.js";
import {UIScene} from "./scenes/UIScene.js";

let config = {
    type: Phaser.AUTO,
    parent: 'content',
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
      BootScene, WorldScene, UIScene
    ],
    parent: 'game'
};

let game = new Phaser.Game(config);