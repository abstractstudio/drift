goog.require("engine.Engine");
goog.provide("drift.Background");

/** Scrolling background image. */
class Background {
    
    constructor(engine) {
        
        /* Engine. */
        this.engine = engine;

        /* Image and other data. */
        this.image = null;
        this.ratio = 6;
        this.rate = 1 * 2;
        this.scroll = 0;
        
        /* Active. */
        this.running = true;

    }
    
    /** Update the background image. */
    update(delta) {
        if (this.running)
            this.scroll = (this.scroll + this.rate * delta/16) % this.engine.canvas.height;
    }
    
    /** Render the background image. */
    render(context) {
        if (this.image == null) return;
        var h1 = this.engine.canvas.height - this.scroll
        var h2 = this.scroll;
        var w = this.engine.canvas.width;
        context.drawImage(this.image, 0, 0, w / this.ratio, h1 / this.ratio, 0, this.scroll, w, h1);
        if (h2) context.drawImage(this.image, 0, h1 / this.ratio, w / this.ratio, h2 / this.ratio, 0, 0, w, h2);
    }
        
}
