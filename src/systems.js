function eventSystem(args) {
	// process events
}

// Applies stims to entities
function stimSystem(args) {

}

function physicsSystem(args) {
	var w = args.world;
	var ents = w.entities;

	for (var id in ents) {
		var e = ents[id];

		if (e.position && e.motion) {

		}
	}
}

function regionSystem(args){
	// Generates regions as the player entity moves around the world
	var world = args.world;
	var entities = world.entities;
	var player = entities['_player'];

	// Get the current region for the player entity
	// region ID is a 2D array string, e.g., "-1, 0"
	var curRegionX = Math.floor(player.position.x / world.REGION_SIZE);
	var curRegionY = Math.floor(player.position.y / world.REGION_SIZE);

	// Get the currently occupied region
	var curRegionId = [curRegionX, curRegionY].join(',');
	var curRegion = world.regions[curRegionId];

	// Check the regions around that region
	// console.log(world.regions);
	for (var x = -1; x <= 1; x++) {
		for (var y = -1; y <= 1; y++) {
			// Generate any regions that haven't yet been generated

			// Get the position/coordinates for the adjacent region
			var adj = {
				x: curRegionX + x,
				y: curRegionY + y
			};

			// Create position string fopr adjacent region
			var adjId = [adj.x, adj.y].join(',');

			if (world.regions[adjId] === undefined) {
				world.generateRegionCells(adj.x, adj.y, world.REGION_SIZE);
			}
		}
	}
}

function renderSystem(args) {
	rotRenderer(args);
}

function pixiRenderSystem(args) {
	requestAnimFrame(pixiRenderSystem);

	// just for fun, rotate bunny
	bunny.rotation += 0.1;

	// render the stage
	renderer.render(stage);
}
if (typeof PIXI !== 'undefined') {
	// create a new instance of a pixi stage
	var stage = new PIXI.Stage(0x66FF99);

	// create a renderer instance
	var renderer = PIXI.autoDetectRenderer(400, 300);

	// add the renderer view element to the DOM
	document.body.appendChild(renderer.view);

	requestAnimFrame(pixiRenderSystem);

	// create a texture from an image path
	var texture = PIXI.Texture.fromImage("static/img/bunny.png");

	//create a new sprite using the texture
	var bunny = new PIXI.Sprite(texture);

	//center the sprites anchor point
	bunny.anchor.x = 0.5;
	bunny.anchor.y = 0.5;

	// move the sprite to the center of the screen
	bunny.position.x = 200;
	bunny.position.y = 150;

	stage.addChild(bunny);

}