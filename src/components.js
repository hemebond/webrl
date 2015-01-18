'use strict';


//
// Health
//
var CHealth = function(max, current) {
	this.max = max;
	this.current = current;
};
CHealth.prototype.name = 'health';

//
// Action
//
var CAction = function(action, timeRemaining) {
	this.currentAction = action;
	this.timeRemaining = timeRemaining;
};
CAction.prototype.name = 'action';


//
// Position
//
var CPosition = function(x, y, z, rotation) {
	this.x = x;
	this.y = y;
	this.z = (z !== undefined) ? z : 1;
	this.rotation = (rotation !== undefined) ? rotation : 0;
};
CPosition.prototype.name = 'position';


//
// Collidable
//
var CCollidable = function(collisionType) {
	this.type = collisionType;
};
CCollidable.prototype.name = 'collidable';


//
// Glyph
//
var CGlyph = function(character, fgColour, bgColour) {
	this.character = character;
	this.foreground = fgColour;
	this.background = bgColour;
};
CGlyph.prototype.name = 'glyph';


//
// Movable
//
var CMovable = function(x, y, z, rotation) {
	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;
	this.rotation = (typeof rotation !== 'undefined') ? rotation : 0;
};
CMovable.prototype.name = 'movable';


//
// PlayerInput
//
var CPlayerInput = function(inputType) {
};
CPlayerInput.prototype.name = 'playerinput';


//
// AttackMove
//
// Moves in a direction if destination is empty of hostiles,
// otherwise the entity will attack the hostile entity
var CAttackMove = function(direction) {
};
CAttackMove.prototype.name = 'attackmove';


//
// Container
//
// Entity can contain other entities
var CContainer = function() {
	this.volume = 0;
};
CContainer.prototype.name = 'container';


//
// Physical
//
// The entity is a physical object
var CPhysical = function() {
	this.weight = 0;
	this.volume = 0;
};
CPhysical.prototype.name = 'physical';


//
// Armour
//
var CArmour = function() {
	this.protection = 0;
};
CArmour.prototype.name = 'armour';


//
// Weapon
//
var CWeapon = function() {

};

//
// Stim
//
var CStim = function() {

};


//
// CTrigger
//
var CTrigger = function() {

};
CTrigger.prototype.name = 'trigger';
