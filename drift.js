var MAX_SPEED = 5;
var STATE = {MENU: 0, PLAY: 1, STOP: 2, DEAD: 3};

/** Bound a number to a lower and upper limit. */
function bound(x, b) { return Math.min(Math.max(x, b[0]), b[1]); }

/** The boat sprite. */
function Boat() {
    
    Sprite.call(this);
    
    this.rate = 1;
	
	this.pos.x = 300;
	this.pos.y = 550;
    this.v = 0;
    this.a = 0.03;

    this.rotation = 0;
	this.rv = 0.01;
    
    this.rb = [-Math.PI/2, Math.PI/2];
    this.xb = [50, 550];
    this.vb = [-1.5, 1.5];
    
    this.width = 16*3;
    this.height = 29*3;
    this.numRows = 1;
    this.numColumns = 3;
    
    this.rpos.x = this.width / 2;
    this.rpos.y = this.height / 2;
    
    this.currentAnimation = "boat";
    this.addAnimation(new Animation("boat", [0, 1, 2]));

	this.update = function(delta) {
        
        var left = keys[KEY.LEFT] || keys[KEY.A];
        var right = keys[KEY.RIGHT] || keys[KEY.D];
        
		if (left && !right) {
            this.rotation = Math.min(this.rb[1], this.rotation+this.rv*delta/16*this.rate);
            this.getCurrentAnimation().frameIndex = 0;
        } else if (right && !left) {
            this.rotation = Math.max(this.rb[0], this.rotation-this.rv*delta/16*this.rate);
            this.getCurrentAnimation().frameIndex = 2;
        } else {
            this.getCurrentAnimation().frameIndex = 1;
        }
        
        this.v += -Math.sin(this.rotation) * this.a;
        this.v = bound(this.v, this.vb);
        this.pos.x += this.v * delta/16 * this.rate;
        this.pos.x = bound(this.pos.x, this.xb);
        
        Boat.prototype.update.call(this, delta);
	}

}

/** The main game engine. */
function Drift(canvas) {
	
	Engine.call(this, canvas);
	
    this.sprites = {"boat": new Boat()};
    this.state = STATE.MENU;
    
    this.setup = function() {
        
        new Engine().setup.call(this);
        
        this.loadImages({"boat": "assets/boat3.png"});
        
        var that = this;
        document.addEventListener("mousedown", function(e) {
           
            /* Update state. */
            var x = mouse.x - that.canvas.offsetLeft;
            var y = mouse.y - that.canvas.offsetTop;
            var bbox = [200, 260, 200, 50];
            if (x > bbox[0] && x < bbox[0] + bbox[2] && y > bbox[1] && y < bbox[1]+bbox[3]) {
                that.state = STATE.PLAY;
                console.log("Shifted to play state");
            }
                        
        });
        
        this.context.imageSmoothingEnabled = false;
        
    }
    
    this.render = function(delta) {
        
        /* Clear. */
        this.context.fillStyle = "white";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        /* Draw frames per second. */
        if (this.showFPS) {
            this.context.font = "24px Verdana";
            this.context.fillStyle = "black";
            this.context.textAlign = "left";
            this.context.textBaseline = "hanging";
            this.context.fillText(Math.round(1000 / delta) + " fps", 10, 10);
        }
        
        /* If in the menu. */
        if (this.state == STATE.MENU) {
            
            /* Grab the mouse. */
            var x = mouse.x - this.canvas.offsetLeft;
            var y = mouse.y - this.canvas.offsetTop;
            
            /* Title. */
            this.context.fillStyle = "black";
            this.context.textBaseline = "hanging";
            this.context.font = "40px Verdana";
            this.context.textAlign = "center";
            this.context.fillText("Chincoteague Drift", 300, 200);
            
            /* Start. */
            var bbox = [200, 260, 200, 50];
            this.context.strokeRect(bbox[0], bbox[1], bbox[2], bbox[3]);
            if (x > bbox[0] && x < bbox[0] + bbox[2] && y > bbox[1] && y < bbox[1]+bbox[3]) this.context.fillStyle = "lightgray";
            else this.context.fillStyle = "white";
            this.context.lineWidth = 6;
            this.context.fillRect(bbox[0], bbox[1], bbox[2], bbox[3]);
            this.context.fillStyle = "black";
            this.context.font = "30px Verdana";
            this.context.fillText("Play", 300, 272);
        
        /* If playing. */
        } else if (this.state == STATE.PLAY) {
            
            /* Render. */
            for (var sprite in this.sprites) this.sprites[sprite].render(this.context);
        
        /* If paused. */
        } else if (this.state == STATE.STOP) {

            /* Render. */
            for (var sprite in this.sprites) this.sprites[sprite].render(this.context);
            this.context.textAlign = "center";
            this.context.fillText("Paused", 300, 300);
        
        }
            
    }
    
    this.update = function(delta) {
        
        if (keys[KEY.ESCAPE] === KEY.PRESSED && [STATE.PLAY, STATE.STOP].indexOf(this.state) != -1) {
            this.state = (this.state == STATE.PLAY ? STATE.STOP : STATE.PLAY);
            console.log("Toggled to " + this.state);
        }
        
        if (this.state == STATE.STOP) delta = 0;
        Drift.prototype.update.call(this, delta);
        
    }

}

Boat.prototype = new Sprite();
Drift.prototype = new Engine();
