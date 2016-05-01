/* Global constants. */
var STATE = {LOAD: 0, MENU: 1, PLAY: 2, STOP: 3, DEAD: 4};

/** Bound a number to a limit. */
function bound(x, b) { return Math.min(Math.max(x, b[0]), b[1]); }

/** Boat sprite. */
function Boat(engine) {
    
    /* Super constructor. */
    Sprite.call(this, engine);
    
    /* Movement rate. */
    this.rate = 1;
    
}


/** Drift engine. */
function Drift(canvas) {
    
    /* Super constructor. */
    Engine.call(this, canvas);
    
    /* Game objects. */
    this.entities = {};
    this.playlist = [];

    /* State. */
    this.state = STATE.LOAD;
    this.difficulty = 0;
    
    /** Setup the engine. */
    this.setup = function() {
        
        this.manager.queue()
        
        
    }
    
}
