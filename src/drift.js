goog.require("engine.Engine");
goog.require("drift.Boat");
goog.require("drift.Obstacle");
goog.require("drift.Projectile");
goog.require("drift.Background");
goog.provide("drift.Drift");
goog.require("drift.Game");


/* Global constants. */
const LOAD = 0;
const MENU = 1;
const PLAY = 2;
const STOP = 3;
const DEAD = 4;

/** Bound a number to a limit. */
function bound(x, b) { return Math.min(Math.max(x, b[0]), b[1]); }


/** Drift engine. */
class Drift extends Engine {
    
    constructor(canvas) {
        
        /* Super constructor. */
        super(canvas);

        /* State. */
        this.state = LOAD;
        
        /* Game objects. */
        this.game = new Game(this);
        this.background = new Background(this);
        this.boat = new Boat(this);
    
    }
    

    /** Setup the engine. */
    setup() {
        
        /* Super setup. */
        super.setup();
        

        
        /* Queue resources. */
        this.queueAsset("boat", ANIMATION, "assets/boat.png", {rows: 3});
        this.queueAsset("obstacles", IMAGE, "assets/obstacles2.png"); //
        this.queueAsset("water", IMAGE, "assets/water.png");
        this.queueAsset("laser", IMAGE, "assets/laser.png");
        this.queueAsset("heart", IMAGE, "assets/heart.png");
        this.queueAsset("running", AUDIO, "assets/running.m4a");
        this.queueAsset("romance", AUDIO, "assets/romance.mp3");
        this.queueAsset("blaster", AUDIO, "assets/blaster.m4a");
        
        /* Register click events. */
        document.addEventListener("mousedown", (e) => {
            if (this.state == PLAY || this.state == STOP) return;
            var x = this.mouse.x - that.canvas.offsetLeft + document.body.scrollLeft;
            var y = this.mouse.y - that.canvas.offsetTop + document.body.scrollTop;
        });
        
        window.onblur = () => {
            if (this.state == "PLAY") this.stop();
        };
        
        /* Mess around with the context. */
        this.context.imageSmoothingEnabled = false;
		
		/* Static context stuff. */
		this.context.fontFamily = "Bit";
        
    }
    
    load() {
            
        /* Assign resources. */
        this.background.image = this.getAsset("water");

        /* Set up menu. */
        this.menu();

    }
    
    /** Go to the menu. */
    menu() {

    }
    
    /** Play the game. */
    play() {

    }
    
    /** Replay. */
    replay() {

    }
    
    /** Pause the engine. */
    stop() {

    }
    
    /** Once a round is over. */
    dead() {

    }
	
	/** Display. */
    display() {
        
    }
	
	/** Leave a text message hanging on screen for a set amount of time. */
	message(text, time) {
		
	}
    
    /** Update the engine. */
    update(delta) {
        this.background.update(delta);
    }
	
    /* Check if a boat and an obstacle are colliding. */
	colliding(obstacle, sprite, isBoat) {
        
	}

    /** Render the entire engine. */
    render(delta) {
		
        /* Clear the canvas by rendering the background. */
        this.background.render(this.context);
        
        switch (this.state) {
                
            /* Draw the loading screen. */
            case LOAD:
                break
                
                
        }

	}
	
}
