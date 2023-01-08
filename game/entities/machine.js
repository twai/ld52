class Machine {
    constructor(parentScene, minigame) {
        this.parent = parentScene;
        this.testTube = new TestTube(parentScene);
        this.minigame = minigame;
    }

    create(x, y, fill) {
        console.log('creating machine')
        this.testTube.create(x, y, fill);
        this.monitors = [this.parent.physics.add.staticSprite(x-91,y,'status_monitor'), this.parent.physics.add.staticSprite(x+91,y,'status_monitor')]
        var machineSprite = this.parent.physics.add.staticSprite(x, y, 'machine')
        this.monitors.forEach(screen => screen.setScale(0.5));
        this.status = 'status_ok';
        this.monitors.forEach(screen => screen.anims.play(this.status));
        
        // warnScreen.setScale(0.5);
        machineSprite.setScale(0.5, 0.5);
        machineSprite.body.setSize(325, 195)
        machineSprite.body.setOffset(160, 230);
        this.machineSprite = machineSprite;
        this.powered = true;
        this.hatPower = [true, true, true, true];
        this.stalling = false;
        this.pleaseStall = false;

    }

    createCollider(player) {
        this.parent.physics.add.collider(player, this.machineSprite);
        this.addHats();
    }

    update(time, dt, powerDrain) {
        this.testTube.update(time, dt, powerDrain);

        // if(this.pleaseStall) {
        //     this.pleaseStall = false;
        //     this.stalling = true;
        //     this.stallingTimestamp = time;
        //     this.monitors.forEach(screen => screen.anims.play('status_loading'));
        //     this.status = 'status_loading'
        // }

        // if(this.stalling) {
        //     if(time - this.stallingTimestamp > 1000) {
        //         console.log('done stalling')
        //         console.log(`${time} - ${this.stallingTimestamp} = ${time - this.stallingTimestamp}`)
        //         this.stalling = false;
        //     }
        //     else {
        //         return;
        //     }
        // }

        if(this.stalling) {
            return;
        }

        if(this.testTube.getStatus() !== this.status) {
            this.status = this.testTube.getStatus();
            this.monitors.forEach(screen => screen.anims.play(this.status));
            if(this.testTube.empty()) {
                this.hats.forEach(marker => marker.setFillStyle(0xFF4E4E));
                this.parent.onMachinePoweredDown();
            }
        }

        if(this.testTube.empty()) {
            return;
        }        

        if(this.parent.cursors.space.isDown) {
            let hat = this.overlappedHat(this.parent.player);
            if(hat > 0) {
                console.log(this.status);
                this.parent.scene.pause();
                this.parent.scene.setVisible(false);
                this.parent.scene.launch(this.getMinigame(), {difficultyLevel: hat, mainScene: this.parent, finalCb: (success) => {
                    if(success) {
                        this.testTube.addFuel(hat * 0.1);
                    }
                    this.stall();
                }});
            }
        }
        
    }

    addHats() {
        var x = 150;
        var y = 100;
        var c = this.parent.add.container(this.machineSprite.x -155, this.machineSprite.y + 90);
        this.hats = []
        for(let i = 0; i < 4; i++) {
            let _x = x + 320 * i;
            let _y = y;
            c.add(this.parent.add.image(_x, _y, 'hat'));
            let marker = this.parent.add.rectangle(_x, _y+4, 64, 24, 0x1DF795).setVisible(true);
            marker.setFillStyle(0x1DF795);
            this.parent.physics.add.existing(marker);
            this.hats.push(marker);
            c.add(marker);
        }
        c.setScale(0.25);
    }

    overlappedHat(player) {
        for(let i = 0; i < 4; i++) {
            if(this.parent.physics.overlap(this.hats[i], player)){
                return i+1;
            }
        }
        return 0;
    }

    getMinigame() {
        return this.minigame;
    }

    stall(time) {
        this.stalling = true;
        this.stallingTimestamp = time;
        this.status = 'status_loading';
        this.monitors.forEach(screen => screen.anims.play('status_loading'));
        this.parent.time.addEvent({
            delay: 1500,
            callback: () => {
                this.stalling = false;
            }
        })
    }
    
    isPowered() {
        return !this.testTube.empty();
    }
}