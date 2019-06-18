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

        const welcomeText = this.add.text(120, 50, 'Game over!', { fill: '#0f0' });
        welcomeText.setFont = "Fresca";
        const start = this.add.text(115, 125, 'Start over', { fill: '#0f0' })
        .setInteractive()
        .on('pointerdown', () => { this.scene.start('LoadScene'); })
        .on('pointerover', () => start.setStyle({ fill: '#ff0'}) )
        .on('pointerout', () => start.setStyle({ fill: '#0f0' }) );

        console.log("EndScene loaded"); // end
    }

    update(){
    }

}