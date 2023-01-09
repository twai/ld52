function createSpawnPoint(scene, x, y, frequency = 1000, offset=0) {
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
            return;
        }
        this.updateCtr += dt;

        if(this.updateCtr > this.frequency) {
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
        this.sprite.anims.play('spawner_reopen')
        this.updateCtr = Math.max(0, this.frequency - 1000);
    }

    spawnPoint.sprite.parent = spawnPoint;
    scene.spawnerGroup.add(spawnPoint.sprite);

    return;
}