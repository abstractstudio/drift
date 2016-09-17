goog.require("engine.Engine");
goog.require("drift.Boat");
goog.require("drift.Obstacle");
goog.require("drift.Projectile");
goog.require("drift.Background");
goog.provide("drift.Drift");


/* Global constants. */
const STATE = {LOAD: 0, MENU: 1, PLAY: 2, STOP: 3, DEAD: 4};

/** Bound a number to a limit. */
function bound(x, b) { return Math.min(Math.max(x, b[0]), b[1]); }


/** Scoreboard code. */
var downloadedScoreboards;
var downloadScoreboards = function(callback) {
    var ready = {"normal": false, "speed": false, "love": false};
    for (var mode in ready) {
        var request = new XMLHttpRequest();
        request.mode = mode;
        request.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
                ready[this.mode] = JSON.parse(this.responseText);
                for (var m in ready) if (!ready[m]) return;
                downloadedScoreboards = ready;
                if (callback) callback(ready);
            }
        };
        var url = "scoreboard.php?mode=" + mode;
        request.open("GET", url, true);
        request.send();
    }
}

downloadScoreboards();


var updateScoreboards = function(hook) {
    downloadScoreboards(function(scoreboards) {
        var modes = ["normal", "speed", "love"];
        for (var i = 0; i < modes.length; i++) {
            var mode = modes[i];
            var element = document.getElementById("scoreboard-" + mode);
            element.style.opacity = 0;
            html = "";
            for (var j = 0; j < Math.min(scoreboards[mode].length, 10); j++) {
                html += "<tr><td>" + scoreboards[mode][j][0].substr(0, 18) + "</td>";
                html += "<td>" + scoreboards[mode][j][1] + "</td></tr>";
            }
            if (scoreboards[mode].length == 0) {
                html += "<tr><td></td><td></td></tr>";
            }
            var callback = new function() {
                this.element = element;
                this.html = html;
                this.call = function() {
                    this.element.innerHTML = this.html;
                    this.element.style.opacity = 1;
                }
                if (hook) hook();
            }
            setTimeout(callback.call.bind(callback), 500);
            delete callback;
        } 
    });
}

/** Drift engine. */
class Drift extends Engine {
    
    constructor(canvas) {
        /* Super constructor. */
        super(canvas);

        /* Random data. */
        this.cache = {};
        this.cache["lastSkillBonus"] = 0;
        this.cache["skillBonusCount"] = 0;    

        /* Game objects. */
        this.entities = {};
        this.playlist = [];
        this.messages = [];

        /* State. */
        this.state = STATE.LOAD;
        this.difficulty = 10;

        /* Rate. */
        this.rate = 100;
        this.target = 1000;

        /* Score. */
        this.score = 0;

        /* Boost. */
        this.boost = 100;
    }
    

