class DodgeballScene extends Phaser.Scene {
    constructor() {
        super('dodgeball');
        console.log('constructing dodgeball')
    }
    
    preload() {
        console.log('preloading dodgeball');
        this.load.spritesheet('red_spritesheet', 'img/spritesheet_red.png', {frameWidth: 256, frameHeight: 256});
        this.load.image('overlay_failed', 'img/overlay_failed.png');
        this.load.image('overlay_passed', 'img/overlay_passed.png');
    }

    endGame(success) {
        this.player.allowMovement = false;
        this.scene.pause()
        this.scene.launch('fadescene', {
            peakCb: () => {
                console.log('stopping dodgeball')
                this.scene.stop();
                this.mainScene.scene.setVisible(true);     
            },
            doneCb: () => {
                console.log('resuming main')
                console.log(this.data);
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
        this.finalCb = data.finalCb;
        console.log('setting mainScene')
        console.log(data.mainScene)
        this.mainScene = data.mainScene;
        console.log(`creating dodgeball scene with difficulty ${data.difficultyLevel}`)
        this.anims.create({
            key: 'red_idle',
            repeat: -1,
            frames: this.anims.generateFrameNumbers('red_spritesheet', {start: 0, end: 2}),
            frameRate: 5
        })

        this.cursors = My.Utils.mapInput(this);
        this.player = createPlayer(this, 500, 300);

        this.add.text(400, 16, 'Dodgeball', {fontSize: '32px', fill: '#000'});
        this.timerText = this.add.text(800, 16, '5s', {fontSize: '32px', fill: '#000'})

        // Add a game timer to know when to return to main game
        this.myTimer = this.time.addEvent({delay: 5000});

        // Add a physics group for red balls
        // Letting them collide with each other and with the player
        this.redGroup = this.physics.add.group({
            quantity: 0,
            bounceX: 1,
            bounceY: 1,
            collideWorldBounds: true
        });
        this.physics.add.collider(this.redGroup);
        this.physics.add.collider(this.player, this.redGroup, () => {
            console.log('FAILED')
            this.endGame(false);
        });

        // Spawn new balls at an interval, based on difficulty
        const difficultyMapping = {1: 1000, 2: 500, 3: 250, 4: 200};
        this.spawnTimer = this.time.addEvent({
            delay: difficultyMapping[data.difficultyLevel],
            callback: () => {
                var redBall = this.physics.add.sprite(500, 300, 'red_spritesheet');
                redBall.anims.play('red_idle');
                redBall.scale = 0.25;
                redBall.setCollideWorldBounds(true);
                redBall.setBounce(1, 1);
                var vel = new Phaser.Math.Vector2();
                vel = Phaser.Math.RandomXY(vel);
                var scaledVel = vel.scale(Phaser.Math.Between(100, 500));
                redBall.setVelocity(scaledVel.x, scaledVel.y);
                redBall.setRotation(Phaser.Math.FloatBetween(0, Phaser.Math.PI2))

                // Spawn off-screen in a position where our direction will bring us on screen
                redBall.setRandomPosition();
                redBall.x -= vel.x * 1000;
                redBall.y -= vel.y * 1000;
                redBall.body.setCircle(128);
                this.redGroup.add(redBall);

                // The group sets velocity to 0, need to get in there and fix that
                this.redGroup.children.entries[this.redGroup.children.entries.length - 1].setVelocity(vel.x, vel.y);
            },
            repeat: -1
        });



    }
    
    update(time, dt) {
        this.player.update(time, dt);
        var secondsRemaining = this.myTimer.getRemainingSeconds();
        if(secondsRemaining <= 0) {
            this.endGame(true);
            console.log('SURVIVED')
        }
        else {
            this.timerText.setText(`${secondsRemaining.toFixed(1)}s`)
        }
    }
}