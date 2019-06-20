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
        this.load.image("resume", "assets/resume.png");
        this.load.image("help", "assets/pause_scrn.png"); 
        this.load.image("restart", "assets/restart.png"); 
    }

    create(){
        let gameScene = this.scene.get(CST.SCENES.WORLD);
        let loadScene = this.scene.get(CST.SCENES.LOAD);
        
        this.help = this.add.image(100, 50, "help").setOrigin(0);

        //close HelpScene
        this.keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        let closeButton  = this.add.image(314, 134, "resume").setInteractive();

        closeButton.on("pointerdown", ()=>{
            this.scene.start('UIScene');
            this.scene.resume('WorldScene');
            this.scene.sleep('HelpScene');  
        });

        let resetButton  = this.add.image(314, 190, "restart").setInteractive();

        resetButton.on("pointerdown", ()=>{
            
            this.scene.stop('WorldScene');
            this.scene.stop('UIScene');
            this.scene.start('BootScene');
        });
    
        console.log("HelpScene loaded"); // end
    }

    update(){
        if (Phaser.Input.Keyboard.JustDown(this.keyESC)){
            this.scene.start('UIScene');
            this.scene.resume('WorldScene');
            this.scene.sleep('HelpScene');  
        }
    }

}