    /** Setup the engine. */
    setup() {
        
        /* Super setup. */
        super.setup();
        
        /* Reference to self. */
        var that = this;
        
        /* Create entities. */
        this.entities.boat = new Boat(this);
        this.entities.boat.reset();
        this.entities.background = new Background(this);
        for (var i = 0; i < this.difficulty; i++) this.entities["obstacle" + i] = new Obstacle(this);
        for (var i = 0; i < 10; i++) this.entities["laser" + i] = new Projectile(this, this.entities.boat.pos.x, this.entities.boat.pos.y);
        
        /* Queue resources. */
        this.manager.queue("boat", RESOURCE.IMAGE, "assets/boat.png");
        this.manager.queue("obstacles", RESOURCE.IMAGE, "assets/obstacles2.png");
        this.manager.queue("water", RESOURCE.IMAGE, "assets/water.png");
        this.manager.queue("laser", RESOURCE.IMAGE, "assets/laser.png");
        this.manager.queue("heart", RESOURCE.IMAGE, "assets/heart.png");
        this.manager.queue("running", RESOURCE.AUDIO, "assets/running.m4a");
        this.manager.queue("romance", RESOURCE.AUDIO, "assets/romance.mp3");
        this.manager.queue("blaster", RESOURCE.AUDIO, "assets/blaster.m4a");
        this.manager.load(function() {
            
            /* Alot resources. */
            var boatSheet = new Sheet(that.manager.$("boat"), 1, 3);
            var obstacleSheet = new Sheet(that.manager.$("obstacles"), 2, 3);
            that.entities.boat.setSheet(boatSheet);
            that.entities.background.image = that.manager.$("water");
            that.cache.heartImage = that.manager.$("heart");
            for (var i = 0; i < 10; i++) that.entities["laser" + i].sheet = new Sheet(that.manager.$("laser"));
            for (var i = 0; i < that.difficulty; i++) that.entities["obstacle" + i].setSheet(obstacleSheet);
            console.log("Loaded resources.")
            
            /* Add music. */
            that.manager.$("running").volume = 0.02;
            that.playlist.push(that.manager.$("running"));
            that.manager.$("romance").volume = 0.04;
            that.playlist.push(that.manager.$("romance"));
            
            /* Set up menu. */
            that.menu();
            
        });
        
        /* Register click events. */
        document.addEventListener("mousedown", function(e) {
            if (that.state == STATE.PLAY || that.state == STATE.STOP) return;
            var x = that.mouse.x - that.canvas.offsetLeft + document.body.scrollLeft;
            var y = that.mouse.y - that.canvas.offsetTop + document.body.scrollTop;
            
            // Right corner
            if (that.canvas.width-30 < x && x < that.canvas.width && that.canvas.height-30 < y && y < that.canvas.height) {
                if (that.playlist[0].paused) {
                    that.playlist[1].pause();
                    that.cache.loveMode = false;

                    that.entities.boat.particleSystem.properties.startRadius = 2.5;
                    that.entities.boat.sideParticleSystem.properties.startRadius = 2.5; 
                    that.playlist[0].play();
                    that.playlist[0].addEventListener("ended", function() { that.playlist[0].play(); });
                    that.cache.lsdMode = true;
                    that.cache.target = 5;
                    that.target = 5;
                } else {
                    that.playlist[0].pause();
                    that.cache.lsdMode = false;
                    that.cache.target = 1;
                    that.target = 1;
                }
            }
            
            // Left Corner
            if (0 < x && x < 30 && that.canvas.height-30 < y && y < that.canvas.height) {
                if (that.playlist[1].paused) {
                    that.playlist[0].pause();
                    that.cache.lsdMode = false;
                    
                    that.playlist[1].play();
                    that.playlist[1].addEventListener("ended", function() { that.playlist[1].play(); });
                    that.entities.boat.particleSystem.properties.startRadius = 6;
                    that.entities.boat.sideParticleSystem.properties.startRadius = 6;                    
                    that.cache.loveMode = true;
                    that.cache.target = 0.5;
                    that.target = 0.5;
                } else {
                    that.playlist[1].pause();
                    that.cache.loveMode = false;

                    that.entities.boat.particleSystem.properties.startRadius = 2.5;
                    that.entities.boat.sideParticleSystem.properties.startRadius = 2.5; 
                    that.cache.target = 1;
                    that.target = 1;
                }
            }
        });
        
        window.onblur = function() {
            if (that.state == STATE.PLAY) that.stop();
        };
        
        /* Mess around with the context. */
        this.context.imageSmoothingEnabled = false;
		
		/* Static context stuff. */
		this.context.fontFamily = "Bit";
        
    }
    
    resetGameMode() {
        this.playlist[0].pause();
        this.cache.lsdMode = false;
        this.playList[1].pause();
        this.cache.loveMode = false;
        this.cache.target = 1;
        this.target = 1;
    }
    
    /** Go to the menu. */
    menu() {
        this.state = STATE.MENU;
        this.rate = 0;
        this.target = 0;
    }
    
    /** Play the game. */
    play() {
        this.state = STATE.PLAY;
        this.rate = this.cache.rate || 0;
        this.target = this.cache.target || 1;
    }
    
    /** Replay. */
    replay() {
        this.entities.boat.reset();
        if (this.cache.loveMode) {
        	this.entities.boat.particleSystem.properties.startRadius = 6;
        	this.entities.boat.sideParticleSystem.properties.startRadius = 6;
        }
        for (var i = 0; i < this.difficulty; i++) this.entities["obstacle"+i].respawn();
        for (var i = 0; i < 10; i++) {
        	this.entities["laser"+i].pos = this.entities.boat.pos.copy();
        	this.entities["laser"+i].active = false;
        }
        this.state = STATE.PLAY;
        this.target = this.cache.target || 1;
        this.score = 0;
        this.cache["skillBonusCount"] = 0;
        this.boost = 100;
    }
    
    /** Pause the engine. */
    stop() {
        this.state = STATE.STOP;
        this.cache.rate = this.rate;
        this.cache.target = this.target;
    }
    
