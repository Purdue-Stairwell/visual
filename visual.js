//const socket = io("http://localhost:3000", { secure: false });
const socket = io("wss://navinate.com", { secure: true });

// array of creatues
let creatures = [];

// arrays of sprites
let tails = [];
let bodies = [];
let heads = [];

// stars
let star_x = [],
	star_y = [],
	stars_made = false
names = ["bread", "drops", "rombo", "star", "swirl"];

// preload images
function preload() {
	heads.push(loadImage("./assets/sprites/heads/1/head_test.gif"));

	for (let i = 0; i < names.length; i++) {
		let images = new Array();

		for (let j = 0; j < 5; j++) {
			images[j] = loadImage("./assets/sprites/bodies/" + names[i] + "/" + j + ".gif");
		}
		bodies.push(images);
	}
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

// document.addEventListener("click", () => {
// 	if (creatures.length > 20) {
// 		creatures.shift();
// 	}
// 	creatures.push(
// 		new Creature(
// 			color(
// 				floor(random(0, 255)),
// 				floor(random(0, 255)),
// 				floor(random(0, 255)),
// 				floor(random(200, 255))
// 			), // hue
// 			Math.floor(Math.random() * 5), // color index
// 			random(0.0, 1.0), // agitatedness
// 			random(0.8, 2.5), // speed
// 			random(0.2, 1.2), // size
// 			Math.floor(Math.random() * 5), // sprite
// 			Math.floor(Math.random() * 5), // base
// 			random(-width / 3, width / 3), // x
// 			random(-height / 3, height / 3) // y
// 		)
// 	);
// 	creatures[creatures.length - 1].addPoint(-10, 10);
// 	creatures[creatures.length - 1].addPoint(10, 10);
// 	creatures[creatures.length - 1].addPoint(20, 20);
// 	creatures[creatures.length - 1].addPoint(30, 30);
// 	creatures[creatures.length - 1].addPoint(100, -100);
// 	creatures[creatures.length - 1].addPoint(-100, 100);
// 	creatures[creatures.length - 1].normalizePoints();
// });

function colorToIndex(colorVar) {
	switch (colorVar) {
		case "#4d26db":
			return (0);
		case "#05a59d":
			return (1);
		case "#f6921e":
			return (2);
		case "#ec1d23":
			return (3);
		case "#ec008b":
			return (4);
		default:
			return (0);
	}
}

function pathToSprite(path) {
	switch (path) {
		case "/anim/newblob.gif":
			return (0);
		case "/anim/drops.gif":
			return (1);
		case "/anim/sprite03.gif":
			return (2);
		case "/anim/star01.gif":
			return (3);
		case "/anim/head.gif":
			return (4);
		default:
			return (0);
	}
}

socket.on("backend to visual", (points, who5, sprite, colorVar, base) => {
	console.log("Color: " + colorVar + " Who5: " + who5 + " Sprite: " + sprite + " Base: " + base);
	if (points !== null && colorVar !== null) {
		if (creatures.length > 20) {
			creatures.shift();
		}
		creatures.push(
			new Creature(
				colorVar, // color (hex)
				colorToIndex(colorVar), // color index
				random(0.0, 0.75), // agitatedness
				random(0.3, 1.5), // speed
				random(0.2, 1.2), // size
				pathToSprite(sprite), // sprite
				pathToSprite(base), // base sprite
				random(-width / 3, width / 3), // x
				random(-height / 3, height / 3), // y
				points
			)
		);
		creatures[creatures.length - 1].points = [...points];
		for (i = 0; i <= creatures[creatures.length - 1].points.length - 1; i++) {
			creatures[creatures.length - 1].x[i] = creatures[creatures.length - 1].points[i]["x"];
			creatures[creatures.length - 1].y[i] = creatures[creatures.length - 1].points[i]["y"];
		}
	}
	else {
		console.log("Missing Either Color Or Points");
	}
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
			star_x[i] = Math.floor(Math.random() * w);
			star_y[i] = Math.floor(Math.random() * h);
			stars_made = true;
		}
	}

	for (let i = 0; i <= star_count - 1; i++) {
		fill(255);
		circle(star_x[i], star_y[i], star_size);
		star_y[i] += 0.1;
		if (Math.floor(Math.random() * 15) % 15 == 0) {
			star_x[i] += (Math.floor(Math.random() * 3) - 1);
		}
		if (star_x[i] >= w || star_y[i] >= h) {
			star_x[i] = Math.floor(Math.random() * w);
			star_y[i] = Math.floor(Math.random() * h);
		}
	}
}
