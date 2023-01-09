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

    }

    repeatingBackground(startCnt, levelWidth, texture, scrollFactor) {
        const w = this.textures.get(texture).getSourceImage().width
        const count = 1 + (Math.ceil(levelWidth / w) * scrollFactor)

        let x = startCnt * scrollFactor * w
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
            key: 'spawner_reopen',
            repeat: 0,
            frames: this.anims.generateFrameNumbers('spawner', {start: 4, end: 8}),
            frameRate: 10
        })
        this.anims.create({
            key: 'spawner_close',
            repeat: 0,
            frames: this.anims.generateFrameNumbers('spawner', {start: 8, end: 4}),
            frameRate: 10
        })

    }

    requestResume(data) {
        this.scene.setVisible(true);
    }

    enemyHit(enemyGroup, enemy) {
        enemy.hit();
    }
    

    soulTouched(soulGroup, soul) {
        soul.destroy();
        this.player.addSoul();
        return;
        console.log('player hit enemy:');
        console.log(player);
        console.log(enemy);
        enemy.hit(player);
    }

    spawnEnemy(x, y) {
        createEnemy(this, x, y);
    }

    create() {
        this.init_animations();
        this.cursors = My.Utils.mapInput(this);

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

        this.barrierGroup = this.physics.add.staticGroup();
        this.darkBarrierGroup = this.physics.add.staticGroup();
        
        
        this.enemyGroup = this.physics.add.group()
        this.physics.add.collider(this.enemyGroup, this.enemyGroup);
        this.physics.add.collider(this.enemyGroup, this.barrierGroup);
        this.physics.add.collider(this.enemyGroup, this.darkBarrierGroup);
        
        this.player = createPlayer(this, 200, 500);
        this.physics.add.collider(this.player, this.darkBarrierGroup);

        createBarrier(this, 550, 525, false, 1, 3);
        createBarrier(this, 800, 525, false, 1, 3);

        createPortal(this, 1920*3 - 200, 1080/2);

        this.souls = []
        
        this.spawnerGroup = this.physics.add.group();
        this.physics.add.overlap(this.player.frontZone, this.spawnerGroup, this.player.handleSpawnerDrain);
       
        this.physics.add.overlap(this.enemyGroup, this.player, this.player.hit, null, this);

        this.soulGroup = this.physics.add.group();
        this.physics.add.overlap(this.player, this.soulGroup, this.soulTouched, null, this);


        this.spawn_soul(675, 100);
        this.spawn_soul(675, 300);
        this.spawn_soul(675, 500);
        this.spawn_soul(675, 700);
        this.spawn_soul(675, 900);

        this.physics.world.setBounds(0, 0, 1920*3, 1080);

        const cam = this.cameras.main
        cam.setZoom(1.0);
        cam.setBounds(0, 0, 1920*3, 1080);
        cam.setDeadzone(920, 1080);
        cam.startFollow(this.player);

        this.enemiesDirty = false;
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
    }

    onMachinePoweredDown() {
        this.activeMachines -= 1;
    }
}
