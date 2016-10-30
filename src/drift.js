goog.require("engine.Engine2D");
goog.require("drift.MenuState");
goog.require("drift.PlayState");
//goog.require("drift.MenuPlayTransition");
goog.require("drift.Title");


class Drift extends Engine2D {

    setup() {
        this.game = new Game();
        this.states.add("menu", MenuState);
        this.states.add("play", PlayState);
        this.states.add("pause", PauseState);
        this.states.add("gameover", GameOverState);
        this.states.link("menu", "play"); //, MenuPlayTransition);
        this.states.link("play", "pause"); //, MenuPlayTransition);
        this.states.link("pause", "play"); //, MenuPlayTransition);
        this.states.link("play", "gameover");
        this.states.link("gameover", "play");
        this.assets.queue("water", IMAGE, "assets/water.png");
        this.assets.queue("boat", ANIMATION, "assets/boat.png", {frameIndex: 1, columns: 3});
        this.assets.queue("obstacles", ANIMATION, "assets/obstacles2.png", {rows: 2, columns: 3});
        var that = this;
        window.addEventListener("blur", function() { 
            if (that.states.current == "play") 
                that.states.go("pause"); 
        });
    }
    
    load() {
        this.entities.add("title", new Title(this));
        var water = new Water(this);
        water.renderable = this.assets.get("water");
        this.entities.add("water", water);
        var boat = new Boat(this);
        boat.renderable = this.assets.get("boat");
        boat.particles();
        boat.reset();
        this.entities.add("boat", boat);
        var obstacles = [];
        this.entities.add("obstacles", obstacles);
        for (var i = 0; i < this.game.difficulty; i++)
            obstacles[i] = new Obstacle(this, this.assets.get("obstacles").copy());
        this.states.go("menu");
    }
    
    render(context, canvas) {
        this.state.render(context, canvas);
        context.font = "12px Arcade";
        context.textAlign = "left";         
        context.textBaseline = "top";
        context.fillText(60 /*Math.floor(this.fps())*/, 10, 10);
        context.textAlign = "right";
        context.fillText(this.game.mode, canvas.width-10, 10);
    }
    
    update(delta) {
        this.state.update(delta);
    }
    
}

var drift;
window.onload = function() {
    drift = new Drift(document.getElementById("canvas"));
    drift.main();
}
