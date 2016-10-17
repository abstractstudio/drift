goog.require("engine.State");
goog.require("engine.Transition");
goog.provide("drift.MenuState");

class MenuState extends State {
    
    start() {
        this.game.backgroundRate.set(0.2);
    }
    
    update(delta) {
        this.entities.get("water").update(delta);
    }
    
    render(context, canvas) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        this.entities.get("water").render(context, canvas);
        this.entities.get("title").render(context, canvas);
        this.entities.get("boat").render(context, canvas);
    }
    
    stop() {
        
    }
    
}
