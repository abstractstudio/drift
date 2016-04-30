var MAX_SPEED = 5;
var STATE = {MENU: 0, PLAY: 1, STOP: 2, DEAD: 3};

/** Bound a number to a lower and upper limit. */
function bound(x, b) { return Math.min(Math.max(x, b[0]), b[1]); }

/** Pythagorean distance. */
function distance(v1, v2) { return Math.sqrt((v2.x-v1.x)*(v2.x-v1.x) + (v2.y-v1.y)*(v2.y-v1.y)); }

/** The boat sprite. */
function Boat() {
    
    /* Super constructor. */
    Sprite.call(this);
    
    /* Movement rate. */
    this.rate = 1;
	
    /* Position, velocity, and acceleration. */
	this.pos.x = 300;
	this.pos.y = 550;
    this.v = 0;
    this.a = 0.03;

    /* Rotation and rotational velocity. */
    this.rotation = 0;
	this.rv = 0.01;
    
    /* Bounds or rotation, position, and velocity. */
    this.rb = [-Math.PI/2, Math.PI/2];
    this.xb = [50, 550];
    this.vb = [-1.5, 1.5];
    
    /* Sprite sizing. */
    this.width = 16*3;
    this.height = 29*3;
    this.numRows = 1;
    this.numColumns = 3;
    
    /* Relative rotation point. */
    this.rpos.x = this.width / 2;
    this.rpos.y = this.height / 2;
    
    /* Animation. */
    this.currentAnimation = "boat";
    this.addAnimation(new Animation("boat", [0, 1, 2]));

    /* Update the boat. */
	this.update = function(delta) {
        
        /* Left and right input. */
        var left = keys[KEY.LEFT] || keys[KEY.A];
        var right = keys[KEY.RIGHT] || keys[KEY.D];
        
        /* If left. */
		if (left && !right) {
            this.turn(delta)
            this.getCurrentAnimation().frameIndex = 0;
            
        /* If right. */
        } else if (right && !left) {
            this.turn(-delta);
            this.getCurrentAnimation().frameIndex = 2;
            
        /* If neither or both. */
        } else {
            this.getCurrentAnimation().frameIndex = 1;
        }
        
        /* Change velocity and position. */
        this.v += -Math.sin(this.rotation) * this.a;
        this.v = bound(this.v, this.vb);
        this.pos.x += this.v * delta/16 * this.rate;
        this.pos.x = bound(this.pos.x, this.xb);
        
        /* Update the boat as a sprite. */
        Boat.prototype.update.call(this, delta);
	
    }
    
    /** Turn the boat. */
    this.turn = function(delta) {
        this.rotation = bound(this.rotation + this.rv*delta/16*this.rate, this.rb);
    }

}

/** Obstacle. */
function Obstacle(canvas, obstacles, image) {
    
    /* Super constructor. */
    Sprite.call(this);
    
    /* Velocity. */
    this.v = 0.1;
    
    /* Canvas and other obstacle reference for respawn. */
    this.canvas = canvas;
    this.obstacles = obstacles;
    this.spriteImage = image;
    
    /* Animations. */
    this.currentAnimation = "obstacle";
    this.addAnimation(new Animation("obstacle", [0, 1, 2, 3]));
    this.width = 8*4;
    this.height = 8*4;
    this.numRows = 2;
    this.numColumns = 2;
    
    /** Update the obstacle. */
    this.update = function(delta) {
        this.pos.y += this.v * delta * Obstacle.prototype.rate;
        if (this.pos.y > this.canvas.height + 30 && delta != 0) this.respawn();
        this.getCurrentAnimation().update();
    }
    
    /** Respawn the obstacle. */
    this.respawn = function() {
        this.randomize();
        for (var i = 0; i < this.obstacles.length; i++) {
            if (this.obstacles[i] === this) continue;
            /* Fail and send to bottom if colliding with another. */
            if (distance(this.pos, this.obstacles[i].pos) < this.r*2 + this.obstacles[i].r) {
                this.pos.y = this.canvas.height + 31;
                break;
            }
        }
    }
    
    /** Randomize the position and radius of the obstacle. */
    this.randomize = function () {
        this.r = Math.random()*10 + 10;
        this.pos.x = Math.random() * (this.canvas.width-100) + 50;
        this.pos.y = -Math.random() * this.canvas.height;
        this.getCurrentAnimation().frameIndex = Math.floor(Math.random() * 4);
    }

}

