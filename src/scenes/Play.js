class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('screw', './assets/screw.png');
        this.load.image('blue balloon', './assets/BlueBalloon.png');
        this.load.image('green balloon', './assets/GreenBalloon.png');
        this.load.image('red balloon', './assets/RedBalloon.png');
        this.load.image('clouds', './assets/clouds.png');
        this.load.image('buildings', './assets/building.png');
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 18, frameHeight: 20, startFrame: 0, endFrame: 5});
    }

    create() {
        // place tile sprite
        this.clouds = this.add.tileSprite(0, 0, 640, 480, 'clouds').setOrigin(0, 0);
        this.buildings = this.add.tileSprite(0, 120, 640, 360, 'buildings').setOrigin(0, 0);

        // Dark Green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x162521).setOrigin(0, 0);
        // light blue borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xC0E0DE).setOrigin(0 ,0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xC0E0DE).setOrigin(0 ,0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xC0E0DE).setOrigin(0 ,0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xC0E0DE).setOrigin(0 ,0);

        // add Screw (p1)
        this.p1Screw = new Screw(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'screw').setOrigin(0.5, 0);

        // add Balloons (x3)
        this.balloon01 = new Balloon(this, game.config.width + borderUISize*6, borderUISize*4, 'red balloon', 0, 30).setOrigin(0, 0);
        this.balloon02 = new Balloon(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'green balloon', 0, 20).setOrigin(0,0);
        this.balloon03 = new Balloon(this, game.config.width, borderUISize*6 + borderPadding*4, 'blue balloon', 0, 10).setOrigin(0,0);

        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        cursor = this.input.mousePointer;

        // animation config:
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 5, first: 0}),
            frameRate: 30
        });

        // initialize score
        this.p1Score = 0;

        // display score
        let scoreConfig = {
            fontFamily: 'Tahoma',
            fontSize: '28px',
            backgroundColor: '#4F7CAC',
            color: '#3C474B',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 180
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, "Score: " + this.p1Score, scoreConfig);
        this.timerLeft = this.add.text(460 - borderUISize -borderPadding, borderUISize + borderPadding*2, "Time: " + game.settings.gameTimer, scoreConfig); 

        // GAME OVER flag
        this.gameOver = false;

        // variable play clock based on novice or expert mode
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← to Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
    }

    update() {
        // check key input for restart / menu

        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }

        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }
        

        // parallax scrolling
        this.clouds.tilePositionX += 4;  // update background
        this.buildings.tilePositionX += 1;  // update foreground

        if(!this.gameOver) {
            this.p1Screw.update();             // update p1
            this.balloon01.update();               // update Balloon (x3)
            this.balloon02.update();
            this.balloon03.update();
        }

        // check collisions
        if(this.checkCollision(this.p1Screw, this.balloon03)) {
            this.p1Screw.reset();
            this.balloonExplode(this.balloon03);
        }
        if (this.checkCollision(this.p1Screw, this.balloon02)) {
            this.p1Screw.reset();
            this.balloonExplode(this.balloon02);
        }
        if (this.checkCollision(this.p1Screw, this.balloon01)) {
            this.p1Screw.reset();
            this.balloonExplode(this.balloon01);
        }

        // displays Countdown Timer
        this.timerLeft.setText("Time: " + Math.floor((1-this.clock.getProgress())*(game.settings.gameTimer/1000)).toString());
    }

    checkCollision(Screw, balloon) {
        // simple logic for collision checking 
        if (Screw.x < balloon.x + balloon.width && 
            Screw.x + Screw.width > balloon.x && 
            Screw.y < balloon.y + balloon.height - 21 &&
            Screw.height + Screw.y > balloon. y) {
                return true;
        } else {
            return false;
        }
    }

    balloonExplode(balloon) {
        // temporarily hide balloon
        balloon.alpha = 0;                         
        // create explosion sprite at balloon's position
        let boom = this.add.sprite(balloon.x, balloon.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
            balloon.reset();                         // reset balloon position
            balloon.alpha = 1;                       // make balloon visible again
            boom.destroy();                       // remove explosion sprite
        });
        // add to score and display
        this.p1Score += balloon.points;
        this.scoreLeft.text = "Score: " + this.p1Score; 
        
        this.sound.play('sfx_explosion');
      }
}