function createPortal(scene, x, y) {
    let portal = scene.add.sprite(x, y, 'portal');
    portal.anims.play('portal_open')
}