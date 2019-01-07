		var camera, controls, controlObject, scene, renderer, canvas, canvas_container, texture, gridHelper,
		gui, customContainer, 
		holeGeo, holePlane,
		holeBaseGeo, holeBasePlane,
		groundGeo, groundPlane,
		objects=[];
		var groupHole = new THREE.Group(); groupHole.name = 'Hole';
		var groupBones = new THREE.Group(); groupBones.name = 'Bones';
		//var dragControls, // à supprimer
		manager = new THREE.LoadingManager();
		manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
			console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
		};
		manager.onError = function ( url ) {
			console.log( 'There was an error loading ' + url );
		};
		var loader = new THREE.OBJLoader(manager);


		init(); //préparer la scene 
		animate(); //boucle infinit pour l'animation 3D de la scene

		function init() {
			// chargement des textures 
			texture = new THREE.TextureLoader().load("../images/hall_ground.jpg"); 
			texture3 = new THREE.TextureLoader().load("../images/hall_ground.png");
			
			//canvas domHtmlDocument
			canvas = document.getElementById('renderer');
			canvas_container = document.getElementsByClassName('renderer_container');

			//scene
			scene = new THREE.Scene();
			scene.background = new THREE.Color( 0xE5E5E5 );

			//renderer
			renderer = new THREE.WebGLRenderer({canvas:canvas,antialias: true,clearAlpha:1});
			renderer.setSize( canvas_container[0].clientWidth, canvas_container[0].clientHeight );
			camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 4000 );
			camera.position.set( 800, 800, 0 );
			
			// controls
			controls = new THREE.OrbitControls( camera, canvas );
			controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
			controls.dampingFactor = 0.80;
			controls.screenSpacePanning = false;
			controls.minDistance = 10;
			controls.maxDistance = 2000;
			controls.maxPolarAngle = Math.PI;

			
			//controls Object
			controlObject = new THREE.TransformControls( camera, canvas );
			controlObject.addEventListener( 'dragging-changed', function ( event ) {
				controls.enabled = ! event.value;
			});
			scene.add(controlObject);


			//lights
			scene.add( new THREE.AmbientLight( 0x505050 ) );
			var light1 = new THREE.SpotLight( 0xffffff,0.5 );
			light1.position.set( 0, 1000, 1000 );
			light1.angle = Math.PI;
			scene.add(light1);

			var light2 = new THREE.SpotLight( 0xffffff,0.5 );
			light2.position.set( 0, 1000, -1000 );
			light2.angle = Math.PI;
			scene.add(light2);

			
			//AxesHelper
			var axesHelper = new THREE.AxesHelper( 800 );
			axesHelper.name = 'axesHelper';
			//Grid Helper pour la scene
			gridHelper = new THREE.GridHelper( 1400, 10, 0x505050, 0x505050 );
			gridHelper.name = 'gridHelper';
			gridHelper.add(groupHole);
			gridHelper.add(groupBones);
			gridHelper.add(axesHelper);
			scene.add(gridHelper);

			// !!!!!!! a supprimer
			//Stop orbit control when draging objects 
			// dragControls = new THREE.DragControls( objects, camera, canvas );
			// dragControls.addEventListener( 'dragstart', function () {
			// 	controls.enabled = false;
			// },false);

			// dragControls.addEventListener( 'dragend', function () {
			// 	controls.enabled = true;
			// },false);
	
			
			//Objects Controls 
			gui = new dat.GUI({ autoPlace: false } );
			customContainer = document.getElementById('gui-container');
			customContainer.appendChild(gui.domElement);

			//resize canvas on windowsResize
			window.addEventListener( 'resize', onWindowResize, false );
		}
		function onWindowResize() {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize( window.innerWidth, window.innerHeight );
		}
		function animate() {
			requestAnimationFrame( animate );
			controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
			renderer.render( scene, camera );
		}

