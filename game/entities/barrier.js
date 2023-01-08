function createBarrier(scene, x, y, friendly=true, scaleX=1, scaleY=1) {
    
    // var block = scene.physics.add.image(x || 0, y || 0, 'obstacle');
    var block = null;
    if(friendly) {
        block = scene.barrierGroup.create(x || 0, y || 0, 'barrier');
    }
    else {
        block = scene.darkBarrierGroup.create(x || 0, y || 0, 'dark_barrier');
    }
    block.setScale(scaleX, scaleY);
    block.refreshBody();

    block.hit = function() {
        scene.cameras.main.shake(250, 0.02, true);
        scene.sound.play('shatter')
        block.destroy();
    }
    // scene.obstacleGroup.add(block);
    // block.setImmovable(true);
    
    //scene.physics.add.collider(scene.player, block);

    return block;
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