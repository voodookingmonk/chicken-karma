/* jshint esversion:6*/
import { CST } from "../CST.js";
//export default DialogBox;

export class UIScene extends Phaser.Scene{
	constructor(){
        super({
            key: CST.SCENES.UI
        });
    }

    init(){
        console.log("UI loading...");
        this.graphics = 0;
        this.bar = null;
        this.bar2 = null;
        this.t = null;
        this.gameScene = null;

    }

    preload(){
        this.load.image("help", "assets/pause.png");
    }

    create(){
        this.gameScene = this.scene.get(CST.SCENES.WORLD);
        this.playerHealth = this.gameScene.playerHealth;
        this.playerHealthMax = this.gameScene.playerHealthMax;

        //call HelpScene
        this.helpButton  = this.add.image(480, 20, "help").setInteractive();

        this.keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.keyC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);

        this.helpButton.on("pointerdown", ()=>{
            this.scene.start('HelpScene');
            this.scene.stop('UIScene');
            this.scene.pause('WorldScene');
        });

        // graphics fixedToCamera
        this.graphics = this.add.graphics();
        this.graphics.fixedToCamera = true;
        this.graphics.setScrollFactor(0);

        //Healthbar bg
        this.bar = new Phaser.Geom.Rectangle(43, 10, (this.playerHealthMax / 2), 7);
        this.graphics.fillStyle(0xff3333);
        this.graphics.fillRectShape(this.bar);
				this.t = this.add.text(8, 6.5, "Health ", {
            font: "11px Arial",
            fill: "black",
            align: "center"
        });

        // quest UI addon

        this.userInterfaceHelper(8, 30, 85, 50);
        this.userInterfaceHelper(8, 90, 85, 40);

        var style = { fontFamily: 'Arial', fill: 'black', fontSize: 10, wordWrap: true, wordWrap: { width: 78, useAdvancedWrap: true } };

        this.questUITitle = this.add.text(10, 30, "Quest:", style).setScrollFactor(0);
        this.questUI = this.add.text(10, 40, "Talk to the King for a quest.", style).setScrollFactor(0);
        this.questUIHint = this.add.text(10, 90, "Hint: Healer is South-East in the village.", style).setScrollFactor(0);

        this.questUITitle.fixedToCamera = true;
        this.questUI.fixedToCamera = true;

        console.log("UI loaded"); // end
    }

    update(){
        if (Phaser.Input.Keyboard.JustDown(this.keyESC)){
            console.log("hello");
            this.scene.start('HelpScene');
            this.scene.stop('UIScene');
            this.scene.pause('WorldScene');
        }

        //call health bar
        if(this.gameScene.playerHealth >= -100){
            this.drawHealthBar();
        }

        // Main quest
        if (this.gameScene.talkedToKing){
            this.questUI.setText("Head east to kill slimes. " + this.gameScene.enemiesKilled + "/" + this.gameScene.enemyCount);
        }

        // Hide/Show UI
        if (Phaser.Input.Keyboard.JustDown(this.keyC)){
            (this.scene.isVisible() === true) ? this.scene.setVisible(false) : this.scene.setVisible(true);
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
                this.graphics.fillStyle(0x000000);
                this.graphics.fillRectShape(this.bar2);
            }else{
                //healed
                this.bar2 = new Phaser.Geom.Rectangle(43, 10, 50, 7);
                this.graphics.fillStyle(0xff3333);
                this.graphics.fillRectShape(this.bar2);
            }
        }
        if(this.gameScene.playerHealth < 0){
            this.graphics.clear(this.bar2);
            this.bar2 = new Phaser.Geom.Rectangle(43, 10, 50, 7);
            this.graphics.fillRectShape(this.bar2);
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
            this.scene.stop('WorldScene');
            this.scene.stop('UIScene');
            this.scene.stop('HelpScene');
            this.scene.start('EndScene');

            //respawn();
    }

    userInterfaceHelper(x, y, width, height){
        let uiBackground = this.add.graphics();
        let rect = new Phaser.Geom.Rectangle(x, y, width, height); // 8 30 85 50
        uiBackground.fillStyle(0xFFFFFF, 0.75);
        uiBackground.fillRectShape(rect);
        uiBackground.fixedToCamera = true;
        uiBackground.setScrollFactor(0);
    }
}

