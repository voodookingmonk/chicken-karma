/* jshint esversion:6*/
import { CST } from "../CST.js";

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

    this.NPCS = [];
    this.NPCSdir = [];
    this.NPCmax = [];


    this.chickenCount = 20;
    this.chickens = [];
    }

    init(){
        console.log("World loading...");
    }

    preload(){
    }

    create(){
		//this.sys.install('DialogModalPlugin');
        //console.log(this.sys.dialogModal);

        // create the map
        let map = this.make.tilemap({
            key: 'map'
        });

        // first parameter is the name of the tilemap in tiled
        let tiles = map.addTilesetImage('spritesheet', 'tiles');

        // creating the layers
        let grass = map.createStaticLayer('Grass', tiles, 0, 0);
        let obstacles = map.createStaticLayer('Obstacles', tiles, 0, 0);

        // make all tiles in obstacles collidable
        obstacles.setCollisionByExclusion([-1]);

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
            key: 'NPCleft',
            frames: this.anims.generateFrameNumbers('chicken', {
                frames: [4, 5, 6, 7]
            }),
            frameRate: 10,
            repeat: -1
        });

        // animation with key 'right'
        this.anims.create({
            key: 'NPCright',
            frames: this.anims.generateFrameNumbers('chicken', {
                frames: [4, 5, 6, 7]
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'NPCup',
            frames: this.anims.generateFrameNumbers('chicken', {
                frames: [8, 9, 10, 11]
            }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'NPCdown',
            frames: this.anims.generateFrameNumbers('chicken', {
                frames: [0, 1, 2, 3]
            }),
            frameRate: 10,
            repeat: -1
        });

        //test.fixedToCamera = true;
        //test.setScrollFactor(0);
        //test.cameraOffset.setTo(20, 20);
        this.t = this.add.text(10, 220, "Health: ", {
            font: "10px Arial",
            fill: "black",
            align: "center"
        });
        this.t.fixedToCamera = true;
        this.t.setScrollFactor(0);


        // our player sprite created through the phycis system
        this.player = this.physics.add.sprite(50, 100, 'player', 1);
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

        /*for (let i = 0; i < chickenCount; i++) {
            chickens.push({
                obj: this.physics.add.sprite(150, 75, 'chicken', 2),
                hp: 1,
                movingDir: 0
            });
            this.physics.add.collider(chickens[i].obj, obstacles);
            this.physics.add.collider(this.player, chickens[i].obj);
            this.physics.add.collider(chickens[i].obj, this.healer);
            this.physics.add.collider(chickens[i].obj, this.NPC2);
            this.physics.add.collider(chickens[i].obj, this.NPC3);
            chickens[i].obj.setCollideWorldBounds(true);
        }*/

        /*$(document).on("keypress keydown", function (e) {
            if (e.which === 50) {
                this.scene.restart();
            } else if (e.which === 49) {
                console.log("pere");
            }
        });*/

        this.chickens = this.add.group();

        for (let i = 0; i < 20; i++) {
            let x = Phaser.Math.RND.between(0, 800);
            let y = Phaser.Math.RND.between(0, 600);

            //let newChick = chickens.create(new Chickens(this, x, y, 'chicken'));
            let newChick = this.chickens.create(x, y, 'chicken', 2);
        }

        //this.chicken = this.add.existing(new Chickens(this, 100, 75, this.playerSpeedVal)).setDepth(2).setImmovable(true);

        //this.player = this.add.existing(new Chickens(this, 100, 75, this.playerSpeedVal)).setDepth(2).setImmovable(true);

        //console.log(chickens.children.entries[0]);

        // Create health bar:
        this.graphics = this.add.graphics();
        this.bar = new Phaser.Geom.Rectangle(45, 222, 70, 10);
        this.bar2 = new Phaser.Geom.Rectangle(45, 222, 0, 10);
        this.graphics.fillStyle(0xff3333);
        this.graphics.fillRectShape(this.bar);
        this.graphics.fixedToCamera = true;
        this.graphics.setScrollFactor(0);
				this.t = this.add.text(10, 220, "Health: ", {
            font: "10px Arial",
            fill: "black",
            align: "center"
        });
        this.t.fixedToCamera = true;
        this.t.setScrollFactor(0);

        //treetops and stuff above player
        let top = map.createStaticLayer('Top', tiles, 0, 0);

        // don't go out of the map
        this.physics.world.bounds.width = map.widthInPixels;
        this.physics.world.bounds.height = map.heightInPixels;
        this.player.setCollideWorldBounds(true);

        // don't walk on trees
        this.physics.add.collider(this.player, obstacles);
        this.physics.add.collider(this.npcEnemy, obstacles);

        // limit camera to map
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
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
                    this.drawHealthBar();
            } else {
                    this.t = this.add.text(60, 100, "You dided man!", {
                            font: "30px Arial",
                            fill: "red",
                            align: "center"
                    });
                    this.t.fixedToCamera = true;
                    this.t.setScrollFactor(0);
                    this.graphics.clear(bar2);
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
            this.drawHealthBar();
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

        this.player.body.setVelocity(0);

        this.enemyFollow(this.player, this.npcEnemy);
        // Horizontal movement
        if (this.liikumine == true) {
            if (this.cursors.left.isDown) {
                this.player.body.setVelocityX(-80);
            } else if (this.cursors.right.isDown) {
                this.player.body.setVelocityX(80);
            }

            // Vertical movement
            if (this.cursors.up.isDown) {
                this.player.body.setVelocityY(-80);
            } else if (this.cursors.down.isDown) {
                this.player.body.setVelocityY(80);
            }

            // Update the animation last and give left/right animations precedence over up/down animations
            if (this.cursors.left.isDown) {
                this.player.anims.play('left', true);
                this.player.flipX = false;
            } else if (this.cursors.right.isDown) {
                this.player.anims.play('right', true);
                this.player.flipX = false;
            } else if (this.cursors.up.isDown) {
                this.player.anims.play('up', true);
            } else if (this.cursors.down.isDown) {
                this.player.anims.play('down', true);
            } else {
                this.player.anims.stop();
            }
        }


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
