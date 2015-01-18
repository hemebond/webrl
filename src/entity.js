function Entity(id) {
	if (id) {
		this.id = id;
	}
	else {
		// Generate a pseudo random ID
		this.id = (+new Date()).toString(16) +
		          (Math.random() * 100000000 | 0).toString(16) +
		          Entity.prototype._count;
	}

	// increment counter
	Entity.prototype._count++;

	return this;
}
// keep track of entities created
Entity.prototype._count = 0;

Entity.prototype.addComponent = function addComponent(component) {
	if (this[component.name] !== undefined) {
		this.removeComponent(component);
	}

	// Add component data to the entity
	this[component.name] = component;
	return this;
};
Entity.prototype.removeComponent = function removeComponent(component) {
	// Remove component data by removing the reference to it.
	// Allows either a component function or a string of a component name to be
	// passed in
	var componentName;

	if (typeof component === 'function') {
		componentName = component.prototype.name;
	}
	else {
		componentName = component.name;
	}

	if (this[componentName].destroy) {
		this[componentName].destroy();
	}

	delete this[componentName];
	return this;
};

Entity.prototype.print = function print() {
	// Function to print / log information about the entity
	console.log(JSON.stringify(this, null, 4));
	return this;
};


Entity.prototype.hasComponent = function(component) {
	// console.log(component);

	var componentName;

	if (typeof component === 'function') {
		componentName = component.prototype.name;
	}
	else {
		componentName = component.name;
	}

	if (this[componentName] !== undefined) {
		return true;
	}

	return false;
};

Entity.prototype.add = function(component) {
	// console.log(component);
	// console.log(component.name);
	// Add a component
	return this.addComponent(component);
};

Entity.prototype.del = function(component) {
	// Remove a component from the entity
	return this.removeComponent(component);
};

Entity.prototype.has = function(component) {
	return this.hasComponent(component);
};