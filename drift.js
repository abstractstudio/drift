var MAX_SPEED = 5;

function bound(x, b) { return Math.min(Math.max(x, b[0]), b[1]); }

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
		if (keys[KEY.LEFT] || keys[KEY.A]) this.r = Math.min(this.rb[1], this.r+this.rv);
        if (keys[KEY.RIGHT] || keys[KEY.D]) this.r = Math.max(this.rb[0], this.r-this.rv);
        this.v += Math.cos(this.r) * this.a;
        this.v = bound(this.v, this.vb);
        this.x += this.v;
        this.x = bound(this.x, this.xb);
        
	}

	this.render = function(context) {
		context.fillRect(this.x, this.y, 10, 10);
        context.beginPath();
        context.arc(this.x+5, this.y+5, 20, -this.r - 0.1, -this.r + 0.1);
        context.stroke();
    }

}

function Drift(canvas) {
	
	Engine.call(this, canvas);
	this.sprites = {"boat": new Boat()}; 

}

Boat.prototype = new Sprite();
Drift.prototype = new Engine();
