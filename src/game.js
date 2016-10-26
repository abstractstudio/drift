goog.require("engine.EventInterface")
goog.provide("drift.Game");

/** The game container.

The idea behind the game container is modularity in the core constants and
configuration in the game's actual runtime. This way, values can be have 
stacked modifications which can be discretely add, inserted, or removed.

*/

class Game {
    
    constructor() {
        
        this.speed = 1.0;
        this.targetSpeed = 1.0;
        
        this.backgroundImageScale = 6;
        this.foregroundImageScale = 2.4;
        
        this.boatHorizontalAcceleration = 0.03;
        this.boatRotationalAcceleration = 0.005;
        
        this.obstacleSpeed = 1.0;
        
        this.difficulty = 10;
        this.score = 0;
        this.boost = 100;
        
        this.lastSkillBonus = 0;
        this.skillBonusCount = 0;
        
        this.showDisplay = true;
        
        this.boostDepletion = 1/8;
        
    }
    
    update(delta) {
        
        /* Interpolate to target rate. */
        var g = this.speed;
        var t = this.targetSpeed;
        if (g > t) this.speed = Math.max(t, g-delta/16*0.02);
        else if (g < t) this.speed = Math.min(t, g+delta/16*0.02);
        
    }
    
}