goog.require("engine.State");
goog.require("engine.Transition");
goog.provide("drift.MenuState");
goog.provide("drift.PlayState");
goog.provide("drift.PauseState");
goog.provide("drift.GameOverState");
//goog.provide("drift.MenuPlayTransition");

function inside(v, l, r, b, t) {
    return l <= v.x && v.x <= r && b <= v.y && v.y <= t;
}


class MenuState extends State {
    
    start() {
        var canvas = this.engine.canvas;
        var boat = this.entities.get("boat");
        boat.transform.position.x = canvas.width / 2;
        boat.transform.position.y = 3 * canvas.height / 4;
        boat.reset();
        this.game.speed = this.game.targetSpeed = 0.2;
    }
    
    update(delta) {
        if (this.input.keyboard[KEY.SPACE]) this.states.go("play");
        this.entities.get("water").update(delta);
        this.entities.get("boat").update(delta);
        if (this.input.mouse[MOUSE.LEFT] == BUTTON.PRESSED) {
            if (inside(this.input.mouse, this.engine.canvas.width - 100, this.engine.canvas.width, 0, 30)) {
                var m = this.game.mode;
                var ms = this.game.modes;
                this.game.mode = ms[(ms.indexOf(m) + 1) % ms.length];
                console.log(this.game.mode);
            }
        }
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
        this.game.targetSpeed = this.game.speeds[this.game.mode];
        this.game.boatRotationSpeed = this.game.boatRotationSpeeds[this.game.mode];
        this.game.boatAcceleration = this.game.boatAccelerations[this.game.mode];
        var boat = this.entities.get("boat");
        boat.wake.intensity = this.game.wakeIntensities[this.game.mode];
        
    }
    
    update(delta) {
        this.game.update(delta);
        
        var boat = this.entities.get("boat");
        var keyboard = this.input.keyboard;
        
        if (keyboard[KEY.ESCAPE] == BUTTON.PRESSED) {
            this.states.go("pause");
            return;
        }
        
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
        boat.update(delta);
        
        this.engine.game.score += delta/500;
        this.entities.get("water").update(delta);
       
        var obstacles = this.entities.get("obstacles");
        for (var i = 0; i < obstacles.length; i++) {
            obstacles[i].update(delta);
            if (boat.collider.collides(obstacles[i].collider)) {
                boat.die();
            }
        }
        
        if (boat.dead) {
            this.states.go("gameover");
        }
    }
    
    render(context, canvas) {
        this.entities.get("water").render(context, canvas);
        this.entities.get("boat").render(context, canvas);
        var obstacles = this.entities.get("obstacles");
        for (var i = 0; i < obstacles.length; i++)
            obstacles[i].render(context, canvas);
        context.textBaseline = "top";
        context.textAlign = "center";
        context.font = "24px Arcade";
        context.fillText(Math.floor(this.game.score), canvas.width/2, 40);
    }
       
}

class PauseState extends PlayState {
    
    update(delta) {
        if (this.input.keyboard[KEY.ESCAPE] == BUTTON.PRESSED) {
            this.states.go("play");
        }
    }
    
    render(context, canvas) {
        super.render(context, canvas);
        context.textAlign = "center";
        context.font = "12px Arcade";
        context.fillText("PRESS ESCAPE TO CONTINUE", canvas.width/2, canvas.height/2);
    }
    
}


class GameOverState extends PlayState {
    
    start() {
        // Do nothing
    }
    
    update(delta) {
        if (this.input.keyboard[KEY.SPACE] == BUTTON.PRESSED) {
            this.states.go("play");
        }
    }
    
    render(context, canvas) {
        super.render(context, canvas);
        context.textAlign = "center";
        context.font = "12px Arcade";
        context.fillText("PRESS SPACE TO PLAY AGAIN", canvas.width/2, canvas.height/2);
    }
    
    stop() {
        var boat = this.entities.get("boat");
        boat.transform.position.x = canvas.width / 2;
        boat.transform.position.y = 3 * canvas.height / 4;
        boat.wake.kill();
        boat.reset();
        this.game.score = 0;

        var obstacles = this.entities.get("obstacles");
        for (var i = 0; i < this.game.difficulty; i++) {
            obstacles[i] = new Obstacle(this.engine, obstacles[i].renderable);
        }
    }
    
}