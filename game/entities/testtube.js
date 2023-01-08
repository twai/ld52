class TestTube {
    constructor(parentScene) {
        this.parent = parentScene;
    }

    create(x, y, fill) {
        console.log('creating testtube')
        this.container = this.parent.add.container(x || 0, y || 0);
        this.rect = this.parent.add.rectangle(-0, 402, 256, 768, 0xFFAEF7);
        this.rect.setOrigin(0.5, 1);
        this.fuel = fill;
        
        //var waveSprite = this.parent.add.image(0, 384, 'waves')
        var waveSprite = this.parent.physics.add.sprite(0, 384, 'waves');
        waveSprite.anims.play('waves_idle');
        waveSprite.setOrigin(0.5, 1);
        this.waveSprite = waveSprite;
        var foregroundSprite = this.parent.add.image(0, 0, 'testtube');

        this.container.add(this.rect);
        this.container.add(waveSprite);
        this.container.add(foregroundSprite);
        this.container.setScale(0.25, 0.25);

        this.minFuel = -0.1;

        this.updateFuelRect();
        // this.foregroundSprite.setScale(0.25, 0.25);
        // this.waveSprite.setScale(0.25, 0.25);
    }

    update(time, dt, powerDrain) {
        console.log(powerDrain)
        this.fuel = Math.max(this.minFuel, this.fuel - (dt * (powerDrain / 1000)));
        this.updateFuelRect();
    }

    updateFuelRect() {
        this.rect.setScale(1, this.fuel);
        this.waveSprite.y = this.rect.y - this.rect.height * this.rect.scaleY + 5;
    }

    addFuel(amount) {
        console.log(`adding ${amount} fuel`)
        console.log('before', this.fuel)
        this.fuel = Math.min(1, this.fuel + amount);
        console.log('after', this.fuel)
        this.updateFuelRect();
    }

    empty() {
        return this.fuel <= this.minFuel;
    }

    getStatus() {
        if(this.empty()) {
            return 'status_off';
        }
        else if(this.fuel < 0.25) {
            return 'status_critical';
        }
        else if(this.fuel < 0.5) {
            return 'status_warn';
        }
        else {
            return 'status_ok';
        }
    }
}