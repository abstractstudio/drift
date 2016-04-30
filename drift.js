var MAX_SPEED = 5;
var STATE = {MENU: 0, PLAY: 1, STOP: 2, DEAD: 3};

/** Bound a number to a lower and upper limit. */
function bound(x, b) { return Math.min(Math.max(x, b[0]), b[1]); }

/** The boat sprite. */
function Boat() {
	
	this.x = 300;
	this.y = 550;
    this.v = 0;
    this.a = 0.05;

    this.r = Math.PI / 2;
	this.rv = 0.02;
    
    this.rb = [0, Math.PI];
    this.xb = [50, 550];
    this.vb = [-2, 2];

	this.update = function(delta) {
		if (keys[KEY.LEFT] || keys[KEY.A]) this.r = Math.min(this.rb[1], this.r+this.rv*delta/16);
        if (keys[KEY.RIGHT] || keys[KEY.D]) this.r = Math.max(this.rb[0], this.r-this.rv*delta/16);
        this.v += Math.cos(this.r) * this.a;
        this.v = bound(this.v, this.vb);
        this.x += this.v * delta/16;
        this.x = bound(this.x, this.xb);
        
	}

	this.render = function(context) {
        context.fillStyle = "black";
		context.fillRect(this.x, this.y, 10, 10);
        context.beginPath();
        context.arc(this.x+5, this.y+5, 20, -this.r - 0.1, -this.r + 0.1);
        context.stroke();
    }

}

/** The main game engine. */
function Drift(canvas) {
	
	Engine.call(this, canvas);
	
    this.sprites = {"boat": new Boat()};
    this.state = STATE.MENU;
    
    this.setup = function() {
        
        new Engine().setup.call(this);
        
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
