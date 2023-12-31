const OFFSCREEN_DIST = 40;

class Creature {
	constructor(colorVar, colorIndex, agitatedness, speed, size, sprite, base, x, y, points) {
		// chosen  by user
		this.color = colorVar;

		// decided by form
		this.agitatedness = agitatedness;
		this.maxSpeed = speed;
		this.size = size;
		this.sprite = sprite;
		this.base = base;
		this.colorIndex = colorIndex;
		this.points = points;
		this.angleIndex = 0;
		this.prevAngle = 0//this.getNextAngle();
		this.timeToChangeAngle = 0;

		// misc
		this.tick = 0;
		this.frame = 0;
		this.pos = createVector(x, y);
		this.vel = createVector(random(-4, 4), random(-4, 4));
		this.acc = createVector(0, 0);
		this.x = this.points.map((p) => p.x);
		this.y = this.points.map((p) => p.y);
	}

	addPoint(x, y) {
		let newPoint = createVector(x, y);
		this.points.push(newPoint);
		this.updateXYwithPoints();
	}

	updateXYwithPoints() {
		this.x = this.points.map((p) => p.x);
		this.y = this.points.map((p) => p.y);
	}

	normalizePoints() {
		for (let i = 1; i < this.points.length; i++) {
			this.points[i].x -= this.points[0].x;
			this.points[i].y -= this.points[0].y;
			this.points[i].x = this.points[i].x * 0.5;
			this.points[i].y = this.points[i].y * 0.5;
		}
		this.points[0].x = 0;
		this.points[0].y = 0;
	}

	update() {
		this.doMovement();
		this.easeSegments();
		this.warpOffscreen();
	}

	// do the movement of the creatures head

	doMovement() {
		//let angle = random(0, this.agitatedness * 360);
		let angle = this.getNextAngle(); //+ random(-5, 5); 
		

		let v = p5.Vector.fromAngle(angle, 0.5);
		this.acc.add(v);

		//this.vel.add(this.acc);
		this.vel = v;
		this.vel.limit(this.maxSpeed);
		this.pos.add(this.vel);
		this.acc.mult(0);
	}

	//gets the angle between two points in this.points, and returns the next angle
	getNextAngle() {
		if(this.timeToChangeAngle > 0) {
			this.timeToChangeAngle--;
			return this.prevAngle;
		} else {
			if(this.angleIndex == this.points.length - 1) {
				this.angleIndex = 0;
			}
			//get current path point
			let current = this.points[this.angleIndex]
			//increment
			this.angleIndex++;
			//get next path point
			let next = this.points[this.angleIndex];
			//angle to next point
			let angle = atan2(next.y - current.y, next.x - current.x);
			//distance to next point
			this.timeToChangeAngle = ceil(dist(current.x, current.y, next.x, next.y));
			this.prevAngle = angle;
			return angle;
		}
	}

	// ease the other segments of the creature
	easeSegments() {
		// tx or ty is target pos
		// dx or dy is distance to pos
		let tx = [], dx = [];
		let ty = [], dy = [];

		// amount of easing, scaled by size
		let easing = 0.3 //* (1.5 - this.size);

		// actual easing code
		this.pos.x += this.vel.x;
		this.pos.y += this.vel.y;

		tx[0] = this.x[0];
		ty[0] = this.y[0];

		this.x[0] = this.pos.x;
		this.y[0] = this.pos.y;

		for (let i = 1; i <= this.points.length; i++) {
			tx[i] = this.x[i - 1];
			dx[i] = tx[i] - this.x[i];
			this.x[i] += dx[i] * easing;

			ty[i] = this.y[i - 1];
			dy[i] = ty[i] - this.y[i];
			this.y[i] += dy[i] * easing;
		}
	}

