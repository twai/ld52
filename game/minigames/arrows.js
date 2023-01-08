class ArrowsScene extends Phaser.Scene {
    constructor() {
        super('arrows');
        console.log('constructing arrows')
    }
    
    preload() {
        console.log('preloading arrows');
        // this.load.spritesheet('red_spritesheet', 'img/spritesheet_red.png', {frameWidth: 256, frameHeight: 256});
        this.load.image('red_arrow', 'img/arrow_down.png');
        this.load.image('overlay_failed', 'img/overlay_failed.png');
        this.load.image('overlay_passed', 'img/overlay_passed.png');
    }

    endGame(success) {
        this.player.allowMovement = false;
        this.scene.pause()
        this.scene.launch('fadescene', {
            peakCb: () => {
                console.log('stopping arrows')
                this.scene.stop();
                this.mainScene.scene.setVisible(true);     
            },
            doneCb: () => {
                console.log('resuming main')
                if(this.finalCb !== undefined) {
                    this.finalCb(success);
                }
                this.mainScene.scene.resume();
            },
            fadeDuration: 500,
            peakDuration: 1000,
            image_tag: success ? 'overlay_passed' : 'overlay_failed',
            style: 'FADE_INOUT'
        });
    }

    create(data) {
        this.mainScene = data.mainScene;
        this.finalCb = data.finalCb;
        console.log(`creating arrows scene with difficulty ${data.difficultyLevel}`)
        // this.anims.create({
        //     key: 'red_idle',
        //     repeat: -1,
        //     frames: this.anims.generateFrameNumbers('red_spritesheet', {start: 0, end: 2}),
        //     frameRate: 5
        // })


        this.cursors = My.Utils.mapInput(this);
        this.player = createPlayer(this, 500, 900);
        this.player.allowVerticalMovement = false;
        // Add a game timer to know when to return to main game
        this.myTimer = this.time.addEvent({delay: 5000, callback: () => {
            console.log('SURVIVED')
            this.endGame(true);
        }});

        this.spawnArrowWave();
        this.arrowDropperTimer = this.time.addEvent({
            delay: 200,
            callback: () => {
                var idx = Phaser.Utils.Array.RemoveRandomElement(this.arrowsToDrop);
                var c = this.arrowGroup.children.entries[idx];
                if(c !== undefined) {
                    c.setVelocity(0, 450);
                }
            },
            repeat: -1
        })


        this.add.text(400, 16, 'Arrows', {fontSize: '32px', fill: '#000'});
        this.timerText = this.add.text(800, 16, '5s', {fontSize: '32px', fill: '#000'})

        this.arrowGroup = this.physics.add.group({
            quantity: 0,
            bounceX: 1,
            bounceY: 1,
            collideWorldBounds: true
        })


        // Add a physics group for red balls
        // Letting them collide with each other and with the player
        // this.arrowGroup = this.physics.add.group({
        //     quantity: 0,
        //     bounceX: 1,
        //     bounceY: 1,
        //     collideWorldBounds: true
        // });
        // this.physics.add.collider(this.redGroup);
        // this.physics.add.collider(this.player, this.redGroup, () => {
        //     console.log('FAILED')
        //     this.endGame();
        // });

        // Spawn new balls at an interval, based on difficulty
        // const difficultyMapping = {1: 1000, 2: 500, 3: 250, 4: 200};
        // this.spawnTimer = this.time.addEvent({
        //     delay: difficultyMapping[data.difficultyLevel],
        //     callback: () => {
        //         var redBall = this.physics.add.sprite(500, 300, 'red_spritesheet');
        //         redBall.anims.play('red_idle');
        //         redBall.scale = 0.25;
        //         redBall.setCollideWorldBounds(true);
        //         redBall.setBounce(1, 1);
        //         var vel = new Phaser.Math.Vector2();
        //         vel = Phaser.Math.RandomXY(vel);
        //         var scaledVel = vel.scale(Phaser.Math.Between(100, 500));
        //         redBall.setVelocity(scaledVel.x, scaledVel.y);
        //         redBall.setRotation(Phaser.Math.FloatBetween(0, Phaser.Math.PI2))

        //         // Spawn off-screen in a position where our direction will bring us on screen
        //         redBall.setRandomPosition();
        //         redBall.x -= vel.x * 1000;
        //         redBall.y -= vel.y * 1000;
        //         this.redGroup.add(redBall);

        //         // The group sets velocity to 0, need to get in there and fix that
        //         this.redGroup.children.entries[this.redGroup.children.entries.length - 1].setVelocity(vel.x, vel.y);
        //     },
        //     repeat: -1
        // });

    }

    spawnArrowWave() {
        this.arrowGroup = this.physics.add.group({
            key: 'red_arrow',
            frameQuantity: 16,
            gridAlign: {
                x: 20,
                y: -125,
                width: -1,
                height: 1,
                cellWidth: 64,
                cellHeight: 128
            },
            setScale: {x: 0.75, y: 0.75},

        });
        this.physics.add.collider(this.player, this.arrowGroup, () => {
            console.log('FAILED');
            this.endGame(false);
        });
        console.log('creating arrows to drop..')
        this.arrowsToDrop = [...Phaser.Utils.Array.NumberArray(0, 15)];

       // group.setVelocityY(200);
        
    }

    update(time, dt) {
        this.player.update(time, dt);
        this.timerText.setText(`${this.myTimer.getRemainingSeconds().toFixed(1)}s`)

    }
}