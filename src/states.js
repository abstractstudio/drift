goog.require("engine.State");
goog.require("engine.Transition");
goog.provide("drift.MenuState");
goog.provide("drift.PlayState");
//goog.provide("drift.MenuPlayTransition");

class MenuState extends State {
    
    start() {
        var canvas = this.engine.canvas;
        var boat = this.entities.get("boat");
        boat.transform.position.x = canvas.width / 2;
        boat.transform.position.y = 3 * canvas.height / 4;
        boat.particles();
        this.game.backgroundRate = 0.2;
    }
    
    update(delta) {
        if (this.input.keyboard[KEY.SPACE]) this.states.go("play");
        this.entities.get("water").update(delta);
        this.entities.get("boat").update(delta);
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


