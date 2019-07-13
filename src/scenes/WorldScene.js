/* jshint esversion:6*/
import { CST } from "../CST.js";
import thisGame from "../main.js";
import { UIScene } from "./UIScene.js";
import { DialogBox as DialogBox } from "./UIScene.js";
import { Pow as Pow } from "./UIScene.js";

export class WorldScene extends Phaser.Scene{
	constructor(){
        super({
            key: CST.SCENES.WORLD
        });

    }

    init(){
        console.log("World loading...");
        this.npcText = null;
        this.liikumine = true;

        //Healthbar:
        this.playerHealth = 100; // player health for health bar
        this.playerHealthMax = 100; // player health max
        this.firstTime = null;

        //Quest:
        this.talking = 0;
        this.quest1 = 0;
        this.text = null;
        this.talkedToKing = false;
        this.questUI;
        this.dialogueHappening = true;
        this.kingDialogue = ["CLUCK... Po, I am king Roland.", "I have summoned you here to give you a quest.", "If you succeed then I shall redeem you of all your wrongdoings.", "There are dangerous slimes attacking the village and you are our last hope! CLUCK...", "You must kill them! CLUCK... head east of the city."];
        this.healerDialogue = ["Welcome traveller! CLUCK...", "I have healed your wounds.", "Now go and clear out the slimes.", "CLUCK..."];
        this.witchDialogue = ["Welcome, I heard that you are on a quest to kill the slimes.", "Allow me to let you in on a secret, but sssh!", "The chickens are mind controlling the villagers.", "The chickens fear the slimes.", "So before you slay all the slimes, be sure to kill the chickens."];
        this.foolDialogue = ["CLUCK...The slimes are bad. CLUCK...", "No the cluck clucks are bad", "No, no, no, no CLUCK...the slimes are bad CLUCK.", "Where is the witch?!", "We need the witch!"];

        //graphics
        this.map = null;
        this.tiles = null;
        this.grass = null;
        this.obstacles = null;
        this.graphics = 0;
        this.graphicsText = 0;

        //Mobs and karma mechanics
        this.chickenCount = 3; // amount of chickens spawned
        this.enemyCount = 3; // amount of enemies spawned
        this.chickenCount = 34; // amount of chickens spawned
        this.enemyCount = 15; // amount of enemies spawned
        this.aChickenIsKilled = false; // a chicken is killed
        this.enemiesKilled = 0; // enemies killed, gameover reaction
        this.karma = 0; // karma points for game purpose
        this.updateCounter = 0; // timing counter
        this.canTalkToNPCAgain = true; // so can´t talk to multiple NPCS at a time
        this.talkWait = 1000;
        this.talkToWitchOnce = true;
        this.talkCounter = 0;

        this.checkHealth = 100;

        this.checkDialog = false;
    }

