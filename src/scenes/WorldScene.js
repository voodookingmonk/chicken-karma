/* jshint esversion:6*/
import { CST } from "../CST.js";
import thisGame from "../main.js";
import { UIScene } from "./UIScene.js";

export class WorldScene extends Phaser.Scene{
	constructor(){
        super({
            key: CST.SCENES.WORLD
        });

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

    this.map = null;
    this.tiles = null;
    this.grass = null;
    this.obstacles = null;
    this.graphics = 0;
    this.graphicsText = 0;

    this.chickenCount = 1; // amount of chickens spawned
    this.enemyCount = 1; // amount of enemies spawned
    this.enemiesKilled = 0; // enemies killed, gameover reaction
    this.karma = 0; // karma points for game purpose
    this.updateCounter = 0; // timing counter

    this.checkHealth = 100;
    this.checkDialog = false;

    }

    init(){
        console.log("World loading...");
    }

    preload(){

		//this.sys.install('DialogModalPlugin');
        //console.log(this.sys.dialogModal);

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

    }

    create(){
      	let uiScene = this.scene.get(CST.SCENES.UI);

        // our player sprite created through the phycis system

        this.player = this.add.existing(new Player(this, 700, 300));
        //this.newEnemy = this.add.existing(new Enemy(this, 600, 300, this.player));
        this.NPC = this.add.existing(new NPC(this, 600, 300, this.player));
        this.physics.add.overlap(this.player, this.NPC, this.onMeetNPC2, false, this);

        let npcText = this.add.text(16, 16, 'tere', {
            fontSize: '32px',
            fill: '#000'
        });
        npcText.visible = false;

        this.chickens = this.add.group();
        this.enemies = this.add.group();
        this.npcs = this.add.group();

        this.npcs.add(this.NPC);

        for (let i = 0; i < this.chickenCount; i++) {
            let x = Phaser.Math.RND.between(500, 700);
            let y = Phaser.Math.RND.between(200, 400);

            let singleChicken = this.add.existing(new Chicken(this, x, y, this.player));
            this.physics.add.existing(singleChicken);
            this.chickens.add(singleChicken);

            if (i < this.enemyCount){
                x = Phaser.Math.RND.between(700, 900);
                y = Phaser.Math.RND.between(200, 400);
                let singleEnemy = this.add.existing(new Enemy(this, x, y, this.player));
                //this.singleNPC = this.add.existing(new NPC(this, x, y, this.player));
                this.physics.add.existing(singleEnemy);
                //this.physics.add.existing(this.singleNPC);
                this.enemies.add(singleEnemy);
            }
        }

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
        //this.physics.add.collider(this.enemies, this.player);
        //this.physics.add.collider(this.npcs, this.npcs);
        // limit camera to map
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.roundPixels = true; // avoid tile bleed

        // user input
        this.cursors = this.input.keyboard.createCursorKeys();


        this.physics.add.collider(this.player, this.chickens, this.collide, false, this);
        this.physics.add.collider(this.player, this.enemies, this.collide, false, this);
        this.physics.add.collider(this.player, this.npcs, (player, enemy)=>{
            this.collide(player, enemy);
            this.talk(player, enemy);
        }, false, this);

        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.keyT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T);

        }

    collide(player, enemy){
        enemy.collided = true;

        if ((enemy.firstAttack || enemy.canAttack) && player.health > -1 ){
            enemy.firstAttack = false;
            enemy.canAttack = false;
            player.health -= enemy.damage;
        }

        if (Phaser.Input.Keyboard.JustDown(this.keyE)){
            player.anims.play('enemyRight', true);
            enemy.health -= 1;   
        }
    }

    attack(){

    }

    talk(player, enemy) {

        let what = ["Tere", "Merilin", "How", "Are", "You", "Doing"];
        let talk = new DialogBox(this, 600, 300, what);

    }

    respawn (player) {
        this.player.x = 50;
        this.player.y = 100;
        this.bar2.width = 30;
        this.t = this.add.text(60, 100, "I AM ALIVE! ", {
            font: "30px Arial",
            fill: "red",
            align: "center"
        });
    }

    heal () {
            this.playerHealth = 100;
            console.log("healed");
    }

    onMeetNPC2 (player, NPC2) {
        if (new Date().getTime() > (this.time_now + this.interval)) {
            this.time_now = new Date().getTime();
            //console.log(new Date().getTime() + " every " + ((this.time_now + this.interval) - new Date().getTime()) + " milliseconds");

            this.talking = 1;
            this.checkDialog = true;
            this.liikumine = false;
            if (this.testHealth > 0 && this.enemyHealth > 0) {
                this.quest1 = 1;
            } else {
                this.quest1 = 2;
            }

        }

    }

    update(time, delta){

        this.updateCounter++;

        if (this.updateCounter == 100){
            this.updateCounter = 0;
        }

        if (this.enemiesKilled === 1){
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
        this.body.mass = 500;
        this.keys = this.scene.input.keyboard.createCursorKeys();
        this.speed = 200;
        this.movement = true;

        this.counter = 0;
    }

    create(){

    }

    preUpdate(time, delta){
        super.preUpdate(time, delta);

        this.counter++;

        this.gameScene.playerHealth = this.health;

        this.body.setVelocity(0);

        //Player movement
        // Horizontal movement
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
        if (this.keys.left.isDown) {
            this.anims.play('left', true);
            this.flipX = false;
        } else if (this.keys.right.isDown) {
            this.anims.play('right', true);
            this.flipX = false;
        } else if (this.keys.up.isDown) {
            this.anims.play('up', true);
        } else if (this.keys.down.isDown) {
            this.anims.play('down', true);
        } else {
            this.anims.stop();
        }
    }
}

