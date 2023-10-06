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
		this.points = [];

		// misc
		this.tick = 0;
		this.frame = 0;
		this.pos = createVector(x, y);
		this.vel = createVector(random(-4, 4), random(-4, 4));
		this.acc = createVector(0, 0);
		this.x = [];
		this.y = [];
	}

	addPoint(x, y) {
		let newPoint = createVector(x, y);
		this.points.push(newPoint);
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
		let angle = random(0, this.agitatedness * 360);

		let v = p5.Vector.fromAngle(angle);
		v.setMag(0.2);
		this.acc.add(v);

		this.vel.add(this.acc);
		this.vel.limit(this.maxSpeed);
		this.pos.add(this.vel);
		this.acc.mult(0);
	}

	// ease the other segments of the creature
	easeSegments() {
		// tx or ty is target pos
		// dx or dy is distance to pos
		let tx = [], dx = [];
		let ty = [], dy = [];

		// amount of easing, scaled by size
		let easing = 0.2 * (1.5 - this.size);

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

		let offscreen_dist = 40

		if (this.pos.y >= height + offscreen_dist) {
			this.pos.y = - offscreen_dist;
			this.y.fill(this.pos.y);
		}
		else if (this.pos.y <= - offscreen_dist) {
			this.pos.y = height + offscreen_dist;
			this.y.fill(this.pos.y);
		}

		if (this.pos.x >= width + offscreen_dist) {
			this.pos.x = - offscreen_dist;
			this.x.fill(this.pos.x);
		}
		else if (this.pos.x <= - offscreen_dist) {
			this.pos.x = width + offscreen_dist;
			this.x.fill(this.pos.x);
		}
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

		this.drawBezier()

		// draw sprites
		for (let i = 0; i < (this.points.length - 1); i += 2) {
			//line((this.x[i + 1] + this.points[i + 1]["x"]) / 2, (this.y[i] + this.points[i]["y"]) / 2, (this.x[i] + this.points[i]["x"]) / 2, (this.y[i] + this.points[i]["y"]) / 2);
			image(bodies[this.base][this.colorIndex], (this.x[i] + this.points[i]["x"]) / 2, (this.y[i] + this.points[i]["y"]) / 2, 60 * this.size, 60 * this.size);
			image(bodies[this.sprite][this.colorIndex], (this.x[i] + this.points[i]["x"]) / 2, (this.y[i] + this.points[i]["y"]) / 2, 40 * this.size, 40 * this.size);
		}
	}
}
