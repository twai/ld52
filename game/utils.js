const My = {
    Utils: {}
}

My.Utils.mapInput = function(scene) {
    return scene.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D,
        space: Phaser.Input.Keyboard.KeyCodes.SPACE,
        kright: Phaser.Input.Keyboard.KeyCodes.RIGHT,
        kleft: Phaser.Input.Keyboard.KeyCodes.LEFT,
        m: Phaser.Input.Keyboard.KeyCodes.M,
        n: Phaser.Input.Keyboard.KeyCodes.N,
        // e: Phaser.Input.Keyboard.KeyCodes.E
    })
};
