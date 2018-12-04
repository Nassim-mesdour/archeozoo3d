var camera, controls, scene, renderer, canvas, canvas_container, texture, gridHelper;
	init();
	//render(); // remove when using next line for animation loop (requestAnimationFrame)
	animate();

	function init() {
		// chargement des textures 
		texture = new THREE.TextureLoader().load("../images/ground1.jpg"); 
		texture2 = new THREE.TextureLoader().load("../images/sky.jpg");
		texture3 = new THREE.TextureLoader().load("../images/hall_ground.jpg");
		
		canvas = document.getElementById('renderer');
		canvas_container = document.getElementsByClassName('renderer_container');

		scene = new THREE.Scene();
		scene.background = new THREE.Color( 0xE5E5E5 );
		//scene.background = texture2;
		//scene.fog = new THREE.FogExp2( 0xE3E3E3, 0.0002 );


		renderer = new THREE.WebGLRenderer({canvas:canvas,antialias: true});
		renderer.setSize( canvas_container[0].clientWidth, canvas_container[0].clientHeight );
		camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 2000 );
		camera.position.set( 900, 600, 0 );
		// controls
		controls = new THREE.OrbitControls( camera, canvas );
		//controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
		controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
		controls.dampingFactor = 0.80;
		controls.screenSpacePanning = false;
		controls.minDistance = 10;
		controls.maxDistance = 1000;
		controls.maxPolarAngle = Math.PI;

		//Plan
		// var plan = new THREE.PlaneGeometry(1000, 1000, 100, 100);
		// var material = new THREE.MeshBasicMaterial( { 
		// 	//color: 0xffffff,
		// 	//flatShading: true,
		// 	//map : texture,
		// 	opacity: 1,
		// 	side: THREE.DoubleSide 
		// });
		// var mesh2 = new THREE.Mesh(plan,material);
		// mesh2.rotation.x = -50 * Math.PI / 100;
		// mesh2.rotation.y = 0;
		// scene.add(mesh2);


		//hall
		// var hallGeometry = new THREE.BoxGeometry( 800, 200, 800 );
		// var hallMaterial = new THREE.MeshPhongMaterial( {map: texture3, opacity:0.95} );
		// hallMaterial.transparent = true ;     
		// hallMaterial.side = THREE.DoubleSide ; 
		// var cube = new THREE.Mesh( hallGeometry, hallMaterial );
		// cube.position.y = 100;
		// scene.add( cube );


		//another holl
		var group = new THREE.Group();
		//group.scale.set(2,2,3);
		scene.add(group);

		// hall
		let face1 = new THREE.PlaneGeometry(300, 100, 0, 0);
		face1.translate(0, 50, -200);

		let face2 = new THREE.PlaneGeometry(300, 100, 0, 0);
		face2.translate(0, 50, 200);

		let face3 = new THREE.PlaneGeometry(400, 100, 0, 0);
		face3.translate(0, 50, 150);
		face3.rotateY(Math.PI * -0.5);

		let face4 = new THREE.PlaneGeometry(400, 100, 0, 0);
		face4.translate(0, 50, 150);
		face4.rotateY(Math.PI * 0.5);

		let face5 = new THREE.PlaneGeometry(300, 400, 0, 0);
		face5.translate(0, 0, 0);
		face5.rotateX(Math.PI * 0.5);

		// la terre
		let face12 = new THREE.PlaneGeometry(2300, 1000, 0, 0);
		face12.translate(0, 700, -100);
		face12.rotateX(Math.PI * 0.5);

		let face13 =  new THREE.PlaneGeometry(2300, 1000, 0, 0);
		face13.translate(0, -700, -100);
		face13.rotateX(Math.PI * 0.5);

		let face14 =  new THREE.PlaneGeometry(1000, 400, 0, 0);
		face14.translate(650, 0, -100);
		face14.rotateX(Math.PI * 0.5);

		let face15 =  new THREE.PlaneGeometry(1000, 400, 0, 0);
		face15.translate(-650, 0, -100);
		face15.rotateX(Math.PI * 0.5);

		let plane1 = new THREE.Mesh(face1, new THREE.MeshPhongMaterial({map: texture3, opacity: 0.9, transparent: true, side: THREE.DoubleSide}));
		group.add(plane1);

		let plane2 = new THREE.Mesh(face2, new THREE.MeshPhongMaterial({map: texture3, opacity: 0.9, transparent: true, side: THREE.DoubleSide}));
		group.add(plane2);

		let plane3 = new THREE.Mesh(face3, new THREE.MeshPhongMaterial({map: texture3, opacity: 0.9, transparent: true, side: THREE.DoubleSide}));
		group.add(plane3);

		let plane4 = new THREE.Mesh(face4, new THREE.MeshPhongMaterial({map: texture3, opacity: 0.9, transparent: true, side: THREE.DoubleSide}));
		group.add(plane4);

		let plane5 = new THREE.Mesh(face5, new THREE.MeshPhongMaterial({map: texture3, opacity: 0.9, transparent: true, side: THREE.DoubleSide}));
		group.add(plane5);


		let plane12 = new THREE.Mesh(face12, new THREE.MeshPhongMaterial({map: texture, side: THREE.DoubleSide}));
		group.add(plane12);
		let plane13 = new THREE.Mesh(face13, new THREE.MeshPhongMaterial({map: texture, side: THREE.DoubleSide}));
		group.add(plane13);
		let plane14 = new THREE.Mesh(face14, new THREE.MeshPhongMaterial({map: texture, side: THREE.DoubleSide}));
		group.add(plane14);
		let plane15 = new THREE.Mesh(face15, new THREE.MeshPhongMaterial({map: texture, side: THREE.DoubleSide}));
		group.add(plane15);


		//lights
		var light = new THREE.DirectionalLight( 0xffffff );
		light.position.set( 1, 1, 1 );
		scene.add( light );
		var light = new THREE.DirectionalLight( 0xffffff );
		light.position.set( - 1, - 1, - 1 );
		scene.add( light );
		var light = new THREE.AmbientLight( 0xffffff );
		scene.add( light );
		gridHelper = new THREE.GridHelper( 800, 20, 0xffffff, 0xffffff );
		scene.add( gridHelper );
		
	}
	function animate() {
		requestAnimationFrame( animate );
		controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
		renderer.render( scene, camera );
	}








// load json models 
// var loader = new THREE.ObjectLoader();
// loader.load( "../examples/models/json/lightmap/lightmap.json", function ( object ) {
// 	scene.add( object );
// });