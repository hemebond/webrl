function cameraSystem(args) {
	var entities = args.world.entities;

	var camera = entities['_camera'];
	var player = entities['_player'];

	camera.position.x = player.position.x;
	camera.position.y = player.position.y;
}
