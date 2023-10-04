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
		let easing = 0.4 * (1.5 - this.size);

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

	// warp offscreen creatures to the other side
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

	// actually draw creatures
	drawCreatures() {
		imageMode(CENTER);

		// draw sprites
		for (let i = 0; i < this.points.length; i++) {
			console.log(i);
			line(this.x[i], this.y[i], this.x[i - 1], this.y[i - 1]);
			image(bodies[this.base][this.colorIndex], this.x[i] + this.points[i]["x"], this.y[i] + this.points[i]["y"], 60 * this.size, 60 * this.size);
			//image(bodies[this.sprite][this.colorIndex], this.x[i], this.y[i], 40 * this.size, 40 * this.size);
		}
	}
}
