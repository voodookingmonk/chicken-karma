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

    }

    update(){
    }

}