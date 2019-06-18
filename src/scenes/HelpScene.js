/* jshint esversion:6*/
import { CST } from "../CST.js";

export class HelpScene extends Phaser.Scene{
	constructor(){
        super({
            key: CST.SCENES.HELP
        });
    }

    init(){
        console.log("HelpScene loading...");
    }

    preload(){
        this.load.image("close", "assets/mushroom16_16.png");
        this.load.image("help", "assets/help.png"); 
    }

    create(){
        let gameScene = this.scene.get(CST.SCENES.WORLD);

        console.log("HelpScene loaded"); // end
        let help = this.add.image(10, 10, "help").setOrigin(0).setDepth(0);

        //close HelpScene
        let closeButton  = this.add.image(280,25, "close").setOrigin(0).setDepth(1).setInteractive();

        closeButton.on("pointerover", ()=>{
            closeButton.setTexture("close");
        });
        closeButton.on("pointerout", ()=>{
            closeButton.setTexture("close");
        });
        closeButton.on("pointerdown", ()=>{
            this.scene.start('UIScene');
            this.scene.resume('WorldScene');
            this.scene.sleep('HelpScene');
            
        });

        
        





/*
        const welcomeText = this.add.text(100, 50, 'Chicken Karma!', { fill: '#0f0' });
        welcomeText.setFont = "Fresca";
        const start = this.add.text(115, 125, 'Start game!', { fill: '#0f0' })
        .setInteractive()
        .on('pointerdown', () => { this.scene.start('LoadScene'); })
        .on('pointerover', () => start.setStyle({ fill: '#ff0'}) )
        .on('pointerout', () => start.setStyle({ fill: '#0f0' }) );


        this.graphics = this.add.graphics();
        this.bg = new Phaser.Geom.Rectangle(10, 230, 310, 220);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.input.keyboard.on('keydown_I', ()=>{
            console.log("väljas");
            this.scene.setVisible(false, 'HelpScene');
            //this.scene.run('WorldScene');
            //this.scene.run('UIScene');
        });*/

    }

    update(){
    }

}