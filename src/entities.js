goog.require("engine.Entity2D");
goog.require("engine.SquareParticleSystem2D");
goog.provide("drift.Title");
goog.provide("drift.Water");
goog.provide("drift.Boat");
goog.provide("drift.Obstacle");

function bound(n, l, u) {
    return Math.min(u, Math.max(l, n));
}

class Title extends Entity2D {

    constructor(engine) {
        super();
        this.engine = engine;
        this.transform.x = canvas.width / 2;
        this.transform.y = 100;
    }
    
    render(context, canvas) {
        context.textAlign = "center";         
        context.fillStyle = "black";
        context.font = "20px Arcade";
        context.fillText("CHINCOTEAGUE DRIFT", this.transform.x, this.transform.y);
        context.font = "12px Arcade";
        context.fillText("Created by Abstract Studio", this.transform.x, this.transform.y + 30);
        if (Math.floor(Date.now() / 500) % 2 == 0) {
            context.font = "12px Arcade";
            context.fillText("PRESS SPACE TO START", canvas.width/2, this.transform.y + 80);
        }
    }

}

class Water extends Entity2D {
    
    constructor(engine) {
        super();
        this.engine = engine;
        this.scroll = 0;
    }
    
    update(delta) {
        var g = this.engine.game.speed;
        var h = this.engine.canvas.height;
        this.scroll = (this.scroll + g * delta/8) % h;
    }
    
    render(context, canvas) {
        if (this.renderable == null) return;
        var h1 = canvas.height - this.scroll;
        var h2 = this.scroll + 1;
        var w = canvas.width;
        var bgir = this.engine.game.backgroundImageScale;
        context.drawImage(this.renderable, 0, 0, w / bgir, h1 / bgir, 0, this.scroll, w, h1);
        if (h2) context.drawImage(this.renderable, 0, h1 / bgir, w / bgir, h2 / bgir, 0, 0, w, h2);
    }

}

class Obstacle extends Entity2D {
    
    constructor(engine) {
        super();
        this.engine = engine;
        
        /* Movement. */
        this.radius = 0;
        this.yv = 2;
        
        /* Identification. */
        this.obstacleNumber = Math.floor(Math.random() * 5);
        
        this.randomize();
    }
    
    /** Respawn the obstacle. */
	respawn() {
		/* Randomize the position and obstacle type. */
		this.randomize();
        
		var obstacles = this.engine.entities.get("obstacles");
        for (var i = 0; i < obstacles.length; i++) {	
			/* Get the obstacle. */
			var obstacle = obstacles[i];
			if (!obstacle) continue;
						
			/* Skip if comparing to self. */
            if (obstacle === this) continue;
						
            /* Fail and send to bottom if colliding with another or too close. */
            if (Vector2D.distance(this.transform.position, obstacle.transform.position) < this.radius + obstacle.radius + this.engine.entities.get("boat").height * Math.sqrt(this.engine.game.speed*1.2)) {
                this.transform.y = this.engine.canvas.height + this.radius + 1;
				break;
            }
			
        }
		
	}
	
	/** Randomize the obstacle. */
	randomize() {
        this.radius = Math.random()*10 + 20;
        this.width = this.height = this.radius*2;
        this.transform.r = Math.random() * 2 * Math.PI;
        this.transform.x = Math.random() * (this.engine.canvas.width-50) + 25;
        this.transform.y = -Math.random() * this.engine.canvas.height - this.radius;
        this.obstacleNumber = Math.floor(Math.random() * 5);
	    this.radius -= 2;
	}
    
    update(delta) {
        this.transform.y += this.yv * this.engine.game.obstacleSpeed * this.engine.game.speed * delta/16;
        if (this.transform.y > this.engine.canvas.height + this.radius && delta != 0) this.respawn();
    }
    
    render(context, canvas) {
        if (this.renderable == null) return;
        this.renderable.frame(this.obstacleNumber);
        
        context.save();
        context.translate(this.transform.x, this.transform.y);
        context.rotate(this.transform.r);
        context.drawAnimation(this.renderable, -this.radius/2, -this.radius/2, this.radius, this.radius);
        context.restore();
    }
}

class Boat extends Entity2D {
    
    constructor(engine) {
        super();
        this.engine = engine;
        this.v = 0;
    }
    
    particles() {
        this.wake = new WakeParticleSystem(this);
        this.wake.start();
    }
    
    update(delta) {
        this.wake.update(delta);
    }
    
    render(context, canvas) {
        if (this.renderable == null) return;
        this.wake.render(context, canvas);
        var w = this.renderable.width;
        var h = this.renderable.height;
        var s = this.engine.game.foregroundImageScale;
        context.save();
        context.translate(this.transform.x, this.transform.y);
        context.rotate(this.transform.r);
        context.drawAnimation(this.renderable, -w*s/2, -h*s/2, w * s, h * s);
        context.restore();
    }
    
    turn(delta) {
        var r = this.engine.game.boatRotationalAcceleration * this.engine.game.speed * delta/16;
        this.transform.r = Math.max(-Math.PI/6, Math.min(this.transform.r+r, Math.PI/3));
    }
    
    move(delta) {
        var a = this.engine.game.boatHorizontalAcceleration;
        this.v = bound(this.v+Math.sin(this.transform.r)*a, -1.5, 1.5);
        //this.v -= Math.sin(this.rot) * (this.temp.boost || 0);
        var m = this.v * this.engine.game.speed * delta/16;
        this.transform.x = bound(this.transform.x+m, 30, this.engine.canvas.width - 30);
        if (this.transform.x == 30 || this.transform.x == this.engine.canvas.width - 30) 
            this.v = 0;
    }
    
}

class WakeParticle extends SquareParticle2D { 
    
    update(delta) {
        super.update(delta);
        this.velocity.y += this.system.intensity;
    }
    
}

class WakeParticleSystem extends SquareParticleSystem2D {
    
    constructor(boat) {
        super(400, 100, WakeParticle.prototype.constructor);
        this.boat = boat;
        
        this.intensity = 0.001;
        
        this.transform.position = this.boat.transform.position.copy()
        this.positionVariation = new Vector2D(15, 10);
        this.transform.rotation = this.boat.transform.rotation - 3*Math.PI/2;
        this.rotationVariation = 0.2 * Math.PI;
        
        this.baseSpeed = 0.5;
        this.speedVariation = 0;
        this.baseLife = 2000;
        this.lifeVariation = 0;
        
        this.baseLength = 5;
        this.baseLengthVariation = 0.25;
        this.endLength = 3;
        this.endLengthVariation = 1;
        
        this.baseColor = [133, 193, 233, 128];
        this.baseColorVariation = [10, 5, 0, 0];
        this.endColor = [163, 233, 255, 0];
    }
    
    update(delta) {
        super.update(delta);
        var r = this.boat.transform.r - 3*Math.PI/2;
        this.transform.x = this.boat.transform.x + 30 * Math.cos(r);
        this.transform.y = this.boat.transform.y + 30 * Math.sin(r);
        this.transform.rotation = r;
    }
    
}