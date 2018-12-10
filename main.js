var camera, controls, scene, renderer, canvas, canvas_container, texture, gridHelper,
gui, customContainer, face1, face1, face2, face3, face4, face5, face12, face13, face14, face15, 
plane1, plane2, plane3, plane4, plane5, plane12, plane13, plane14, plane15, 
groupHole = new THREE.Group();
	init();
	animate();

	function init() {
		// chargement des textures 
		texture = new THREE.TextureLoader().load("../images/ground1.jpg"); 
		texture3 = new THREE.TextureLoader().load("../images/hall_ground.jpg");
		
		canvas = document.getElementById('renderer');
		canvas_container = document.getElementsByClassName('renderer_container');

		scene = new THREE.Scene();
		scene.background = new THREE.Color( 0xE5E5E5 );
		//scene.background = texture2;
		//scene.fog = new THREE.FogExp2( 0xE3E3E3, 0.0002 );


		renderer = new THREE.WebGLRenderer({canvas:canvas,antialias: true,clearAlpha:1});
		renderer.setSize( canvas_container[0].clientWidth, canvas_container[0].clientHeight );
		camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 4000 );
		camera.position.set( 2000, 800, 0 );
		// controls
		controls = new THREE.OrbitControls( camera, canvas );
		//controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
		controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
		controls.dampingFactor = 0.80;
		controls.screenSpacePanning = false;
		controls.minDistance = 10;
		controls.maxDistance = 2000;
		controls.maxPolarAngle = Math.PI/2;


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

		gui = new dat.GUI({ autoPlace: false } );
		customContainer = document.getElementById('gui-container');
		customContainer.appendChild(gui.domElement);
	}
	function animate() {
		requestAnimationFrame( animate );
		controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
		renderer.render( scene, camera );
	}





































	var state = {
		subMenu : false },
		menuDevlop = document.getElementById('menu-devlop'),
		closeEditor = document.getElementById('enable'),
		openEditor = document.getElementsByClassName('editor'),
		controlsElemLft = document.getElementsByClassName('sub_menu_lft'),
		controlsElemTop = document.getElementsByClassName('sub_menu_top'),  
		i=0;
	
	// show and hide controls elements    
	menuDevlop.addEventListener('click',function(){
		var i=0;
		for(i ; i < 6 ; i++){
			if(state.subMenu){
				(function(i){
					setTimeout(function(){
						dragElementLeftIn(i);
					}, 50 * (i + 1));
				})(i);
	
				(function(i){
					setTimeout(function(){
						dragElementRightIn(i);
					}, 50 * (i + 1));
				})(i);
			}else{
				(function(i){
					setTimeout(function(){
						dragElementLeftOut(i);
					}, 100 * (i + 1));
				})(i);
	
				(function(i){
					setTimeout(function(){
						dragElementRightOut(i);
					}, 100 * (i + 1));
				})(i);
			}
	
		}
		state.subMenu = !state.subMenu ;
		function dragElementLeftOut(i){
			document.getElementsByClassName('sub_menu_lft').item(i).setAttribute(
				"style","transform: translate(0px)"
			);
		}
		function dragElementLeftIn(i){
			document.getElementsByClassName('sub_menu_lft').item(i).setAttribute(
				"style","transform: translate(-72px);"
			);
		}
	
		function dragElementRightOut(i){ 
			document.getElementsByClassName('sub_menu_top').item(i).setAttribute(
				"style","transform: translate(0px,0px)"
			);
		}
		function dragElementRightIn(i){
			document.getElementsByClassName('sub_menu_top').item(i).setAttribute(
				"style","transform: translate(0px,-72px);"
			);
		}
	},false);
	
	// enable Editor
	(function(){
		for(i;i<controlsElemLft.length;i++){
			controlsElemLft.item(i).addEventListener('click',function(){
				openEditor[0].setAttribute(
					"style","transform: scale(1,1)"
				)
			},false);
			controlsElemTop.item(i).addEventListener('click',function(){
				openEditor[0].setAttribute(
					"style","transform: scale(1,1)"
				)
			},false);
		}
	})();
	
	// disable Editor
	closeEditor.addEventListener('click',function(){
		this.parentElement.setAttribute(
			"style","transform: scale(0,0)"
		)
	},false);
	
	


























var  imageHole=['geometry.png','cylinder.png','triangle.png'],
editor = document.getElementsByClassName('editor').item(0),
controlsElemLft = document.getElementsByClassName('sub_menu_lft'),
randomString = (length = 6, chars='0123456789abcdefghijklmnopqrstuvwxyz') => {
    var result = '_';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
};

//____hole controls__________________________________________________________________

