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
    }

    create(){
        let gameScene = this.scene.get(CST.SCENES.WORLD);

        this.scene.stop('WorldScene');   
        this.scene.stop('UIScene');
        this.scene.stop('HelpScene');

        const welcomeText = this.add.text(85, 15, 'Game over!', { fill: '#0f0', fontSize: 24 });
        welcomeText.setFont = "Fresca";
        const start = this.add.text(105, 200, 'Start over!', { fill: '#0f0' })
        .setInteractive()
        .on('pointerdown', () => { 
            this.scene.start('LoadScene'); 
            gameScene.karma = 0;
            gameScene.playerHealth = 100;
            gameScene.enemiesKilled = 0;
        })
        .on('pointerover', () => start.setStyle({ fill: '#ff0'}) )
        .on('pointerout', () => start.setStyle({ fill: '#0f0' }) );

        let karma = this.add.text(85, 15, `${gameScene.karma}`);

        console.log("EndScene loaded"); // end
    }

    update(){

    }

}