    /** Once a round is over. */
    dead() {
        
        var allowScoreboard = this.state != STATE.DEAD;
        this.state = STATE.DEAD;
        this.cache.target = this.target;
        this.target = 0;

        /* Scoreboard code. */
        if (allowScoreboard && this.entities.boat.lastShootTime == 0) {
            if (this.cache.loveMode) var mode = "love";
            else if (this.cache.lsdMode) var mode = "speed";
            else var mode = "normal";
            var modes = ["normal", "speed", "love"];
            var local = downloadedScoreboards[mode];
            if (local.length < 10 || this.score > local[local.length-1][1]) {
                showDescription();
                var i = Math.max(local.length-1, 0);
                while (i > 0 && local[i-1][1] < this.score) i--;
                var scoreboard = document.getElementById("scoreboard-" + mode);

                var newRow = document.createElement("tr");                
                var entryCell = document.createElement("td");
                var entry = document.createElement("input");
                var scoreCell = document.createElement("td");
                entryCell.appendChild(entry);
                newRow.appendChild(entryCell);
                newRow.appendChild(scoreCell);
                scoreCell.innerHTML = Math.round(this.score * 100) / 100;
                entry.type = "text"; 
                entry.style.width = "100%";
                var score = this.score; 
                entry.onkeydown = function(e) { if (e.keyCode == 13) {
                    updateScoreboard(mode, entry.value, score); 
                }};

                var row = scoreboard.getElementsByTagName("tr")[i];
                row.parentNode.insertBefore(newRow, row);
                entry.focus();
            }
        }
    }
	
	/** Display. */
	display() {
		this.context.font = "16px Bit";
		this.context.textBaseline = "hanging";
		super.display();
		this.context.textAlign = "right";
		this.context.fillText(Math.floor(this.score), this.canvas.width-10, 10);
		this.context.textAlign = "center";
        this.context.fillText("BOOST: " + Math.max(0, Math.floor(this.boost)), this.canvas.width/2, 10);
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
    
    /** Update the engine. */
    update(delta) {
         
        /* Check start. */
        if (this.keyboard[KEY.SPACE] == KEY.PRESSED) {
            if (this.state == STATE.MENU) this.play();
            else if (this.state == STATE.DEAD) this.replay();
        }

        /* Boost. */
        var up = this.keyboard[KEY.UP] || this.keyboard[KEY.W];
        if (up && this.state == STATE.PLAY && this.boost > 0) {
            this.entities.boat.temp.boost = 0.2;
            this.boost -= delta/16 * 2;
        } else if (this.state == STATE.PLAY) {
            this.boost = Math.min(this.boost+0.05, 100);
        }
            
        /* Check pause. */
        if (this.keyboard[KEY.ESCAPE] == KEY.PRESSED) {
            if (this.state == STATE.PLAY) this.state = STATE.STOP;
            else if (this.state == STATE.STOP) this.state = STATE.PLAY;
            console.log("Changed to state " + this.state);
        }
		
		/* Increase score. */
		if (this.state == STATE.PLAY) this.score += this.rate * delta/16 * 0.1;
		
		/* Check for collisions. */
        if (this.state == STATE.PLAY) {
            for (var i = 0; i < this.difficulty; i++) {
                var obstacle = this.entities["obstacle" + i];
                if (!obstacle.detectCollision) continue;
                
                if (this.colliding(obstacle, this.entities.boat, true)) {
                    this.dead();
                    break;
                }
                
                for (var j = 0; j < 10; j++) {
                    var laser = this.entities["laser" + j];
                    if (laser.active && this.colliding(obstacle, laser, false)) {
                        laser.active = false;
                        obstacle.autorender = false;
                        obstacle.detectCollision = false;
                    }
                }
            }
            
        }
		
        /* Update the superclass. */
        super(delta);
        
    }
	
    /* Check if a boat and an obstacle are colliding. */
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
        if (isBoat && Date.now() - this.cache["lastSkillBonus"] > 1500) {
            if (distance - obstacle.rad < 10) {
                this.cache["lastSkillBonus"] = Date.now();
                this.score += 10;
                
                var mode = this.cache.loveMode ? "LOVE" : "";
                this.message(mode + " BONUS +10", 1000);
                this.cache["skillBonusCount"] += 1;
                
                if (this.cache["skillBonusCount"] % 5 == 0) {
                    this.score += 50;
                    this.message("SUPER " + mode + " BONUS +50", 1500);
                }
            }
        }
        
        /* Return. */
		if (distance < obstacle.rad) return true;
		return false;
        
	}

