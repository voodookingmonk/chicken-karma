const interval = 3000;
let time_now = new Date().getTime();
let NPC_time_now = new Date().getTime();
let NPC_movement_direction = 0;

let BootScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function BootScene ()
    {
        Phaser.Scene.call(this, { key: 'BootScene' });
    },

    preload: function ()
    {
        // map tiles
        this.load.image('tiles', 'assets/map/spritesheet.png');
        
        // map in json format
        this.load.tilemapTiledJSON('map', 'assets/map/map.json');
        
        // our two characters
        this.load.spritesheet('player', 'assets/RPG_assets.png', { frameWidth: 16, frameHeight: 16 });
		this.load.spritesheet('npc', 'assets/RPG_assets.png', { frameWidth: 16, frameHeight: 16 });
	
    },

    create: function ()
    {
        // start the WorldScene
        this.scene.start('WorldScene');
    }
});

let WorldScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function WorldScene ()
    {
        Phaser.Scene.call(this, { key: 'WorldScene' });
    },

    preload: function ()
    {
        
    },

    create: function ()
    {
        // create the map
        let map = this.make.tilemap({ key: 'map' });
        
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
            frames: this.anims.generateFrameNumbers('player', { frames: [1, 7, 1, 13]}),
            frameRate: 10,
            repeat: -1
        });
        
        // animation with key 'right'
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', { frames: [1, 7, 1, 13] }),
            frameRate: 10,
            repeat: -1
        });
		
        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('player', { frames: [2, 8, 2, 14]}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('player', { frames: [ 0, 6, 0, 12 ] }),
            frameRate: 10,
            repeat: -1
        });        

        // our player sprite created through the phycis system
        this.player = this.physics.add.sprite(50, 100, 'player', 6);
		this.NPC = this.physics.add.sprite(150, 75, 'npc', 16);
		
		/*for (let i = 0; i < 10; i++){
			let x = Phaser.Math.RND.between(50, 150);
			let y = Phaser.Math.RND.between(120, 300);
			this.NPC_healer = this.physics.add.sprite(x, y, 'npc', 6);
			//this.physics.add.collider(this.player, this.NPC_healer);
		}*/
		
		/*this.NPC_healer = this.physics.add.sprite(150, 200, 'npc', 32);		
		this.NPC_healer.setCollideWorldBounds(true);
		this.NPC_healer.collidable(false);*/
		
		//let healer = this.physics.add.sprite(150, 200, 'npc', 6);		
		
        
        // don't go out of the map
        this.physics.world.bounds.width = map.widthInPixels;
        this.physics.world.bounds.height = map.heightInPixels;
        this.player.setCollideWorldBounds(true);
        
        // don't walk on trees
        this.physics.add.collider(this.player, obstacles);

        // limit camera to map
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.roundPixels = true; // avoid tile bleed
		
        // user input
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // where the enemies will be
		//this.physics.add.collider(this.player, this.spawns);
        // add collider
        this.physics.add.overlap(this.player, this.NPC, this.onMeetNPC, false, this);
		
		//this.physics.add.collider(this.player, this.NPC_healer, this.onMeetNPC, false, this);
    },
	onMeetNPC: function(player, NPC) {

		this.checkDirection(player, NPC);
		
		if (new Date().getTime() > (time_now + interval)){
			time_now = new Date().getTime();
			console.log(new Date().getTime() + " every " + ((time_now + interval) - new Date().getTime()) + " milliseconds");
		}
	
    },
	checkDirection: function(player, NPC){
		
		if ((player.x-NPC.x) < 0){
			player.x -= 2;
		} else {
			player.x += 2;
		}
		
		if ((player.y-NPC.y) < 0){
			player.y -= 2;
		} else {
			player.y += 2;
		}
		
		
		/*if ((player.x-NPC.x) < 0){
			console.log("A");
			if ((player.y-NPC.y) < 0){
				console.log("A1");
			} else {
				console.log("A2");
			}
		} else if ((player.x-NPC.x) > 0){
			console.log("B");
			if ((player.y-NPC.y) < 0){
				console.log("B1");
			} else {
				console.log("B2");
			}
		}
		
		if ((player.y-NPC.y) < 0){
			console.log("C");
			if ((player.x-NPC.x) < 0){
				console.log("C1");
			} else {
				console.log("C2");
			}
		} else if ((player.y-NPC.y) > 0){
			console.log("D");
			if ((player.x-NPC.x) < 0){
				console.log("D1");
			} else {
				console.log("D2");
			}
		}*/
		
		
		/*if ((player.x-NPC.x) < 0 && (player.y-NPC.y) < 0){
			console.log("1"); // Ã¼leval vasakul
		} else if ((player.x-NPC.x) < 0 && (player.y-NPC.y) > 0){
			console.log("2"); // all vasakul
			
			player.x -= 5;
		} else if ((player.x-NPC.x) > 0 && (player.y-NPC.y) < 0){
			console.log("3"); // Ã¼leval paremal
			
			player.x += 5;
			
			
		} else if ((player.x-NPC.x) > 0 && (player.y-NPC.y) > 0){
			console.log("4"); // all paremal
		}*/
		
		/*if ((player.y-NPC.y) < 0){
			player.y -= 2;
			player.x += 0;
		} else { // alt poolt
			player.y += 2;
			player.x -= 0;
		}*/
	},
    onMeetEnemy: function(player, zone) {        
        // we move the zone to some other location
        //zone.x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
        //zone.y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);
		
        
        // shake the world
        //this.cameras.main.shake(50);
		//console.log("Hello");
		this.cameras.main.shake(50);
		console.log("hello");
        // start battle 
    },
    update: function (time, delta)
    {
    //    this.controls.update(delta);
	
			// NPC roaming
			
		if (new Date().getTime() > (NPC_time_now + interval)){
			if (NPC_movement_direction == 0){ NPC_movement_direction = 1; }
			NPC_time_now = new Date().getTime();
			if (NPC_movement_direction == 1){
				this.NPC.body.setVelocityY(0);
				this.NPC.body.setVelocityX(10);
				NPC_movement_direction = 2;
			} else if (NPC_movement_direction == 2){
				this.NPC.body.setVelocityX(-10);
				NPC_movement_direction = 3;
			} else if (NPC_movement_direction == 3){
				this.NPC.body.setVelocityX(0);
				this.NPC.body.setVelocityY(10);
				NPC_movement_direction = 4;
			} else if (NPC_movement_direction == 4){
				this.NPC.body.setVelocityY(-10);
				NPC_movement_direction = 1;
			}
		}
    
        this.player.body.setVelocity(0);

        // Horizontal movement
        if (this.cursors.left.isDown)
        {
            this.player.body.setVelocityX(-80);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.body.setVelocityX(80);
        }

        // Vertical movement
        if (this.cursors.up.isDown)
        {
            this.player.body.setVelocityY(-80);
        }
        else if (this.cursors.down.isDown)
        {
            this.player.body.setVelocityY(80);
        }        

        // Update the animation last and give left/right animations precedence over up/down animations
        if (this.cursors.left.isDown)
        {
            this.player.anims.play('left', true);
            this.player.flipX = true;
        }
        else if (this.cursors.right.isDown)
        {
            this.player.anims.play('right', true);
            this.player.flipX = false;
        }
        else if (this.cursors.up.isDown)
        {
            this.player.anims.play('up', true);
        }
        else if (this.cursors.down.isDown)
        {
            this.player.anims.play('down', true);
        }
        else
        {
            this.player.anims.stop();
        }
		
		// NPC roaming
		
		if (NPC_movement_direction == 1)
        {
            this.NPC.anims.play('up', true);
        }
        else if (NPC_movement_direction == 2)
        {
			this.NPC.anims.play('right', true);
            this.NPC.flipX = false;
        }
		else if (NPC_movement_direction == 3)
        {
            this.NPC.anims.play('left', true);
            this.NPC.flipX = true;
        }
        else if (NPC_movement_direction == 4)
        {
            this.NPC.anims.play('down', true);
        }
        else
        {
            this.NPC.anims.stop();
        }
		
    }
    
});

let config = {
    type: Phaser.AUTO,
    parent: 'content',
    width: 320,
    height: 240,
    zoom: 2,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false // set to true to view zones
        }
    },
    scene: [
        BootScene,
        WorldScene
    ]
};
let game = new Phaser.Game(config);
