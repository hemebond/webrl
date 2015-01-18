/* global CGlyph */
'use strict';


var	CONTENTS_SOLID       = 1;		// an eye is never valid in a solid
var	CONTENTS_LAVA        = 8;
var	CONTENTS_SLIME       = 16;
var	CONTENTS_WATER       = 32;
var	CONTENTS_FOG         = 64;

var CONTENTS_NOTTEAM1    = 0x0080;
var CONTENTS_NOTTEAM2    = 0x0100;
var CONTENTS_NOBOTCLIP   = 0x0200;

var	CONTENTS_AREAPORTAL  = 0x8000;

var	CONTENTS_PLAYERCLIP  = 0x10000;
var	CONTENTS_MONSTERCLIP = 0x20000;

var	CONTENTS_DETAIL      = 0x8000000;	// brushes not used for the bsp
var	CONTENTS_STRUCTURAL  = 0x10000000;	// brushes used for the bsp
var	CONTENTS_TRANSLUCENT = 0x20000000;	// don't consume surface fragments inside
var	CONTENTS_TRIGGER     = 0x40000000;
var	CONTENTS_NODROP      = 0x80000000;	// don't leave bodies or items (death fog, lava)

var	SURF_NODAMAGE        = 0x1;		// never give falling damage
var	SURF_SLICK           = 0x2;		// effects game physics
var	SURF_LADDER          = 0x8;
var	SURF_NOIMPACT        = 0x10;	// don't make missile explosions
var	SURF_NOMARKS         = 0x20;	// don't leave missile marks
var	SURF_FLESH           = 0x40;	// make flesh sounds and effects
var	SURF_NODRAW          = 0x80;	// don't generate a drawsurface at all
var	SURF_HINT            = 0x100;	// make a primary bsp splitter
var	SURF_SKIP            = 0x200;	// completely ignore, allowing non-closed brushes
var	SURF_NOLIGHTMAP      = 0x400;	// surface doesn't need a lightmap
var	SURF_METALSTEPS      = 0x1000;	// clanking footsteps
var	SURF_NOSTEPS         = 0x2000;	// no footstep sounds
var	SURF_NONSOLID        = 0x4000;	// don't collide against curves with this set
var	SURF_LIGHTFILTER     = 0x8000;	// act as a light filter during q3map -light
var	SURF_ALPHASHADOW     = 0x10000;	// do per-pixel light shadow casting in q3map
var	SURF_NODLIGHT        = 0x20000;	// don't dlight even if solid (solid lava, skies)
var SURF_DUST            = 0x40000; // leave a dust trail when walking on this surface


var Cell = function(args) {
	args = args || {};

	this._solid = (args['solid'] !== undefined) ? args['solid'] : true;
	this._blocksLight = (args['blocksLight'] !== undefined) ? args['blocksLight'] : true;
	this._entities = [];
	this._glyph = args.glyph;
};


// Adds an entity to the tile and updates properties
// like walkable, blocked, etc.
Cell.prototype.addEntity = function(entityId) {
	// Add the entity id to the tile at positionNew
	this._entities.push(entityId);
};


// Removes an entity to the tile and updates properties
// like walkable, blocked, etc.
Cell.prototype.removeEntity = function(entityId) {
	// Remove the entity id from the tile at positionOld
	var numEntities = this._entities.length;

	for (var i=0; i < numEntities; i++) {
		if (this._entities[i] == entityId) {
			this._entities.splice(i, 1);
			break;
		}
	}
};

Cell.prototype.getEntities = function() {
	// Returns all the entities within this cell
	return this._entities;
};

Cell.prototype.isBlocked = function() {
	// Check through all the entities to see if there are
	// any monsters or characters occupying the space
	if (this.isSolid()) {
		return true;
	}

	return false;
};

Cell.prototype.blocksLight = function() {
	return this._blocksLight;
};

Cell.prototype.isSolid = function() {
	return this._solid;
};

// Calculate the movement cost for this cell
// based on the terrain type and the entities contained within
Cell.prototype.moveCost = function(moveType) {
	return 0;
};

// Returns an object with terrain details of this cell
Cell.prototype.getContents = function() {
	return this._contents;
};

// Returns the Glyph for this tile/cell for text-based renderers
Cell.prototype.getGlyph = function() {
	return this._glyph;
};

Cell.emptyCell = new Cell({
	solid: false,
	blocksLight: false,
	moveCost: 1
});

Cell.dirtCell = new Cell({
	solid: true,
	blocksLight: true,
	glyph: new CGlyph('\u2022', 'green', null),
	moveCost: 1
});

Cell.stoneCell = new Cell({
	solid: true,
	blocksLight: true,
	glyph: new CGlyph('#', 'gray', null)
});

Cell.waterCell = new Cell({
	solid: false,
	blocksLight: false,
	glyph: new CGlyph('~', '#33f', '#007'),
	moveCost: 5
});
