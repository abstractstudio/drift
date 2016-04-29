var MAX_SPEED = 5;

function Boat() {
	
	this.x = 300;
	this.y = 600;
	this.a = Math.PI / 2;
	this.r = 0;

	this.update = function(delta) {
		
	}

	this.render = function(context) {
		context.fillRect(this.x, this.y, 10, 10);
	}

}

function Drift(canvas) {
	
	Engine.call(this, canvas);
	this.sprites = {"boat": new Boat()}; 

}

Boat.prototype = new Sprite();
Drift.prototype = new Engine();
