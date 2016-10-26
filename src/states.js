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
        this.game.speed = this.game.targetSpeed = 0.2;
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
        this.game.targetSpeed = 1;
        this.entities.get("boat").wake.intensity = 0.015;
    }
    
    update(delta) {
        this.game.update(delta);
        
        var boat = this.entities.get("boat");
        var keyboard = this.input.keyboard;
        var left = keyboard[KEY.LEFT] || keyboard[KEY.A];
        var right = keyboard[KEY.RIGHT] || keyboard[KEY.D];
        
        if (left && !right) {
            boat.turn(-delta);
            boat.renderable.frame(0);
        } else if (right && !left) {
            boat.turn(delta);
            boat.renderable.frame(2);
        } else {
            boat.renderable.frame(1);
        }
        
        boat.move(delta);
        
        this.entities.get("water").update(delta);
        this.entities.get("boat").update(delta);
        var obstacles = this.entities.get("obstacles");
        for (var i = 0; i < obstacles.length; i++) {
            obstacles[i].update(delta);
        }
    }
    
    render(context, canvas) {
        this.entities.get("water").render(context, canvas);
        this.entities.get("boat").render(context, canvas);
        var obstacles = this.entities.get("obstacles");
        for (var i = 0; i < obstacles.length; i++)
            obstacles[i].render(context, canvas);
    }
       
}


