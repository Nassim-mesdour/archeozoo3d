var camera, controls, controlObject, scene, renderer, canvas, canvas_container, texture, gridHelper,
gui, customContainer, 
objects=[];
var groupHole = new THREE.Group(); groupHole.name = 'Hole';
var groupBones = new THREE.Group(); groupBones.name = 'Bones';

// chargement des textures 
texture = new THREE.TextureLoader().load("../assets/images/hall_ground.jpg"); 
texture3 = new THREE.TextureLoader().load("../assets/images/hall_ground.png");

//canvas domHtmlDocument
canvas = document.getElementById('renderer');
canvas_container = document.getElementsByClassName('renderer_container');
//var dragControls, // à supprimer
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
//__Load project__________________________________________________________________________
//////////////////////////////////////////////////////////////////////////////////////////

var _loadProject = document.getElementById('project');
_loadProject.addEventListener('change',

function(){
//scene.remove(scene.getObjectByName('gridHelper'));
loadingStart();
var progress = document.getElementsByClassName('progress').item(0);
var progress_num = document.getElementsByClassName('progress_num').item(0);
var i = groupBones.children.length - 1;
for(i;i>=0;i--){
	groupBones.remove(groupBones.children[i]);
}
objects = [];
var file = this.files[0];
var reader = new FileReader();
reader.onprogress = function(e){
	var value = parseInt( ((e.loaded / e.total) * 100), 10 );
	progress.setAttribute('style','width:'+value+'%;');
	progress_num.innerHTML = value+'%';
}
reader.onloadend = function(e) {
	var loader = new THREE.ObjectLoader();
	var result = reader.result;
	resultJson = JSON.parse(result);
	var object = loader.parse(resultJson);
	for(i = object.children[1].children.length - 1 ; i>=0 ;i--){
		object.children[1].children[i].traverse( function ( child ) {
			objects.push(child);
			//if ( child.isMesh ) child.material.map = texture;
		});
	}


	groupHole.copy(object.children[0]);
	for(i = object.children[1].children.length - 1 ; i>=0 ;i--){
		groupBones.add(object.children[1].children[i]);
	}
	closeEditor.click();
	loadingEnd();
	progress.setAttribute('style','width:0%;');
	progress_num.innerHTML = '0%';
}
reader.readAsText(file);

if(gui.__folders['hole'] !== undefined) gui.removeFolder(gui.__folders['hole']);

var hole = gui.addFolder('hole');
	hole.add(groupHole.scale, 'x', 1, 6).name('Width').listen();
	hole.add(groupHole.scale, 'y', 1, 6).name('Depth').listen();
	hole.add(groupHole.scale, 'z', 1, 6).name('Height').listen();
hole.open;

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
//__Load project__________________________________________________________________________
//////////////////////////////////////////////////////////////////////////////////////////

init(); //préparer la scene 
animate(); //boucle infinit pour l'animation 3D de la scene

function init() {

	//scene
	scene = new THREE.Scene();
	scene.background = new THREE.Color(0xd4d4d4);

	//renderer
	renderer = new THREE.WebGLRenderer({canvas:canvas,antialias: true,clearAlpha:0});
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( canvas_container[0].clientWidth, canvas_container[0].clientHeight );
	camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 4000 );
	camera.position.set( 800, 800, 0 );
	
	// controls
	controls = new THREE.OrbitControls( camera, canvas );
	controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
	controls.dampingFactor = 0.80;
	controls.screenSpacePanning = false;
	controls.minDistance = 10;
	controls.maxDistance = 3000;
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
	var axesHelper = new THREE.AxesHelper( 600 );
	axesHelper.name = 'axesHelper';
	//Grid Helper pour la scene
	gridHelper = new THREE.GridHelper( 1200,12 );
	gridHelper.name = 'gridHelper';
	gridHelper.add(groupHole);
	gridHelper.add(groupBones);
	scene.add(axesHelper);
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
function onWindowResize(){
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}
function animate(){
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
			"style","transform: scale(1)"
		);
	}
	function dragElementLeftIn(i){
		controlsElemLft.item(i).setAttribute(
			"style","transform: scale(0);"
		);
	}

	function dragElementRightOut(i){ 
		controlsElemTop.item(i).setAttribute(
			"style","transform: scale(1)"
		);
	}
	function dragElementRightIn(i){
		controlsElemTop.item(i).setAttribute(
			"style","transform: scale(0);"
		);
	}
},false);

