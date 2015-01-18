var Game = {
	_display: null,
	_currentScreen: null,
	_time: 0,

	init: function() {
		var game = this;

		// Load the tileset
		this.tileSet = document.createElement('img');
		this.tileSet.src = '/static/img/retrodaystiles20.png';

		// Display options with tileset
		var options = {
			layout: 'tile',
			bg: 'transparent',
			tileWidth: 20,
			tileHeight: 20,
			tileSet: this.tileSet,
			tileMap: {
				'@': [140, 520],
				'#': [100, 1200],
				'\u2022': [100, 0],
				'~': [80, 480]
			},
			width: 32,
			height: 32
		};

		this._display = new ROT.Display(options);
		this._world = new World(64, 64, 1234);

		var player = this._world.addEntity('_player')
			.add(new CPosition(4, 4, 1))
			.add(new CGlyph('@', 'white', null))
			.add(new CMovable())
			.add(new CHealth(100, 100));

		var camera = this._world.addEntity('_camera')
			.add(new CPosition(16, 16));

		document.body.addEventListener('keydown', this.handleInput, false);
		document.body.addEventListener('keyup', this.handleInput, false);
		document.body.addEventListener('keypress', this.handleInput, false);
	},

	getDisplay: function() {
		return this._display;
	},

	handleInput: function(e) {
		// console.log('handleInput');

		var player = Game._world.entities['_player'];
		var action = null;

		if (e.type === 'keydown') {
			// console.log('keydown');

			switch (e.keyCode) {
				case ROT.VK_UP:
					action = 'MOVE_N';
					time = 1;
					break;
				case ROT.VK_RIGHT:
					action = 'MOVE_E';
					time = 1;
					break;
				case ROT.VK_DOWN:
					action = 'MOVE_S';
					time = 1;
					break;
				case ROT.VK_LEFT:
					action = 'MOVE_W';
					time = 1;
					break;
			}

			player.add(new CAction(action, time));
		}
		else if (e.type === 'keypress') {
			//console.log('keypress');
		}
		else if (e.type === 'keyup') {
			//console.log('keyup');
		}

		// Only progress the game if the user input has
		// resulted in an action
		if (action !== null) {
			Game.update();
		}
	},

	update: function(timeDelta) {
		// console.log('Game.update()');
		document.getElementById('time').innerHTML = this._time++;

		regionSystem({
			world: Game._world
		});

		actionSystem({
			entities: Game._world.entities
		});

		movementSystem({
			world: Game._world
		});

		cameraSystem({
			world: Game._world
		});

		renderSystem({
			world: Game._world,
			display: Game.getDisplay()
		});

		if (this._world.entities['_player'].has(CAction)) {
			this._intervalId = setInterval(this.update(), 0);
		}
	}
};

window.onload = function() {
	// Check if rot.js can work on this browser
	if (!ROT.isSupported()) {
		alert("The rot.js library isn't supported by your browser.");
	} else {
		// Initialise the game
		Game.init();

		// Add the container to the HTML
		document.body.appendChild(Game.getDisplay().getContainer());

		Game.update();
	}
};
