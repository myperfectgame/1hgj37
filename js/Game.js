var PlatfomerGame = PlatformerGame || {};

PlatformerGame.Game = function(){};

PlatformerGame.Game.prototype = {
  create: function() {

    this.level = 1;

    this.music1 = this.game.add.audio('music1');
    this.music2 = this.game.add.audio('music2');
    this.music3 = this.game.add.audio('music3');
    this.music1.loop = true;
    this.music2.loop = true;
    this.music3.loop = true;

    this.sky = this.game.add.sprite(0, 0, 'sky');


    //  The score
    this.scoreText = this.game.add.text(16, 16, '' + this.game.world.width /2  + " / 352 ", { fontSize: '32px', fill: '#000' });

    this.loadLevel(this.level);

    //  Our controls.
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.rkey = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
    this.rkey.onDown.add(this.restart, this);

    this.music1.play();
    this.musicState = 1; // 1 = 1 is playing. 2 = 1 is scheduled to stop 3 = 2 is playing 4 = 2 is scheudled to stop 5 = 3 playing

  },

  update: function() {

    this.player.body.velocity.x = 60;
    this.player2.body.velocity.x = -60;

    //  Collide the player and the stars with the platforms
    this.game.physics.arcade.collide(this.players, this.blockedLayer);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    this.game.physics.arcade.overlap(this.player, this.player2, this.clearLevel, null, this);

    //  Allow the player to jump if they are touching the ground.
    if (this.cursors.up.isDown)
    {
        if (this.player.body.blocked.down) {
           this.player.body.velocity.y = -100;
        }
        if (this.player2.body.blocked.down) {
            this.player2.body.velocity.y = -100;
        }
    }
  },
  distanceBetweenTwoPoints: function(a, b) {
        var xs = b.x - a.x;
        xs = xs * xs;

        var ys = b.y - a.y;
        ys = ys * ys;

        return Math.sqrt(xs + ys);
    },
  clearLevel : function(player, player2) {
    
    //  Add and update the score

    /*
    if (this.distanceBetweenTwoPoints(player, this.goal) < 8 && 
        this.distanceBetweenTwoPoints(player2, this.goal) < 8) {
 */
    if (Math.abs(player.y - this.goal.y) < 8 && Math.abs(player2.y - this.goal.y)) {
        this.level += 1;
        if (this.level == 7) {
            this.scoreText.text = "Great work. The Twins salute you. Game over";
            this.game.paused = true;
        }
        else {
            this.loadLevel(this.level);
             // 1 = 1 is playing. 2 = 1 is scheduled to stop 3 = 2 is playing 4 = 2 is scheduled to stop 5 = 3 playing

            if (this.musicState == 1) {
                this.musicState++;
                this.music1.onLoop.add(this.nextMusic, this);
            }
            else if (this.musicState == 3) {
                this.musicState++;
                this.music2.onLoop.add(this.nextMusic, this);
            }
        }
    }

  },


loadLevel : function(levelName) {

    if (this.map) {    
        this.map.destroy();
        this.player.destroy();
        this.player2.destroy();
        this.players.destroy();
        this.blockedLayer.destroy();
    }
    this.map = this.game.add.tilemap("level" + levelName);
    
    this.map.addTilesetImage('sheet16', 'tiles');

    this.blockedLayer = this.map.createLayer('Tile Layer 1');
    this.map.setCollisionBetween(1, 10000, true, 'Tile Layer 1');

    this.blockedLayer.resizeWorld();

    // The player and its settings
    this.players = this.game.add.group();
    this.player = this.game.add.sprite(8, this.game.world.height - 72, 'dude');
    this.player2 = this.game.add.sprite(this.game.world.width - 24, this.game.world.height - 72, 'dude');

    //  We need to enable physics on the player
    this.game.physics.arcade.enable(this.player);
    this.game.physics.arcade.enable(this.player2);

    //  Player physics properties. Give the little guy a slight bounce.
    this.player.body.bounce.y = 0.2;
    this.player.body.gravity.y = 300;
    this.player.anchor.setTo(0.5);
    this.player.scale.setTo(-0.4, 0.4);

    //  Our two animations, walking left and right.
    this.player.animations.add('left', [0, 1, 2, 3], 10, true);
    this.player.animations.add('right', [5, 6, 7, 8], 10, true);

    //  Player physics properties. Give the little guy a slight bounce.
    this.player2.body.bounce.y = 0.2;
    this.player2.body.gravity.y = 300;
    this.player2.scale.setTo(0.4);

    this.players.add(this.player);
    this.players.add(this.player2);

    //  Our two animations, walking left and right.
    this.player2.animations.add('left', [0, 1, 2, 3], 10, true);
    this.player2.animations.add('right', [5, 6, 7, 8], 10, true);

    this.goal = {};
   if (levelName == '1') {
        this.scoreText.text = "Meet your twin at the summit of Mount Tiny! \nClick up to jump and R to restart level!";   
        this.goal.y = 352;

        this.goal.x = this.game.world.width /2;   

    }
    else if (levelName == '2') {
        this.scoreText.text = "Good work. Next mountain: Cliff Mountain! ";
        this.goal.y = 352 - 32;

        this.goal.x = this.game.world.width /2;

    }
    else if (levelName == '3') {
        this.scoreText.text = "The Twins conquer The Twins ";
        this.goal.y = 352 + 16;

        this.goal.x = this.game.world.width /2;
    }
    else if (levelName == '4') {
        this.scoreText.text = "The Twin Leaps of Faith \n(errm...but how will they get back down?) ";
        this.goal.y = 352 - 16;

        this.goal.x = this.game.world.width /2;
    }
    else if (levelName == '5') {
        this.scoreText.text = "Lion mountain. Can you meet at the top? ";
        this.goal.y = 352 - 32 - 16;

        this.goal.x = this.game.world.width /2;
    }

    else if (levelName == '6') {
        this.scoreText.text = "Awesome. Final test: Cloud Mountain! ";
        this.goal.y = 352 - 16*6;

        this.goal.x = this.game.world.width /2;


        if (this.cloud) {
            this.cloud.destroy();
        }
        this.cloud = this.game.add.sprite(this.goal.x + 30, this.goal.y + 60, 'cloud');
        this.cloud.anchor.set(0.5);
    }
  },

  restart : function() {
    if (!this.game.paused) {
        this.loadLevel(this.level);
    }
  },

  nextMusic : function() {
     // 1 = 1 is playing. 2 = 1 is scheduled to stop 3 = 2 is playing 4 = 2 is scheudled to stop 5 = 3 playing

    if (this.musicState == 2) {
        this.musicState++;
        this.music1.stop();
        this.music2.loop = true;
        this.music2.play();
    }
    else if (this.musicState == 4) {
        this.musicState++;
        this.music2.stop();
        this.music3.loop = true;
        this.music3.play();
    }
  },
};