	warpOffscreen() {
		if (this.pos.y >= height) {
			this.vel.y = this.vel.y * -1;
			this.invertPointsOrientation();
			//this.pos.y = constrain(this.pos.y, 1, height-1);
		}
		else if (this.pos.y <= 0) {
			this.vel.y = this.vel.y * -1;
			this.invertPointsOrientation();
			//this.pos.y = constrain(this.pos.y, 1, height-1);
		}

		if (this.pos.x >= width ) {
			this.vel.x = this.vel.x * -1;
			this.invertPointsOrientation();
			//this.pos.x = constrain(this.pos.x, 1, width-1);
		}
		else if (this.pos.x <= 0) {
			this.vel.x = this.vel.x * -1;
			this.invertPointsOrientation();
			//this.pos.x = constrain(this.pos.x, 1, width-1);
		}
		//check if creature is offscreen
		if(brightness(mask.get(this.pos.x, this.pos.y)) < 50) {
			/* let up = brightness(mask.get(this.pos.x, this.pos.y - 5)) < 50;
			let down = brightness(mask.get(this.pos.x, this.pos.y + 5)) < 50;
			let left = brightness(mask.get(this.pos.x - 5, this.pos.y)) < 50;
			let right = brightness(mask.get(this.pos.x + 5, this.pos.y)) < 50; */
			//if it is, invert the direction
			this.vel.x = this.vel.x * -1;
			this.vel.y = this.vel.y * -1;
			this.invertPointsOrientation();
		}
	}

	// inverts the orientation of the points array (makes the image flipped vertically and horizontally)
	invertPointsOrientation() {
		let tempPoints = [];
		for (let i = this.points.length - 1; i >= 0; i--) {
			tempPoints.push(this.points[i]);
		}
		this.points = tempPoints;
	}

	drawBezier() {
		stroke(this.color);
		strokeWeight(10);
		noFill();
		
		beginShape();
		//draw first point if points exist
		  let offsetX0 = map(
			noise(sin(time * 20), 2048),
			0,
			1,
			-5.2048,
			5.2048
		  );
		  let offsetY0 = map(
			noise(cos(time * 20), 2048),
			0,
			1,
			-5.2048,
			5.2048
		  );
		  vertex(this.points[0].x + offsetX0, this.points[0].y + offsetY0);
		//iterate through the rest of the points and calc control points and add bezier
		for (let i = 1; i < this.points.length - 2; i += 2) {
		  let offsetX = map(
			noise(sin(time * 20 + i), 2048),
			0,
			1,
			-5.2048,
			5.2048
		  );
		  let offsetY = map(
			noise(cos(time * 20 + i), 2048),
			0,
			1,
			-5.2048,
			5.2048
		  );
		  
		//   let x1 = (this.points[i].x + this.points[i + 1].x) / 2;
		//   let y1 = (this.points[i].y + this.points[i + 1].y) / 2;
		//   let x2 = (this.points[i + 1].x + this.points[i + 2].x) / 2;
		//   let y2 = (this.points[i + 1].y + this.points[i + 2].y) / 2;
		//   let x3 = this.points[i + 2].x;
		//   let y3 = this.points[i + 2].y;

		let x1 = (this.points[i].x + this.points[i + 1].x) / 2;
		let y1 = (this.points[i].y + this.points[i + 1].y) / 2;
		let x2 = (this.points[i + 1].x + this.points[i + 2].x) / 2;
		let y2 = (this.points[i + 1].y + this.points[i + 2].y) / 2;
		let x3 = this.points[i + 2].x;
		let y3 = this.points[i + 2].y;

		  bezierVertex(
			x1 + offsetX,
			y1 + offsetY,
			x2 + offsetX,
			y2 + offsetY,
			x3 + offsetX,
			y3 + offsetY
		  );
		}
		endShape();
	}

	// actually draw creatures
	drawCreatures() {
		imageMode(CENTER);
		stroke(this.color);
		strokeWeight(this.size * 6);
		strokeCap(ROUND);
		strokeJoin(ROUND);
		
			
		beginShape();
		for (let i = 0; i < this.points.length; i++) {
			noFill();
			stroke(this.color);
			//target pos: this.x[i]
			//shape offset: this.points[i]["x"] 
			vertex( this.x[i], this.y[i]);
		}
		endShape();
			
			beginShape();
			for (let i = 0; i < this.points.length; i++) {
				noFill();
				stroke(255,0,0);
				//target pos: this.x[i]
				//shape offset: this.points[i]["x"] 
				vertex( this.points[i]["x"], this.points[i]["y"]);
			}
			endShape();

			// draw sprites
			/* for (let i = 0; i < (this.points.length - 1); i += 2) {
				//    image to display                    x start                            y start                            width           height
				image(base_sprites[this.base][this.colorIndex], (this.x[i] + this.points[i]["x"]), (this.y[i] + this.points[i]["y"]), 60 * this.size, 60 * this.size);
				image(skin_sprites[this.sprite][this.colorIndex], (this.x[i] + this.points[i]["x"]), (this.y[i] + this.points[i]["y"]), 40 * this.size, 40 * this.size);
			}  */
		
	}
}
