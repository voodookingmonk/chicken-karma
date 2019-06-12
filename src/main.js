/* jshint esversion:6*/

import {BootScene} from "./scenes/BootScene";
import {WorldScene} from "./scenes/WorldScene";
import {BootScene} from "./scenes/BootScene.js";
import {WorldScene} from "./scenes/WorldScene.js";

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
      BootScene, WorldScene
    ],
    parent: 'game'
};

let game = new Phaser.Game(config);