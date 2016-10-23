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
            context.fillText("PRESS SPACE TO START", canvas.width/2, canvas.height - 120);
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
        var b = this.engine.game.backgroundRate.get();
        var g = this.engine.game.globalRate.get();
        var h = this.engine.canvas.height;
        this.scroll = (this.scroll + b * (false ? g : 1) * delta/8) % h;
    }
    
    render(context, canvas) {
        if (this.renderable == null) return;
        var h1 = canvas.height - this.scroll;
        var h2 = this.scroll + 1;
        var w = canvas.width;
        var bgir = this.engine.game.backgroundImageScale.get();
        context.drawImage(this.renderable, 0, 0, w / bgir, h1 / bgir, 0, this.scroll, w, h1);
        if (h2) context.drawImage(this.renderable, 0, h1 / bgir, w / bgir, h2 / bgir, 0, 0, w, h2);
    }

}

class Boat extends Entity2D {
    
    constructor(engine) {
        super();
        this.engine = engine;
    }
    
    startParticles() {
        this.particleSystem = new BoatParticleSystem(this);
        this.particleSystem.start();
    }
    
    update(delta) {
        this.particleSystem.update(delta);
        this.particleSystem.transform.x = this.transform.x;
        this.particleSystem.transform.y = this.transform.y;
    }
    
    render(context, canvas) {
        if (this.renderable == null) return;
        
        this.particleSystem.render(context, canvas);
        
        var w = this.renderable.width;
        var h = this.renderable.height;
        var s = this.engine.game.foregroundImageScale.get();
        context.drawAnimation(this.renderable, this.transform.x - w*s/2, this.transform.y - h*s/2, w * s, h * s);
    }
    
}

class SprayParticle extends SquareParticle2D { 
    
    update(delta) {
        super.update(delta);
        this.velocity.y += 0.01;
    }
    
}

class BoatParticleSystem extends SquareParticleSystem2D {
    
    constructor(boat) {
        super(500, 1000, SprayParticle.prototype.constructor);
        this.boat = boat;
        
        this.transform.position = this.boat.transform.position.copy().add(new Vector2D(0, this.boat.renderable.height/2));
        this.positionVariation = new Vector2D(boat.renderable.width/2 + 5, 0);
        this.transform.rotation = boat.transform.rotation - 3*Math.PI/2;
        this.rotationVariation = 0.15 * Math.PI;
        
        this.baseSpeed = 0.75;
        this.speedVariation = 0;
        this.baseLife = 1300;
        this.lifeVariation = 300;
        this.positionVariation = new Vector2D(20, 0);
        
        this.baseLength = 5;
        this.baseLengthVariation = 0.25;
        this.endLength = 2;
        this.endLengthVariation = 1;
        
        this.baseColor = [133, 193, 233, 128];
        this.baseColorVariation = [10, 5, 0, 0];
        this.endColor = [163, 233, 255, 0];
    }
    
    update(delta) {
        super.update(delta);
        this.transform.x = this.boat.transform.x;
        this.transform.rotation = this.boat.transform.rotation - 3*Math.PI/2;
    }
    
}
