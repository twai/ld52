const MINIGAMES = ['dodgeball', 'arrows']

class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
    }

    preload() {
        console.log('preloading MainScene');
        this.load.spritesheet('reaper', 'img/reaper_sheet_hq.png', {frameWidth: 512, frameHeight: 512});
        this.load.image('slash', 'img/slash.png')
        this.load.image('soul_shield', 'img/soul_shield.png');
        this.load.spritesheet('spawner', 'img/portal_sheet_red.png', {frameWidth: 256, frameHeight: 512});
        this.load.spritesheet('portal', 'img/portal_sheet_blue.png', {frameWidth: 256, frameHeight: 512});
        this.load.image('life', 'img/life.png');
        this.load.image('life_x', 'img/life_x.png');
        this.load.spritesheet('scythe', 'img/scythe_sheet_2.png', {frameWidth: 512, frameHeight: 512});
        this.load.spritesheet('soul', 'img/soul_sheet.png', {frameWidth: 128, frameHeight: 186});
        this.load.spritesheet('soul2', 'img/soul_sheet_2.png', {frameWidth: 128, frameHeight: 186});
        this.load.spritesheet('soul3', 'img/soul_sheet_3.png', {frameWidth: 128, frameHeight: 186});
    
    
        this.load.html('easeform', './easeform.html');
    
        this.load.plugin('rexinversepipelineplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexinversepipelineplugin.min.js', true);

        this.load.image('backdrop', 'img/backdrop.png');
        this.load.image('bg1', 'img/bg_1.png');
        this.load.image('bg2a', 'img/bg_2a.png');
        this.load.image('bg2b', 'img/bg_2b.png');
        this.load.image('bg2c', 'img/bg_2c.png');
        this.load.image('bg3', 'img/bg_3.png');
        this.load.image('bg4', 'img/bg_4.png');
        this.load.image('bg5', 'img/bg_5.png');
        this.load.image('barrier', 'img/soul_wall.png');
        this.load.image('dark_barrier', 'img/soul_wall_dark.png');


        // Audio
        this.load.audio('slash', 'sound/click.wav');
        this.load.audio('shatter', 'sound/shatter.wav');
        this.load.audio('slay', 'sound/slay.wav');
        this.load.audio('hurt', 'sound/hurt.wav');
        this.load.audio('die', 'sound/die2.wav');


        /* this.load.spritesheet('portal', 'img/ss_portal.png', {frameWidth: 256, frameHeight: 256})
        this.load.spritesheet('green_guy_spritesheet', 'img/spritesheet2_centered.png', {frameWidth: 256, frameHeight: 256});
        this.load.spritesheet('waves', 'img/waves_pink.png', {frameWidth: 256, frameHeight: 64})
        this.load.spritesheet('machine', 'img/machine2.png', {frameWidth: 640, frameHeight: 640})
        this.load.spritesheet('status_monitor', 'img/spritesheet_monitor.png', {frameWidth: 158, frameHeight: 94})
        this.load.image('testtube', 'img/testtube.png');
        this.load.image('hat', 'img/hat.png');
        this.load.image('floor', 'img/floor.png'); */

        
        // this.load.image('waves', 'img/waves_pink3.png');
    }

    repeatingBackground(startCnt, levelWidth, texture, scrollFactor) {
        const w = this.textures.get(texture).getSourceImage().width
        const count = 1 + (Math.ceil(levelWidth / w) * scrollFactor)
        //console.log('w:', w)
        //console.log('Repeating texture', texture, count, 'times')

        let x = startCnt * scrollFactor * w
        //console.log('start x:', startCnt, '*', scrollFactor, '*', w, '=', x)
        for(let i = 0; i < count; i++) {
            const m = this.add.image(x, this.scale.height, texture).setOrigin(0, 1).setScrollFactor(scrollFactor)
            x += m.width
        }
    }


    spawn_soul(x, y) {
        this.soulGroup.add(createSoul(this, x, y));
    }

    init_animations() {
        // PLAYER
        this.anims.create({
            key: 'reaper_idle',
            frames: this.anims.generateFrameNumbers('reaper', {start: 0, end: 0})
        })
        this.anims.create({
            key: 'reaper_moving',
            repeat: -1,
            frameRate: 8,
            frames: this.anims.generateFrameNumbers('reaper', {start: 0, end: 2})
        })
        this.anims.create({
            key: 'scythe_idle',
            frames: this.anims.generateFrameNumbers('scythe', {start: 0, end: 0})
        })
        this.anims.create({
            key: 'scythe_glow',
            frames: this.anims.generateFrameNumbers('scythe', {start: 1, end: 0}),
            frameRate: 3
        })
        // this.anims.create({
        //     key: 'soul_base',
        //     repeat: -1,
        //     frames: this.anims.generateFrameNumbers('soul', {start: 1, end: 3}),
        //     frameRate: 5
        // })
        // this.anims.create({
        //     key: 'soul_2_base',
        //     repeat: -1,
        //     frames: this.anims.generateFrameNumbers('soul2', {start: 1, end: 3}),
        //     frameRate: 5
        // })
        this.anims.create({
            key: 'soul_3_base',
            repeat: -1,
            frames: this.anims.generateFrameNumbers('soul3', {start: 0, end: 3}),
            frameRate: 6
        })
        this.anims.create({
            key: 'soul_3_idle',
            repeat: 0,
            frames: this.anims.generateFrameNumbers('soul3', {start: 0, end: 0}),
        })

        
        this.anims.create({
            key: 'portal_open_idle',
            repeat: 0,
            frames: this.anims.generateFrameNumbers('portal', {start: 8, end: 8}),
        })
        this.anims.create({
            key: 'spawner_open_idle',
            repeat: 0,
            frames: this.anims.generateFrameNumbers('spawner', {start: 8, end: 8}),
        })
        
        this.anims.create({
            key: 'portal_open',
            repeat: 0,
            frames: this.anims.generateFrameNumbers('portal', {start: 0, end: 8}),
        })
        this.anims.create({
            key: 'spawner_open',
            repeat: 0,
            frames: this.anims.generateFrameNumbers('spawner', {start: 0, end: 8}),
            frameRate: 10
        })
        this.anims.create({
            key: 'spawner_close',
            repeat: 0,
            frames: this.anims.generateFrameNumbers('spawner', {start: 8, end: 4}),
            frameRate: 10
        })


        /*
        this.anims.create({
            key: 'idle',
            repeat: -1,
            frames: this.anims.generateFrameNumbers('green_guy_spritesheet', {start: 0, end: 2}),
            frameRate: 5
        })
        this.anims.create({
            key: 'right_collide',
            repeat: -1,
            frames: this.anims.generateFrameNumbers('green_guy_spritesheet', {start: 3, end: 5}),
            frameRate: 5
        })
        this.anims.create({
            key: 'right_collide_hard',
            repeat: -1,
            frames: this.anims.generateFrameNumbers('green_guy_spritesheet', {start: 6, end: 8}),
            frameRate: 5
        })
        this.anims.create({
            key: 'left_collide',
            repeat: -1,
            frames: this.anims.generateFrameNumbers('green_guy_spritesheet', {start: 9, end: 11}),
            frameRate: 5
        })
        this.anims.create({
            key: 'left_collide_hard',
            repeat: -1,
            frames: this.anims.generateFrameNumbers('green_guy_spritesheet', {start: 12, end: 14}),
            frameRate: 5
        })

        // PORTAL
        this.anims.create({
            key: 'portal_idle',
            repeat: -1,
            frames: this.anims.generateFrameNumbers('portal', {start: 0, end: 2}),
            frameRate: 5
        })

        // TEST TUBE
        this.anims.create({
            key: 'waves_idle',
            repeat: -1,
            frames: this.anims.generateFrameNumbers('waves', {start: 0, end: 2}),
            frameRate: 5
        })

        // MONITOR
        this.anims.create({
            key: 'status_off',
            repeat: 0,
            frames: this.anims.generateFrameNumbers('status_monitor', {start: 0, end: 3}),
            frameRate: 10
        })
        this.anims.create({
            key: 'status_critical',
            repeat: -1,
            frames: this.anims.generateFrameNumbers('status_monitor', {start: 4, end: 7}),
            frameRate: 5
        })
        this.anims.create({
            key: 'status_warn',
            repeat: -1,
            frames: this.anims.generateFrameNumbers('status_monitor', {start: 8, end: 10}),
            frameRate: 5
        })
        this.anims.create({
            key: 'status_ok',
            repeat: 0,
            frames: this.anims.generateFrameNumbers('status_monitor', {start: 11, end: 11}),
            frameRate: 0
        })
        this.anims.create({
            key: 'status_loading',
            repeat: -1,
            frames: this.anims.generateFrameNumbers('status_monitor', {start: 12, end: 14}),
            frameRate: 5
        })
        */
    }

    requestResume(data) {
        this.scene.setVisible(true);
    }

    enemyHit(enemyGroup, enemy) {
        // console.log('player hit enemy:');
        //  console.log('player', player);
        //console.log('enemy', enemy);
        enemy.hit();
        // this.player.addSoul();
        // this.events.emit('addKill');
        // this.events.emit('updateSoulBar', 100);
    }
    

    soulTouched(soulGroup, soul) {
        //console.log('soul', soulGroup)
        //console.log('player', player)

        soul.destroy();
        this.player.addSoul();
        return;
        console.log('player hit enemy:');
        console.log(player);
        console.log(enemy);
        enemy.hit(player);
        // this.events.emit('addKill');
        // this.events.emit('updateSoulBar', 100);
    }

    spawnEnemy(x, y) {
        createEnemy(this, x, y);
    }

    create() {
       // console.log('Creating MainScene');

        this.init_animations();
        this.cursors = My.Utils.mapInput(this);
       // console.log(this.cursors);

        this.nextSpawnerTime = 5000;

        // Background
        this.add.image(960, 600, 'backdrop').setScrollFactor(0);
        
        this.repeatingBackground(-1, 1920*3, 'bg1', 0);
        this.repeatingBackground(-1, 1920*3, 'bg2a', 0);
        this.repeatingBackground(-1, 1920*3, 'bg2b', 0.02);
        this.repeatingBackground(-1, 1920*3, 'bg2c', 0.04);
        this.repeatingBackground(-1, 1920*3, 'bg3', 0.08);
        this.repeatingBackground(-1, 1920*3, 'bg4', 0.12);
        this.repeatingBackground(-1, 1920*3, 'bg5', 0.16);
        
        // this.add.sprite(100, 100, 'soul').play('soul_base')
        // this.add.sprite(400, 100, 'soul2').play('soul_2_base')
        // this.add.sprite(700, 100, 'soul3').play('soul_3_base')

        this.barrierGroup = this.physics.add.staticGroup();
        this.darkBarrierGroup = this.physics.add.staticGroup();
        //this.obstacleGroup.add(createObstacle(this, 800, 500));
        
        this.enemyGroup = this.physics.add.group()
        this.physics.add.collider(this.enemyGroup, this.enemyGroup);
        this.physics.add.collider(this.enemyGroup, this.barrierGroup);
        this.physics.add.collider(this.enemyGroup, this.darkBarrierGroup);

        // this.enemy = createEnemy(this, 900, 900);
        
        this.player = createPlayer(this, 200, 500);
        this.physics.add.collider(this.player, this.darkBarrierGroup);

        createBarrier(this, 550, 525, false, 1, 3);
        createBarrier(this, 800, 525, false, 1, 3);

        createPortal(this, 1920*3 - 200, 1080/2);

        this.souls = []
        /*
        // let enemies = []
        for(let i =wd 0; i < 3; i++) {
            this.spawnEnemy(900 + i * 30, 900);
            // let e = createEnemy(this, 900 + i * 10, 900);
            /// enemies.push(e);
        }
        for(let i = 0; i < 15; i++) {
            this.spawnEnemy(900 + i * 300, 900);
            // let e = createEnemy(this, 900 + i * 300, 900);
            // this.physics.add.overlap(this.enemy, this.player, this.player.hit, null, this);
           //  enemies.push(e);
        }
        */
        
        
        this.spawnerGroup = this.physics.add.group();
        //createSpawnPoint(this, 1500, 200, 9000, 0);
        //createSpawnPoint(this, 1700, 500, 9000, 3000);
        //createSpawnPoint(this, 1500, 800, 9000, 6000);
        this.physics.add.overlap(this.player.frontZone, this.spawnerGroup, this.player.handleSpawnerDrain);
        /*this.spawnPoints.push(createSpawnPoint(this, 1500, 200, 9000, 0));
        this.spawnPoints.push(createSpawnPoint(this, 1700, 500, 9000, 3000));
        this.spawnPoints.push(createSpawnPoint(this, 1500, 800, 9000, 6000));


        this.spawnPoints.push(createSpawnPoint(this, 3500, 200, 9000, 0));
        this.spawnPoints.push(createSpawnPoint(this, 3700, 500, 9000, 3000));
        this.spawnPoints.push(createSpawnPoint(this, 3500, 800, 9000, 6000));
        */
        // this.enemyGroup.addMultiple(enemies)
        this.physics.add.overlap(this.enemyGroup, this.player, this.player.hit, null, this);

        this.soulGroup = this.physics.add.group();
        this.physics.add.overlap(this.player, this.soulGroup, this.soulTouched, null, this);


        this.spawn_soul(675, 100);
        this.spawn_soul(675, 300);
        this.spawn_soul(675, 500);
        this.spawn_soul(675, 700);
        this.spawn_soul(675, 900);

        // this.add.text(600, 50, 'Here:', { color: 'black', fontSize: '20px '});
        // var element = this.add.dom(700, 50).createFromCache('easeform');
        // this.add.dom(200, 200, 'div', 'background-color: lime; width: 220px; height: 100px; font: 48px Arial', 'Phaser')
        // element.addListener('click');
        // console.log(this)

        this.physics.world.setBounds(0, 0, 1920*3, 1080);

        const cam = this.cameras.main
        cam.setZoom(1.0);
        cam.setBounds(0, 0, 1920*3, 1080);
        // cam.setLerp(0.5);
        cam.setDeadzone(920, 1080);
        cam.startFollow(this.player);

        this.enemiesDirty = false;

        // this.powerDrain = 0.1;
        // this.add.image(500, 350, 'floor')
        /*
       var m1 = new Machine(this, 'dodgeball');
       m1.create(165, 110, 1);
       var m2 = new Machine(this, 'arrows');
       m2.create(495, 110, 0.5);
       var m3 = new Machine(this, 'dodgeball');
       m3.create(825, 110, 0.8);
       
        this.player = createPlayer(this, 500, 500);
        this.player.usePerspective = true;
        m1.createCollider(this.player);
        m2.createCollider(this.player);
        m3.createCollider(this.player);
        this.machines = []
        this.machines.push(m1);
        this.machines.push(m2);
        this.machines.push(m3);
        this.activeMachines = 3;
        // Some text to show where we are
        // this.add.text(400, 16, 'Main Game', {fontSize: '32px', fill: '#000'});

        // For debugging
        this.events.on('pause', () => {
            console.log('paused');
        });

        // Since we hid when pausing, we need to become visible again!
        this.events.on('resume', (scene, data) => {
            if(!this.scene.isVisible()) {
                this.scene.setVisible(true);
            }
        })
        */
    }


    clearDeadEntities() {
        this.enemyGroup.children.each((enemy) => {
            if(enemy.dead) {
                enemy.destroy();
            }
        });
    }

    createNewSpawner() {
        const wv = this.cameras.main.worldView;
        const x = (wv.left + 50) + (wv.width - 100) * Math.random();
        const y = (wv.top + 50) + (wv.height - 100) * Math.random();
        createSpawnPoint(this, x, y, 1000 + Math.random() * 5000);
    }

    update(time, dt) {
        
        this.nextSpawnerTime -= dt;
        if(this.nextSpawnerTime < 0) {
            this.createNewSpawner();
            this.nextSpawnerTime = 1000 + Math.random() * 10000;
        }

        this.player.update(time, dt);

        if(this.enemiesDirty) {
            this.clearDeadEntities();
        }

        this.spawnerGroup.children.each((spawnPoint) => spawnPoint.parent.update(time, dt));

        this.enemyGroup.children.each((child) => child.update(time. dt));

        const cam = this.cameras.main
        const speed = 5
        if(this.cursors.kright.isDown) {
            cam.scrollX += speed;
        }
        else if(this.cursors.kleft.isDown) {
            cam.scrollX -= speed;
        }

        /*
        this.powerDrain += dt * 0.000003
        var drain = this.powerDrain / Math.max(1, this.activeMachines);
        this.machines.forEach(machine => machine.update(time, dt, drain));
*/


        // (( TEMPORARY ))
        // If we press space while overlapping the portal, start a minigame!
        // if(this.cursors.space.isDown && this.physics.overlap(this.player, this.portal)) {
        //     this.scene.pause();
        //     // this.player.allowMovement = false;

        //     this.scene.setVisible(false);
        //     var gameMode = MINIGAMES[Phaser.Math.Between(0, MINIGAMES.length-1)];
        //     this.scene.launch(gameMode, {difficultyLevel: Phaser.Math.Between(1, 4), mainScene: this});
        // }
    }

    onMachinePoweredDown() {
        this.activeMachines -= 1;
    }
}
