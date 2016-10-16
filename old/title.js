goog.require("engine.Sprite");
goog.provide("drift.Title");

class Title extends Sprite {

    constructor(engine) {
        super(engine);
        this.counter = 0;
        this.height = 0;
        this.x = canvas.width / 2;
        this.y = 120;
    }
    
    render(context, canvas) {     
        context.textAlign = "center";         
        context.fillStyle = "black";
        context.font = "20px Arcade";
        context.fillText("CHINCOTEAGUE DRIFT", this.x, this.y + this.height);
        context.font = "12px Arcade";
        context.fillText("Created by Abstract Studio", this.x, this.y + 20 + this.height);
    }

}
