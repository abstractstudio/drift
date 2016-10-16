goog.require("engine.State");
goog.require("engine.Transition");
goog.provide("drift.MenuState");

class MenuState extends State {
    
    start() {
        
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
