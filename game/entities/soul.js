function createSoul(scene, x, y) {
    
    var sprite = scene.physics.add.sprite(x || 0, y || 0, 'soul3');
    const spriteSize = {x: 256, y: 256};
    let scale = 0.5;
    sprite.anims.play('soul_3_base');
    // scene.plugins.get('rexinversepipelineplugin').add(sprite, {intensity: 1});
    // scene.physics.world.enable(sprite);
    sprite.parent = scene
    sprite.setScale(scale)
    // sprite.flipX = true;
    // sprite.body.setSize(300, 512)
    
    scene.tweens.addCounter({
        from: 0,
        to: 1,
        duration: 300,
        ease: 'Quintic',

        onUpdate: function(tween) {
            sprite.alpha = tween.getValue();
        }
    });

    /*
    sprite.update = function(time, dt) {

        var scene = this.parent;

    
    }

    sprite.hit = function(attacker) {
        const cam = this.parent.cameras.main;
        cam.shake(100, 0.01);
        this.disableBody();
        this.parent.tweens.addCounter({
            from: 1,
            to: 0,
            duration: 300,
            ease: 'Quintic',

            onUpdate: function(tween) {
                sprite.alpha = tween.getValue();
            },
            onComplete: function(tween) {
                sprite.disableBody(true, true);
            }
        });
    }
    */

    return sprite;
}