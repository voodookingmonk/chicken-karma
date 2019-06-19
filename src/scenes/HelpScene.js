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
    
/*      console.log("BootScene sleep " + this.scene.manager.isSleeping('BootScene'));
        console.log("BootScene active " + this.scene.manager.isActive('BootScene'));
        console.log("BootScene visible " + this.scene.manager.isVisible('BootScene'));
        console.log("UIScene sleep " + this.scene.manager.isSleeping('UIScene'));
        console.log("UIScene active " + this.scene.manager.isActive('UIScene'));
        console.log("UIScene visible " + this.scene.manager.isVisible('UIScene')); */
        
        //if(this.scene.manager.isSleeping('BootScene') == false){

            //close HelpScene
            let closeButton  = this.add.image(314, 134, "resume").setInteractive();

            closeButton.on("pointerdown", ()=>{
                this.scene.start('UIScene');
                this.scene.resume('WorldScene');
                this.scene.sleep('HelpScene');  
            });

            //reset game

/*          this.reset = this.add.text(200, 210, 'Reset game', { fill: '#000' }).setInteractive()
            .on('pointerdown', () => { 
                this.scene.stop('WorldScene');
                this.scene.stop('UIScene');
                this.scene.start('BootScene'); }) 
            .on('pointerover', () => this.reset.setStyle({ fill: '#f00'}) )
            .on('pointerout', () => this.reset.setStyle({ fill: '#000' }) ); */
            let resetButton  = this.add.image(314, 190, "restart").setInteractive();

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