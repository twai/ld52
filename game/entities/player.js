function createSoulShield(scene) {
    let shield = scene.physics.add.image(0, 0, 'soul_shield');
    shield.setScale(1.2, 1.2);
    const r = 325;
    shield.setCircle(r, (shield.displayWidth / (2 * shield.scaleX)) - r,  (shield.displayHeight / (2 * shield.scaleY)) - r);
    shield.disableBody(true, true);
    return shield;
}




function createPlayer(scene, x, y) {
    
    var sprite = scene.physics.add.sprite(0, 0, 'reaper');
    // sprite.body.setCircle(128);
    const spriteSize = {x: 256, y: 256};
    // sprite.setSize()
    // sprite.scale = 0.25;
    //sprite.setScale(0.5);
    let scale = 0.5;

    sprite.anims.play('reaper_idle');
    let scythe = scene.physics.add.sprite(70, 100, 'scythe')
    let slashOffset = {x: 200, y: 100};
    let slash = scene.physics.add.image(slashOffset.x, slashOffset.y, 'slash')
   // let zone = scene.physics.add.body()
    scene.physics.world.enable(slash);
    scene.physics.add.overlap(slash, scene.enemyGroup, (group, enemy) => enemy.hit(), null, scene);
    scene.physics.add.overlap(slash, scene.barrierGroup, (group, barrier) => barrier.hit() , null, scene);
    scene.physics.add.overlap(slash, scene.darkBarrierGroup, (group, barrier) => barrier.hit() , null, scene);
    console.log(slash);
    slash.disableBody(true);

    // let frontZone = scene.physics.add.image(sprite.x + 100, sprite.y, 'slash') // scene.add.rectangle(sprite.x + 100, sprite.y, sprite.displayWidth, sprite.displayHeight, 0x6666ff);
    let frontZone =  scene.add.rectangle(sprite.x, sprite.y, sprite.displayWidth, sprite.displayHeight, 0x6666ff);;
    frontZone.setAlpha(0);
    scene.physics.add.existing(frontZone);
    // let weaponCollider = scene.add.shape(scene, )

    let soulShield = createSoulShield(scene);
    scene.physics.add.overlap(soulShield, scene.enemyGroup, scene.enemyHit, null, scene);
    var player = scene.add.container(x || 0, y || 0, [sprite, scythe, slash, soulShield, frontZone])
    player.sprite = sprite
    player.scythe = scythe
    player.slash = slash
    player.slashOffset = slashOffset
    slash.visible = false
    player.frontZone = frontZone;
    // player.setCollideWorldBounds(true);
    // sprite.parent = scene;
    player.pressed = {right: 0, left: 0};
    player.lives = 3;


    // scene.plugins.get('rexinversepipelineplugin').add(sprite, {intensity: 1});

    player.allowVerticalMovement = true;
    player.allowMovement = true;
    console.log(player);
    player.speed = 800;
    player.setSize(300, 512);
    scene.physics.world.enable(player);
    player.body.setCollideWorldBounds(true);
    player.setScale(scale);
    player.moving = false;
    player.setDepth(1);

    if(scene.cursors == undefined) {
        console.warn('Parents creating a player should have cursor keys!');
    }
    


    player.parent = scene
    player.canRotate = true;
    player.isFlipped = false;

    let totalSouls = 5;
    const maxSouls = 10;

    player.handleSpawnerDrain = function(group, portal) {
        if(scene.cursors.n.isDown) {
            portal.parent.drain();
        }
    }

    player.addSoul = function() {
        totalSouls = Math.min(totalSouls + 1, maxSouls);
        scene.events.emit('updateSoulBar', totalSouls, 300);
    }


    player.activateSoulShield = function(cost = 1) {
        console.log('Enabling shield!');
        shieldOn = true;
        totalSouls -= cost;
        soulShield.enableBody(false, null, null, true, true);
        const time = 500;
        if(cost > 0) { scene.events.emit('updateSoulBar', totalSouls, time); }
        scene.time.delayedCall(time, () => {
            shieldOn = false; 
            soulShield.disableBody(true, true); 
        }, [], this);
    }

    let shieldOn = false;
    player.updateShield = function() {
        if(scene.cursors.m.isDown && !shieldOn && totalSouls > 0) {
            player.activateSoulShield();
        }
    }


    player.flashRed = function(time=500) {
        player.sprite.setTint(0xFF0000);
        scene.time.addEvent({
            delay: time,
            callback: function(){player.sprite.clearTint();}
        });
    }

    player.update = function(time, dt) {
        soulShield.setAngle((time * 0.01) % 360);
        
        var speed = this.speed;

        var scene = this.parent;
        var velocity = new Phaser.Math.Vector2(0, 0);

        this.updateShield();


        if(scene.cursors === undefined) {
            return;
        }

        if(this.allowMovement) {
            if(scene.cursors.left.isDown) {
                velocity.x -= 1;
                if(!this.isFlipped) {
                    this.list.forEach(o => o.flipX = true);
                    this.scythe.x = -70
                    this.isFlipped = true;
                }
            }
            if(scene.cursors.right.isDown) {
                velocity.x += 1;
                if(this.isFlipped) {
                    this.list.forEach(o => o.flipX = false);
                    this.scaleX = 1 * scale;
                    this.scythe.x = 70
                    this.isFlipped = false;
                }
                
            }
    
            if(this.allowVerticalMovement) {
                if(scene.cursors.up.isDown) {
                    velocity.y -= 1;
                }
                if(scene.cursors.down.isDown) {
                    velocity.y += 1;
                }
            }
        }



        if(scene.cursors.space.isDown && this.canRotate) {
            console.log('Space!')
            dir = this.isFlipped ? -1 : 1;
            this.canRotate = false;
            this.scythe.anims.play('scythe_glow');

            scene.tweens.addCounter({
                onUpdateParams: null,
                onCompleteParams: player,
                from: 0,
                to: 360 * dir,
                duration: 300,
                repeat: 0,
                ease: 'Back',
                onUpdate: function(tween, target, _1, _2, _3) {
                    player.scythe.setAngle(tween.getValue());
                },
                completeDelay: 200,
                onComplete: function(tween) {
                    player.canRotate = true
                }
            })

            scene.sound.play('slash')
            this.slash.enableBody();
            this.slash.visible = true;
            this.slash.x = player.x + player.slashOffset.x * dir
            console.log('Slash x', this.slash.x)
            scene.tweens.addCounter({
                from: 1,
                to: 0,
                duration: 300,
                onUpdateParams: [0, 0, dir],
                ease: 'Quintic',
                onStart: function(tween) {
                    player.slash.x = player.slashOffset.x * dir;
                    console.log('Setting flip to', player.isFlipped ? 'true' : 'false')
                },

                onUpdate: function(tween, target, _1, _2, _3, startX, startY, spawnDir) {
                    player.slash.alpha = tween.getValue();
                    player.slash.y = player.slashOffset.y;
                    player.slash.x = (player.slashOffset.x + (1 - tween.getValue()) * 100) * (player.isFlipped ? -1 : 1);
                },
                onComplete: function(tween) {
                    player.slash.disableBody();
                }
            })
        }




        if(velocity.length() > 0) {
            velocity.normalize();
            velocity.scale(speed);
            if(!player.moving) {
                sprite.anims.play('reaper_moving');
                player.moving = true;
            }
        }
        else {
            if(player.moving) {
                sprite.anims.play('reaper_idle');
                player.moving = false;
            }
        }
        this.body.setVelocity(velocity.x, velocity.y);
    }

    player.hit = function(attacker, self) {
        if(player.invincible) {
            return;
        }

        console.log(attacker)
        if(player.lives > 0) {
            scene.sound.play('die');
            player.lives -= 1;
            console.log('setting lives to', player.lives);
            scene.events.emit('setLives', player.lives);
            totalSouls = 0;
            scene.events.emit('updateSoulBar', totalSouls, 1000);
            player.activateSoulShield(0);
            player.flashRed(500);
            scene.cameras.main.shake(250, 0.01, true);
            player.invincible = true;
            scene.time.delayedCall(500, () => {
                player.invincible = false;
            }, [], this);
        }
        else {
            window.location.reload();
        }
    }

    return player;
}