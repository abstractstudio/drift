/* Global constants. */
var STATE = {LOAD: 0, MENU: 1, PLAY: 2, STOP: 3, DEAD: 4};

/** Bound a number to a limit. */
function bound(x, b) { return Math.min(Math.max(x, b[0]), b[1]); }

/** Boat sprite. */
function Boat(engine) {
    
    /* Super constructor. */
    Sprite.call(this, engine, 300, 550, 16*3, 29*3);
    
    /* Movement rate. */
    this.rate = 1;
    
    /* Movement. */
    this.rot = 0;
    this.mov = {xv: 0, xa: 0.03, rv: 0.01};
    this.mov.xb = [50, 550];
    this.mov.vb = [-1.5, 1.5];
    
    /* Rotational bounds. */
    this.mov.rb = [-Math.PI/3, Math.PI/3];
    
    /* Auto render. */
    this.autoupdate = true;
    this.autorender = true;
    
    /* Animation. */
    this.animation = "boat";
    this.addAnimation(new Animation("boat", [0, 1, 2]));
    
    /** Update the boat. */
    this.update = function(delta) {

        /* Left and right input. */
        var keyboard = this.engine.keyboard;
        var left = keyboard[KEY.LEFT] || keyboard[KEY.A];
        var right = keyboard[KEY.RIGHT] || keyboard[KEY.D];
        
        /* Only left. */
        if (left && !right) { 
            this.turn(+delta);
            this.getAnimation().index = 0;
        
        /* Only right. */
        } else if (right && !left) {
            this.turn(-delta);
            this.getAnimation().index = 2; 
        
        /* Neither or both. */
        } else { this.getAnimation().index = 1; }
        
        /* Move. */
        this.move(delta);
        
    }
    
    /** Turn the boat. */
    this.turn = function(delta) {
        var rot = this.mov.rv * this.rate * this.engine.rate * delta/16;
        this.rot = bound(this.rot+rot, this.mov.rb);
    }
    
    /** Move the boat. */
    this.move = function(delta) {
        this.mov.xv = bound(this.mov.xv-Math.sin(this.rot)*this.mov.xa, this.mov.vb);
        var mov = this.mov.xv * this.rate * this.engine.rate * delta/16;
        this.pos.x = bound(this.pos.x+mov, this.mov.xb);
    }
    
}

/** Drift engine. */
function Drift(canvas) {
    
    /* Super constructor. */
    Engine.call(this, canvas);
    var superclass = new Engine();
    
    /* Game objects. */
    this.entities = {};
    this.playlist = [];

    /* State. */
    this.state = STATE.LOAD;
    this.difficulty = 0;
    
    /* Rate. */
    this.rate = 1;
    
    /** Setup the engine. */
    this.setup = function() {
        
        /* Super setup. */
        superclass.setup.call(this);
        
        /* Reference to self. */
        var that = this;
        
        /* Create entities. */
        this.entities.boat = new Boat(this);
        
        /* Queue resources. */
        this.manager.queue("boat", RESOURCE.IMAGE, "assets/boat.png");
        this.manager.queue("obstacles", RESOURCE.IMAGE, "assets/obstacles.png");
        this.manager.queue("water", RESOURCE.IMAGE, "assets/water.png");
        this.manager.load(function() {
            var sheet = new Sheet(that.manager.$("boat"), 1, 3);
            that.entities.boat.setSheet(sheet);
        });
        
        /* Register click events. */
        document.addEventListener("mousedown", function(e) {
            var x = that.engine.mouse.x - that.canvas.offsetLeft + body.scrollLeft;
            var y = that.engine.mouse.y - that.canvas.offsetTop + body.scrollTop;
        });
        
        /* Mess around with the context. */
        this.context.imageSmoothingEnabled = false;
        
    }
    
    /** Render the entire engine. */
    this.render = function(delta) {
        
        /* Clear the canvas. */
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        superclass.render.call(this, this.context);
        
    }
    
}
