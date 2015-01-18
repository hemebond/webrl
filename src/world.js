/* global console */
/* global ROT */
/* global Cell */
/* global Entity */

'use strict';

var Region = function(size) {
	this.cells = {};
	this.size = size;
};


//
// World
//
var World = function(width, height, seed) {
	var world = this;
	this.cells = {};
	this.regions = {};
	this.entities = {};
	this.width = width;
	this.height = height;

	this.REGION_SIZE = 32;

	// Generate some regions which in turn will create the cells within that region
	for (var x=-1; x <= 1; x++) {
		for (var y=-1; y <= 1; y++) {
			var pos = [x, y].join(',');
			this.generateRegionCells(x, y, this.REGION_SIZE);
		}
	}

	// console.log(this.cells);
};

	// returns a tile object at the location x, y, z
World.prototype.getCell = function(x, y, z) {
	// Default to ground-level
	z = (z !== undefined) ? z : 0;

	// Generate the id string
	var pos = [x, y, z].join(',');

	// Create the cell if it doesn't already exist
	// if (this.cells[pos] === undefined) {
	// 	this.cells[pos] = Cell.emptyCell;
	// }

	return this.cells[pos];
};


World.prototype.setCell = function(cellType, x, y, z) {
	// If no z-level provided, assume ground level
	z = (z !== undefined) ? z : 0;

	// Generate the coordinate string for the id
	var pos = [x, y, z].join(',');

	// Set the cell to the cell type provided
	this.cells[pos] = cellType;

	return this.cells[pos];
};


World.prototype.addEntity = function(id) {
	var e = new Entity(id);
	this.entities[e.id] = e;
	return e;
};


//
// Generates a group of cells
//
World.prototype.generateRegionCells = function(regionX, regionY, regionSize, regionSeed) {
	// Initialise and build the world
	// biomes
	// entities
	// terrain
	var that = this;

	this.regions[[regionX, regionY].join(',')] = true;

	if (regionSeed !== undefined) {
		ROT.RNG.setSeed(regionSeed);
	}

	// Create a new generator
	var generator = new ROT.Map.Cellular(regionSize, regionSize);
	generator.randomize(0.5);

	// Iteratively smoothen the map
	var totalIterations = 5;
	for (var i=0; i < totalIterations - 1; i++) {
		generator.create();
	}

	generator.create(function(x, y, value) {
		// First translate x and y for this region
		var cellX = x + (regionSize * regionX);
		var cellY = y + (regionSize * regionY);

		// console.log([cellX, cellY].join(','));

		// Set the cell type for the ground and
		// for the current level (where the player is)
		var id0 = [cellX, cellY, 0].join(',');
		var id1 = [cellX, cellY, 1].join(',');

		if (value === 0) {
			this.setCell(Cell.dirtCell, cellX, cellY, 0);
			this.setCell(Cell.emptyCell, cellX, cellY, 1);
		}
		else {
			this.setCell(Cell.stoneCell, cellX, cellY, 0);
			this.setCell(Cell.stoneCell, cellX, cellY, 1);
		}

		// console.log(this.getCell(id1));
	}.bind(this));

	var regionTop = regionY * regionSize;
	var regionRight = (regionX * regionSize) + regionSize;
	var regionBottom = (regionY * regionSize) + regionSize;
	var regionLeft = regionX * regionSize;

	// Generate some bodies of water
	var waterMaxLoops = 10; // max number of water bodies
	var waterMaxSize = 20; // max number of water cells for a body of water
	var waterX, waterY, tx, ty, cell;
	for (var wtr=0; wtr < waterMaxLoops; wtr++) {
		// First find an empty cell just above ground level
		do {
			tx = waterX = Math.floor(Math.random() * regionSize) + (regionX * regionSize);
			ty = waterY = Math.floor(Math.random() * regionSize) + (regionY * regionSize);
		} while (this.getCell(waterX, waterY, 1).isSolid());

		// Set the initial water cell
		this.setCell(Cell.waterCell, waterX, waterY, 0);

		for (var i=0; i < waterMaxSize; i++) {
			var targetCell;
			// which direction do we try next
			var dir = Math.floor(Math.random() * 4);

			if (dir === 0) {
				// up
				if ((waterY - 1) > regionTop) {
					ty = waterY - 1;
				}
			}
			else if (dir === 1) {
				// right
				if ((waterX + 1) < regionRight) {
					tx = waterX + 1;
				}
			}
			else if (dir === 2) {
				// down
				if ((waterY + 1) < regionBottom) {
					ty = waterY + 1;
				}
			}
			else if (dir === 3) {
				// left
				if ((waterX -1) > regionLeft) {
					tx = waterX - 1;
				}
			}

			// Check the above-ground cell is not solid
			var cell = this.getCell(tx, ty, 1);

			// console.log([tx, ty, 1].join(','));
			if (cell === undefined) {
				console.log('cell is undefined');
				console.log(this.cells);
			}

			if (cell !== undefined && !cell.isSolid()) {
				this.setCell(Cell.waterCell, tx, ty, 0);

				waterX = tx;
				waterY = ty;
			}
		}
	}
};

World.prototype.getRegion = function(x, y) {
	// Create the position string
	var pos = [x, y].join(',');

	return this.regions[pos];
};

World.prototype.getCellsRelativeTo = function(x, y, z) {
	// Returns the "cube" of cells, as a dict, around a cell

	// dict for the cells
	var cells = {};

	// Start with cells below
	for (var dz = -1; dz <= 1; dz--) {
		// Go left to right
		for (var dx = -1; dx <= 1; dx++) {
			// Row by row
			for (var dy = -1; dy <= 1; dy++) {
				var cell = this.getCell(x + dx, y + dy, z + dz);
				var pos = [dx, dy, dz].join(',');

				cells[pos] = cell;
			}
		}
	}
	return cells;
};
