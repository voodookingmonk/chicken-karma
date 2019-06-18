/* jshint esversion:6*/
import { CST } from "../CST.js";

export class LoadScene extends Phaser.Scene{
	constructor(){
        super({
            key: CST.SCENES.LOAD
        });
    }

    init(){
        console.log("LoadScene loading...");
    }

    preload(){
    }

    create(){
        let gameScene = this.scene.get(CST.SCENES.WORLD);

        this.scene.start('WorldScene');   
        this.scene.start('UIScene');
        this.scene.start('HelpScene');

        //console.log("LoadScene loaded"); // end
    }

    update(){
    }

}