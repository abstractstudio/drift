goog.require("engine.EventManager")
goog.provide("drift.Game");

/** The game container.

The idea behind the game container is modularity in the core constants and
configuration in the game's actual runtime. This way, values can be have 
stacked modifications which can be discretely add, inserted, or removed.

*/

class Property extends EventManager {
    
    constructor(base) {
        super();
        this.type = typeof base;
        this.base = base;
        this.reset();
    }
    
    reset() { this.set(this.base); }
    
    set(value) { 
        this.value = value;
        this.fireEvent("set", value);
        return this.value;
    }
    
    get() { return this.value; }
    
}

class Game {
    
    constructor() {
        
        this.globalRate = new Property(0);
        this.targetGlobalRate = new Property(0)
        this.backgroundRate = new Property(0);
        this.boatRate = new Property(0);
        
        this.backgroundImageRatio = new Property(6);
        
        this.boatHorizontalAcceleration = new Property(0.03);
        this.boatRotationalAcceleration = new Property(0.04);
        
        this.difficulty = new Property(0);
        this.score = new Property(0);
        this.boost = new Property(100);
        
    }
    
}