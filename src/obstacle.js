goog.require("engine.Sprite");
goog.require("engine.Animation");
goog.provide("drift.Obstacle");

/** Generic obstacle. */
class Obstacle extends Sprite {
    
    constructor(engine) {
        /* Super constructor. */
        super(engine);

        /* Movement. */
        this.rate = 1;
        this.rad = 0;
        this.rot = 0;
        this.mov = {yv: 2};

        this.detectCollision = true;

        /* Animation. */
        this.animation = "obstacle";
        this.addAnimation(new Animation("obstacle", [0, 1, 2, 3]));

    }
	
	/** Update the obstacle. */
	update(delta) {
		if (this.engine.state != STATE.PLAY) return;
		this.pos.y += this.mov.yv * Obstacle.rate * this.engine.rate;
        if (this.pos.y > this.engine.canvas.height + this.rad && delta != 0) this.respawn();
	}
	
	/** Respawn the obstacle. */
	respawn() {
		
		/* Randomize the position and obstacle type. */
		this.randomize();
		
        for (var i = 0; i < this.engine.difficulty; i++) {
						
			/* Get the obstacle. */
			var obstacle = this.engine.obstacles[i];
			if (!obstacle) continue;
						
			/* Skip if comparing to self. */
            if (obstacle === this) continue;
						
            /* Fail and send to bottom if colliding with another or too close. */
            if (Vector.distance(this.pos, obstacle.pos) < this.rad + obstacle.rad + this.engine.entities.boat.height*Math.sqrt(this.engine.rate)*1.2) {
                this.pos.y = this.engine.canvas.height + this.rad + 1;
				break;
            }
			
        }
		
	}
	
	/** Randomize the obstacle. */
	randomize() {
        this.rad = Math.random()*10 + 10;
        this.cpos.x = this.rad;
        this.cpos.y = this.rad;
        this.width = this.height = this.rad*2;
        this.rot = Math.random() * 2 * Math.PI;
        this.pos.x = Math.random() * (this.engine.canvas.width-50) + 25;
        this.pos.y = -Math.random() * this.engine.canvas.height - this.rad;
        this.getAnimation().index = Math.floor(Math.random() * 5);
	    this.rad -= 2;
        this.detectCollision = true;
        this.autoupdate = true;
        this.autorender = true;
	}
	
}

/* Static rate. */
Obstacle.rate = 1;