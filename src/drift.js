goog.require("engine.Engine2D");
goog.require("drift.MenuState");
goog.require("drift.Title");


class Drift extends Engine2D {

    setup() {
        this.states.add("menu", MenuState);
        this.states.goto("menu");
    }
    
    load() {
        this.entities.add("title", new Title());
    }
    
    prerender(context, canvas) {
        this.state.render(context, canvas);
    }
    
    postrender(context, canvas) {
        this.state.render(context, canvas);
    }
    
    update(delta) {
        
    }
    
}

var drift;
window.onload = function() {
    drift = new Drift(document.getElementById("canvas"));
    drift.main();
}
