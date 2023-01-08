function createSpawnPoint(scene, x, y, frequency = 1000, offset=0) {
    // let spawnFrequency = frequency

    console.log('Creating a spawn point with frequency ' + frequency + ' and offset ' + offset);
    spawnPoint = {};
    spawnPoint.frequency = frequency;
    spawnPoint.updateCtr = offset;
    spawnPoint.sprite = scene.physics.add.sprite(x, y, 'spawner').setScale(0.5);
    spawnPoint.sprite.anims.play('spawner_open')
    spawnPoint.isOpen = true;

    spawnPoint.drain = function() {
        if(this.isOpen) {
            this.close();
        }
    }

    spawnPoint.update = function(time, dt) {
        if(!this.isOpen) {
            this.openTimer -= dt;
            if(this.openTimer < 0) {
                this.open();
            }
            return;
        }
        let rect = scene.cameras.main.worldView;
        if(this.sprite.x < rect.left || this.sprite.x > rect.right || this.sprite.y < rect.top || this.sprite.y > rect.bottom) {
            //console.log('not in view')
           // console.log('worldView', scene.cameras.main.worldView)
           // console.log('(x, y)', x, y);
            return;
        }
        else {
            ///console.log('(' + spawnPoint.sprite.x + ',' + spawnPoint.sprite.y + ') is inside', rect);

        }
        this.updateCtr += dt;
        // console.log('++');

        if(this.updateCtr > this.frequency) {
            console.log('Spawn!');
            this.updateCtr -= this.frequency;
            scene.spawnEnemy(this.sprite.x, this.sprite.y);
        }

    }
    spawnPoint.close = function() {
        this.isOpen = false;
        this.sprite.anims.play('spawner_close')
        this.openTimer = 5000 + Math.random() * 10000;
    }

    spawnPoint.open = function() {
        this.isOpen = true;
        this.sprite.anims.play('spawner_open')
        this.updateCtr = Math.max(0, this.frequency - 1000);
    }

    spawnPoint.sprite.parent = spawnPoint;
    // spawnPoint.body = spawnPoint.sprite.body;
    scene.spawnerGroup.add(spawnPoint.sprite);

    return;
    // return spawnPoint;

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
    
    sprite.update = function(time, dt) {

        var scene = this.parent;

    
    }

    sprite.hit = function() {
        const cam = this.parent.cameras.main;
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

    return sprite;
}