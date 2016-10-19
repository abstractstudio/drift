goog.require("engine.State");
goog.require("engine.Transition");
goog.provide("drift.MenuState");
goog.provide("drift.PlayState");
goog.provide("drift.MenuPlayTransition");

class MenuState extends State {
    
    start() {
        this.game.backgroundRate.set(0.2);
    }
    
    update(delta) {
        this.entities.get("water").update(delta);
    }
    
    render(context, canvas) {
        this.entities.get("water").render(context, canvas);
        this.entities.get("title").render(context, canvas);
        this.entities.get("boat").render(context, canvas);
    }
    
    stop() {
        
    }
    
}

class PlayState extends State {

    start() {
        
    }
    
    update(delta) {
        this.entities.get("water").update(delta);
        this.entities.get("boat").update(delta);
    }
    
    render(context, canvas) {
        this.entities.get("water").render(context, canvas);
        this.entities.get("boat").render(context, canvas);
    }
       
}
