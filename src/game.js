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
    
    increment(value) { this.set(this.value + value); }
    
}

class Game {
    
    constructor() {
        
        this.globalRate = new Property(1);
        this.targetGlobalRate = new Property(1)
        this.backgroundRate = new Property(1);
        this.boatRate = new Property(1);
        this.obstacleRate = new Property(1);
        
        this.backgroundImageRatio = new Property(6);
        
        this.boatHorizontalAcceleration = new Property(0.03);
        this.boatRotationalAcceleration = new Property(0.04);
        
        this.difficulty = new Property(10);
        this.score = new Property(0);
        this.boost = new Property(100);
        
        this.lastSkillBonus = new Property(0);
        this.skillBonusCount = new Property(0);
        
        this.showDisplay = new Property(true);
        
    }
    
    update(delta) {
        
        /* Interpolate to target rate. */
        var g = this.globalRate.get();
        var t = this.targetGlobalRate.get();
        if (g > t) this.globalRate.set(Math.max(t, g-delta/16*0.05));
        else if (g < t) this.globalRate.set(Math.min(t, g+delta/16*0.05));
        
    }
    
}