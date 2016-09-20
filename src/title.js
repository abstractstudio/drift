goog.require("engine.Sprite");
goog.provide("drift.Title");

class Title extends Sprite {

    constructor(engine) {
        super(engine);
        this.counter = 0;
        this.height = 0;
    }

    update(delta) {
        this.counter += delta / 200;
        this.height = 5 * Math.sin(this.counter);
    }
    
    render(context, canvas) {
        cx = canvas.width / 2;
        cy = canvas.height / 2;       
        context.textAlign = "center";         
        context.fillStyle = "black";
        context.font = "20px Arcade";
        context.fillText("Chincoteague Drift", cx, cy*0.5 + this.height);
        context.font = "12px Arcade";
        context.fillText("Created by Abstract Studio", cx, cy*0.5 + 20 + this.height);
    }

}
