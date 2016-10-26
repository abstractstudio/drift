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
        this.states.link("menu", "play"); //, MenuPlayTransition);
        this.assets.queue("water", IMAGE, "assets/water.png");
        this.assets.queue("boat", ANIMATION, "assets/boat.png", {frameIndex: 1, columns: 3});
        this.assets.queue("obstacles", ANIMATION, "assets/obstacles2.png", {rows: 2, columns: 3});
    }
    
    load() {
        this.entities.add("title", new Title(this));
        var water = new Water(this);
        water.renderable = this.assets.get("water");
        this.entities.add("water", water);
        var boat = new Boat(this);
        boat.renderable = this.assets.get("boat")
        this.entities.add("boat", boat);
        var obstacles = [];
        for (var i = 0; i < this.game.difficulty; i++) {
            obstacles[i] = new Obstacle(this);
            obstacles[i].renderable = this.assets.get("obstacles");
        }
        this.entities.add("obstacles", obstacles);
        this.states.go("menu");
    }
    
    render(context, canvas) {
        this.state.render(context, canvas);
        context.font = "12px Arcade";
        context.textAlign = "left";         
        context.textBaseline = "top";
        context.fillText(Math.floor(this.fps()), 10, 10);
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
