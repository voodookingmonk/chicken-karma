/* jshint esversion:6*/
import { CST } from "../CST.js";

export class EndScene extends Phaser.Scene{
	constructor(){
        super({
            key: CST.SCENES.END
        });
    }

    init(){
        console.log("EndScene loading...");
    }

    preload(){
        this.load.image("worst", "assets/worst.png");
        this.load.image("medium", "assets/medium.png"); 
        this.load.image("best", "assets/best.png"); 
    }

    create(){
        let gameScene = this.scene.get(CST.SCENES.WORLD);

        this.scene.stop('WorldScene');   
        this.scene.stop('UIScene');
        this.scene.stop('HelpScene');

        if(gameScene.karma >= 0 && gameScene.karma < 33){
            console.log("worst");
            this.ending = this.add.text(200, 70, 'worst', { fill: '#0f0', fontSize: 24 });
            let worst = this.add.image(10, 70, "worst").setOrigin(0);
        }
        if(gameScene.karma >= 33 && gameScene.karma < 66){
            console.log("medium");
            this.ending = this.add.text(200, 70, 'medium', { fill: '#0f0', fontSize: 24 });
            let medium = this.add.image(10, 70, "medium").setOrigin(0);
            
        }
        if(gameScene.karma >= 66 && gameScene.karma <= 100){
            console.log("best");
            this.ending = this.add.text(200, 70, 'best', { fill: '#0f0', fontSize: 24 });
            let best = this.add.image(10, 70, "best").setOrigin(0);
        }

        const welcomeText = this.add.text(85, 15, 'Game over!', { fill: '#0f0', fontSize: 24 });
        welcomeText.setFont = "Fresca";
        const start = this.add.text(105, 220, 'Start over', { fill: '#0f0' })
        .setInteractive()
        .on('pointerdown', () => { 
            this.scene.start('BootScene'); 
            gameScene.karma = 0;
            gameScene.playerHealth = 100;
            gameScene.enemiesKilled = 0;
        })
        .on('pointerover', () => start.setStyle({ fill: '#ff0'}) )
        .on('pointerout', () => start.setStyle({ fill: '#0f0' }) );

        let karma = this.add.text(150, 40, `${gameScene.karma}`);

        console.log("EndScene loaded"); // end
    }

    update(){

    }

}