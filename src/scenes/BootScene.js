/* jshint esversion:6*/
import { CST } from "../CST.js";

export class BootScene extends Phaser.Scene{
	constructor(){
        super({
            key: CST.SCENES.BOOT
        });

        this.counter = 0;
        this.firstTime = true;
        this.matrix;

    }

    init(){
        console.log("Boot loading...");
    }

    preload(){
        //this.load.plugin('DialogModalPlugin', './js/dialog_plugin.js');

        //title screen
        this.load.image('titlescreen', './assets/title_screen_500x320.png');
        this.load.image('startbutton', './assets/start_button.png');

        // map tiles
        this.load.image('tiles', './assets/map/spritesheet.png');

        // map in json format
        this.load.tilemapTiledJSON('map', './assets/map/map.json');

        // our two characters
        this.load.spritesheet('player', './assets/player.png', {
            frameWidth: 23,
            frameHeight: 35,
            spacing: 1,
        });
        this.load.spritesheet('healer', './assets/npcs/healer.png', {
            frameWidth: 21,
            frameHeight: 35
        });
				this.load.spritesheet('king', './assets/npcs/king.png', {
            frameWidth: 21,
            frameHeight: 35
        });
				this.load.spritesheet('witch', './assets/npcs/witch.png', {
            frameWidth: 21,
            frameHeight: 35
        });
				this.load.spritesheet('fool', './assets/npcs/clown.png', {
            frameWidth: 21,
            frameHeight: 35
        });
        this.load.spritesheet('chicken', './assets/npcs/chicken_21x16.png', {
            frameWidth: 21,
            frameHeight: 16
        });
        this.load.spritesheet('enemy', './assets/npcs/monster_25x35.png', {
            frameWidth: 25,
            frameHeight: 35
        });

        this.load.spritesheet('playerAttack', './assets/player_attack_45x35.png', {
            frameWidth: 45,
            frameHeight: 35,
            spacing: 1
        })

        this.load.image('pow', './assets/pow_25x25.png');
    }

    create(){
        console.log("Boot loaded");

        this.anims.create({
            key: 'chickenRight',
            frames: this.anims.generateFrameNumbers('chicken', {
                frames: [4, 5, 6, 7]
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'chickenUp',
            frames: this.anims.generateFrameNumbers('chicken', {
                frames: [8, 9, 10, 11]
            }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'chickenDown',
            frames: this.anims.generateFrameNumbers('chicken', {
                frames: [0, 1, 2, 3]
            }),
            frameRate: 10,
            repeat: -1
        });

        let startpic = this.add.image(250, 160, 'titlescreen');

        const start = this.add.image(185, 220, 'startbutton')
        .setInteractive()
        .on('pointerdown', () => { this.scene.start('LoadScene'); }); // LoadScene

    }

    update(){
    }
}
