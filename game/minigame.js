class MinigameScene extends Phaser.Scene {
    constructor() {
        super('minigame');
        console.log('constructor minigame')
    }
    
    preload() {
        console.log('preloading minigame')
        this.load.image('box_red', 'img/RED.png');
        this.load.image('box_blue', 'img/BLUE.png');
    }

    create() {

        console.log('creating minigame')
        this.blue_box = this.physics.add.sprite(128, 128, 'box_blue')
        this.blue_box.setCollideWorldBounds(true)


        this.add.text(400, 16, 'Mini Game', {fontSize: '32px', fill: '#000'});

        this.input.on('pointerdown', () => {
            this.scene.stop()
            this.scene.resume('MainScene')
            
        });

        this.cursors = this.input.keyboard.createCursorKeys();
        // Set bounds for world and camera
        // this.physics.world.setBounds(0, 0, 800, 600);
        // this.cameras.main.setBounds(0,0,800, 2000);
    
        // Create input
        // this.cursor = this.input.keyboard.createCursorKeys();
        // this.cursor.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update(time, dt) {
        // this.blue_box.y += dt / 10;

        var speed = dt / 2;
        if(this.cursors.left.isDown) {
            this.blue_box.x -= speed;
        }
        if(this.cursors.right.isDown) {
            this.blue_box.x += speed;
        }
        if(this.cursors.up.isDown) {
            this.blue_box.y -= speed;
        }
        if(this.cursors.down.isDown) {
            this.blue_box.y += speed;
        }
    }
}