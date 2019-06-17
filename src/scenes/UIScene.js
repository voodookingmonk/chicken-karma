/* jshint esversion:6*/
import { CST } from "../CST.js";

export class UIScene extends Phaser.Scene{
	constructor(){
        super({
            key: CST.SCENES.UI
        });
        this.gameScene = null;
        this.graphics = null;
    }

    init(){
        console.log("UI loading...");
    }

    preload(){
    }

    create(){
        this.gameScene = this.scene.get(CST.SCENES.WORLD);
        console.log("UI loaded"); // end
        //Dialoog
        this.talking = 1;
        this.test = 0;
    }

    update(){
        if (this.gameScene.checkDialog === false) {
            //console.log("false");
          /*  if (this.talking == 0) {
                this.graphics.npcText.destroy();
            }*/
        } else {
            console.log(this.talking);
            this.test = 1;
            this.graphics = new DialogBox(this, 32, 180, 250, 50, 35, 185, "Tere", this.talking);
            this.graphics.drawDialogBox();
            this.graphics.addText();
            if (this.gameScene.cursors.space.isDown && this.talking < 2){
              //  this.graphics.npcText.destroy();
                this.talking += 1;
            }
        }
        if ((this.gameScene.cursors.left.isDown || this.gameScene.cursors.right.isDown || this.gameScene.cursors.up.isDown || this.gameScene.cursors.down.isDown) && this.talking > 1){
            this.talking = 0;
            this.gameScene.checkDialog = false;
						this.graphics.npcText.visible = false;
        }
    }

}

class DialogBox extends Phaser.GameObjects.Graphics{
    constructor(scene, x, y, width, height, textX, textY, textWord, talking){
        super(scene);
        scene.add.existing(this);
        this.scene = scene;
        this.talking = talking;

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.textX = textX;
        this.textY = textY;
        this.textWord = textWord;

    }

    preUpdate(){
    }

    drawDialogBox(){
        this.graphicsText = this.scene.add.graphics();
        this.text = new Phaser.Geom.Rectangle(this.x, this.y, this.width, this.height);
        this.graphicsText.fillStyle(0xffffff, 1);
        this.graphicsText.fillRectShape(this.text);

    }

    addText(){
        if (this.talking < 2 && this.talking > 0) {
            this.npcText = this.scene.add.text(this.textX, this.textY, this.textWord, {
                fontSize: '12px',
                fill: '#000',
                wordWrap: { width: 250, useAdvancedWrap: true }
            });
         }


        if (this.talking >=2) {
            this.textWord = "YOU ARE AMAZING";
            this.npcText = this.scene.add.text(this.textX, this.textY, this.textWord, {
                fontSize: '12px',
                fill: '#000',
                wordWrap: { width: 300, useAdvancedWrap: true }
            });
            this.talking = 2;
         }
    }
}
