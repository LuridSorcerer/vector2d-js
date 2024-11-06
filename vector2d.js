//////////////////////////////////////////////////////////////////////////////
// Global data
//////////////////////////////////////////////////////////////////////////////
let canvas;
let ctx;
let player = {location:{x:100,y:100}, speed:{x:0,y:0}, fillStyle:'black' };
let target = {location: {x:0,y:0}, active:false, fillStyle:'red'};
const OBJ_SIZE = 32;
const MAX_SPEED = 100;
let lastframetime;
let framecount = 0;
const scaleFactor = window.devicePixelRatio || 1;

//////////////////////////////////////////////////////////////////////////////
// Engine functions
//////////////////////////////////////////////////////////////////////////////
function init() {
	canvas = document.getElementById("c");
	ctx = canvas.getContext("2d");
	canvas.addEventListener("click",handleClick);
	canvas.addEventListener("mousemove",handleMouseMove);
	lastframetime = Date.now();

	canvas.width = canvas.clientWidth * scaleFactor;
	canvas.height = canvas.clientHeight * scaleFactor;
	ctx.scale(scaleFactor,scaleFactor);
}

function update(deltatime) {

	// move player
	player.location.x += player.speed.x * (deltatime/1000);
	player.location.y += player.speed.y * (deltatime/1000);

	// check if the target was reached
	if (target.active &&
		getDistance(player.location, target.location) < 5) {
		target.active = false;
		player.speed.x = 0;
		player.speed.y = 0;
	}
}

function render() {
	// clear screen
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// draw target
	if (target.active) {
		drawObject(target);
	}

	// draw player
	drawObject(player);
}

function drawObject(a) {
	ctx.fillStyle = a.fillStyle;
	ctx.fillRect(a.location.x-(OBJ_SIZE/2), a.location.y-(OBJ_SIZE/2), OBJ_SIZE, OBJ_SIZE);
}

function handleClick(e) {
	// move and activate target
	target.location.x = e.x / scaleFactor;
	target.location.y = e.y / scaleFactor;
	target.active = true;

	// direct player toward the target
	player.speed.x = target.location.x - player.location.x; 
	player.speed.y = target.location.y - player.location.y;
	player.speed = normalize(player.speed);
	player.speed.x *= MAX_SPEED;
	player.speed.y *= MAX_SPEED;
}

function handleMouseMove(e) {
	// if the button is held, set and move the target
	if (e.buttons >= 1) {
		handleClick(e);
	}
}

function mainLoop() {
	// update delta time
	const currentTime = Date.now();
	const deltatime = currentTime - lastframetime;
	lastframetime = currentTime;

	update(deltatime);
	render();
	requestAnimationFrame(mainLoop);
}

//////////////////////////////////////////////////////////////////////////////
// Vector functions
//////////////////////////////////////////////////////////////////////////////
function getDistance(a,b) {
	return Math.hypot( b.x - a.x, b.y - a.y );
}

function normalize(a) {
	let l = Math.hypot(a.x, a.y);
	if (l === 0) { return {x:NaN, y:NaN }; }
	return {x: a.x/l, y: a.y/l}; 
}

//////////////////////////////////////////////////////////////////////////////
// Begin running
//////////////////////////////////////////////////////////////////////////////
init();
mainLoop();