function Boat() {
	
	this.x = 300;
	this.y = 600;
	this.a = 0;
	this.r = 0;

	this.render = function(context) {
		context.fillRect(this.x, this.y, 10, 10);
	}

}

function Drift(canvas) {
	
	Engine.call(this, canvas);
	this.sprites = {"boat": new Boat()}
}

Boat.prototype = new Sprite();
Drift.prototype = new Engine();
