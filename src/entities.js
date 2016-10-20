goog.require("engine.Entity2D")
goog.require("engine.CircleParticleSystem")
goog.provide("drift.Title");
goog.provide("drift.Water");

class Title extends Entity2D {

    constructor(engine) {
        super();
        this.engine = engine;
        this.transform.x = canvas.width / 2;
        this.transform.y = 100;
        
        this.particleSystem = new CircleParticleSystem(1000);
        this.particleSystem.transform = new Transform2D(new Vector2(200, 200), 0, 1);
        this.particleSystem.posVar = new Vector2(2, 2);
        this.particleSystem.life = 10;
        this.particleSystem.speed = 1.0;
        this.particleSystem.startColor = [0, 255, 255];
    }
    
    update(delta) {
        this.particleSystem.update(delta);
        console.log(this.particleSystem._particlePool[0].transform);
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
        
        this.particleSystem.render(context, canvas);
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
    
    update(delta) {
        
    }
    
    render(context, canvas) {
        if (this.renderable == null) return;
        var w = this.renderable.width;
        var h = this.renderable.height;
        var s = this.engine.game.foregroundImageScale.get();
        context.drawAnimation(this.renderable, this.transform.x - w*s/2, this.transform.y - h*s/2, w * s, h * s);
    }
    
}
