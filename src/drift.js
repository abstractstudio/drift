goog.require("engine.Engine2D");
goog.require("drift.MenuState");
goog.require("drift.Title");


class Drift extends Engine2D {

    setup() {
        this.game = new Game();
        this.states.add("menu", MenuState);
        this.states.goto("menu");
        this.assets.queue("water", IMAGE, "assets/water.png");
        this.assets.queue("boat", ANIMATION, "assets/boat.png", {columns: 3});
    }
    
    load() {
        this.entities.add("title", new Title(this));
        var water = new Water(this);
        water.renderable = this.assets.get("water");
        this.entities.add("water", water);
        var boat = new Boat(this);
        boat.renderable = this.assets.get("boat")
        this.entities.add("boat", boat);
    }
    
    render(context, canvas) {
        this.state.render(context, canvas);
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
