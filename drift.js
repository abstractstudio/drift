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
    this.getAnimation().index = 1;
    
    /** Update the boat. */
    this.update = function(delta) {
        
        /* Only allow the boat to move if playing. */
        if (this.engine.state == STATE.PLAY) {

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

/** Scrolling background image. */
function Background(engine) {
    
    /* Engine. */
    this.engine = engine;
    
    /* Image and other data. */
    this.image;
    this.ratio = 6;
    this.rate = 1 * 2;
    this.scroll = 0;
    
    /* Auto update and render. */
    this.autoupdate = true;
    this.autorender = false;
    
    /** Update the background image. */
    this.update = function(delta) {
        if (this.engine.state == STATE.PLAY || this.engine.state == STATE.MENU) {
            this.scroll = (this.scroll + this.rate * this.engine.rate * delta/16) % this.engine.canvas.height;
        }
    }
    
    /** Render the background image. */
    this.render = function(context) {
        if (this.image == null) return;
        var h1 = this.engine.canvas.height - this.scroll
        var h2 = this.scroll;
        var w = this.engine.canvas.width;
        context.drawImage(this.image, 0, 0, w / this.ratio, h1 / this.ratio, 0, this.scroll, w, h1);
        context.drawImage(this.image, 0, h1 / this.ratio, w / this.ratio, h2 / this.ratio, 0, 0, w, h2);
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
    this.target = 1;
    
    /** Setup the engine. */
    this.setup = function() {
        
        /* Super setup. */
        superclass.setup.call(this);
        
        /* Reference to self. */
        var that = this;
        
        /* Create entities. */
        this.entities.boat = new Boat(this);
        this.entities.background = new Background(this);
        
        /* Queue resources. */
        this.manager.queue("boat", RESOURCE.IMAGE, "assets/boat.png");
        this.manager.queue("obstacles", RESOURCE.IMAGE, "assets/obstacles.png");
        this.manager.queue("water", RESOURCE.IMAGE, "assets/water.png");
        this.manager.load(function() {
            
            /* Alot resources. */
            var sheet = new Sheet(that.manager.$("boat"), 1, 3);
            that.entities.boat.setSheet(sheet);
            that.entities.background.image = that.manager.$("water");
            console.log("Loaded resources.")
            
            /* Set up menu. */
            that.state = STATE.MENU;
            that.rate = 0;
            that.target = 0;
            
        });
        
        /* Register click events. */
        document.addEventListener("mousedown", function(e) {
            var x = that.mouse.x - that.canvas.offsetLeft + document.body.scrollLeft;
            var y = that.mouse.y - that.canvas.offsetTop + document.body.scrollTop;
            
            /* Start code. */
            that.state = STATE.PLAY;
            that.target = 1;
        });
        
        /* Mess around with the context. */
        this.context.imageSmoothingEnabled = false;
        
    }
    
    /** Update the engine. */
    this.update = function(delta) {
                
        /* Check pause. */
        if (this.keyboard[KEY.ESCAPE] == KEY.PRESSED) {
            if (this.state == STATE.PLAY) this.state = STATE.STOP;
            else if (this.state == STATE.STOP) this.state = STATE.PLAY;
            console.log("Changed to state " + this.state);
        }
        
        /** Update the superclass. */
        superclass.update.call(this, delta);
        
    }
    
    /** Render the entire engine. */
    this.render = function(delta) {
        
        if (this.state == STATE.MENU) {
            
            /* Clear by drawing the background. */
            this.entities.background.render(this.context);
            superclass.render.call(this, delta, false);
            
        } else if (this.state == STATE.PLAY) {
        
            /* Move rate to target. */
            if (this.rate > this.target) this.rate = Math.max(this.target, this.rate-delta/16*0.05);
            else if (this.rate < this.target) this.rate = Math.min(this.target, this.rate+delta/16*0.05);

            /* Clear by drawing the background and render. */
            this.entities.background.render(this.context);
            superclass.render.call(this, delta, false);
        
        } else if (this.state == STATE.STOP) {
            
            /* Clear by drawing the background and render. */
            this.entities.background.render(this.context);
            superclass.render.call(this, delta, false);
            
        }
        
    }
    
}
