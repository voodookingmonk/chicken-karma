/* jshint esversion:6*/
import { CST } from "../CST.js";

export class UIScene extends Phaser.Scene{
	constructor(){
        super({
            key: CST.SCENES.UI
        });
        this.graphics = 0;
        this.bar = null;
        this.bar2 = null;
        this.t = null;
        this.gameScene = null;

    }

    init(){
        console.log("UI loading...");
    }

    preload(){
    }

    create(){
        this.gameScene = this.scene.get(CST.SCENES.WORLD);

        //console.log(gameScene);
        this.playerHealth = this.gameScene.playerHealth;
        this.playerHealthMax = this.gameScene.playerHealthMax;

        console.log("UI loaded"); // end

        // graphics fixedToCamera
        this.graphics = this.add.graphics();
        this.graphics.fixedToCamera = true;
        this.graphics.setScrollFactor(0);
        //Healthbar bg
        this.bar = new Phaser.Geom.Rectangle(43, 10, (this.playerHealthMax / 2), 7);
        this.graphics.fillStyle(0xff3333);
        this.graphics.fillRectShape(this.bar);
				this.t = this.add.text(10, 6.5, "Health : ", {
            font: "9px Arial",
            fill: "black",
            align: "center"
        });

				//Dialoog
				//this.talking = 1;
    }

    update(){

        if(this.gameScene.playerHealth >= -100){
            this.drawHealthBar();
        }

				//dialoog
				if (this.gameScene.checkDialog === false) {
					this.talking = 1;
				} else {
						//console.log(this.talking);
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

    drawHealthBar (){
        this.graphics = this.add.graphics();

        if(this.gameScene.playerHealth >= 0 && this.gameScene.playerHealth <= 100){
            if(this.gameScene.playerHealth != this.playerHealthMax){
                let w = 0;
                w = (this.gameScene.playerHealth - this.playerHealthMax) / 2;

                this.graphics.clear(this.bar2);
                this.bar2 = new Phaser.Geom.Rectangle(93, 10, w, 7);
                this.graphics.fillRectShape(this.bar2);
            }else{
                this.bar2 = new Phaser.Geom.Rectangle(43, 10, 50, 7);
                this.graphics.fillStyle(0xff3333);
                this.graphics.fillRectShape(this.bar2);
            }
        }
        if(this.gameScene.playerHealth < 0){
            this.death();
        }

    }

    death (playerHealth){
        this.graphicsText = this.add.graphics();
            this.text = new Phaser.Geom.Rectangle(0, 90, 400, 50, 32);
            this.graphicsText.fillStyle(0x000000, 1);
            this.graphicsText.fillRectShape(this.text);


            this.t = this.add.text(100, 100, "You died", {
                    font: "30px Arial",
                    fill: "red",
                    align: "center"
            });
            //respawn();
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
