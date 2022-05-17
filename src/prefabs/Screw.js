// Screw prefab
class Screw extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);   // add to existing, displayList, updateList
        this.isFiring = false;      // track screw's firing status
        this.moveSpeed = 2;         // pixels per frame
        this.sfxScrew = scene.sound.add('sfx_screw') 
    }

    update() {
        // left/right movement
        if(!this.isFiring) {
            if((keyLEFT.isDown || cursor.x < this.x) && this.x >= borderUISize + this.width) {
                this.x -= this.moveSpeed;
            } else if ((keyRIGHT.isDown || cursor.x > this.x) && this.x <= game.config.width - borderUISize - this.width) {
                this.x += this.moveSpeed;
            } 
        }
        // fire button
        if((Phaser.Input.Keyboard.JustDown(keyF) || cursor.isDown) && !this.isFiring) {
            this.isFiring = true;
            this.sfxScrew.play();
        }
        // if fired, move up
        if(this.isFiring && this.y >= borderUISize * 3 + borderPadding) {
            this.y -= this.moveSpeed;
        }
        // reset on miss
        if(this.y <= borderUISize * 3 + borderPadding) {
            this.reset();
        }
    }

    // reset screw to "ground"
    reset() {
        this.isFiring = false;
        this.y = game.config.height - borderUISize - borderPadding;
    }
}