/* jshint esversion:6*/
import { CST } from "../CST.js";

export class UIScene extends Phaser.Scene{
	constructor(){
        super({
            key: CST.SCENES.UI
        });
    }

    init(){
        console.log("UI loading...");
    }

    preload(){
    }

    create(){
        let gameScene = this.scene.get(CST.SCENES.WORLD);
        console.log("UI loaded"); // end
    }

    update(){
    }

}