/* jshint esversion:6*/
import { CST } from "../CST.js";

export class BootScene extends Phaser.Scene{
	constructor(){
        super({
            key: CST.SCENES.BOOT
        });

    }

    init(){
        console.log("Boot loading...");
    }

    preload(){
        //this.load.plugin('DialogModalPlugin', './js/dialog_plugin.js');

        // map tiles
        this.load.image('tiles', './assets/map/spritesheet.png');

        // map in json format
        this.load.tilemapTiledJSON('map', './assets/map/map.json');

        // our two characters
        this.load.spritesheet('player', './assets/player.png', {
            frameWidth: 23,
            frameHeight: 35
        });
        this.load.spritesheet('npc', './assets/RPG_assets.png', {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet('npc2', './assets/RPG_assets.png', {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet('npc3', './assets/RPG_assets.png', {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet('healer', './assets/RPG_assets.png', {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet('chicken', './assets/chicken_21x16.png', {
            frameWidth: 21,
            frameHeight: 16
        });

        this.load.spritesheet('npcEnemy', './assets/RPG_assets.png', {
            frameWidth: 16,
            frameHeight: 16
        });

        this.load.spritesheet('enemy', './assets/RPG_assets.png', {
            frameWidth: 16,
            frameHeight: 16
        });

        //fixed to camera test:
        this.load.image('mushroom', './assets/mushroom16_16.png');
    }

    create(){
        this.scene.start('LoadScene');
        this.scene.start('WorldScene');   
        this.scene.start('UIScene');
        console.log("Boot loaded");
    }

    update(){
    }

    updateCounter(){
    }
}