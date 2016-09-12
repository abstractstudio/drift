goog.require("engine.Engine");
goog.require("drift.Boat");
goog.require("drift.Obstacle");

class Drift extends Engine {
    
    constructor(canvas) {
        super(canvas);
        
    }
    
    render(context, canvas) {
        
    }
    
}

window.onload = function() {
    
    var canvas = document.getElementById("canvas");
    game = new Drift(canvas);
    game.main();
    
}