/*
    POINT BREAKDOWN:

    10pt (2):
        -parallax scrolling
        -display time remaining in seconds
    20pt:
        -implement mouse control(left click to fire and cursor movement)
    60pt:
        -completely redesign aesthetics of the game.

    TOTAL: 100pts

*/

let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}
let game = new Phaser.Game(config);

// reserve keyboard vars and mouse
let keyF, keyR, keyLEFT, keyRIGHT, cursor;

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;
