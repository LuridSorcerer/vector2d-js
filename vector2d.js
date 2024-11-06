//////////////////////////////////////////////////////////////////////////////
// Global data
//////////////////////////////////////////////////////////////////////////////
let canvas;
let ctx;
let player = {location:{x:100,y:100}, speed:{x:0,y:0} };
let target = {location: {x:0,y:0}, active:false};
let lastframetime;
let framecount = 0;

//////////////////////////////////////////////////////////////////////////////
// Engine functions
//////////////////////////////////////////////////////////////////////////////
function init() {
	canvas = document.getElementById("c");
	ctx = canvas.getContext("2d");
	canvas.addEventListener("click",handleClick);
	canvas.addEventListener("mousemove",handleMouseMove);
	lastframetime = Date.now();
}

function update() {
	// update delta time
	const currentTime = Date.now();
	const deltatime = currentTime - lastframetime;
	lastframetime = currentTime;

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

function handleMouseMove(e) {
	// if the button is held, set and move the target
	if (e.buttons >= 1) {
		handleClick(e);
	}
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