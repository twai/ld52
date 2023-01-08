var config = {
    type: Phaser.AUTO,
    width: 1900,
    height: 1060,
    backgroundColor: "#808080",
    parent: game,
    dom: {
        createContainer: true
    },
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'game'
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [MainScene, GUIScene, FadeScene]
};

var game = new Phaser.Game(config);