    preload(){

        // create the map
        this.map = this.make.tilemap({
            key: 'map'
        });

        // first parameter is the name of the tilemap in tiled
        this.tiles = this.map.addTilesetImage('spritesheet', 'tiles');

        // creating the layers
        this.grass = this.map.createStaticLayer('Grass', this.tiles, 0, 0);
        this.obstacles = this.map.createStaticLayer('Obstacles', this.tiles, 0, 0);

        // make all tiles in obstacles collidable
        this.obstacles.setCollisionByExclusion([-1]);

        //  animation with key 'left', we don't need left and right as we will use one and flip the sprite
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', {
                frames: [12, 13, 14, 15]
            }),
            frameRate: 10,
            repeat: -1
        });

        // animation with key 'right'
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', {
                frames: [8, 9, 10, 11]
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('player', {
                frames: [4, 5, 6, 7]
            }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('player', {
                frames: [0, 1, 2, 3]
            }),
            frameRate: 10,
            repeat: -1
        });

        // for chicken

        this.anims.create({
            key: 'chickenLeft',
            frames: this.anims.generateFrameNumbers('chicken', {
                frames: [4, 5, 6, 7]
            }),
            frameRate: 10,
            repeat: -1
        });

        // animation with key 'right'
        this.anims.create({
            key: 'chickenRight',
            frames: this.anims.generateFrameNumbers('chicken', {
                frames: [4, 5, 6, 7]
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'chickenUp',
            frames: this.anims.generateFrameNumbers('chicken', {
                frames: [8, 9, 10, 11]
            }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'chickenDown',
            frames: this.anims.generateFrameNumbers('chicken', {
                frames: [0, 1, 2, 3]
            }),
            frameRate: 10,
            repeat: -1
        });

        // for enemy

        this.anims.create({
            key: 'enemyLeft',
            frames: this.anims.generateFrameNumbers('enemy', {
                frames: [8, 9, 10, 11]
            }),
            frameRate: 10,
            repeat: -1
        });

        // animation with key 'right'
        this.anims.create({
            key: 'enemyRight',
            frames: this.anims.generateFrameNumbers('enemy', {
                frames: [8, 9, 10, 11]
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'enemyUp',
            frames: this.anims.generateFrameNumbers('enemy', {
                frames: [4, 5, 6, 7]
            }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'enemyDown',
            frames: this.anims.generateFrameNumbers('enemy', {
                frames: [0, 1, 2, 3]
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'playerAtk',
            frames: this.anims.generateFrameNumbers('playerAttack', {
                frames: [0, 1, 2, 3, 4, 5, 6, 7]
            }),
            frameRate: 30,
            repeat: -1
        });

    }

    create(){
      	this.uiScene = this.scene.get(CST.SCENES.UI);

        // our player sprite created through the phycis system

        this.player = this.add.existing(new Player(this, 778, 280));

        this.NPC_King = this.add.existing(new NPC(this, 778, 240, "King", this.player));
        this.NPC_healer = this.add.existing(new NPC(this, 1012, 540, "Healer", this.player));
        this.NPC_witch = this.add.existing(new NPC(this, 150, 68, "Witch", this.player));
        this.NPC_fool = this.add.existing(new NPC(this, 487, 443, "Fool", this.player));

        let npcText = this.add.text(16, 16, 'tere', {
            fontSize: '32px',
            fill: '#000'
        });
        npcText.visible = false;

        this.chickens = this.add.group();
        this.enemies = this.add.group();
        this.npcs = this.add.group();

        this.npcs.add(this.NPC_healer);
        this.npcs.add(this.NPC_fool);
        this.npcs.add(this.NPC_witch);
        this.npcs.add(this.NPC_King);

        this.spawnEnemies(65, 503, 181, 575, 28, "Chicken");
        this.spawnEnemies(640, 1160, 511, 682, 6, "Chicken");
        this.spawnEnemies(1650, 2200, 220, 600, this.enemyCount, "Enemy");

        //might change the player's collision box
        this.player.body.setSize(25, 25, 0, 15);
        this.player.body.offset.y = 10;

        //treetops and stuff above player
        let top = this.map.createStaticLayer('Top', this.tiles, 0, 0);

        // don't go out of the map
        this.physics.world.bounds.width = this.map.widthInPixels;
        this.physics.world.bounds.height = this.map.heightInPixels;
        this.player.setCollideWorldBounds(true);

        // don't walk on trees
        this.physics.add.collider(this.player, this.obstacles);
        this.physics.add.collider(this.chickens, this.obstacles);
        this.physics.add.collider(this.enemies, this.obstacles);
        this.physics.add.collider(this.npcs, this.obstacles);

        this.physics.add.collider(this.player, this.chickens, this.collide, false, this);
        this.physics.add.collider(this.player, this.enemies, this.collide, false, this);
        this.physics.add.collider(this.player, this.npcs, this.collide, false, this);

        // limit camera to map
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.roundPixels = true; // avoid tile bleed

        // user input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.keyX = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);

        console.log("WorldScene loaded"); // end
        }

    collide(player, target){
        this.attack(player, target);

        if (target.canTalk){
            this.talk(player, target);
        }
    }

    attack(player, target){
        if ((target.firstAttack || target.canAttack) && player.health > -1 ){
            target.collided = true;
            target.firstAttack = false;
            target.canAttack = false;
            player.health -= target.damage;

            player.visible = false;
            player.turnToVisible = true;
        }

        if (Phaser.Input.Keyboard.JustDown(this.keySPACE)){
            player.attackingAnimationCounter = 0;
            player.attackingAnimation = true;
            target.health -= 1;
            let newAttack = new Pow(this, player, target);
        }
    }

    talk(player, target) {
        let dialogue;

        if (target.npcType === "Healer"){
            this.heal(player);
        }

        if (this.canTalkToNPCAgain && target.canTalk){ // this.talkToOneNPCAtATime && enemy.canTalkAgain
            this.canTalkToNPCAgain = false;
            if (target.npcType === "King"){
                this.talkedToKing = true;
                dialogue = this.kingDialogue;
            } else if (target.npcType === "Healer"){
                dialogue = this.healerDialogue;
            } else if (target.npcType === "Fool"){
                dialogue = this.foolDialogue;
            }else if (target.npcType === "Witch"){
                if (this.talkToWitchOnce){
                    this.karma += 2;
                    this.talkToWitchOnce = false;
                }
                dialogue = this.witchDialogue;
            }

            let talk = new DialogBox(this.uiScene, 5, 255, 60, dialogue, player, target); // scene, x, y, timing, dialogue array, player, enemy
        }
    }

    userInterfaceHelper(x, y, width, height){
        let uiBackground = this.add.graphics();
        let rect = new Phaser.Geom.Rectangle(x, y, width, height); // 8 30 85 50
        uiBackground.fillStyle(0xFFFFFF, 0.75);
        uiBackground.fillRectShape(rect);
        uiBackground.fixedToCamera = true;
        uiBackground.setScrollFactor(0);
    }

    heal (player) {
        player.health = 100;
    }

    spawnEnemies(xMin, xMax, yMin, yMax, amount, type){
        let target;

        for (let i = 0; i < amount; i++){
            let x = Phaser.Math.RND.between(xMin, xMax);
            let y = Phaser.Math.RND.between(yMin, yMax);

            if (type === "Chicken"){

                target = this.add.existing(new Chicken(this, x, y, this.player));
                this.chickens.add(target);

            } else if (type === "Enemy"){

                target = this.add.existing(new Enemy(this, x, y, this.player));
                this.enemies.add(target);

            }

            this.physics.add.existing(target);
        }
    }

    update(time, delta){

        this.updateCounter++;
        this.talkCounter++;

        if (Phaser.Input.Keyboard.JustDown(this.keySPACE)){
            this.player.attackingAnimationCounter = 0;
            this.player.attackingAnimation = true;
        }

        if (this.updateCounter == 100){
            this.updateCounter = 0;
        }

        if (this.talkedToKing && this.enemiesKilled === this.enemyCount){
            this.scene.stop('UIScene');
            this.scene.stop('WorldScene');
            this.scene.start('EndScene');
        }

    }
}

class Player extends Phaser.Physics.Arcade.Sprite{
    constructor (scene, x, y){
        super(scene, x, y);
        this.scene = scene;

        this.gameScene = scene.scene.get(CST.SCENES.WORLD);
        this.health = this.gameScene.playerHealth;

        this.setTexture('player');
        this.setPosition(x, y);
        scene.physics.world.enableBody(this, 0);
        this.body.collideWorldBounds = true;
        this.body.immovable = true;

        this.keys = this.scene.input.keyboard.createCursorKeys();
        this.speed = 200;
        this.movement = true;
        this.attackingAnimation = false;
        this.canMove = true;

        this.counter = 0;
        this.attackingAnimationCounter = 0;

        this.turnToVisible = false;

        this.keyE = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    }

    create(){

    }

    preUpdate(time, delta){
        super.preUpdate(time, delta);
        //this.counter++;
        //this.attackingAnimationCounter++;

        if (this.turnToVisible){
            this.turnToVisible = false;
            this.gameScene.time.delayedCall(100, () => { this.visible = true; });
            //this.counter = 0;
        }

        /*if (this.counter == 5){
            this.visible = true;
        }*/

        this.gameScene.playerHealth = this.health;

        this.body.setVelocity(0);

        //Player movement
        // Horizontal movement
        if (this.canMove){

            if (this.keys.left.isDown) {
                this.body.setVelocityX(-this.speed);
            } else if (this.keys.right.isDown) {
                this.body.setVelocityX(this.speed);
            }

            // Vertical movement
            if (this.keys.up.isDown) {
                this.body.setVelocityY(-this.speed);
            } else if (this.keys.down.isDown) {
                this.body.setVelocityY(this.speed);
            }
        

            // Update the animation last and give left/right animations precedence over up/down animations
            if (!this.attackingAnimation){
                this.animations('left', 'right', 'up', 'down', false);
            } else {
                this.anims.play('playerAtk', true);
                this.body.setSize(32, 32);
                this.body.offset.x = -4;
                this.body.offset.y = 4;
                this.gameScene.time.delayedCall(400, () => {
                //if (this.attackingAnimationCounter % 30 === 0){
                    //this.attackingAnimationCounter = 0;
                    this.body.setSize(25, 25);
                    this.body.offset.x = 0; // im
                    this.body.offset.y = 10;
                    this.attackingAnimation = false;
                //}
                });
            }
        } else {
            this.anims.stop();
        }
    }

    animations(left, right, up, down, statement){

        if (this.keys.left.isDown) {
            this.anims.play(left, true);
            this.flipX = false;
        } else if (this.keys.right.isDown) {
            this.anims.play(right, true);
            this.flipX = false;
        } else if (this.keys.up.isDown) {
            this.anims.play(up, true);
        } else if (this.keys.down.isDown) {
            this.anims.play(down, true);
        } else {
            if (statement){
                this.anims.play(left, true);
            } else {
                this.anims.stop();
            }
        }
    }
}

class NPC extends Phaser.Physics.Arcade.Sprite{
    constructor (scene, x, y, type, player){
        super(scene, x, y);

        this.setTexture(type);
        this.setPosition(x, y);
        scene.physics.world.enableBody(this, 0);
        this.body.collideWorldBounds = true;
        this.body.immovable = true;
        this.keys = this.scene.input.keyboard.createCursorKeys();
        this.body.immovable = true;

        this.scene = scene; // scene object
        this.player = player; // player object

        this.speed = 200; // object speed
        this.karma = -1; // object karma point influence
        this.health = 5; // object health
        this.canAttack = false; // if NPC is able to attack
        this.canTalk = true; // checking if this object is able to talk
        this.canTalkAgain = true;
        this.npcType = type;

        this.collided = false; // collision with player check
    }

    create(){

    }

    preUpdate(time, delta){
        this.body.setVelocity(0);

        this.checkAlive();
    }

    checkAlive(){
        if (this.health <= 0){
            this.disableBody(true, true);
            this.scene.karma += this.karma;
            if (!this.scene.aChickenIsKilled){
                this.scene.aChickenIsKilled = true;
            }
        }
    }

    follow(player){
        this.scene.physics.moveToObject(this, player, 80);
    }
}

class Chicken extends Phaser.Physics.Arcade.Sprite{
    constructor (scene, x, y, player){
        super(scene, x, y);

        this.setTexture('chicken');
        this.setPosition(x, y);
        scene.physics.world.enableBody(this, 0);
        this.body.collideWorldBounds = true;
        this.body.immovable = false;
        this.keys = this.scene.input.keyboard.createCursorKeys();
        this.scene = scene;
        this.gameScene = scene.scene.get(CST.SCENES.WORLD);

        this.damage = 5; // object damage
        this.speed = 10; // object movement speed
        this.health = 2; // object health
        this.karma = 2; // object karma point
        this.npcType = "Chicken";
        this.canTalk = false;

        this.direction = 0; // moving direction
        this.firstTime = true; // first time launch to start moving without timer
        this.firstAttack = true;
        this.canAttack = true;
        this.timerBoolean = true;

        this.interval = Phaser.Math.RND.between(50, 100); // choosing when to switch direction (timer based)
        this.previousTimer = 0; // timers for events
        this.counter = 0; // counter for events
        this.timer;

        this.collided = false; // used for following
        this.player = player; // used for following the player

        this.minX = 500;
        this.maxX = 700;
        this.minY = 200;
        this.maxY = 400;
    }

    create(){

    }

    preUpdate(time, delta){
        super.preUpdate(time, delta);
        this.previousTimer += 1;
        this.counter += 1;

        if (this.counter == 100){
            this.canAttack = true;
            this.counter = 0;
        }

        if (!this.collided){
            this.randomRoaming();
        } else {
            this.follow(this.player);

            if (this.body.velocity.x > 0){

                this.anims.play('chickenRight', true);
                this.flipX = false;

            } else if (this.body.velocity.x < 0){

                this.anims.play('chickenLeft', true);
                this.flipX = true;

            }
        }

        this.checkAlive();
    }

    follow(player){
        this.scene.physics.moveToObject(this, player, 80);
    }

    checkAlive(){
        if (this.health <= 0){
            this.disableBody(true, true);
            this.scene.karma += this.karma;
        }
    }

    maxBounds(){
        if (this.x > this.maxX){
            this.anims.play('chickenRight', true);
            this.flipX = true;
            this.previousTimer = 0;
            this.makeNPCMove(-this.speed, 0);
        } else if (this.x < this.minX){
            this.anims.play('chickenRight', true);
            this.flipX = false;
            this.previousTimer = 0;
            this.makeNPCMove(this.speed, 0);
        }
        if (this.y > this.maxY){
            this.anims.play('chickenUp', true);
            this.previousTimer = 0;
            this.makeNPCMove(0, -this.speed);
        } else if (this.y < this.minY){
            this.anims.play('chickenDown', true);
            this.previousTimer = 0;
            this.makeNPCMove(0, this.speed);
        }
    }

    randomRoaming(){
        if (this.previousTimer == this.interval || this.firstTime){
            this.firstTime = false;
            this.direction = Phaser.Math.RND.between(0, 8);
            if (this.direction == 1){ // right
                this.makeNPCMove(this.speed, 0);

                this.anims.play('chickenRight', true);
                this.flipX = false;

            } else if (this.direction == 2){ // left

                this.makeNPCMove(-this.speed, 0);
                this.anims.play('chickenRight', true);
                this.flipX = true;

            } else if (this.direction == 3){ // down

                this.makeNPCMove(0, this.speed);
                this.anims.play('chickenDown', true);

            } else if (this.direction == 4){ // up

                this.makeNPCMove(0, -this.speed);
                this.anims.play('chickenUp', true);

            } else if (this.direction == 5){

                this.makeNPCMove(this.speed, -this.speed);
                this.anims.play('chickenRight', true);
                this.flipX = false;

            } else if (this.direction == 6){

                this.makeNPCMove(this.speed, this.speed);
                this.anims.play('chickenRight', true);
                this.flipX = false;

            } else if (this.direction == 7){

                this.makeNPCMove(-this.speed, -this.speed);
                this.anims.play('chickenLeft', true);
                this.flipX = true;

            } else if (this.direction == 8){

                this.makeNPCMove(-this.speed, this.speed);
                this.anims.play('chickenLeft', true);
                this.flipX = true;

            }
            this.previousTimer = 0;
        }
    }

    makeNPCMove(x, y){
        this.body.setVelocityX(x);
        this.body.setVelocityY(y);
    }
}

class Enemy extends Phaser.Physics.Arcade.Sprite{
    constructor (scene, x, y, player){
        super(scene, x, y);

        this.setTexture('enemy');
        this.setPosition(x, y);
        scene.physics.world.enableBody(this, 0);
        this.body.collideWorldBounds = true;
        this.keys = this.scene.input.keyboard.createCursorKeys();
        this.player = player;

        this.speed = 80; // object speed
        this.karma = 2; // object karma point
        this.health = 2; // object health
        this.damage = 10; // object damage
        this.npcType = "Enemy";
        this.canTalk = false;

        this.collided = false; // used for following

        this.firstTime = true; // first time movement
        this.canAttack = true;
        this.firstAttack = true;

        this.interval = Phaser.Math.RND.between(50, 100); // random timed movement
        this.direction = 0; // random moving direction
        this.previousTimer = 0; // counter
        this.counter = 0;


    }

    create(){

    }

    preUpdate(time, delta){
        super.preUpdate(time, delta);
        this.previousTimer++;
        this.counter++;

        if (this.counter == 100){
            this.canAttack = true;
            this.counter = 0;
        }

        if (!this.collided){
            this.randomRoaming();
        } else {
            this.follow(this.player);

            if (this.body.velocity.x > 0){

                this.anims.play('enemyRight', true);
                this.flipX = false;

            } else if (this.body.velocity.x < 0){

                this.anims.play('enemyLeft', true);
                this.flipX = true;

            }
        }

        this.checkAlive();
    }

    follow(player){
        this.scene.physics.moveToObject(this, player, 80);
    }

    checkAlive(){
        if (this.health <= 0){
            this.disableBody(true, true);
            this.scene.karma += this.karma;
            this.scene.enemiesKilled++;
        }
    }

    randomRoaming(){

        if (this.previousTimer == this.interval || this.firstTime){
            this.firstTime = false;
            this.direction = Phaser.Math.RND.between(0, 8);
            if (this.direction == 1){ // right
                this.makeNPCMove(this.speed, 0);

                this.anims.play('enemyRight', true);
                this.flipX = false;

            } else if (this.direction == 2){ // left

                this.makeNPCMove(-this.speed, 0);
                this.anims.play('enemyLeft', true);
                this.flipX = true;

            } else if (this.direction == 3){ // down

                this.makeNPCMove(0, this.speed);
                this.anims.play('enemyDown', true);

            } else if (this.direction == 4){ // up

                this.makeNPCMove(0, -this.speed);
                this.anims.play('enemyUp', true);

            } else if (this.direction == 5){

                this.makeNPCMove(this.speed, -this.speed);
                this.anims.play('enemyRight', true);
                this.flipX = false;

            } else if (this.direction == 6){

                this.makeNPCMove(this.speed, this.speed);
                this.anims.play('enemyRight', true);
                this.flipX = false;

            } else if (this.direction == 7){

                this.makeNPCMove(-this.speed, -this.speed);
                this.anims.play('enemyLeft', true);
                this.flipX = true;

            } else if (this.direction == 8){

                this.makeNPCMove(-this.speed, this.speed);
                this.anims.play('enemyLeft', true);
                this.flipX = true;

            }

            this.previousTimer = 0;
        }
    }

    makeNPCMove(x, y){
        this.body.setVelocityX(x);
        this.body.setVelocityY(y);
    }
}