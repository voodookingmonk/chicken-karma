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
    }

    create(){
        let gameScene = this.scene.get(CST.SCENES.WORLD);

        console.log("HelpScene loaded"); // end
    }

    update(){
    }

}