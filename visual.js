const socket = io("http://localhost:3000");

// array of creatues
let creatures = [];

let sprite_count = 12;

// arrays of sprites
let tails = [];
let bodies = [];
let heads = [];

// stars
let star_x = [],
	star_y = [],
	stars_made = false;

// preload images
function preload() {
	heads.push(loadImage("./assets/sprites/heads/0/0.gif"));
	heads.push(loadImage("./assets/sprites/heads/1/1.gif"));

	bodies.push(loadImage("./assets/sprites/bodies/0/0.gif"));
	bodies.push(loadImage("./assets/sprites/bodies/1/1.gif"));

	tails.push(loadImage("./assets/sprites/tails/0/0.gif"));
	tails.push(loadImage("./assets/sprites/tails/1/1.gif"));

	console.log(heads);
}

// setup canvas and framerate before drawing
function setup() {
	createCanvas(windowWidth, windowHeight);
	frameRate(60);
}

// run every tick; draws background, space, and creatures
function draw() {

	// background
	background(0);
	space(width, height, 200, 2);

	//draw each creature
	push();
	creatures.forEach((g) => {
		g.update();
		g.drawCreatures();
	});
	pop();

}

document.addEventListener("click", () => {
  if (creatures.length > 20) {
    creatures.shift();
  }
  creatures.push(
    new Creature(
      color(
        floor(random(0, 255)),
        floor(random(0, 255)),
        floor(random(0, 255)),
        floor(random(200, 255))
      ), // hue
      random(0.0, 1.0), // agitatedness
      random(0.8, 2.5), // speed
      floor(random(1, 15)), // pointiness
      random(0.2, 1.2), // size
      Math.floor(Math.random() * 2), // sprite
      random(-width / 3, width / 3), // x
      random(-height / 3, height / 3) // y
    )
  );
});

socket.on("server to gesture", (points, who5, sprite, color) => {
	console.log("recieved data");
	console.log("Points: " + points);
	if (gests.length > 20) {
		gests.shift();
	}
	gests.push(
		new Creature(
			color(
			  hexToRgb(color).r,
			  hexToRgb(color).g,
			  hexToRgb(color).b,
			  floor(random(200, 255))
			), // hue
			random(0.0, 1.0), // agitatedness
			random(0.8, 2.5), // speed
			floor(random(1, 15)), // pointiness
			random(0.2, 1.2), // size
			Math.floor(Math.random() * 2), // sprite
			random(-width / 3, width / 3), // x
			random(-height / 3, height / 3) // y
		  )
	);
	gests[gests.length - 1].points = [...points];
});

function hexToRgb(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
	  r: parseInt(result[1], 16),
	  g: parseInt(result[2], 16),
	  b: parseInt(result[3], 16)
	} : null;
  }

// draw space background
function space(w, h, star_count, star_size) {
	noStroke();
	fill(0);
	rectMode(CORNERS);
	rect(0, 0, w, h);

	if (stars_made == false) {
		for (let i = 0; i <= star_count - 1; i++) {
			star_x[i] = randomGaussian(w / 2, w / 2);
			star_y[i] = randomGaussian(h / 2, h / 2);
			stars_made = true;
		}
	}

	for (let i = 0; i <= star_count - 1; i++) {
		fill(255);
		circle(star_x[i], star_y[i], star_size);
		star_y[i] += 0.1;
		if (abs(randomGaussian(0, 3) > 6)) {
			star_x[i] += randomGaussian(0, 1);
		}
		if (star_x[i] >= w || star_y[i] >= h) {
			star_x[i] = randomGaussian(w / 2, w / 2);
			star_y[i] = randomGaussian(h / 2, h / 2);
		}
	}
}
