class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {

        // load background
        this.load.image('clouds', './assets/clouds.png');
        this.load.image('buildings', './assets/building.png');
        // load audio: 
        this.load.audio('sfx_select', './assets/select_sound.wav');
        this.load.audio('sfx_explosion', './assets/explosion.wav'); // explosion.wav is from Mixkit and is free to use
        this.load.audio('sfx_screw', './assets/screw_shot.wav');
    }

    create() {

        // place background

        this.clouds = this.add.tileSprite(0, 0, 640, 480, 'clouds').setOrigin(0, 0);
        this.buildings = this.add.tileSprite(0, 120, 640, 360, 'buildings').setOrigin(0, 0);

        // menu text configuration
        let menuConfig = {
            fontFamily: 'Tahoma',
            fontSize: '28px',
            backgroundColor: '#4F7CAC',
            color: '#C0E0DE',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        
        // show menu text 
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding, 'BALLOON POP', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2, 'The screw will follow your cursor.', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + (borderUISize + borderPadding), 'Or use ← or → to move the screw.', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2+ (borderUISize + borderPadding)*2, 'Use (F) or left click to fire.', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + (borderUISize + borderPadding)*3, 'Press ← for Novice or → for Expert', menuConfig).setOrigin(0.5);

        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
          // Novice mode
          game.settings = {
            balloonSpeed: 3,
            gameTimer: 60000    
          }
          this.sound.play('sfx_select');
          this.scene.start("playScene");    
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
          // Expert mode
          game.settings = {
            balloonSpeed: 4,
            gameTimer: 45000    
          }
          this.sound.play('sfx_select');
          this.scene.start("playScene");    
        }
      }
}