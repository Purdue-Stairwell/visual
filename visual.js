//const socket = io("http://localhost:3000", { secure: false });
const socket = io("wss://navinate.com", { secure: true });

// array of creatues
let creatures = [];

// arrays of sprites
let base_sprites = [];
let skin_sprites = [];

// arrays of sprite names
names = [ "bread", "drops", "rombo", "star", "swirl" ];
base_names = ["circle", "cloud", "cube", "heart", "spiky" ];

// collision mask
let mask;

// stars
let star_x = [],
	star_y = [],
	stars_made = false;

// preload images
function preload() {
	for (let i = 0; i < names.length; i++) {
		let gifs = new Array();
		let base_gifs = new Array();

		for (let j = 0; j < 5; j++) {
			gifs[j] = loadImage("./assets/sprites/skin/" + names[i] + "/" + j + ".gif");
			gifs[j] = loadImage("./assets/sprites/base/" + base_names[i] + "/" + j + ".gif");
		}
		base_sprites.push(gifs);
		skin_sprites.push(base_gifs);
	}

	mask = loadImage("./assets/LEDmask.png");
}

// setup canvas and framerate before drawing
function setup() {
	createCanvas(mask.width, mask.height);
	console.log("Canvas Size: " + mask.width + "x" + mask.height);
	frameRate(30);
	
}

// run every tick; draws background, space, and creatures
function draw() {
	// background
	background(0);
	imageMode(CENTER);
	image(mask, width/2, height/2, width, height);
	//space(width, height, 200, 2);
	
	//DEBUG STUFF
	stroke(255,0,0);
	strokeWeight(10);
	line(0, 0, 0, height);
	line(0, 0, width, 0);
	line(width, 0, width, height);
	line(0, height, width, height);
	
	//draw each creature
	for(let g of creatures) {
		g.update();
		g.drawCreatures();
		stroke(255,0,0);
		strokeWeight(10);
		point(g.pos.x, g.pos.y);
	}
	
}

//DEBUG SPAWN METHOD
/* document.addEventListener("click", (e) => {
	if (creatures.length > 20) {
		creatures.shift();
	}
	let newCreature = new Creature(
		color(
			floor(random(0, 255)),
			floor(random(0, 255)),
			floor(random(0, 255)),
			floor(random(200, 255))
		), // hue
		Math.floor(Math.random() * 5), // color index
		random(0.0, 1.0), // agitatedness
		random(0.8, 2.5), // speed
		random(0.2, 1.2), // size
		Math.floor(Math.random() * 5), // sprite
		Math.floor(Math.random() * 5), // base
		random(-width / 3, width / 3), // x
		random(-height / 3, height / 3) // y
	)
	newCreature.addPoint(0, 0);
	newCreature.addPoint(10, 10);
	newCreature.addPoint(20, 20);
	newCreature.addPoint(30, 30);
	newCreature.addPoint(40, 40);
	newCreature.addPoint(50, 50);
	newCreature.normalizePoints();
	creatures.push(newCreature);
}); */

function mouseClicked() {
	if (creatures.length > 20) {
		creatures.shift();
	}
	console.log("Mouse Clicked", mouseX, mouseY);
	let newCreature = new Creature(
		color(
			floor(random(0, 255)),
			floor(random(0, 255)),
			floor(random(0, 255)),
			floor(random(200, 255))
		), // hue
		Math.floor(Math.random() * 5), // color index
		random(0.0, 1.0), // agitatedness
		random(0.8, 2.5), // speed
		random(0.2, 1.2), // size
		Math.floor(Math.random() * 5), // sprite
		Math.floor(Math.random() * 5), // base
		mouseX, // x
		mouseY, // y
		[], // points
	)
	newCreature.addPoint(0, 0);
	newCreature.addPoint(0, 80);
	newCreature.addPoint(80, 80);
	newCreature.addPoint(160, 80);

	newCreature.normalizePoints();
	creatures.push(newCreature);
	console.log(creatures[creatures.length - 1].y);
	/* creatures[creatures.length - 1].points = newCreature.points;
	for (i = 0; i <= creatures[creatures.length - 1].points.length - 1; i++) {
		creatures[creatures.length - 1].x[i] = creatures[creatures.length - 1].points[i]["x"];
		creatures[creatures.length - 1].y[i] = creatures[creatures.length - 1].points[i]["y"];
	} */
}

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
		case "/anim/base/circle.gif":
			return (0);
		case "/anim/drops.gif":
		case "/anim/base/cloud.gif":
			return (1);
		case "/anim/sprite03.gif":
		case "/anim/base/cube.gif":
			return (2);
		case "/anim/star01.gif":
		case "/anim/base/heart.gif":
			return (3);
		case "/anim/head.gif":
		case "/anim/base/spikey.gif":
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
		let newCreature = new Creature(
			colorVar, // color (hex)
			colorToIndex(colorVar), // color index
			random(0.0, 0.75), // agitatedness
			random(0.3, 1.5), // speed
			random(0.75, 1.1), // size
			pathToSprite(sprite), // sprite
			pathToSprite(base), // base sprite
			random(width * 0.25, width * 0.75), // x
			random(height * 0.25, height * 0.75), // y
			points // points
		)
		newCreature.normalizePoints();
		creatures.push(newCreature);
		//creatures[creatures.length - 1].points = [...points];
		/* for (i = 0; i <= creatures[creatures.length - 1].points.length - 1; i++) {
			creatures[creatures.length - 1].x[i] = creatures[creatures.length - 1].points[i]["x"];
			creatures[creatures.length - 1].y[i] = creatures[creatures.length - 1].points[i]["y"];
		} */
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
