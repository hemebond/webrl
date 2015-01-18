function rotRenderer(args) {
	var world = args.world || {};
	var entities = args.world.entities || {};
	var display = args.display;
	var player = entities['_player'];

	var screenWidth = 32;
	var screenHeight = 32;
	var camera = entities['_camera'];
	var viewRange = 8;

	// If we have no camera we have nothing to draw
	if (typeof camera === 'undefined') {
		return;
	}

	// Clear the canvas completely
	display.clear();

	// Calculate coordinates and offsets
	// var topLeftX = Math.max(0, camera.position.x - (screenWidth / 2));
	// topLeftX = Math.min(topLeftX, world.width - screenWidth);
	var topLeftX = camera.position.x - (screenWidth / 2);

	// var topLeftY = Math.max(0, camera.position.y - (screenHeight / 2));
	// topLeftY = Math.min(topLeftY, world.height - screenHeight);
	var topLeftY = camera.position.y - (screenHeight / 2);

	// Get the players current Z level in the world
	var z = player.position.z;

	// Store the visible cells
	var visibleCells = {};

	// FOV/visibility calculations
	var fov = new ROT.FOV.DiscreteShadowcasting(function(x, y) {
		var pos = [x, y, 1].join(',');
		var cell = world.getCell(pos);

		// console.log('testing ' + pos);

		// Return true if light can pass through
		// console.log(cell + ': ' + cell.blocksLight);
		// console.log(cell);
		if (cell === undefined) {
			// console.log(pos);
			// console.log(world.cells);
		}
		else {
			return !cell._blocksLight;
		}
		return false;
	});

	fov.compute(player.position.x, player.position.y, 8, function(x, y, r, visibility) {
		var pos = [x, y, 1].join(',');
		// console.log('Visibility at [' + pos + ']:' + visibility);
		visibleCells[pos] = true;
		// console.log(visibleCells);
	});

	for (var x=topLeftX; x < topLeftX + screenWidth; x++) {
		for (var y=topLeftY; y < topLeftY + screenHeight; y++) {
			var z = 1;
			var pos = [x, y, z].join(',');
			var cell;
			var glyph;

			// Check that it's in the visible cell list
			// console.log('checking ' + pos + ": " + visibleCells[pos]);
			// if (visibleCells[[x, y, 1].join(',')] === true) {
				// console.log('rendering ' + pos);
				// Walk downward until we find a cell with a glyph to render
				do {
					cell = world.getCell(x, y, z--);
					if (cell !== undefined) {
						glyph = cell._glyph;
					}
				} while (glyph === undefined && z > -1);

				if (typeof glyph !== 'undefined') {
					display.draw(x - topLeftX, y - topLeftY, glyph.character, glyph.foreground, glyph.background);
				}
			// }

			// var cellEntities = cell.getEntities();
			// for (var i=0; i < cellEntities.length; i++) {
			// 	var e = entities[cellEntities[i]];

			// 	if (e.position && e.glyph) {
			// 		display.draw(x, y, e.glyph.character, e.glyph.colour);
			// 	}
			// }
		}
	}

	for (var id in entities) {
		var e = entities[id];

		if (e.position && e.glyph) {
			if (e.position.x >= topLeftX && e.position.x < (topLeftX + screenWidth)) {
				if (e.position.y >= topLeftY && e.position.y < (topLeftY + screenHeight)) {
					display.draw(e.position.x - topLeftX, e.position.y - topLeftY, e.glyph.character, e.glyph.foreground);
				}
			}
		}
	}
}