/* choose hole type */
holeType = (e,item) => {
	closeHoleSelector();
	if(scene.getObjectByName('hole') !== undefined){
		return;
	}
	groupHole.scale.set(1,1,1);
	groupHole.name = "hole";
	scene.add(groupHole);
	if(!gui.__folders.Hole){
		var hole = gui.addFolder('Hole');
			hole.add(groupHole.scale, 'x', 0, 10).name('Width').listen();
			hole.add(groupHole.scale, 'y', 0, 5).name('Depth').listen();
			hole.add(groupHole.scale, 'z', 0, 10).name('Height').listen();
	}

	face1 = new THREE.PlaneGeometry(300, 200, 0, 0);
	face1.translate(0, 100, -200);
	plane1 = new THREE.Mesh(face1, new THREE.MeshPhongMaterial({map: texture3, opacity: 0.9, transparent: true, side: THREE.DoubleSide}));
	groupHole.add(plane1);

	face2 = new THREE.PlaneGeometry(300, 200, 0, 0);
	face2.translate(0, 100, 200);
	plane2 = new THREE.Mesh(face2, new THREE.MeshPhongMaterial({map: texture3, opacity: 0.9, transparent: true, side: THREE.DoubleSide}));
	groupHole.add(plane2);

	face3 = new THREE.PlaneGeometry(400, 200, 0, 0);
	face3.translate(0, 100, 150);
	face3.rotateY(Math.PI * -0.5);
	plane3 = new THREE.Mesh(face3, new THREE.MeshPhongMaterial({map: texture3, opacity: 0.9, transparent: true, side: THREE.DoubleSide}));
	groupHole.add(plane3);

	face4 = new THREE.PlaneGeometry(400, 200, 0, 0);
	face4.translate(0, 100, 150);
	face4.rotateY(Math.PI * 0.5);
	plane4 = new THREE.Mesh(face4, new THREE.MeshPhongMaterial({map: texture3, opacity: 0.9, transparent: true, side: THREE.DoubleSide}));
	groupHole.add(plane4);

	face5 = new THREE.PlaneGeometry(300, 400, 0, 0);
	face5.translate(0, 0, 0);
	face5.rotateX(Math.PI * 0.5);
	plane5 = new THREE.Mesh(face5, new THREE.MeshPhongMaterial({map: texture3, opacity: 0.9, transparent: true, side: THREE.DoubleSide}));
	groupHole.add(plane5);

	// // la terre
	// face12 = new THREE.PlaneGeometry(1100, 400, 0, 0);
	// face12.translate(0, 400, -100);
	// face12.rotateX(Math.PI * 0.5);
	// plane12 = new THREE.Mesh(face12, new THREE.MeshPhongMaterial({map: texture, side: THREE.DoubleSide}));
	// groupGround.add(plane12);

	// face13 =  new THREE.PlaneGeometry(1100, 400, 0, 0);
	// face13.translate(0, -400, -100);
	// face13.rotateX(Math.PI * 0.5);
	// plane13 = new THREE.Mesh(face13, new THREE.MeshPhongMaterial({map: texture, side: THREE.DoubleSide}));
	// groupGround.add(plane13);

	// face14 =  new THREE.PlaneGeometry(400, 400, 0, 0);
	// face14.translate(350, 0, -100);
	// face14.rotateX(Math.PI * 0.5);
	// plane14 = new THREE.Mesh(face14, new THREE.MeshPhongMaterial({map: texture, side: THREE.DoubleSide}));
	// groupGround.add(plane14);

	// face15 =  new THREE.PlaneGeometry(400, 400, 0, 0);
	// face15.translate(-350, 0, -100);
	// face15.rotateX(Math.PI * 0.5);
	// plane15 = new THREE.Mesh(face15, new THREE.MeshPhongMaterial({map: texture, side: THREE.DoubleSide}));
	// groupGround.add(plane15);
}

/* hole selector interface */
openHoleSelector = () => {
    if(editor.childElementCount === 2){
        return;
    }
    var _hole_type = document.createElement('div');
    _hole_type.setAttribute('class','_hole_type');

    imageHole.forEach( (item, index) => {
        var type = document.createElement('div');
        type.setAttribute('class','type '+randomString());
        type.addEventListener('click',(event) => holeType(event,item),false);
        var img = document.createElement('img');
        img.setAttribute('src','images/hole/'+item);

        type.appendChild(img);
        _hole_type.appendChild(type);
    })

    editor.appendChild(_hole_type);
}
closeHoleSelector = () =>{
    var holeType = document.getElementsByClassName('_hole_type').item(0);
    holeType.setAttribute('style','transform:translate(-200px);opacity:0;');
    (function(){
        setTimeout(function(){
            closeEditor.click();
            holeType.remove();
        }, 400 );
    })();
}


//____Events__________________________________________________________________

/* on add hole click */
controlsElemLft.item(0).addEventListener('click',() => openHoleSelector(),false)

/* on choose hole type */







//____ligth controls__________________________________________________________________
	
	







// load json models 
// var loader = new THREE.ObjectLoader();
// loader.load( "../examples/models/json/lightmap/lightmap.json", function ( object ) {
// 	scene.add( object );
// });
