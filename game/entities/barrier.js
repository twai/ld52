function createBarrier(scene, x, y, friendly=true, scaleX=1, scaleY=1) {
    var block = null;
    if(friendly) {
        block = scene.barrierGroup.create(x || 0, y || 0, 'barrier');
    }
    else {
        block = scene.darkBarrierGroup.create(x || 0, y || 0, 'dark_barrier');
    }
    block.setScale(scaleX, scaleY);
    block.refreshBody();

    block.hit = function() {
        scene.cameras.main.shake(250, 0.02, true);
        scene.sound.play('shatter')
        block.destroy();
    }

    return block;
}