/* jshint esversion:6*/
import { CST } from "../CST.js";
import thisGame from "../main.js";
import { UIScene } from "./UIScene.js";

export class WorldScene extends Phaser.Scene{
	constructor(){
        super({
            key: CST.SCENES.WORLD
        });

    this.interval = 3000;
    this.time_now = new Date().getTime();
    this.NPC_time_now = new Date().getTime();
    this.NPC_movement_direction = 0;
    this.Enemy_time_now = new Date().getTime();
    this.Enemy_movement_direction = 0;
    this.npcText = null;
    this.liikumine = true;
    //Healthbar:
    this.test = null; 
    this.playerHealth = 100;
    this.playerHealthMax = 100;
    this.testHealth = 100;
    this.enemyHealth = 100;
    this.damage = null;
    this.firstZero = true;
    //Quest:
    this.talking = 0;
    this.quest1 = 0;
    this.text = null;

    this.map = null;
    this.tiles = null;
    this.grass = null;
    this.obstacles = null;
    this.singleNPC = null;

    this.graphics = 0;
    this.graphicsText = 0;


    this.chickenCount = 100; // amount of chickens spawned

    this.checkHealth = 100;

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
                frames: [22, 28, 34]
            }),
            frameRate: 10,
            repeat: -1
        });

        // animation with key 'right'
        this.anims.create({
            key: 'enemyRight',
            frames: this.anims.generateFrameNumbers('enemy', {
                frames: [22, 28, 34]
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'enemyUp',
            frames: this.anims.generateFrameNumbers('enemy', {
                frames: [23, 29, 35]
            }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'enemyDown',
            frames: this.anims.generateFrameNumbers('enemy', {
                frames: [21, 27, 33]
            }),
            frameRate: 10,
            repeat: -1
        });

    }

    create(){
        //let UIScene = this.scene.get(CST.SCENES.UI);


        let uiScene = this.scene.get(CST.SCENES.UI);

        // our player sprite created through the phycis system

        this.player = this.add.existing(new Player(this, 600, 300));
        this.newEnemy = this.add.existing(new Enemy(this, 600, 300));
        this.NPC = this.add.existing(new NPC(this, 600, 300, this.player));

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

            let singleChicken = this.add.existing(new Chicken(this, x, y));
            this.physics.add.existing(singleChicken);
            this.chickens.add(singleChicken);
            if (i <= this.chickenCount/2){
                let singleEnemy = this.add.existing(new Enemy(this, x, y));
                //this.singleNPC = this.add.existing(new NPC(this, x, y, this.player));
                this.physics.add.existing(singleEnemy);
                //this.physics.add.existing(this.singleNPC);
                this.enemies.add(singleEnemy);
                //this.npcs.add(this.singleNPC);
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
        /*this.physics.add.collider(this.npcEnemy, this.obstacles);*/
        this.physics.add.collider(this.chickens, this.obstacles);
        this.physics.add.collider(this.enemies, this.obstacles);
        this.physics.add.collider(this.npcs, this.obstacles);
        this.physics.add.collider(this.npcs, this.npcs);

        //this.physics.add.collider(this.npcs, this.player);

        // limit camera to map
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.roundPixels = true; // avoid tile bleed

        // user input
        this.cursors = this.input.keyboard.createCursorKeys();

        this.physics.add.collider(this.player, this.npcs, this.collide, null, this);

        //this.physics.add.collider(this.player, this.healer, this.heal, false, this);
        //this.physics.add.overlap(this.player, this.NPC, this.onMeetNPC, false, this);
        /*this.physics.add.overlap(this.player, this.NPC2, this.onMeetNPC2, false, this);
        this.physics.add.overlap(this.player, this.NPC3, this.onMeetNPC3, false, this);
        this.physics.add.overlap(this.player, this.npcEnemy, this.damageToPlayer, false, this);
        this.physics.add.overlap(this.player, this.test, this.damageToPlayer, false, this);*/
        this.input.keyboard.on('keydown_E', this.dmg, this);
        }

    collide(player, enemy){
        enemy.firstTime = true;

        if (enemy.counter === 75){
            player.health -= 1;
        }



        console.log(player.health);
        //enemy.active = false;
        //enemy.visible = false;
    }

    attack(){

    }

	dmg (player, test) {
        if (((Math.abs(this.player.x - this.test.x) <= 40) && (Math.abs(this.player.y - this.test.y) <= 40)) && this.testHealth > 0) {
            this.testHealth = this.testHealth - 50;
            if (this.testHealth == 0) {
                this.test.destroy();
            }
        }
        if ((Math.abs(this.player.x - this.npcEnemy.x) <= 40) && (Math.abs(this.player.y - this.npcEnemy.y) <= 40) && this.enemyHealth > 0) {
            this.enemyHealth = this.enemyHealth - 50;
            if (this.enemyHealth == 0) {
                this.npcEnemy.destroy();
            }
        }
    }

    damageToPlayer (player, test) {
        this.checkDirection(player, test);
				//Phaser.Geom.Rectangle.Inflate(graphics, -20, 0);
        if (new Date().getTime() > (this.time_now + this.interval - 2500)) {
            this.time_now = new Date().getTime();
            this.damage = 10;
            if(this.damage >= this.playerHealth && this.firstZero == true){
                this.playerHealth = 0;
                this.firstZero = false;
            }else{
                this.playerHealth -= this.damage;
            }
        }
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
        this.checkDirection(player, NPC2);
        if (new Date().getTime() > (this.time_now + this.interval)) {
            this.time_now = new Date().getTime();
            console.log(new Date().getTime() + " every " + ((this.time_now + this.interval) - new Date().getTime()) + " milliseconds");
            this.NPC3.visible = true;

            this.graphicsText = this.add.graphics();
            this.text = new Phaser.Geom.Rectangle(32, 180, 250, 50, 32);
            this.graphicsText.fillStyle(0xffffff, 0.7);
            this.graphicsText.fillRectShape(this.text);
            this.graphicsText.fixedToCamera = true;
            this.graphicsText.setScrollFactor(0);

            this.talking = 1;
            this.npcText = this.add.text(35, 185, 'Tere', {
                fontSize: '12px',
                fill: '#000'
            });
            this.npcText.fixedToCamera = true;
            this.npcText.setScrollFactor(0);
            this.npcText.visible = true;
            this.liikumine = false;
            if (this.testHealth > 0 && this.enemyHealth > 0) {
                this.quest1 = 1;
            } else {
                this.quest1 = 2;
            }

        }

    }

    onMeetNPC (player, NPC) {
        this.checkDirection(player, NPC);

        if (new Date().getTime() > (this.time_now + this.interval)) {
            this.time_now = new Date().getTime();
            console.log(new Date().getTime() + " every " + ((this.time_now + this.interval) - new Date().getTime()) + " milliseconds");
            this.NPC3.visible = false;
        }

    }

    checkDirection (player, NPC) {
        if ((player.x - NPC.x) < 0) {
            player.x -= 2;
        } else {
            player.x += 2;
        }

        if ((player.y - NPC.y) < 0) {
            player.y -= 2;
        } else {
            player.y += 2;
        }
    }

    onMeetEnemyNPC (player, npcEnemy) {
        this.checkDirection(player, npcEnemy);

        if (new Date().getTime() > (time_now + interval)) {
            time_now = new Date().getTime();
            console.log(new Date().getTime() + " every " + ((time_now + interval) - new Date().getTime()) + " milliseconds");
        }

    }

	enemyFollow (player, npcEnemy) {

        if ((Math.round(player.x) > Math.round(this.npcEnemy.x)) && this.enemyHealth > 0) {
            this.npcEnemy.body.setVelocityX(50);
            this.npcEnemy.body.setVelocityY(0);
        } else if ((Math.round(player.y) > Math.round(this.npcEnemy.y)) && this.enemyHealth > 0) {
            this.npcEnemy.body.setVelocityY(50);
            this.npcEnemy.body.setVelocityX(0);
        } else if ((Math.round(player.x) < Math.round(this.npcEnemy.x)) && this.enemyHealth > 0) {
            this.npcEnemy.body.setVelocityX(-50);
            this.npcEnemy.body.setVelocityY(0);
        } else if ((Math.round(player.y) < Math.round(this.npcEnemy.y)) && this.enemyHealth > 0) {
            this.npcEnemy.body.setVelocityY(-50);
            this.npcEnemy.body.setVelocityX(0);
        }
    }

    update(){

        /*if(this.NPC != undefined){
            if(this.NPC.active === true){
                this.physics.accelerateToObject(this.NPC, this.player, 1300);
            }
        }*/

        //console.log(this.player.x + " " + this.player.y);

        //this.enemyFollow(this.player, this.npcEnemy);

        if (this.cursors.space.isDown && this.quest1 == 1 && this.talking == 1) {
            this.npcText.destroy();
            this.talking = 2;
            this.npcText = this.add.text(35, 185, 'Tegemist on suht algelise testiga mängust :)', {
                    fontSize: '12px',
                    fill: '#000'
            });
            this.npcText.fixedToCamera = true;
            this.npcText.setScrollFactor(0);
        }
        if (this.cursors.space.isDown && this.quest1 == 1 && this.talking == 2) {
            this.npcText.destroy();
            this.talking = 3;
            this.npcText = this.add.text(35, 185, 'Ole hea mine hävita see roheline seen ning see hull tüdruk kes kõiki ründab.', {
                    fontSize: '12px',
                    fill: '#000'
            });
            this.npcText.fixedToCamera = true;
            this.npcText.setScrollFactor(0);
            this.liikumine = true;
        }
        if (this.cursors.space.isDown && this.quest1 == 2) {
            this.npcText.destroy();
            this.talking == 3
            this.npcText = this.add.text(35, 185, 'Done', {
                    fontSize: '12px',
                    fill: '#000'
            });
            this.npcText.fixedToCamera = true;
            this.npcText.setScrollFactor(0);
            this.liikumine = true;
        }
        if ((this.cursors.left.isDown || this.cursors.right.isDown || this.cursors.down.isDown || this.cursors.down.isDown) && this.liikumine == true) {
            if (this.npcText != null){
                this.talking = 0;
                this.npcText.destroy();
                this.graphicsText.destroy(this.text);
            }
        }
    }
}

class Player extends Phaser.Physics.Arcade.Sprite{
    constructor (scene, x, y){
        super(scene, x, y);

        this.setTexture('player');
        this.setPosition(x, y);
        scene.physics.world.enableBody(this, 0);
        this.body.collideWorldBounds = true;
        this.keys = this.scene.input.keyboard.createCursorKeys();
        this.speed = 200;

        this.health = 10;

        this.moveleft = false;
        this.moveright = false;
        this.moveup = false;
        this.movedown = false;
        this.scene = scene;
    }

    create(){

    }

    preUpdate(time, delta){
        super.preUpdate(time, delta);

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

        this.health = 10;

        this.setTexture('enemy');
        this.setPosition(x, y);
        scene.physics.world.enableBody(this, 0);
        this.body.collideWorldBounds = true;
        this.keys = this.scene.input.keyboard.createCursorKeys();
        this.speed = 200;
        this.scene = scene;


        this.moveleft = false;
        this.moveright = false;
        this.moveup = false;
        this.movedown = false;
        this.player = player;
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

        if (this.body.velocity.x > 0){

            this.anims.play('enemyRight', true);
            this.flipX = false;

        } else if (this.body.velocity.x < 0){

            this.anims.play('enemyLeft', true);
            this.flipX = true;

        }

        this.body.setVelocity(0);
        this.follow(this.player);
    }

    follow(player){
        this.scene.physics.moveToObject(this, player, 80);
    }
}

class Chicken extends Phaser.Physics.Arcade.Sprite{
    constructor (scene, x, y){
        super(scene, x, y);

        this.health = 10;

        this.setTexture('chicken');
        this.setPosition(x, y);
        scene.physics.world.enableBody(this, 0);
        this.body.collideWorldBounds = true;
        this.keys = this.scene.input.keyboard.createCursorKeys();
        this.speed = 300;

        this.moveleft = false;
        this.moveright = false;
        this.moveup = false;
        this.movedown = false;

        this.direction = 0;
        this.previousTimer = 0;
        this.speed = 10;
        this.firstTime = true;
        this.interval = Phaser.Math.RND.between(50, 100);

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

        this.randomRoaming();
        this.maxBounds();
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

    specificRoaming(){
        
    }

    makeNPCMove(x, y){
        this.body.setVelocityX(x);
        this.body.setVelocityY(y);
    }
}

class Enemy extends Phaser.Physics.Arcade.Sprite{
    constructor (scene, x, y){
        super(scene, x, y);

        this.setTexture('enemy');
        this.setPosition(x, y);
        scene.physics.world.enableBody(this, 0);
        this.body.collideWorldBounds = true;
        this.keys = this.scene.input.keyboard.createCursorKeys();
        this.speed = 80;

        this.moveleft = false;
        this.moveright = false;
        this.moveup = false;
        this.movedown = false;

        this.direction = 0;
        this.previousTimer = 0;
        this.speed = 40;
        this.firstTime = true;
        this.interval = Phaser.Math.RND.between(50, 100);


    }

    create(){

    }

    preUpdate(time, delta){
        super.preUpdate(time, delta);
        this.previousTimer += 1;
        this.randomRoaming();
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
