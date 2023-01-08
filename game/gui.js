class GUIScene extends Phaser.Scene {
    constructor() {
        super({key: 'GUIScene', active: true});
        this.score = 0;
        this.soulCapacity = 10;
        this.souls = 5;
        this.activeTween = null;
    }

    preload() {
        this.load.image('soul_bar', 'img/soul_bar.png');
        this.load.image('soul_bar_fill_body', 'img/soul_bar_fill_body.png');
        this.load.image('soul_bar_fill_edge', 'img/soul_bar_fill_edge.png');
        this.load.spritesheet('soul_bar_bg', 'img/soul_bar_backgrounds_2.png', {frameWidth: 512, frameHeight: 200});
    }

    updateSoulBar(easeMode='Expo.easeOut', duration=300) {
        console.log('Updating soule bar over ' + duration + ' seconds with ease mode ' + easeMode);
        const full_bar = 4.9;
        let s_per_soul = full_bar / this.soulCapacity;

        if(this.activeTween != null) {
            this.tweens.remove(this.activeTween);
            this.activeTween = null;
        }
        let scene = this;

        if(scene.souls < scene.soulCapacity) { scene.soul_bar_bg.visible = false; }

        this.activeTween = this.tweens.addCounter({
            from: scene.soul_fill_body.scaleX,
            to: s_per_soul * scene.souls,
            duration: duration,
            ease: easeMode,
            onUpdate: function(tween) {
                scene.soul_fill_body.scaleX = tween.getValue()
                scene.soul_fill_edge.x = scene.soul_fill_body.x + scene.soul_fill_body.displayWidth
            },
            onComplete: function(tween) {
                scene.activeTween = null;
                console.log(scene.souls + '/' + scene.soulCapacity);
                if(scene.souls >= scene.soulCapacity){
                    scene.soulSprite.anims.play('soul_3_base', true);
                    scene.soul_bar_bg.visible = true;
                }
                else {
                    scene.soulSprite.anims.play('soul_3_idle', true);
                }
            }
        });


        // this.soul_fill_body.scaleX = s_per_soul * this.souls
        // this.soul_fill_edge.x = this.soul_fill_body.x + this.soul_fill_body.displayWidth;
    }

    removeLife(idx) {
        let cross = this.lives[idx].cross;
        cross.setScale(2);
        cross.setVisible(true);
        
        this.tweens.addCounter({
            from: 2,
            to: 1,
            duration: 150,
            onUpdate: function(tween) {
                cross.setScale(tween.getValue());
            },
        });

    }

    create() {
        this.anims.create({
            key: 'soul_bar_bg_base',
            repeat: -1,
            frames: this.anims.generateFrameNumbers('soul_bar_bg', {start: 0, end: 3}),
            frameRate: 5
        })

        let soul_bar = this.add.image(5, 10, 'soul_bar').setOrigin(0, 0)
        this.soul_fill_body = this.add.image(soul_bar.x + 33, soul_bar.y + 98, 'soul_bar_fill_body').setOrigin(0, 0);
        this.soul_fill_body.scaleX = 0;
        this.soul_fill_edge = this.add.image(this.soul_fill_body.x + this.soul_fill_body.displayWidth, this.soul_fill_body.y, 'soul_bar_fill_edge').setOrigin(0, 0);
        this.soulSprite = this.add.sprite(10, 0, 'soul3').setOrigin(0, 0);
        this.soul_bar_bg = this.add.sprite(5, 10, 'soul-bar_bg').setOrigin(0, 0);
        this.soul_bar_bg.anims.play('soul_bar_bg_base');
        this.soul_bar_bg.visible = false;
        this.lives = [{icon: this.add.image(160, 65, 'life'), cross: this.add.image(160, 65, 'life_x').setVisible(false)},
                      {icon: this.add.image(160 + 64, 65, 'life'), cross: this.add.image(160 + 64, 65, 'life_x').setVisible(false)},
                      {icon: this.add.image(160 + 128, 65, 'life'), cross: this.add.image(160 + 128, 65, 'life_x').setVisible(false)}]
        soul_bar.setDepth(0.5)
        this.soulSprite.setDepth(0.6);
        //soul_bar.setAlpha(0);
        this.updateSoulBar();

        console.log('sup from gui')
        let info = this.add.text(200, 115, '5 / 10', {font: '32px consolas', strokeThickness: 5, stroke: '#000000'});
        let mainScene = this.scene.get('MainScene');


        mainScene.events.on('updateSoulBar', function(val, duration=300) {
            console.log('set Score bar to', val);
            let easeMode = val > this.souls ? 'Back' : 'linear';
            this.souls = val;
            info.setText(this.souls + ' / ' + this.soulCapacity);
            this.updateSoulBar(easeMode, duration);
        }, this);

        mainScene.events.on('addKill', function() {
            this.score += 1;
            this.souls = Math.min(this.souls + 1, this.soulCapacity);
            info.setText(this.souls + ' / ' + this.soulCapacity);
            this.updateSoulBar();
        }, this);

        mainScene.events.on('soulGained', function() {
        }, this);

        mainScene.events.on('setLives', function(lives) {
            let i = 0;
            for(; i < lives; i++) {
                this.lives[i].cross.setVisible(false);
            }            
            for(; i < 3; i++) {
                if(!this.lives[i].cross.visible) {
                    this.removeLife(i);
                    // this.lives[i].cross.setVisible(true);
                }
            }
        }, this);


    }
} 