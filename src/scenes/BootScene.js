/* jshint esversion:6*/
import { CST } from "../CST.js";

export class BootScene extends Phaser.Scene{
	constructor(){
        super({
            key: CST.SCENES.BOOT
        });

        this.counter = 0;
        this.firstTime = true;

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
        this.load.image('mushroom', './assets/mushroom16_16.png');
        this.load.image('pow', './assets/pow_25x25.png');
    }

    create(){
        console.log("Boot loaded");
    
        this.anims.create({
            key: 'chickenDown',
            frames: this.anims.generateFrameNumbers('chicken', {
                frames: [0, 1, 2, 3]
            }),
            frameRate: 10,
            repeat: -1
        });

        const welcomeText = this.add.text(100, 50, 'Chicken Karma!', { fill: '#0f0' }).setDepth(1);
        welcomeText.setFont = "Fresca";
        
        let startpic = this.add.image(165, 130, 'startpic');

        const start = this.add.text(115, 185, 'Start game', { fill: '#0f0' })
        .setInteractive()
        .on('pointerdown', () => { this.scene.start('LoadScene'); }) // LoadScene
        .on('pointerover', () => start.setStyle({ fill: '#ff0'}) )
        .on('pointerout', () => start.setStyle({ fill: '#0f0' }) )
        .setDepth(1);
    
    }

    update(){
        this.counter++;

        if (this.firstTime || this.counter % 25 == 0){
            this.firstTime = false;
            this.spawnChickens();
        }
    }

    spawnChickens(){
        let matrix = this.physics.add.group({
			key: 'chicken',
			repeat: 15,
            setXY: { x: 10, y: 0, stepX: 20, stepY: 0 },
            velocityY: 50,
            bounceY: -1,
            setDepth: 0
        });

        //matrix.setDepth(0);

        matrix.playAnimation('chickenDown');
    }
}