export class DialogBox extends Phaser.GameObjects.Graphics{ // meant to be used in WorldScene
    constructor(scene, x, y, texts, player, enemy){
        super(scene);
        scene.add.existing(this);
        this.scene = scene;
        this.player = player;
        this.enemy = enemy;

        this.x = x;
        this.y = y;

        this.texts = texts;
        this.textsLength = this.texts.length;
        this.number = 0;
        this.drawWhiteBoxFirstTime = true;
        this.newDialogueDelay = 1000; // ms

        this.currentText;
        this.rect;
        this.text;
        this.graphicsText;
        this.hintBox;
        this.hintText;

        this.keySPACE = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.gameScene = scene.scene.get(CST.SCENES.WORLD);
    }

    preUpdate(){

        if(this.drawWhiteBoxFirstTime){
            this.drawWhiteBox();
            this.drawWhiteBoxFirstTime = false;

            this.drawText(this.texts[this.number]);
            this.number++;
        }

        if (Phaser.Input.Keyboard.JustDown(this.keySPACE)){
            this.destroyText();
            this.drawText(this.texts[this.number]);
            this.number++;
        }

        if ((this.number-1) == this.textsLength){
            this.destroyWhiteBox();
        }
    }

    drawWhiteBox(){
        this.graphicsText = this.scene.add.graphics();
        this.rect = new Phaser.Geom.Rectangle(this.x, this.y, 489, 61);
        this.graphicsText.fillStyle(0xFFFFFF, 0.75);
        this.graphicsText.fillRectShape(this.rect);
        this.graphicsText.fixedToCamera = true;
        this.graphicsText.setScrollFactor(0);

        this.player.canMove = false;

        let style = { fontFamily: 'Arial', fill: 'black', fontSize: 10, wordWrap: true, wordWrap: { width: 78, useAdvancedWrap: true } };
        this.rectTwo = new Phaser.Geom.Rectangle(8, 140, 85, 50);
        this.hintBox = this.scene.add.graphics().fillStyle(0xFFFFFF, 0.75).fillRectShape(this.rectTwo).setScrollFactor(0);
        this.hintBox.fixedToCamera = true;


        this.hintText = this.scene.add.text(10, 140, "Hint: Press SPACE to continue dialogue", style).setScrollFactor(0);
    }

    destroyWhiteBox(){
        this.hintBox.destroy();
        this.hintText.destroy();
        this.graphicsText.destroy();
        this.enemy.canTalk = true;
        this.player.canMove = true;
        this.destroy(true);
        this.number = 0;
        this.gameScene.time.delayedCall(this.newDialogueDelay, () => { this.gameScene.canTalkToNPCAgain = true; });
    }

    drawText(input){
        this.currentText = this.scene.add.text(this.x+5, this.y+5, input, { font: 'bold 8pt Arial', fill: 'black', fontSize: 6, wordWrap: { width: 500} });
        this.currentText.fixedToCamera = true;
        this.currentText.setScrollFactor(0);
    }

    destroyText(){
        this.currentText.destroy();
    }
}

export class Pow extends Phaser.GameObjects.Graphics{ // meant to be used in WorldScene
    constructor(scene, player, enemy){
        super(scene);
        scene.add.existing(this);
        this.scene = scene;
        this.player = player;
        this.enemy = enemy;
        this.gameScene = scene.scene.get(CST.SCENES.WORLD);

        this.showPow = true;
        this.delayToDisplayPow = 50; // ms
        this.delayToHidePow = 150; // ms

        this.currentImage;
    }

    preUpdate(){
        if (this.showPow){
            this.showPow = false;
            this.gameScene.time.delayedCall(this.delayToDisplayPow, () => {
                this.drawText();
                this.gameScene.time.delayedCall(this.delayToHidePow, () => { 
                    this.destroyText(); 
                });
            });
        }
    }

    drawText(){
        this.currentImage = this.scene.add.image(this.enemy.x-10, this.enemy.y-20, 'pow');
    }

    destroyText(){
        this.currentImage.destroy();
    }
}
