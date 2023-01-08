function createEnemy(scene, x, y) {
    
    var sprite = scene.physics.add.sprite(x || 0, y || 0, 'reaper');
    const spriteSize = {x: 256, y: 256};
    let scale = 0.5;
    sprite.anims.play('reaper_moving');
    scene.plugins.get('rexinversepipelineplugin').add(sprite, {intensity: 1});
    scene.physics.world.enable(sprite);
    sprite.parent = scene
    sprite.setScale(scale)
    sprite.flipX = true;
    sprite.body.setSize(300, 512)
    sprite.dead = false;
    sprite.alpha = 0;
    const spawnTime = 1000;
    scene.tweens.addCounter({
        from: 0,
        to: 1,
        duration: spawnTime,
        repeat: 0,
        ease: 'linear',
        onUpdate: function(tween) {
            sprite.alpha = tween.getValue();
        },
        onComplete: function(tween) {
            scene.enemyGroup.add(sprite);
        }
    })


    sprite.update = function(time, dt) {
        let scene = this.parent;
        let player = scene.player;
        const speed = {x: 100, y: 100};
        scene.physics.moveToObject(sprite, scene.player, 400);
        sprite.flipX = sprite.body.velocity.x < 0;
        

    
    }
    sprite.hit = function() {
        const cam = this.parent.cameras.main;
        scene.sound.play('hurt');
        cam.shake(100, 0.01);
        this.disableBody();
        this.parent.spawn_soul(this.x, this.y);
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
                sprite.dead = true;
                scene.enemiesDirty = true;
                
            }
        });
    }


    // return sprite;
}