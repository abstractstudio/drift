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
        
        this.boatAcceleration = 0.03;
        this.boatRotationSpeed = 0.005;
        
        this.obstacleSpeed = 1.0;
        
        this.difficulty = 10;
        this.score = 0;
        this.boost = 100;
        
        this.lastSkillBonus = 0;
        this.skillBonusCount = 0;
        
        this.showDisplay = true;
        
        this.boostDepletion = 1/8;
        
        this.mode = "NORMAL";
        this.modes = ["NORMAL", "FAST"];
        
        this.boatRotationSpeeds = {NORMAL: 0.005, FAST: 0.007};
        this.boatAccelerations = {NORMAL: 0.03, FAST: 0.04};
        this.wakeIntensities = {NORMAL: 0.015, FAST: 0.1};
        this.speeds = {NORMAL: 1, FAST: 2.5};
        
    }
    
    update(delta) {
        
        /* Interpolate to target rate. */
        var g = this.speed;
        var t = this.targetSpeed;
        if (g > t) this.speed = Math.max(t, g-delta/16*0.02);
        else if (g < t) this.speed = Math.min(t, g+delta/16*0.02);
        
    }
    
}