// enable Editor
(function(){
	var addHole = document.getElementById('add_hole');
	addHole.addEventListener('click',function(){
		openEditor[0].setAttribute(
			"style","transform: scale(1,1)"
		)
	},false);

	var addGrid = document.getElementById('add_grid');
	addGrid.addEventListener('click',function(){
		openEditor[0].setAttribute(
			"style","transform: scale(1,1)"
		)
	},false);
})();

// disable Editor
closeEditor.addEventListener('click',function(){
	this.parentElement.setAttribute(
		"style","transform: scale(0,0)"
	)
	this.parentElement.children[1] ? this.parentElement.children[1].remove() : false;
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
editor = document.getElementsByClassName('editor').item(0);
var addHole = document.getElementById('add_hole');
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
		hole.add(groupHole.scale, 'x', 1, 6).name('Width').listen();
		hole.add(groupHole.scale, 'y', 1, 6).name('Depth').listen();
		hole.add(groupHole.scale, 'z', 1, 6).name('Height').listen();
	hole.open;
	var holeGeo, holePlane,
	holeBaseGeo, holeBasePlane,
	groundGeo, groundPlane;
	switch (item) {
		case "geometry.png":
			holeBaseGeo = new THREE.CircleBufferGeometry(141.4213562373095,4,Math.PI * 0.75);
			holeBasePlane = new THREE.Mesh(holeBaseGeo, new THREE.MeshPhongMaterial({map: texture3, opacity: 0.9, transparent: true, side: THREE.DoubleSide}) );
			holeBasePlane.rotateX(Math.PI * -0.5);
			groupHole.add(holeBasePlane);
			
			holeGeo = new THREE.CylinderBufferGeometry(141.4213562373095, 141.4213562373095, 100, 4, 0, true,Math.PI * 0.75);
			holePlane = new THREE.Mesh(holeGeo, new THREE.MeshPhongMaterial({map: texture3, opacity: 0.9, transparent: true, side: THREE.DoubleSide}) );
			holePlane.translateY(50);
			groupHole.add(holePlane);

			groundGeo = new THREE.RingBufferGeometry( 141.4213562373095, 400,4, 1,Math.PI * 0.75);
			groundPlane = new THREE.Mesh( groundGeo, new THREE.MeshPhongMaterial({map: texture, side: THREE.DoubleSide}) );
			groundPlane.translateY(100);
			groundPlane.rotateX(Math.PI * -0.5);	
			groupHole.add( groundPlane );
			
		break;
		case "cylinder.png":
			holeBaseGeo = new THREE.CircleBufferGeometry( 200, 128 );
			cylBasePlane = new THREE.Mesh(holeBaseGeo, new THREE.MeshPhongMaterial({map: texture3, opacity: 0.9, transparent: true, side: THREE.DoubleSide}) );
			cylBasePlane.rotateX(Math.PI * 0.5);
			groupHole.add(cylBasePlane);

			holeGeo = new THREE.CylinderBufferGeometry( 200, 200, 100, 64 ,0,true);
			holePlane = new THREE.Mesh(holeGeo, new THREE.MeshPhongMaterial({map: texture3, opacity: 0.9, transparent: true, side: THREE.DoubleSide}) );
			holePlane.translateY(50)
			groupHole.add(holePlane);
			
			groundGeo = new THREE.RingBufferGeometry( 200, 400, 30 );
			groundPlane = new THREE.Mesh(groundGeo, new THREE.MeshPhongMaterial({map: texture, side: THREE.DoubleSide}) );
			groundPlane.translateY(100);
			groundPlane.rotateX(Math.PI * -0.5);
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

			// groundGeo = new THREE.RingBufferGeometry( 200, 400, 3 );
			// groundGeo.translate(-50,0,100);
			// groundGeo.rotateX(Math.PI * -0.5);
			// groundPlane = new THREE.Mesh( groundGeo, new THREE.MeshPhongMaterial({map: texture, side: THREE.DoubleSide}) );
			// groupHole.add( groundPlane );
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
	var editorContain = document.createElement('div');
	editorContain.setAttribute('class','editorContain');

	imageHole.forEach( (item, index) => {
		var type = document.createElement('div');
		type.setAttribute('class','type '+randomString());
		type.addEventListener('click',(event) => holeType(event,item),false);
		var img = document.createElement('img');
		img.setAttribute('src','images/hole/'+item);

		type.appendChild(img);
		editorContain.appendChild(type);
	})

	editor.appendChild(editorContain);
}
closeHoleSelector = () =>{
	var holeType = document.getElementsByClassName('editorContain').item(0);
	holeType.setAttribute('style','transform:translate(-200px);opacity:0;');
	(function(){
		setTimeout(function(){
			closeEditor.click();
		}, 400 );
	})();
}

/* loading progress */
loadingStart = () => {
	var loading = document.createElement('div');
	loading.setAttribute('class','loading');

	var loading_contain = document.createElement('div');
	loading_contain.setAttribute('class','loading_contain');

	var progress_num = document.createElement('span');
	progress_num.setAttribute('class','progress_num');

	var progress = document.createElement('div');
	progress.setAttribute('class','progress');

	
	loading_contain.appendChild(progress);
	loading_contain.appendChild(progress_num);
	loading.appendChild(loading_contain);
	editor.appendChild(loading);
}

loadingEnd = () => {
	var loading = document.getElementsByClassName('loading').item(0);
	loading.remove();
}

/* on add hole click */
addHole.addEventListener('click',() => openHoleSelector(),false)

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
	var Bonesloader = new THREE.OBJLoader();
	var file = this.files[0];
	var reader = new FileReader();
	reader.onloadend = function(e) {
		var result = reader.result;
		var object = Bonesloader.parse(result);
		console.log(object)
		object.traverse( function ( child ) {
			child.name = file.name;
			objects.push(child);
			
			//if ( child.isMesh ) child.material.map = texture;
		} );
		groupBones.add( object );
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

window.addEventListener('click',function(event){
	switch ( event.keyCode ){
		case 17 :
			var SelectedBones = new THREE.Group();
			SelectedBones.name = 'SelectedBones';


		break;

		default : false;
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
//___Scene_Exporter_______________________________________________________________________
//////////////////////////////////////////////////////////////////////////////////////////


//var exporter = new THREE.SceneExporter();
var exportScene = document.getElementById('export_scene');

exportScene.addEventListener('click',exportOBJ,false)

function exportOBJ() {
	var json = gridHelper.toJSON();
	saveString( json, 'scene.json' );
	closeEditor.click();
}
var link = document.createElement( 'a' );
link.style.display = 'none';
document.body.appendChild( link );
function save( blob, filename ) {
	link.href = URL.createObjectURL( blob );
	link.download = filename;
	link.click();
	closeEditor.click();
}
function saveString( text, filename ) {
	save( new Blob( [JSON.stringify(text, null, 2)] , { type: 'application/json' } ), filename );
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
//________________________________________________________________________________________
//////////////////////////////////////////////////////////////////////////////////////////

// load json models 
// var loader = new THREE.ObjectLoader();
// loader.load( "../examples/models/json/lightmap/lightmap.json", function ( object ) {
// 	scene.add( object );
// });
