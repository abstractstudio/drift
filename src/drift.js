goog.require("engine.Engine");
goog.require("drift.Boat");
goog.require("drift.Obstacle");
goog.require("drift.Projectile");
goog.require("drift.Title");
goog.require("drift.Background");
goog.require("drift.Game");

goog.provide("drift.Drift");

/** The Drift game.

Here lies the core drift runtime. The following is an approximate state map for
the actual game.

LOAD -> MENU -> PLAY -> STOP -> DEAD -> PLAY <-



*/


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
        this.messages = [];
        this.title = new Title(this);
        
        
        this.background = new Background(this);
        this.boat = new Boat(this);
        this.obstacles = [];
        for (var i = 0; i < this.game.difficulty.get(); i++) 
            this.obstacles[i] = new Obstacle(this);
        
    }
    

    /** Setup the engine. */
    setup() {
        
        /* Queue resources. */
        this.queueAsset("boat", ANIMATION, "assets/boat.png", {columns: 3});
        this.queueAsset("obstacles", ANIMATION, "assets/obstacles2.png", {rows: 2, columns: 3}); //
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
		this.context.fontFamily = "Bit";
        
    }
    
    load() {
            
        /* Assign resources. */
        this.background.image = this.getAsset("water");
        this.boat.setRenderable(this.getAsset("boat"));
        this.heartImage = this.getAsset("heart");
        for (var i = 0; i < this.game.difficulty.get(); i++) 
            this.obstacles[i].setRenderable(this.getAsset("obstacles"));

        /*that.manager.$("running").volume = 0.02;
        that.playlist.push(that.manager.$("running"));
        that.manager.$("romance").volume = 0.04;
        that.playlist.push(that.manager.$("romance"));*/
                
        /* Set up menu. */
        this.menu();
        
    }
    
    /** Go to the menu. */
    menu() {
        
        this.state = MENU;

        this.boat.reset();
        
        this.game.backgroundRate.set(0.1);
        this.game.globalRate.set(0);
        this.game.targetGlobalRate.set(0);
        
    }
    
    /** Play the game. */
    play() {
        this.state = PLAY;
        this.boat.reset();
        for (var i = 0; i < this.game.difficulty.get(); i++) 
            this.obstacles[i].respawn();
        
        this.game.targetGlobalRate.set(1);
        this.game.score.reset();
        this.game.boost.reset();
    }
    
    /** Replay. */
    replay() {
        this.play();
        this.game.skillBonusCount.reset();
    }
    
    /** Pause the engine. */
    stop() {
        this.state = STOP;
    }
    
    /** Once a round is over. */
    dead() {
        this.state = DEAD;
        this.game.targetGlobalRate.set(0);
    }
	
	/** Display. */
    display() {
        this.context.font = "16px Bit";
		this.context.textBaseline = "hanging";
		this.context.textAlign = "right";
		this.context.fillText(Math.floor(this.game.score.get()), this.canvas.width-10, 10);
		this.context.textAlign = "center";
        this.context.fillText("BOOST: " + Math.max(0, Math.floor(this.game.boost.get())), this.canvas.width/2, 10);
		for (var i = 0; i < this.messages.length; i++) 
            this.context.fillText(this.messages[i], this.canvas.width/2, this.canvas.height/2+20*i);
        this.context.textBaseline = "bottom";
        this.context.textAlign = "right";
        this.context.fillText("!", this.canvas.width-10, this.canvas.height-10);
        this.context.textAlign = "left";
        this.context.fillText("~", 10, this.canvas.height - 10);
    }
	
	/** Leave a text message hanging on screen for a set amount of time. */
	message(text, time) {
        var that = this;
		var obj = new String(text);
		this.messages.push(obj);
		setTimeout(function() { that.messages.splice(that.messages.indexOf(obj), 1); }, time);
	}
    
    /* Check if a sprite and an obstacle are colliding. */
	colliding(obstacle, sprite, isBoat) {
        var bbox = sprite.bbox();
		
        /* Get boat center position. */
		var bcx = sprite.pos.x;
		var bcy = sprite.pos.y;

        /* Get top left and copy. */
		var bx = bbox[0];
		var by = bbox[1];
		var brx = bx;
		var bry = by;
		
		/* Get boat size. */
		var bw = bbox[2];
		var bh = bbox[3];
		
        /* Get obstacle top left. */
		var ocx = obstacle.pos.x;
		var ocy = obstacle.pos.y;
		
		/* Rotate circle's center point back. */
		var cux = Math.cos(sprite.rot) * (ocx-bcx) - Math.sin(sprite.rot) * (ocy-bcy) + bcx;
		var cuy = Math.sin(sprite.rot) * (ocx-bcx) + Math.cos(sprite.rot) * (ocy-bcy) + bcy;

		/* Closest point in the rectangle to the center of circle rotated backwards (unrotated). */
		var cx, cy;

		/* Find the unrotated closest x point from center of unrotated circle. */
		if (cux < brx) cx = brx;
		else if (cux > brx + bw) cx = brx + bw;
		else cx = cux;
	 
		/* Find the unrotated closest y point from center of unrotated circle. */
		if (cuy < bry) cy = bry;
		else if (cuy > bry + bh) cy = bry + bh;
		else cy = cuy;
	 
		/* Determine collision. */
		var distance = Math.sqrt((cx-cux)*(cx-cux)+(cy-cuy)*(cy-cuy));
        
        /* Piggy back and check skill bonus. */
        if (isBoat && Date.now() - this.game.lastSkillBonus.get() > 1500) {
            if (distance - obstacle.rad < 10) {
                this.game.lastSkillBonus.set(Date.now());
                this.game.score.increment(10);
                
                //var mode = this.cache.loveMode ? "LOVE" : "";
                var mode = "";
                this.message(mode + " BONUS +10", 1000);
                this.game.skillBonusCount.increment(1);
                
                if (this.game.skillBonusCount.get() % 5 == 0) {
                    this.game.score.increment(50);
                    this.message("SUPER " + mode + " BONUS +50", 1500);
                }
            }
        }
        
        /* Return. */
		if (distance < obstacle.rad) return true;
		return false;
	}
	
    /** Update the engine. */
    update(delta) {
        this.background.update(delta);
        this.title.update(delta);
        
        this.boat.update(delta);
        for (var i = 0; i < this.game.difficulty.get(); i++) {
            this.obstacles[i].update(delta);
            //console.log(this.obstacles[i].pos);
        }
        
        /* Move rate to target. */
        if (this.game.globalRate.get() > this.game.targetGlobalRate.get()) 
            this.game.globalRate.set(Math.max(this.game.targetGlobalRate.get(), this.game.globalRate.get()-delta/16*0.05));
        else if (this.game.globalRate.get() < this.game.targetGlobalRate.get()) 
            this.game.globalRate.set(Math.min(this.game.targetGlobalRate.get(), this.game.globalRate.get()+delta/16*0.05));
        
        /* Check start. */
        if (this.keyboard[KEY.SPACE] == BUTTON.PRESSED) {
            if (this.state == MENU) this.play();
            else if (this.state == DEAD) this.replay();
        }

        /* Boost. */
        var up = this.keyboard[KEY.UP] || this.keyboard[KEY.W];
        if (up && this.state == PLAY && this.game.boost.get() > 0) {
            this.boat.temp.boost = 0.2;
            this.game.boost.increment(-delta/16 * 2);
        } else if (this.state == PLAY) {
            this.game.boost.set(Math.min(this.game.boost.get()+0.05, 100));
        }
            
        /* Check pause. */
        if (this.keyboard[KEY.ESCAPE] == BUTTON.PRESSED) {
            if (this.state == PLAY) this.state = STOP;
            else if (this.state == STOP) this.state = PLAY;
            //console.log("Changed to state " + this.state");
        }
		
		/* Increase score. */
		if (this.state == PLAY) this.game.score.increment(this.game.globalRate.get() * delta/16 * 0.1);
		
		/* Check for collisions. */
        if (this.state == PLAY) {
            for (var i = 0; i < this.game.difficulty.get(); i++) {
                var obstacle = this.obstacles[i];
                if (!obstacle.detectCollision) continue;
                
                if (this.colliding(obstacle, this.boat, true)) {
                    this.dead();
                    break;
                }
                
                /*for (var j = 0; j < 10; j++) {
                    var laser = this.entities["laser" + j];
                    if (laser.active && this.colliding(obstacle, laser, false)) {
                        laser.active = false;
                        obstacle.autorender = false;
                        obstacle.detectCollision = false;
                    }
                }*/
            }
            
        }

    }
	
    /** Render the entire engine. */
    render(context, canvas) {
		
        /* Clear the canvas by rendering the background. */
        this.background.render(context, canvas);
        
        /* Render the boat (even if not playing). */
        this.boat.render(context, canvas);
        this.boat.renderParticles(context, null);
        
        for (var i = 0; i < this.game.difficulty.get(); i++) {
            this.obstacles[i].render(context);
        }
        
        /* Render by state. */
        switch (this.state) {
            
            /* Draw the loading screen. */
            case LOAD: 
                context.fillStyle = "white";
                context.fillRect(0, 0, canvas.width, canvas.height);
                context.fillStyle = "black";
                context.fillText("Loading...", 10, 10);
                break;
            
            case MENU: 
                this.title.render(context, canvas);
                /* Draw the title and buttons. */
                this.context.fillStyle = "black";
                this.context.textAlign = "center";
                this.context.textBaseline = "bottom";
                this.context.font = "20px Bit";
                this.context.fillText("PRESS SPACE TO START", canvas.width/2, canvas.height/3+24);

                break;
                
            case PLAY:
                
                
                break;
                
            case STOP:
                 /* Draw the title and buttons. */
                this.context.fillStyle = "black";
                this.context.textAlign = "center";
                this.context.textBaseline = "bottom";
                this.context.font = "28px Bit";
                this.context.fillText("PAUSED", canvas.width/2, canvas.height/3);
                this.context.font = "20px Bit";
                this.context.fillText("ESCAPE TO TOGGLE", canvas.width/2, canvas.height/3+30);
                break;
            
        }
        
        if (this.game.showDisplay.get()) this.display();

	}
	
}
