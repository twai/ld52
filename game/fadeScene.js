class FadeScene extends Phaser.Scene {
    constructor() {
        super({key: 'fadescene'});
    }

    preload() {
    }

    setTimerForState(state) {
        if(state === 'PRE') {
            this.timer = this.time.addEvent({
                delay: this.preDuration
            });
        }
        else if(state === 'FADEIN') {
            this.timer = this.time.addEvent({
                delay: 100,
                callback: () => {
                    var alpha = this.timer.getOverallProgress()
                    this.overlay.setAlpha(alpha)
                },
                repeat: this.fadeDuration / 100
            });
        }
        else if(state === 'PEAK') { 
            this.timer = this.time.addEvent({
                delay: this.peakDuration
            });
        }
        else if(state === 'FADEOUT') {
            this.timer = this.time.addEvent({
                delay: 100,
                callback: () => {
                    var alpha = 1 - this.timer.getOverallProgress();
                    this.overlay.setAlpha(alpha)
                },
                repeat: this.fadeDuration / 100
            });            
        }
        else { // state === 'POST'
            this.timer = this.time.addEvent({
                delay: this.postDuration
            });

        }
    }

    create(data) {
        console.log(data)
        this.data = data;
        
        if(data.image_tag !== undefined) {
            this.overlay = this.add.image(500, 300, data.image_tag);
        }
        else {
            this.overlay = this.add.rectangle(500,300, 1000, 600, data.color || 0xFFFFFF, 1);
        }
        
        if(data.style === 'FADE_IN' || data.style === 'FADE_INOUT') {
            this.overlay.setAlpha(0);
        }
        this.preDuration = data.preDuration || 1;
        this.fadeDuration = data.fadeDuration || 1;
        this.peakDuration = data.peakDuration || 1;
        this.postDuration = data.postDuration || 1;

        this.state = 'PRE';
        this.setTimerForState(this.state);
                
    }

    update(time, delta) {
        if(this.timer.getOverallProgress() >= 1) {
            if(this.state == 'PRE') {
                if(this.data.style === 'FADE_OUT') {
                    this.state = 'FADEOUT';
                }
                else {
                    this.state = 'FADEIN';
                }
                console.log(`Setting state to ${this.state}`)
                this.setTimerForState(this.state);
            }
            else if(this.state === 'FADEIN') {
                if(this.data.style === 'FADE_IN') {
                    this.state = 'POST';
                }
                else {
                    this.state = 'PEAK';
                    if(this.data.peakCb !== undefined) {
                        this.data.peakCb();
                    }
                }
                console.log(`Setting state to ${this.state}`)
                this.setTimerForState(this.state);
            }
            else if(this.state === 'PEAK') {
                this.state = 'FADEOUT';
                console.log(`Setting state to ${this.state}`)
                this.setTimerForState(this.state);                
            }
            else if(this.state === 'FADEOUT') {
                this.state = 'POST';
                console.log(`Setting state to ${this.state}`)
                this.setTimerForState(this.state);                
            }
            else {
                this.scene.stop();
                if(this.data.doneCb !== undefined) {
                    this.data.doneCb();
                }
            }
        }
    }
} 