//////////////////////////////////////////////////////////////////////////////////////////
//________________________________________________________________________________________
/*
#
#
#
#
#
#
#
#
*/
//__disable_editor_animation______________________________________________________________
//////////////////////////////////////////////////////////////////////////////////////////
		var styeleState = {
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
			for(i ; i < controlsElemLft.length ; i++){
				if(styeleState.subMenu){
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
			styeleState.subMenu = !styeleState.subMenu ;
			function dragElementLeftOut(i){
				controlsElemLft.item(i).setAttribute(
					"style","transform: translate(0px)"
				);
			}
			function dragElementLeftIn(i){
				controlsElemLft.item(i).setAttribute(
					"style","transform: translate(-72px);"
				);
			}
		
			function dragElementRightOut(i){ 
				controlsElemTop.item(i).setAttribute(
					"style","transform: translate(0px,0px)"
				);
			}
			function dragElementRightIn(i){
				controlsElemTop.item(i).setAttribute(
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
	
//////////////////////////////////////////////////////////////////////////////////////////
//________________________________________________________________________________________
/*
#
#
#
#
#
#
#
#
*/
//__Holes Controls________________________________________________________________________
//////////////////////////////////////////////////////////////////////////////////////////

		var  imageHole=['geometry.png','cylinder.png','triangle.png'],
		sceneState = {
			holeType : ""
		}
		editor = document.getElementsByClassName('editor').item(0),
		controlsElemLft = document.getElementsByClassName('sub_menu_lft')
		randomString = (length = 6, chars='0123456789abcdefghijklmnopqrstuvwxyz') => {
			var result = '_';
			for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
			return result;
		};

		/* choose hole type */
		holeType = (e,item) => {
			closeHoleSelector();
			if(scene.getObjectByName(item) !== undefined & sceneState.holeType === item){
				return;
			}
			sceneState.holeType = item;
			
			var i = groupHole.children.length -1;
			for(i ; i>=0 ; i--){
				groupHole.remove(groupHole.children[i]);
			}

			groupHole.scale.set(1,1,1);
			groupHole.name = item;
			if(gui.__folders['hole'] !== undefined) gui.removeFolder(gui.__folders['hole']);


			var hole = gui.addFolder('hole');
				hole.add(groupHole.scale, 'x', 0, 10).name('Width').listen();
				hole.add(groupHole.scale, 'y', 0, 5).name('Depth').listen();
				hole.add(groupHole.scale, 'z', 0, 10).name('Height').listen();
			hole.open;

			switch (item) {
				case "geometry.png":
					console.log("addBoxGeometry");
					holeBaseGeo = new THREE.CircleBufferGeometry(200,4);
					holeBaseGeo.rotateX(Math.PI * -0.5);
					holeBaseGeo.rotateY(Math.PI * 0.75);
					holeBasePlane = new THREE.Mesh(holeBaseGeo, new THREE.MeshPhongMaterial({map: texture3, opacity: 0.9, transparent: true, side: THREE.DoubleSide}) );
					groupHole.add(holeBasePlane);
					
					holeGeo = new THREE.CylinderBufferGeometry(200, 200, 100, 4, 0, true);
					holeGeo.rotateY(Math.PI * 0.75);
					holeGeo.translate(0,50,0);
					holePlane = new THREE.Mesh(holeGeo, new THREE.MeshPhongMaterial({map: texture3, opacity: 0.9, transparent: true, side: THREE.DoubleSide}) );
					groupHole.add(holePlane);

					groundGeo = new THREE.RingBufferGeometry( 200, 400, 4 );
					groundGeo.translate(0,0,100);
					groundGeo.rotateX(Math.PI * -0.5);
					groundGeo.rotateY(Math.PI * 0.75);
					groundPlane = new THREE.Mesh( groundGeo, new THREE.MeshPhongMaterial({map: texture, side: THREE.DoubleSide}) );
					groupHole.add( groundPlane );
					

				break;
				case "cylinder.png":
					console.log("addCylinder");
					holeBaseGeo = new THREE.CircleBufferGeometry( 200, 128 );
					holeBaseGeo.rotateX(Math.PI * 0.5);
					cylBasePlane = new THREE.Mesh(holeBaseGeo, new THREE.MeshPhongMaterial({map: texture3, opacity: 0.9, transparent: true, side: THREE.DoubleSide}) );
					groupHole.add(cylBasePlane);

					holeGeo = new THREE.CylinderBufferGeometry( 200, 200, 100, 64 ,0,true);
					holeGeo.translate(0,50,0);	
					holePlane = new THREE.Mesh(holeGeo, new THREE.MeshPhongMaterial({map: texture3, opacity: 0.9, transparent: true, side: THREE.DoubleSide}) );
					groupHole.add(holePlane);

					groundGeo = new THREE.RingBufferGeometry( 200, 400, 30 );
					groundGeo.translate(0,0,100);
					groundGeo.rotateX(Math.PI * -0.5);
					groundPlane = new THREE.Mesh(groundGeo, new THREE.MeshPhongMaterial({map: texture, side: THREE.DoubleSide}) );
					groupHole.add(groundPlane);
				break;
				case "triangle.png":
					holeBaseGeo = new THREE.CircleBufferGeometry( 200, 3 );
					holeBaseGeo.rotateX(Math.PI * 0.5);
					holeBaseGeo.translate(-50,0,0)
					holeBasePlane = new THREE.Mesh(holeBaseGeo, new THREE.MeshPhongMaterial({map: texture3, opacity: 0.9, transparent: true, side: THREE.DoubleSide}) );
					groupHole.add(holeBasePlane);

					holeGeo = new THREE.CylinderBufferGeometry( 200, 200, 100, 3 ,0,true);
					holeGeo.rotateY(Math.PI * -0.167);
					holeGeo.translate(-50,50,0);
					holePlane = new THREE.Mesh(holeGeo, new THREE.MeshPhongMaterial({map: texture3, opacity: 0.9, transparent: true, side: THREE.DoubleSide}) );
					groupHole.add(holePlane);

					groundGeo = new THREE.RingBufferGeometry( 200, 400, 3 );
					groundGeo.translate(-50,0,100);
					groundGeo.rotateX(Math.PI * -0.5);
					groundPlane = new THREE.Mesh( groundGeo, new THREE.MeshPhongMaterial({map: texture, side: THREE.DoubleSide}) );
					groupHole.add( groundPlane );
				break;
			
				default:
					break;
			}
			
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

		/* on add hole click */
		controlsElemLft.item(0).addEventListener('click',() => openHoleSelector(),false)

//////////////////////////////////////////////////////////////////////////////////////////
//________________________________________________________________________________________
/*
#
#
#
#
#
#
#
#
*/
//__Bones_Controls________________________________________________________________________
//////////////////////////////////////////////////////////////////////////////////////////
		var objectSatate = {
			objectSlected : undefined
		}
		var BonesSelect = document.getElementById('Bones');
		var controlObjectElm = document.getElementById('controls-object');

		/*Loading Bones*/
		BonesSelect.addEventListener('change',function(){
			var file = this.files[0];
			var reader = new FileReader();
			reader.onloadend = function(e) {
				var result = reader.result;
				var object = loader.parse(result);

				object.traverse( function ( child ) {
					child.name = file.name;
					objects.push(child);
					
					//if ( child.isMesh ) child.material.map = texture;
				} );
				scene.add( object );
			}
			reader.readAsText(file);
			closeEditor.click();
		},false);

		/*Select & Edit Object*/
		document.addEventListener('touchstart', onDocumentTouchStart);
		document.addEventListener('click', onDocumentMouseDown);
		function onDocumentTouchStart(event) {    
			var mouse3D = new THREE.Vector3( ( event.touches[0].clientX / window.innerWidth ) * 2 - 1,   
									-( event.touches[0].clientY / window.innerHeight ) * 2 + 1,  
									0.5 );     
			var raycaster =  new THREE.Raycaster();                                        
			raycaster.setFromCamera( mouse3D, camera );
			var intersects = raycaster.intersectObjects( objects );
			if ( intersects.length > 0 ) {
				controlObject.attach(intersects[0].object);
				onBoneSelect(intersects[0].object);
				//intersects[ 0 ].object.material.color.setHex( Math.random() * 0xffffff );
			}
		}

		function onDocumentMouseDown (event){    
			var mouse3D = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1,
									-( event.clientY / window.innerHeight ) * 2 + 1,
									0.5 );
			var raycaster =  new THREE.Raycaster();                                        
			raycaster.setFromCamera( mouse3D, camera );
			var intersects = raycaster.intersectObjects( objects );
			if ( intersects.length > 0 ) {
				controlObject.attach(intersects[ 0 ].object);
				onBoneSelect(intersects[0].object);
				console.log(intersects[0].object)
			}
		}

		function onBoneSelect (bone){
			if(gui.__folders[objectSatate.objectSlected] !== undefined & gui.__folders[objectSatate.objectSlected] === bone.name){
				return;
			}else if(gui.__folders[objectSatate.objectSlected] !== undefined & gui.__folders[objectSatate.objectSlected] !== bone.name){
				gui.removeFolder(gui.__folders[objectSatate.objectSlected]);
				boneFolderEditor(bone);
			}else{
				boneFolderEditor(bone);
			}

		}

		// Bones editor
		function boneFolderEditor (bone){
			var prams = {
				color: 0xff0000
			}
			var boneFolder = gui.addFolder(bone.name);
			    boneFolder.open();
			boneFolder.add(bone.scale, 'x', 0.1, 5).name('Scale').onChange(function(value){
				bone.scale.y = value;
				bone.scale.z = value;
			});
			boneFolder.addColor(prams,'color').onChange(function(){
				var colorObj = new THREE.Color( prams.color );
				//var hex = colorObj.getHexString();
				var css = colorObj.getStyle();
				bone.material.color.set(css);
			})
			boneFolder.add(controlObject, 'mode', { Translate: "translate", Rotate: "rotate" } ).onChange(function(value){
				controlObject.setMode(value);
			})
			objectSatate = {
				objectSlected : bone.name 
			} 
		}
		
//////////////////////////////////////////////////////////////////////////////////////////
//________________________________________________________________________________________
/*
#
#
#
#
#
#
#
#
*/
//___Bones_Selection______________________________________________________________________
//////////////////////////////////////////////////////////////////////////////////////////

	window.addEventListener('keydown',function(event){
		switch ( event.keyCode ){
			case 17 :
				var SelectedBones = new THREE.Group();
				SelectedBones.name = 'SelectedBones';


			break;

			default : console.log(event);
		}
	})




//////////////////////////////////////////////////////////////////////////////////////////
//________________________________________________________________________________________
/*
#
#
#
#
#
#
#
#
*/
//________________________________________________________________________________________
//////////////////////////////////////////////////////////////////////////////////////////





// load json models 
// var loader = new THREE.ObjectLoader();
// loader.load( "../examples/models/json/lightmap/lightmap.json", function ( object ) {
// 	scene.add( object );
// });
