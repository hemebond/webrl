// global CAction

function actionSystem(args) {
	var entities = args.entities;

	for (var id in entities) {
		var e = entities[id];

		if (e.hasComponent(CAction)) {
			//console.log('hasComponent action');

			if (e.action.currentAction !== null) {
				// Reduce the timeRemaining by one turn/tick
				e.action.timeRemaining -= 1;

				if (e.action.timeRemaining === 0) {
					// This is the speed or distance travelled when moving
					var speed = 1;

					switch (e.action.currentAction) {
						case 'MOVE_N':
							e.movable.y = -speed;
							break;
						case 'MOVE_NE':
							e.movable.x = speed;
							e.movable.y = -speed;
							break;
						case 'MOVE_E':
							e.movable.x = speed;
							break;
						case 'MOVE_SE':
							e.movable.x = speed;
							e.movable.y = speed;
							break;
						case 'MOVE_S':
							e.movable.y = speed;
							break;
						case 'MOVE_SW':
							e.movable.x = -speed;
							e.movable.y = speed;
							break;
						case 'MOVE_W':
							e.movable.x = -speed;
							break;
						case 'MOVE_NW':
							e.movable.x = -speed;
							e.movable.y = -speed;
							break;
					}

					e.action.currentAction = null;
					e.del(e.action);
				}
			}
		}
	}
}