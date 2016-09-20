goog.provide("drift.Game");

/** The game container.

The idea behind the game container is modularity in the core constants and
configuration in the game's actual runtime. This way, values can be have 
stacked modifications which can be discretely add, inserted, or removed.

*/

    
class DiscreteStack {
    
    constructor(value) {
        this.value = 0;
    }
    
}

class FactorStack {        
    
}

class Game {
    
    constructor() {
        
        this.globalRate = 1;
        this.boatHorizontalAcceleration = 0.03;
        this.boatRotationalAcceleration = 0.04;
        
    }
    
}