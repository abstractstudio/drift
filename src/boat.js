goog.require("engine.Sprite");
goog.require("engine.ParticleSystem");
goog.require("engine.Animation");
goog.provide("drift.Boat");

/** Boat sprite. */
class Boat extends Sprite {
    
    constructor(engine) {
        
        /* Super constructor. */
        super(engine, 250, 400, 16*3, 28*3, 8*3, 10*3);

        /* Movement. */
        this.xv = 0;
        this.xa = 0.05;
        this.xb = [30, 450];
        this.vb = [-1.5, 1.5];
        this.rot = 0;
        this.rv = Math.PI/360;
        this.rb = [-Math.PI/3, Math.PI/3];

        /* Water particle system. */
        this.particleSystem = new ParticleSystem(this.pos.x, this.pos.y);
        this.sideParticleSystem = new ParticleSystem(this.pos.x, this.pos.y);
        this.particleYOffset = this.width/2;
        this.particleImage = null;

        /* Animation. */
        //this.addAsset(this.engine.getAsset("boat"));
        //this.setRenderable("boat").index = 1;
        
    }
    
    
    /* Reset the boat to it's original position. */
    reset() {
        this.rot = 0;
        this.pos.x = 250;
        this.pos.y = 480;
        this.xv = 0;
    }
    
    /** Update the boat. */
    update(delta) {
        
        /* Only allow the boat to move if playing. */
        if (this.engine.state == PLAY) {

            /* Left and right input. */
            var keyboard = this.engine.keyboard;
            var left = keyboard[KEY.LEFT] || keyboard[KEY.A];
            var right = keyboard[KEY.RIGHT] || keyboard[KEY.D];

            /* Only left. */
            if (left && !right) { 
                this.turn(+delta);
                this.getRenderable().frame(0);

            /* Only right. */
            } else if (right && !left) {
                this.turn(-delta);
                this.getRenderable().frame(2); 

            /* Neither or both. */
            } else { this.getRenderable().frame(1); }

            /* Move. */
            this.move(delta);
            
            /* Update particle systems. */
            var boost = this.temp.boost > 0 ? 0.75 : 0.5;
            this.updateParticles(delta * bound(this.engine.game.globalRate.get(), [0, 1.5]) * boost);
            
            /* Fire lasers. */
           /* for (var i = 0; i < 10; i++) {
                if (keyboard[76] && !this.engine.entities["laser"+i].active && Date.now() - this.lastShootTime > this.cooldown) { // L
                	var blaster = this.engine.manager.$("blaster");
                	blaster.volume = 0.3;
                	blaster.currentTime = 0.8;
                	blaster.play();
                    this.engine.entities["laser"+i].active = true;
                    this.engine.entities["laser"+i].pos = new Vector(this.pos.x, this.pos.y);
                    this.engine.entities["laser"+i].rot = this.rot + Math.PI/2;
                    this.engine.entities["laser"+i].speed = 20;
                    this.lastShootTime = Date.now();
                }
                this.engine.entities["laser"+i].update(delta);
            }*/
        }

        this.temp = {};
        
    }
    
    updateParticles(delta) {
        this.particleSystem.properties.pos.x = this.pos.x + this.particleYOffset*Math.sin(this.rot);
        this.particleSystem.properties.posVar.x = (this.width/2 - 2) * Math.cos(this.rot);
        this.particleSystem.properties.pos.y = this.pos.y + this.particleYOffset*Math.cos(this.rot);
        this.particleSystem.properties.posVar.y = (this.width/2 - 2) * Math.sin(this.rot);
        this.particleSystem.properties.angle = Math.PI/2 - this.rot;
        //this.particleSystem.properties.startRadius = 2.5 + Math.abs(this.rot)*1.5;
        this.particleSystem.update(delta);

        /*
        this.sideParticleSystem.properties.pos.x = this.pos.x + this.particleYOffset*Math.sin(this.rot);
        this.sideParticleSystem.properties.posVar.x = (this.width/2 - 8) * Math.cos(this.rot);
        this.sideParticleSystem.properties.pos.y = this.pos.y - this.particleYOffset*Math.cos(this.rot);
        this.sideParticleSystem.properties.posVar.y = (this.width/2 - 8) * Math.sin(this.rot);
        this.sideParticleSystem.properties.angle = Math.PI/2 + this.rot;
        //this.sideParticleSystem.properties.startRadius = 2.5 + Math.abs(this.rot)*2.0;
        this.sideParticleSystem.update(delta);
        */
    }
    
    renderParticles(context, image) {
        this.particleSystem.properties.image = image;
        //this.sideParticleSystem.properties.image = image;
        this.particleSystem.render(context);
        //this.sideParticleSystem.render(context);
    }
    
    /** Turn the boat. */
    turn(delta) {
        var rot = this.rv * this.engine.game.boatRate.get() * this.engine.game.globalRate.get() * delta/16;
        this.rot = bound(this.rot+rot, this.rb);
    }
    
    /** Move the boat. */
    move(delta) {
        this.xv = bound(this.xv-Math.sin(this.rot)*this.xa, this.vb);
        this.xv -= Math.sin(this.rot) * (this.temp.boost || 0);
        var mov = this.xv * this.engine.game.boatRate.get() * this.engine.game.globalRate.get() * delta/16;
        this.pos.x = bound(this.pos.x+mov, this.xb);
        if (this.xb.indexOf(this.pos.x) > -1) this.xv = 0;
    }
	
	bbox() {
		var tl = this.topLeft();
		return [tl.x, tl.y, this.width, this.height - 4*3];
        //return [this.pos.x, this.pos.y, this.width, this.height - 4*3];
	}
    
}



/* FROM reset()

        this.particleSystem = new ParticleSystem(this.pos.x, this.pos.y + this.particleYOffset);
        this.particleSystem.setProperties({
            posVar: new Vector(this.width/2 - 4, 0), 
            speed: 0.2, 
            speedVar: 0.05, 
            angle: Math.PI/2, 
            angleVar: 7.5 * Math.PI/180,  
            life: 200, 
            lifeVar: 50, 
            startRadius: 2.5, 
            startRadiusVar: 0.25, 
            endRadius: 1.0, 
            endRadiusVar: 0.2, 
            startColor: [101, 150, 187, 255], 
            startColorVar: [10, 5, 0, 0],
            endColor: [175, 201, 255, 64]
            
        });
        this.particleSystem.totalParticles = 24;
        this.particleSystem.emissionRate = 0.213;
        this.particleSystem.init();
        
        this.sideParticleSystem = new ParticleSystem(this.pos.x, this.pos.y + this.particleYOffset);
        this.sideParticleSystem.setProperties({
            posVar: new Vector(this.width/2 - 4, 0), 
            speed: 0.2, 
            speedVar: 0.05, 
            angle: Math.PI/2, 
            angleVar: 10.0 * Math.PI/180,  
            life: 500, 
            lifeVar: 50, 
            startRadius: 2.5, 
            startRadiusVar: 0.25, 
            endRadius: 1.0, 
            endRadiusVar: 0.2, 
            startColor: [101, 150, 187, 255], 
            startColorVar: [10, 5, 0, 0],
            endColor: [175, 201, 255, 64]
            
        });
        this.sideParticleSystem.totalParticles = 64;
        this.sideParticleSystem.emissionRate = 0.128;
        this.sideParticleSystem.init();
        
*/
