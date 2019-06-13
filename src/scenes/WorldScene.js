/* jshint esversion:6*/
import { CST } from "../CST.js";
import thisGame from "../main.js";

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
    this.scoreText = null;
    this.liikumine = true;
    this.test = null; //healthbar test
    this.playerHealth = 100;
    this.testHealth = 100;
    this.enemyHealth = 100;
    this.graphics = null;
    this.bar = null;
    this.bar2 = null;
    this.t = null;
    this.damage = null;
    this.healed = null;

    this.map = null;
    this.tiles = null;
    this.grass = null;
    this.obstacles = null;

    this.NPCS = [];
    this.NPCSdir = [];
    this.NPCmax = [];


    this.chickenCount = 500;

    }

    init(){
        console.log("World loading...");
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

		//this.sys.install('DialogModalPlugin');
        //console.log(this.sys.dialogModal);

        // our player sprite created through the phycis system
        //this.player = this.physics.add.sprite(50, 100, 'player', 1);

        this.player = this.add.existing(new Player(this, 600, 300).setDepth(2).setImmovable(true));
        this.newEnemy = this.add.existing(new Enemy(this, 600, 300).setDepth(2).setImmovable(true));

        this.test = this.physics.add.sprite(70, 210, 'mushroom');
        this.NPC = this.physics.add.sprite(350, 75, 'chicken', 2);
        this.NPCx = this.physics.add.sprite(350, 75, 'chicken', 2);
        this.NPCy = this.physics.add.sprite(350, 75, 'chicken', 2);
        //this.chicken = this.physics.add.sprite(100, 75, 'chicken', 2);

        this.NPC2 = this.physics.add.sprite(100, 100, 'npc2', 16).setImmovable();
        this.NPC3 = this.physics.add.sprite(175, 200, 'npc3', 16).setImmovable();
        this.npcEnemy = this.physics.add.sprite(300, 150, 'npcEnemy', 16);
        this.healer = this.physics.add.sprite(50, 50, 'healer', 1).setImmovable();
        this.NPC3.visible = false;
        let scoreText = this.add.text(16, 16, 'tere', {
            fontSize: '32px',
            fill: '#000'
        });
        scoreText.visible = false;


        this.chickens = this.add.group();
        this.enemies = this.add.group();

        for (let i = 0; i < this.chickenCount; i++) {
            let x = Phaser.Math.RND.between(0, 800);
            let y = Phaser.Math.RND.between(0, 600);

            let singleChicken = this.add.existing(new Chicken(this, x, y));
            this.physics.add.existing(singleChicken);
            this.chickens.add(singleChicken);
            if (i <= this.chickenCount/2){
                console.log("what");
                let singleEnemy = this.add.existing(new Enemy(this, x, y));
                this.physics.add.existing(singleEnemy);
                this.enemies.add(singleEnemy);
            }
        }

        // Create health bar:
        this.graphics = this.add.graphics();
        this.bar = new Phaser.Geom.Rectangle(43, 10, 50, 7);
        this.bar2 = new Phaser.Geom.Rectangle(43, 10, 0, 7);
        this.graphics.fillStyle(0xff3333);
        this.graphics.fillRectShape(this.bar);
        this.graphics.fixedToCamera = true;
        this.graphics.setScrollFactor(0);
				this.t = this.add.text(10, 6.5, "Health: ", {
            font: "9px Arial",
            fill: "black",
            align: "center"
        });
        this.t.fixedToCamera = true;
        this.t.setScrollFactor(0);

        //treetops and stuff above player
        let top = this.map.createStaticLayer('Top', this.tiles, 0, 0);

        // don't go out of the map
        this.physics.world.bounds.width = this.map.widthInPixels;
        this.physics.world.bounds.height = this.map.heightInPixels;
        this.player.setCollideWorldBounds(true);

        // don't walk on trees
        this.physics.add.collider(this.player, this.obstacles);
        this.physics.add.collider(this.npcEnemy, this.obstacles);
        this.physics.add.collider(this.chickens, this.obstacles);
        this.physics.add.collider(this.enemies, this.obstacles);


        // limit camera to map
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.roundPixels = true; // avoid tile bleed

        // user input
        this.cursors = this.input.keyboard.createCursorKeys();

        // where the enemies will be
        //this.physics.add.collider(this.player, this.spawns);
        // add collider
        this.physics.add.collider(this.player, this.healer, this.heal, false, this);
        this.physics.add.overlap(this.player, this.NPC, this.onMeetNPC, false, this);
        this.physics.add.overlap(this.player, this.NPC2, this.onMeetNPC2, false, this);
        this.physics.add.overlap(this.player, this.NPC3, this.onMeetNPC3, false, this);
        this.physics.add.overlap(this.player, this.npcEnemy, this.damageToPlayer, false, this);
        this.physics.add.overlap(this.player, this.test, this.damageToPlayer, false, this);
        this.input.keyboard.on('keydown_E', this.dmg, this);
    }

	 drawHealthBar (healed, damage, playerHealth){
				this.graphics = this.add.graphics();

				if(this.healed == 1){
						this.graphics.clear(this.bar2);
						this.graphics.fillStyle(0xff3333);
						this.graphics.fillRectShape(this.bar);
						this.graphics.fixedToCamera = true;
						this.graphics.setScrollFactor(0);
				}
				if(this.damage == 1){
						var damageSize = (100 - this.playerHealth) / 2;
						this.bar2 = new Phaser.Geom.Rectangle(43, 10, damageSize, 7);
						this.graphics.fillRectShape(this.bar2);
						this.graphics.fixedToCamera = true;
						this.graphics.setScrollFactor(0);
				}
		}

	dmg (player, test) {
        if (((Math.abs(this.player.x - this.test.x) <= 40) && (Math.abs(this.player.y - this.test.y) <= 40)) && this.testHealth > 0) {
            this.testHealth = this.testHealth - 50;
            console.log("oof");
            if (this.testHealth == 0) {
                this.test.destroy();
                console.log("big oof");
            }
        }
        if ((Math.abs(this.player.x - this.npcEnemy.x) <= 40) && (Math.abs(this.player.y - this.npcEnemy.y) <= 40) && this.enemyHealth > 0) {
            this.enemyHealth = this.enemyHealth - 50;
            console.log("ouch");
            if (this.enemyHealth == 0) {
                this.npcEnemy.destroy();
                console.log("Tell my mother I love her");
            } else {
                console.log("you missed ya scrub");
            }
        }
    }

		damageToPlayer (player, test) {
				this.checkDirection(player, test);
				//Phaser.Geom.Rectangle.Inflate(graphics, -20, 0);
				if (new Date().getTime() > (this.time_now + this.interval - 2500)) {
					this.time_now = new Date().getTime();

				if (this.playerHealth > 0) {
						this.damage = 1;
						this.healed = 0;
						this.playerHealth -= 10;
						this.drawHealthBar(this.healed, this.damage, this.playerHealth);
						}
				 else {
						this.t = this.add.text(60, 100, "You dided man!", {
								font: "30px Arial",
								fill: "red",
								align: "center"
						});
						this.t.fixedToCamera = true;
						this.t.setScrollFactor(0);
						//respawn();
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

    heal (player, healer) {
        if (this.bar != null){
            this.healed = 1;
            this.damage = 0;
            this.playerHealth = 100;
            this.drawHealthBar(this.healed, this.damage, this.playerHealth);
            console.log("healed");
						this.healed = false;
        }
    }

    onMeetNPC2 (player, NPC2) {
        this.checkDirection(player, NPC2);
        if (new Date().getTime() > (this.time_now + this.interval)) {
            this.time_now = new Date().getTime();
            console.log(new Date().getTime() + " every " + ((this.time_now + this.interval) - new Date().getTime()) + " milliseconds");
            this.NPC3.visible = true;
            this.scoreText = this.add.text(16, 16, 'Tere', {
                fontSize: '32px',
                fill: '#000'
            });
            this.scoreText.visible = true;
            this.liikumine = false;
        }

    }

    checkDirection (player, NPC2) {
        if ((player.x - NPC2.x) < 0) {
            player.x -= 2;
        } else {
            player.x += 2;
        }

        if ((player.y - NPC2.y) < 0) {
            player.y -= 2;
        } else {
            player.y += 2;
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
            scoreText = this.add.text(16, 16, 'OUCH', {
                fontSize: '32px',
                fill: '#000'
            });
            scoreText.visible = true;
            liikumine = false;
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
        //this.player.body.setVelocity(0);

        this.enemyFollow(this.player, this.npcEnemy);

        if (this.cursors.space.isDown && this.liikumine == false) {
            this.scoreText.destroy();
            this.scoreText = this.add.text(16, 16, 'Headaega', {
                fontSize: '32px',
                fill: '#000'
            });
            this.liikumine = true;
        }
        if ((this.cursors.left.isDown || this.cursors.right.isDown || this.cursors.down.isDown || this.cursors.down.isDown) && this.liikumine == true) {
            if (this.scoreText != null){
                this.scoreText.destroy();
            }
        }


		// enable NPC roaming
		//chickenRoam();

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

        this.moveleft = false;
        this.moveright = false;
        this.moveup = false;
        this.movedown = false;
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

class Chicken extends Phaser.Physics.Arcade.Sprite{
    constructor (scene, x, y){
        super(scene, x, y);

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
    }

    create(){

    }

    preUpdate(time, delta){
        super.preUpdate(time, delta);
        this.previousTimer += 1;

        this.roaming();
    }

    roaming(){
        this.direction = Phaser.Math.RND.between(0, 8);

        if (this.previousTimer == 75 || this.firstTime){
            this.firstTime = false;
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
    }

    create(){

    }

    preUpdate(time, delta){
        super.preUpdate(time, delta);
        this.previousTimer += 1;
        this.roaming();
    }

    roaming(){
        if (this.previousTimer == 75 || this.firstTime){
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
