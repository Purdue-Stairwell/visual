class Creature {
	constructor(colorVar, colorIndex, agitatedness, speed, size, sprite, base, x, y) {
		// chosen  by user
		this.color = colorVar;

		// decided by form
		this.agitatedness = agitatedness;
		this.maxSpeed = speed;
		this.size = size;
		this.sprite = sprite;
		this.base = base;
		this.colorIndex = colorIndex;

		// misc
		this.tick = 0;
		this.frame = 0;
		this.points = Array(16).fill(0);
		this.pos = createVector(x, y);
		this.vel = createVector(random(-4, 4), random(-4, 4));
		this.acc = createVector(0, 0);
		this.x = Array(this.points.length).fill(parseInt(this.pos.x));
		this.y = Array(this.points.length).fill(this.pos.y);
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
		let easing = 0.1 * (2 - this.size);

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

		let offscreen_dist = 80

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
		for (let i = 0; i <= this.points.length; i += 2) {
			line(this.x[i], this.y[i], this.x[i - 1], this.y[i - 1]);
			image(bodies[this.base][this.colorIndex], this.x[i], this.y[i], 60 * this.size, 60 * this.size);
			image(bodies[this.sprite][this.colorIndex], this.x[i], this.y[i], 60 * this.size, 60 * this.size);
		}
	}
}
