function movementSystem(args) {
	var world = args.world;
	var entities = world.entities;

	// All entities move 1 so this will reset motion
	// but it should depend on terrain properties too
	var dampening = 1;

	for (var id in entities) {
		var e = entities[id];

		if (e.position && e.movable) {
			var newPosition = {
				x: e.position.x + e.movable.x,
				y: e.position.y + e.movable.y,
				z: e.position.z + e.movable.z
			};

			// Check the cell at the new position to
			// make sure it's not blocked
			var targetCell = world.getCell(newPosition.x, newPosition.y, newPosition.z);
			// console.log(targetCell);
			// console.log(targetCell.isSolid());
			// console.log(targetCell.isBlocked());

			if (targetCell !== undefined && !targetCell.isBlocked()) {
				// Cell is not blocked
				//console.log('cell is not blocked');

				// Remove the entity id from the current cell
				world.getCell(e.position.x, e.position.y, 1).removeEntity(e.id);

				e.position.x = newPosition.x;
				e.position.y = newPosition.y;

				// Add the entity id to the target cell
				world.getCell(e.position.x, e.position.y, 1).addEntity(e.id);
			}

			if (e.movable.x <= -dampening) {
				e.movable.x += dampening;
			}
			else if (e.movable.x >= dampening) {
				e.movable.x -= dampening;
			}

			if (e.movable.y <= -dampening) {
				e.movable.y += dampening;
			}
			else if (e.movable.y >= dampening) {
				e.movable.y -= dampening;
			}

			document.getElementById('console').innerHTML = e.position.x +','+ e.position.y +','+ e.position.z;
		}
	}
}