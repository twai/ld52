function createSoul(scene, x, y) {
    
    var sprite = scene.physics.add.sprite(x || 0, y || 0, 'soul3');
    const spriteSize = {x: 256, y: 256};
    let scale = 0.5;
    sprite.anims.play('soul_3_base');
    sprite.parent = scene
    sprite.setScale(scale)
    
    scene.tweens.addCounter({
        from: 0,
        to: 1,
        duration: 300,
        ease: 'Quintic',

        onUpdate: function(tween) {
            sprite.alpha = tween.getValue();
        }
    });

    return sprite;
}