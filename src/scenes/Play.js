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
        // load spritesheetScrew
        // this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    create() {
        // place tile sprite
        this.clouds = this.add.tileSprite(0, 0, 640, 480, 'clouds').setOrigin(0, 0);
        this.buildings = this.add.tileSprite(0, 120, 640, 360, 'buildings').setOrigin(0, 0);

        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);

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

        // animation config - TODO:
        // this.anims.create({
        //     key: 'explode',
        //     frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
        //     frameRate: 30
        // });

        // initialize score
        this.p1Score = 0;

        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);

        // GAME OVER flag
        this.gameOver = false;

        // 60-second play clock
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
        this.clouds.tilePositionX += 3;  // update background
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
    }

    checkCollision(Screw, balloon) {
        // simple AABB checking
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
        // let boom = this.add.sprite(balloon.x, balloon.y, 'explosion').setOrigin(0, 0);
        // boom.anims.play('explode');             // play explode animation
        // boom.on('animationcomplete', () => {    // callback after anim completes
        //     balloon.reset();                         // reset balloon position
        //     balloon.alpha = 1;                       // make balloon visible again
        //     boom.destroy();                       // remove explosion sprite
        // });
        // score add and repaint

        // REMOVE LATER FOR TESTING ONLY
        balloon.reset();
        balloon.alpha = 1;


        this.p1Score += balloon.points;
        this.scoreLeft.text = this.p1Score; 
        
        //this.sound.play('sfx_explosion');
      }
}