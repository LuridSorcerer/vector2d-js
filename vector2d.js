//////////////////////////////////////////////////////////////////////////////
// Global data
//////////////////////////////////////////////////////////////////////////////
let canvas;
let ctx;
let player = {location:{x:100,y:100}, speed:{x:0,y:0} };
let target = {location: {x:0,y:0}, active:false};
let lastframetime;
let deltatime;
let framecount = 0;

//////////////////////////////////////////////////////////////////////////////
// Engine functions
//////////////////////////////////////////////////////////////////////////////
function init() {
	canvas = document.getElementById("c");
	ctx = canvas.getContext("2d");
	canvas.addEventListener("click",handleClick);
	lastframetime = deltatime = Date.now();
}

function update() {
	// update delta time
	deltatime = Date.now() - lastframetime;
	lastframetime = Date.now();

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
	ctx.fillStyle = 'lightgray';
	ctx.fillRect(0,0,canvas.width, canvas.height);

	// draw target
	if (target.active) {
		ctx.fillStyle = 'red';
		ctx.fillRect(target.location.x-16, target.location.y-16, 32, 32);
	}

	// draw player
	ctx.fillStyle = 'black';
	ctx.fillRect(player.location.x-16, player.location.y-16, 32, 32);
}

function handleClick(e) {
	// move and activate target
	target.location.x = e.x;
	target.location.y = e.y;
	target.active = true;

	// direct player toward the target
	player.speed.x = target.location.x - player.location.x; 
	player.speed.y = target.location.y - player.location.y;
	player.speed = normalize(player.speed);
	player.speed.x *= 100;
	player.speed.y *= 100;
}

function mainLoop() {
	update();
	render();
	requestAnimationFrame(mainLoop);
}

//////////////////////////////////////////////////////////////////////////////
// Vector functions
//////////////////////////////////////////////////////////////////////////////
function getDistance(a,b) {
	return Math.sqrt( ((a.x - b.x)**2) + ((a.y - b.y)**2) );
}

function getVectorLength(a) {
	return Math.sqrt( (a.x*a.x) + (a.y*a.y) );
}

function normalize(a) {
	let l = getVectorLength(a);
	let r = {x:0, y:0};
	if (a.x != 0) { r.x = a.x / l;}
	if (a.y != 0) { r.y = a.y / l;}
	return r;
}

//////////////////////////////////////////////////////////////////////////////
// Begin running
//////////////////////////////////////////////////////////////////////////////
init();
mainLoop();