/* Give all obstacles a rate. */
Obstacle.prototype.rate = 1;

/* HTML body. */
var body;

/** The main game engine. */
function Drift(canvas) {
	
    /* Super constructor. */
	Engine.call(this, canvas);
	
    /* Game objects. */
    this.sprites = {"boat": new Boat()};
    this.obstacles = [];
    
    /* Game state and difficulty. */
    this.state = STATE.MENU;
    this.difficulty = 0;
    
    /** Game setup. */
    this.setup = function() {
        
        /* HTML body. */
        body = document.getElementsByTagName("body")[0];
        
        /* Setup the engine. */
        new Engine().setup.call(this);
        
        this.state = STATE.MENU;
        
        /* Load images. */
        this.loadImages({"boat": "assets/boat3.png",
                         "obstacles": "assets/obstacles.png"});
        
        /* Add custom event listeners. */
        var that = this;
        document.addEventListener("mousedown", function(e) {
                       
            /* Mouse position. */
            var x = mouse.x - that.canvas.offsetLeft + body.scrollLeft;
            var y = mouse.y - that.canvas.offsetTop + body.scrollTop;
                        
            /* Update state. */
            if (that.state == STATE.MENU) {
                var bbox = [200, 260, 200, 50];
                if (x > bbox[0] && x < bbox[0] + bbox[2] && y > bbox[1] && y < bbox[1]+bbox[3]) {
                    that.state = STATE.PLAY;
                    console.log("Shifted to play state");
                }
                
            /* Touch controls. */
            } else if (that.state == STATE.PLAY) {
                /* if (x < that.canvas.width / 2) {
                    that.sprites.boat.turn(16*6);
                } else {
                    that.sprites.boat.turn(-16*6);
                } */
            }
                        
        });
        
        /* Disable image smoothing. */
        this.context.imageSmoothingEnabled = false;
        
    }
    
    /** Render the game. */
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
            var x = mouse.x - this.canvas.offsetLeft + body.scrollLeft;
            var y = mouse.y - this.canvas.offsetTop + body.scrollTop;
            
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
            for (var i in this.obstacles) this.obstacles[i].render(this.context);
        
        /* If paused. */
        } else if (this.state == STATE.STOP) {

            /* Render. */
            for (var i in this.obstacles) this.obstacles[i].render(this.context);
            for (var sprite in this.sprites) this.sprites[sprite].render(this.context);

            /*  Paused. */
            this.context.textAlign = "center";
            this.context.fillStyle = "black";
            this.context.fillText("Paused", 300, 300);
        
        }
            
    }
    
    /** Update the game engine. */
    this.update = function(delta) {
        
        /* Check for pause. */
        if (keys[KEY.ESCAPE] === KEY.PRESSED && [STATE.PLAY, STATE.STOP].indexOf(this.state) != -1) {
            this.state = (this.state == STATE.PLAY ? STATE.STOP : STATE.PLAY);
            console.log("Toggled to " + this.state);
        }
    
        /* Update sprites and obstacles. */
        if (this.state == STATE.STOP) delta = 0;
        Drift.prototype.update.call(this, delta);
        for (var i in this.obstacles) this.obstacles[i].update(delta);
        
        /* Obstacles. Needs canvas and other obstacles for respawn. */
        while (this.obstacles.length < 10 + this.difficulty) {
            var obstacle = new Obstacle(this.canvas, this.obstacles, this.images.obstacles);
            obstacle.respawn();
            this.obstacles.push(obstacle);
        }
    }

}

/* Set object prototypes for inheritance. */
Boat.prototype = new Sprite();
Drift.prototype = new Engine();
Obstacle.protoype = new Sprite();
