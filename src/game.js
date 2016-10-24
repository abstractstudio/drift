goog.require("engine.EventInterface")
goog.provide("drift.Game");

/** The game container.

The idea behind the game container is modularity in the core constants and
configuration in the game's actual runtime. This way, values can be have 
stacked modifications which can be discretely add, inserted, or removed.

*/

class Game {
    
    constructor() {
        
        this.globalRate = 1;
        this.targetGlobalRate = 1;
        this.backgroundRate = 1;
        this.boatRate = 1;
        this.obstacleRate = 1;
        
        this.backgroundImageScale = 6;
        this.foregroundImageScale = 2.4;
        
        this.boatHorizontalAcceleration = 0.03;
        this.boatRotationalAcceleration = 0.04;
        
        this.difficulty = 10;
        this.score = 0;
        this.boost = 100;
        this.gameBoatY = 500;
        
        this.lastSkillBonus = 0;
        this.skillBonusCount = 0;
        
        this.showDisplay = true;
        
        this.boostDepletion = 1/8;
        
    }
    
    update(delta) {
        
        /* Interpolate to target rate. */
        var g = this.globalRate.get();
        var t = this.targetGlobalRate.get();
        if (g > t) this.globalRate.set(Math.max(t, g-delta/16*0.05));
        else if (g < t) this.globalRate.set(Math.min(t, g+delta/16*0.05));
        
    }
    
}