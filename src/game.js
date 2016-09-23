goog.provide("drift.Game");

/** The game container.

The idea behind the game container is modularity in the core constants and
configuration in the game's actual runtime. This way, values can be have 
stacked modifications which can be discretely add, inserted, or removed.

*/


class Value {

    constructor(value, tag, priority) {
        this.value = value;
        this.tag = tag;
        this.priority = priority || 0;
    }

}
    
class Discrete extends Value {
    
}

class Factor extends Value {        
    
    
    
}

class Property {
    
    constructor(type, base) {
        this.type = type;
        this.base = base;
        this.stack = [];
    }
    
}

class Game {
    
    constructor() {
        
        this.globalRate = 1;
        this.backgroundRate = 1;
        this.boatRate = 1;

        this.backgroundImageRatio = 6;

        this.boatHorizontalAcceleration = 0.03;
        this.boatRotationalAcceleration = 0.04;
        
        this.difficulty = 0;
        this.score = 0;
        this.boost = 100;

        this.rate = 100;
        this.targetRate = 100;
        
    }
    
}