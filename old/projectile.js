goog.require("engine.Sprite");
goog.provide("drift.Projectile");

class Projectile extends Sprite {
    
    constructor(engine, x, y, angle, speed) {
        /* Super constructor. */
        super(engine, x || 0, y || 0, 290/8, 74/4);

        this.active = false;

        /* Movement. */
        this.rate = 1;
        this.speed = speed || 0;
        this.rot = angle || 0;

        /* Auto. */
        this.autoupdate = false;
        this.autorender = false;
    }
    
    update(delta) {
        if (!this.active) return;
        
        this.pos.x += this.speed * this.rate * delta/16.0 * Math.cos(this.rot);
        this.pos.y += this.speed * this.rate * delta/16.0 * -Math.sin(this.rot);
        
        // Check if off-screen
        if (this.pos.x + this.width < 0 || this.pos.y + this.height < 0 || this.pos.x - this.width > 600 || this.pos.y - this.height > 690) {
            this.active = false;
        }
    }

    bbox() {
        var tl = this.topLeft();
		return [tl.x, tl.y, this.width, this.height];
    }
    
}
