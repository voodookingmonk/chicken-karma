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
        this.load.image("reset", "assets/reset.png"); 
    }

    create(){
        let gameScene = this.scene.get(CST.SCENES.WORLD);
        let loadScene = this.scene.get(CST.SCENES.LOAD);
        
        this.help = this.add.image(10, 10, "help").setOrigin(0);
    
        console.log("BootScene sleep " + this.scene.manager.isSleeping('BootScene'));
        console.log("BootScene active " + this.scene.manager.isActive('BootScene'));
        console.log("BootScene visible " + this.scene.manager.isVisible('BootScene'));
        console.log("UIScene sleep " + this.scene.manager.isSleeping('UIScene'));
        console.log("UIScene active " + this.scene.manager.isActive('UIScene'));
        console.log("UIScene visible " + this.scene.manager.isVisible('UIScene'));
        
        //if(this.scene.manager.isSleeping('BootScene') == false){

            //close HelpScene
            let closeButton  = this.add.image(280,25, "close").setInteractive();

            closeButton.on("pointerdown", ()=>{
                this.scene.start('UIScene');
                this.scene.resume('WorldScene');
                this.scene.sleep('HelpScene');  
            });

            //reset game
            let resetButton  = this.add.image(275, 50, "reset").setInteractive();

            resetButton.on("pointerdown", ()=>{
                
                this.scene.stop('WorldScene');
                this.scene.stop('UIScene');
                this.scene.start('BootScene');
            });
       /* }else{
            //close HelpScene
            let closeButton  = this.add.image(280,25, "close").setInteractive();

            closeButton.on("pointerdown", ()=>{
                /*this.scene.switch('BootScene');  
            });
    }*/
        
        
        console.log("HelpScene loaded"); // end
    }

    update(){
    }

}