goog.require("engine.Entity2D")
goog.provide("drift.Title");
goog.provide("drift.Water");

class Title extends Entity2D {

    constructor(engine) {
        super(engine);
        this.transform.x = canvas.width / 2;
        this.transform.y = 120;
    }
    
    render(context, canvas) {
        context.textAlign = "center";         
        context.fillStyle = "black";
        context.font = "20px Arcade";
        context.fillText("CHINCOTEAGUE DRIFT", this.transform.x, this.transform.y);
        context.font = "12px Arcade";
        context.fillText("Created by Abstract Studio", this.transform.x, this.transform.y + 20);
        if (Math.floor(Date.now() / 500) % 2 == 0) {
            context.font = "12px Arcade";
            context.fillText("PRESS SPACE TO START", canvas.width/2, canvas.height - 120);
        }
    }

}

class Water {
    
    constructor(engine) {
        this.engine = engine;
        this.image = null;
        this.scroll = 0;
    }
    
    update(delta) {
        var b = this.engine.game.backgroundRate.get();
        var g = this.engine.game.globalRate.get();
        var h = this.engine.canvas.height;
        //this.scroll = (this.scroll + b * (false ? g : 1) * delta/8) % h;
    }
    
    render(context) {
        if (this.image == null) return;
        var h1 = this.engine.canvas.height - this.scroll
        var h2 = this.scroll;
        var w = this.engine.canvas.width;
        var bgir = this.engine.game.backgroundImageRatio.get();
        context.drawImage(this.image, 0, 0, w / bgir, h1 / bgir, 0, this.scroll, w, h1);
        if (h2) context.drawImage(this.image, 0, h1 / bgir, w / bgir, h2 / bgir, 0, 0, w, h2);
    }
        
}