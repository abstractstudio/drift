goog.require("engine.Entity2D");
goog.require("engine.SquareParticleSystem2D");
goog.provide("drift.Title");
goog.provide("drift.Water");

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

class Boat extends Entity2D {
    
    constructor(engine) {
        super();
        this.engine = engine;
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
