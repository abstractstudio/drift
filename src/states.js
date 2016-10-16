goog.require("engine.State");
goog.require("engine.Transition");
goog.provide("drift.MenuState");

class MenuState extends State {
    
    start() {
        
    }
    
    render(context, canvas) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "black";
        context.textAlign = "center";
        context.textBaseline = "bottom";
        context.fillText("PRESS SPACE TO START", canvas.width/2, canvas.height/2);
    }
    
    stop() {
        
    }
    
}
