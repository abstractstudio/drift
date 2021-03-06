goog.require("engine.Engine");
goog.provide("drift.Background");

/** Scrolling background image. */
class Background {
    
    constructor(engine) {
        
        /* Engine. */
        this.engine = engine;

        /* Image and other data. */
        this.image = null;
        this.scroll = 0;

    }
    
    /** Update the background image. */
    update(delta) {
        var b = this.engine.game.backgroundRate.get();
        var g = this.engine.game.globalRate.get();
        var h = this.engine.canvas.height;
        var s = this.engine.state == MENU;
        this.scroll = (this.scroll + b * (s ? g : 1) * delta/8) % h;
    }
    
    /** Render the background image. */
    render(context) {
        if (this.image == null) return;
        var h1 = this.engine.canvas.height - this.scroll
        var h2 = this.scroll;
        var w = this.engine.canvas.width;
        var bgir = this.engine.game.backgroundImageRatio.get();
        context.drawImage(this.image, 0, 0, w / bgir, h1 / bgir, 0, this.scroll, w, h1);
        if (h2) context.drawImage(this.image, 0, h1 / bgir, w / bgir, h2 / bgir, 0, 0, w, h2);
    }
        
}