    /** Render the entire engine. */
    render(delta) {
		
        /* Clear the canvas by rendering the background. */
        this.entities.background.render(this.context);

        /* Autodraw the entities. */
		for (var name in this.entities) if (this.entities[name].autorender) this.entities[name].render(this.context);
        
        if (this.cache.loveMode) {
            this.entities.boat.renderParticles(this.context, this.cache.heartImage);
        } else {
            this.entities.boat.renderParticles(this.context);
        }
        
        for (var i = 0; i < 10; i++) {
            if (this.entities["laser"+i].active) {
                this.entities["laser"+i].render(this.context);
            }
        }
		this.entities.boat.render(this.context);
        
        //this.context.fillRect(this.entities.boat.particleSystem.properties.pos.x - 2, this.entities.boat.particleSystem.properties.pos.y - 2, 4, 4);
        //this.context.fillStyle = "black";
        //this.context.fillRect(this.entities.boat.particleSystem.properties.pos.x - this.entities.boat.particleSystem.properties.posVar.x, this.entities.boat.particleSystem.properties.pos.y - this.entities.boat.particleSystem.properties.posVar.y, this.entities.boat.particleSystem.properties.posVar.x, this.entities.boat.particleSystem.properties.posVar.y);
        
		/* Do before drawing entities. */
        if (this.state == STATE.MENU) {

            /* Draw the title and buttons. */
            this.context.fillStyle = "black";
			this.context.textAlign = "center";
			this.context.textBaseline = "bottom";
			this.context.font = "28px Bit";
			this.context.fillText("CHINCOTEAGUE DRIFT", canvas.width/2, canvas.height/3);
			this.context.font = "20px Bit";
			this.context.fillText("PRESS SPACE TO START", canvas.width/2, canvas.height/3+24);
            
		/* If playing. */
        } else if (this.state == STATE.PLAY) {
            
            /* Move rate to target. */
            if (this.rate > this.target) this.rate = Math.max(this.target, this.rate-delta/16*0.05);
            else if (this.rate < this.target) this.rate = Math.min(this.target, this.rate+delta/16*0.05);
			
		/* If paused. */
        } else if (this.state == STATE.STOP) {
			
            /* Draw the title and buttons. */
            this.context.fillStyle = "black";
			this.context.textAlign = "center";
			this.context.textBaseline = "bottom";
			this.context.font = "28px Bit";
			this.context.fillText("PAUSED", canvas.width/2, canvas.height/3);
            this.context.font = "20px Bit";
            this.context.fillText("ESCAPE TO TOGGLE", canvas.width/2, canvas.height/3+30);

        /* If dead. */
        } else if (this.state == STATE.DEAD) {
            this.context.fillStyle = "black";
            this.context.textAlign = "center";
            this.context.textBaseline = "bottom";
            this.context.font = "28px Bit";
            this.context.fillText("GAME OVER", canvas.width/2, canvas.height/3);
            this.context.font = "20px Bit";
            this.context.fillText("SCORE: " + Math.floor(this.score), canvas.width/2, canvas.height/3+30);
            //this.context.font = "16px Bit";
            //this.context.fillText("SKILL BONUS: " + this.cache["skillBonusCount"] + " X 10", canvas.width/2, canvas.height/3+56);           

        }
		
        if (this.cache.lsdMode) {
            this.context.globalAlpha = 0.1;
            this.context.fillStyle = "hsl(" + (Date.now() / 10)  % 360 + ", 50%, 50%)";
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.context.globalAlpha = 1;
        } else if (this.cache.loveMode) {
            this.context.globalAlpha = 0.2;
            this.context.fillStyle = "rgb(255, 31, 114)";
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.context.globalAlpha = 1;
        } else {
            this.context.globalAlpha = 1;
            this.context.fillStyle = "black";
        }
        
		/* Display. */
		if (this.showDisplay) this.display();
	}
	
	updateScoreboard(mode, name, score) {
		var request = new XMLHttpRequest();
		request.onreadystatechange = function() {
			if (request.readyState == 4 && request.status == 200) {
				//var scoreboard = JSON.parse(request.responseText);
                                updateScoreboards();
			}
		};
		request.open("POST", "scoreboard.php", true);
		request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		var data = "mode=" + mode +  "&name=" + name + "&score=" + score;
                request.send(data);
	}
    
}
