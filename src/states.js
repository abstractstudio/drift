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
        boat.transform.position.y = canvas.height / 2;
        boat.startParticles();
        this.game.backgroundRate.set(0.2);
    }
    
    update(delta) {
        if (this.input.keyboard[KEY.SPACE])
            this.startingAnimationTime = Date.now();
        if (this.startingAnimationTime) {
            var difference = Date.now() - this.startingAnimationTime;
            if (difference > 2000) this.engine.states.go("play");
            this.entities.get("boat").transform.y += 2 * Math.abs(Math.sin(Math.PI * difference / 2000));
        }
        
        this.entities.get("water").update(delta);
        this.entities.get("boat").update(delta);
    }
    
    render(context, canvas) {
        this.entities.get("water").render(context, canvas);
        if (!this.startingAnimationTime)
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


