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

        this.load.spritesheet('enemy', './assets/monster_25x35.png', {
            frameWidth: 25,
            frameHeight: 35
        });

        //fixed to camera test:
        this.load.image('startpic', './assets/chicken_21x16.png');
    }

    create(){
        const welcomeText = this.add.text(100, 50, 'Chicken Karma!', { fill: '#0f0' });
        welcomeText.setFont = "Fresca";

        let startpic = this.add.image(165, 130, 'startpic');
        
        const start = this.add.text(115, 185, 'Start game', { fill: '#0f0' })
        .setInteractive()
        .on('pointerdown', () => { this.scene.start('LoadScene'); }) // LoadScene
        .on('pointerover', () => start.setStyle({ fill: '#ff0'}) )
        .on('pointerout', () => start.setStyle({ fill: '#0f0' }) );
/*
        const info = this.add.text(140, 210, 'Info', { fill: '#0f0' })
        .setInteractive()
        .on('pointerdown', () => { this.scene.switch('HelpScene'); }) 
        .on('pointerover', () => info.setStyle({ fill: '#ff0'}) )
        .on('pointerout', () => info.setStyle({ fill: '#0f0' }) );
*/
        console.log("Boot loaded");
    }

    update(){
    }

    updateCounter(){
    }
}