class NPC extends Phaser.Physics.Arcade.Sprite{
    constructor (scene, x, y, player){
        super(scene, x, y);

        this.setTexture('enemy');
        this.setPosition(x, y);
        scene.physics.world.enableBody(this, 0);
        this.body.collideWorldBounds = true;
        this.body.immovable = true;
        this.keys = this.scene.input.keyboard.createCursorKeys();

        this.scene = scene;
        this.player = player;

        this.speed = 200;
        this.karma = -1;
        this.health = 5;
        this.canAttack = false;

        this.collided = false;

        this.counter = 0;
    }

    create(){

    }

    preUpdate(time, delta){
        super.preUpdate(time, delta);
        this.counter += 1;

        if (this.counter === 100){
            //console.log(this.body.velocity.y);
            this.counter = 0;
        }

        this.body.setVelocity(0);

        this.checkAlive();
        //this.drawHealthBar();
    }

    checkAlive(){
        if (this.health <= 0){
            //this.visible = false;
            //this.active = false;
            this.disableBody(true, true);
            this.scene.karma += this.karma;
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
        this.body.immovable = true;
        this.keys = this.scene.input.keyboard.createCursorKeys();

        this.damage = 5; // object damage
        this.speed = 10; // object movement speed
        this.health = 2; // object health
        this.karma = 1; // object karma point

        this.direction = 0; // moving direction
        this.firstTime = true; // first time launch to start moving without timer
        this.firstAttack = true;
        this.canAttack = true;

        this.interval = Phaser.Math.RND.between(50, 100); // choosing when to switch direction (timer based)
        this.previousTimer = 0; // timers for events
        this.counter = 0; // counter for events

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
            this.maxBounds();
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
            //this.visible = false;
            //this.active = false;
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
        this.body.immovable = true;
        this.keys = this.scene.input.keyboard.createCursorKeys();
        this.player = player;

        this.speed = 80; // object speed
        this.karma = 1; // object karma point
        this.health = 2; // object health
        this.damage = 24; // object damage

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
            //this.visible = false;
            //this.active = false;
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

class DialogBox extends Phaser.GameObjects.Graphics{
    constructor(scene, x, y, texts){
        super(scene);
        scene.add.existing(this);
        this.scene = scene;

        this.x = x;
        this.y = y;

        this.texts = texts;
        this.something = true;
        
        this.currentText;

        this.counter = 0;
        this.number = 0;
    }

    preUpdate(){
        this.counter++;

        if (this.counter % 50 == 0){
            if (this.something){
                this.draw(this.texts[this.number]);
                this.number++;
                this.something = false;
            } else {
                this.destroy();
                this.something = true;
            }
        }
    }

    draw(input){
        this.currentText = this.scene.add.text(this.x, this.y, input, { font: 'bold 64pt Arial', fill: 'white', fontSize: 64, wordWrap: true });
    }

    destroy(){
        this.currentText.destroy();
    }
}
