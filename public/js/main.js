		// chargement des textures 
		var texture, texture3;
		texture = new THREE.TextureLoader().load("./public/assets/images/hall_ground.jpg"); 
		texture3 = new THREE.TextureLoader().load("./public/assets/images/hall_ground.png");
		var camera, controls, controlObject, scene, renderer, canvas, canvas_container, gridHelper, boxHelper,
		gui, customContainer, requestAnimation;
		objects=[], objectsLocked=[],
		state = {
			animation : {
				play : false,
			},
			selectedBone : []
		};
		var holeGeo, holePlane,
		holeBaseGeo, holeBasePlane,
		groundGeo, groundPlane;
		var groupHole = new THREE.Group(); groupHole.name = 'Hole';
		var groupBones = new THREE.Group(); groupBones.name = 'Bones';
		var groupGridLevel = new THREE.Group(); groupGridLevel.name = 'gridlavel';

		//canvas domHtmlDocument
		canvas = document.getElementById('renderer');
		canvas_container = document.getElementsByClassName('renderer_container');
		var newGroup = document.getElementsByName("new_group")[0];
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
		openEditorManual();
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

			// importing hole
			groupHole.copy(object.children[0]);

			// importing all bones and group bones
			console.log(object);
			for(i = object.children[1].children.length - 1 ; i>=0 ;i--){
				if(object.children[1].children[i].isGroup){
					addGroupToGroupTree(null,object.children[1].children[i].uuid,object.children[1].children[i].name);
					loadedGroup = document.getElementById(object.children[1].children[i].uuid);
					object.children[1].children[i].traverse( function ( child ) {
						if (child.isMesh){
							addBoneToTree(child.name,child.uuid,false,object.children[1].children[i].uuid);
						}
					});
				}else{
					addBoneToTree(object.children[1].children[i].name,object.children[1].children[i].uuid,true,null);
				}
				groupBones.add(object.children[1].children[i]);
			}
			groupGridLevel.copy(object.children[2]);
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
//__start editor__________________________________________________________________________
//////////////////////////////////////////////////////////////////////////////////////////

		init(); //préparer la scene 
		var animateDiapo = document.getElementById('scene_animation');
		animateDiapo.addEventListener('click',function(){
			state.animation.play = !state.animation.play;
			state.animation.play ? (
				this.children['0'].setAttribute('class','icon-stop2'),
				this.style.background = "#2e76b5",
				this.style.color = "#fff"
			):(
				this.children['0'].setAttribute('class','icon-play3'),
				this.style.background = "#fff",
				this.style.color = "#2e76b5" 
			);
		},false);
		animate(); //boucle infinit pour l'animation 3D de la scene

		function init() {

			//scene
			scene = new THREE.Scene();
			scene.background = new THREE.Color(0xd4d4d4);

			//renderer
			renderer = new THREE.WebGLRenderer({canvas:canvas,antialias: true,clearAlpha:0});
			renderer.setPixelRatio( window.devicePixelRatio );
			renderer.setSize( canvas_container[0].clientWidth , canvas_container[0].clientHeight);
			
			//camera

			camera = new THREE.PerspectiveCamera( 60, canvas_container[0].clientWidth / canvas_container[0].clientHeight, 1, 4000 );
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
			gridHelper.add(groupGridLevel);
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
			
			//box helper
			boxHelper = new THREE.BoxHelper(groupBones, 0xff8900);
			boxHelper.name = "boxHelper";
			boxHelper.setFromObject(groupBones);
			boxHelper.matrixAutoUpdate = true;
			scene.add(boxHelper);
			
			//Objects Controls 
			gui = new dat.GUI({ autoPlace: false });
			var boneFolder = gui.addFolder();
			boneFolder.name = "Control mode";
			boneFolder.open();
			boneFolder.add(controlObject, 'mode', { Translate: "translate", Rotate: "rotate" } ).onChange(function(value){
				controlObject.setMode(value);
			})
			customContainer = document.getElementById('gui-container');
			customContainer.appendChild(gui.domElement);


			//resize canvas on windowsResize
			window.addEventListener( 'resize', onWindowResize, false );
		}
		function onWindowResize(){
			camera.aspect = canvas_container[0].clientWidth / canvas_container[0].clientHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(canvas_container[0].clientWidth, canvas_container[0].clientHeight)
		}
		function animate(){
			requestAnimation = requestAnimationFrame( animate );
			state.animation.play ? (gridHelper.rotation.y += 0.005) : 
									(gridHelper.rotation.y = gridHelper.rotation.y);
			boxHelper.update();
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
					"style","transform: scale(0.8,0.8) translateY(0px); zoom:1.2;opacity:1;z-index:402;;"
				)
			},false);

			var addGrid = document.getElementById('add_grid');
			addGrid.addEventListener('click',function(){
				openHoleLevel();
				openEditor[0].setAttribute(
					"style","transform: scale(0.4,0.4) translateY(0px); zoom:2;opacity:1;z-index:402;"
				)
			},false);
		})();
		//open editor
		openEditorManual = () => {
			openEditor[0].setAttribute(
				"style","transform: scale(0.8,0.8) translateY(0px); zoom:2;opacity:1;z-index:402;"
			)
		}

		// disable Editor
		closeEditor.addEventListener('click',function(){
			var element = this.parentElement;
			element.setAttribute('style','transform: translateY(-800px);');
			element.children[1] ? element.children[1].remove() : false;
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

		var  imageHole=['geometry.png','cylinder.png'],
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
			var prams = {
				visible : false,
				delete:function(){
					var i = groupHole.children.length -1;
					for(i ; i>=0 ; i--){
						groupHole.remove(groupHole.children[i]);
					}
					gui.removeFolder(gui.__folders['hole']);
					groupHole.name = ""; sceneState.holeType = "";
				}
			}
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
				hole.add(groupHole.scale, 'x', 1, 6).name('Width').onChange(function(e){
					groupGridLevel.scale.x = e;
				});
				hole.add(groupHole.scale, 'y', 1, 6).name('Depth').listen();
				hole.add(groupHole.scale, 'z', 1, 6).name('Height').onChange(function(e){
					groupGridLevel.scale.z = e;
				});
				hole.add(groupHole, 'visible', [false, true]).onChange(function(value){
					value == "true" ? groupHole.visible = true : groupHole.visible = false;
				});
				hole.add(prams, 'delete').onClick;
			hole.open;
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

					groundGeo = new THREE.RingBufferGeometry( 141.4213562373095, 200,4, 1,Math.PI * 0.75);
					groundPlane = new THREE.Mesh( groundGeo, new THREE.MeshPhongMaterial({map: texture, side: THREE.DoubleSide}) );
					groundPlane.translateY(100);
					groundPlane.rotateX(Math.PI * -0.5);	
					groupHole.add( groundPlane );
					
				break;
				case "cylinder.png":
					holeBaseGeo = new THREE.CircleBufferGeometry( 100, 128 );
					cylBasePlane = new THREE.Mesh(holeBaseGeo, new THREE.MeshPhongMaterial({map: texture3, opacity: 0.9, transparent: true, side: THREE.DoubleSide}) );
					cylBasePlane.rotateX(Math.PI * 0.5);
					groupHole.add(cylBasePlane);

					holeGeo = new THREE.CylinderBufferGeometry( 100, 100, 100, 64 ,0,true);
					holePlane = new THREE.Mesh(holeGeo, new THREE.MeshPhongMaterial({map: texture3, opacity: 0.9, transparent: true, side: THREE.DoubleSide}) );
					holePlane.translateY(50)
					groupHole.add(holePlane);
					
					groundGeo = new THREE.RingBufferGeometry( 100, 150, 80 );
					groundPlane = new THREE.Mesh(groundGeo, new THREE.MeshPhongMaterial({map: texture, side: THREE.DoubleSide}) );
					groundPlane.translateY(100);
					groundPlane.rotateX(Math.PI * -0.5);
					groupHole.add(groundPlane);
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
				img.setAttribute('src','public/assets/images/hole/'+item);

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

		/* hole level */
		openHoleLevel = () =>{
			var editorContain = document.createElement('div');
			editorContain.setAttribute('class','editorContain');

			var holeLevel = document.createElement('div');
			holeLevel.setAttribute('class','holeLevel');

			var inputNumber = document.createElement('input');
			inputNumber.setAttribute('id','level_Number');
			inputNumber.setAttribute('type','number');
			inputNumber.setAttribute('name','levelNumber');
			inputNumber.autofocus = true;
			inputNumber.setAttribute('min','0');
			inputNumber.setAttribute('max','600');

			var validate = document.createElement('button');
			validate.innerHTML = 'OK'
			validate.setAttribute('id','validate_level');

			holeLevel.appendChild(inputNumber);
			holeLevel.appendChild(validate);
			editorContain.appendChild(holeLevel);
			editor.appendChild(editorContain);

			var validate_level = document.getElementById('validate_level');
			validate_level.addEventListener('click',()=> validateLevel(),false)
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
*/
//__hole_level____________________________________________________________________________
//////////////////////////////////////////////////////////////////////////////////////////	
		
		validateLevel = () => {
			var value = document.getElementsByName('levelNumber');
			console.log();
			if(value[0].valueAsNumber < 0 | value[0].valueAsNumber > 600){
				closeEditor.click();
				return;
			}
			gridHelperLevel = new THREE.GridHelper(200,40,0xffffff,Math.random() * 0xffffff);
			holeSize = groupHole.scale;
			gridHelperLevel.position.set(0,value[0].valueAsNumber,0)
			groupGridLevel.add(gridHelperLevel);
			closeEditor.click();
		}

//////////////////////////////////////////////////////////////////////////////////////////
//________________________________________________________________________________________
/*
#
#
#
#
*/
//__Bones_Controls________________________________________________________________________
//////////////////////////////////////////////////////////////////////////////////////////
		var guiFoldetState = { // memorize gui folders
			objectSlected : undefined,
			open : true
		}
		var BonesSelect = document.getElementById('Bones');
		var boneList =  document.getElementById('bonesList');
		var groupTree = document.getElementById('groupTree');

		/*Loading Bones*/
		BonesSelect.addEventListener('change',function(){
			var Bonesloader = new THREE.OBJLoader();
			var file = this.files[0];
			var reader = new FileReader();
			reader.onloadend = function(e) {
				var result = reader.result;
				var object = Bonesloader.parse(result);
				object.traverse( function ( child ) {
					child.name = file.name;
					if (child.isMesh){
						objects.push(child);
						groupBones.add(child);
						addBoneToTree(file.name,child.uuid,true,null);
					} 
					//if ( child.isMesh ) child.material.map = texture;
				} );
			}
			reader.readAsText(file);
			closeEditor.click();
		},false);
		
		// attach bone to Objectcontrol (Option for touchScreen handeler)
		canvas.addEventListener('touchstart', onDocumentTouchStart);
		function onDocumentTouchStart(event) {    
			var mouse3D = new THREE.Vector3( ( event.touches[0].clientX / canvas_container[0].clientWidth ) * 2 - 1,   
									-( event.touches[0].clientY / canvas_container[0].clientHeight ) * 2 + 1,  
									0.5 );     
			var raycaster =  new THREE.Raycaster();                                        
			raycaster.setFromCamera( mouse3D, camera );
			var intersects = raycaster.intersectObjects( objects );
			if ( intersects.length > 0 ) {
				controlObject.attach(intersects[ 0 ].object);
				boneEditor(intersects[0].object);
				boxHelper.setFromObject(intersects[0].object);
				state.selectedBone = [];
				state.selectedBone.push(intersects[0].object);
			}
			// else{
			// 	controlObject.detach(state.selectedBone[0]);
			// 	state.selectedBone = [];
			// }
		}

		// attach bone to Objectcontrol (Option for mouse handeler)
		canvas.addEventListener('click', onDocumentMouseDown);
		function onDocumentMouseDown (event){    
			var mouse3D = new THREE.Vector3( ( event.clientX / canvas_container[0].clientWidth ) * 2 - 1,
									-( event.clientY / canvas_container[0].clientHeight ) * 2 + 1,
									0.5 );
			var raycaster =  new THREE.Raycaster();                                        
			raycaster.setFromCamera( mouse3D, camera );
			var intersects = raycaster.intersectObjects( objects );
			if ( intersects.length > 0 ) {
				controlObject.attach(intersects[ 0 ].object);
				boneEditor(intersects[0].object);
				boxHelper.setFromObject(intersects[0].object);
				state.selectedBone = [];
				state.selectedBone.push(intersects[0].object);
			}
			// else{
			// 	controlObject.detach(state.selectedBone[0]);
			// 	state.selectedBone = [];
			// }
		}

		// Add and delete gui folder for controling bones (size, scale, position, color ...)
		// To DDELLETEE !!!!!!!!!
		function onBoneSelect (bone){
			if(gui.__folders[guiFoldetState.objectSlected] !== undefined & gui.__folders[guiFoldetState.objectSlected] === bone.name){
				return;
			}else if(gui.__folders[guiFoldetState.objectSlected] !== undefined & gui.__folders[guiFoldetState.objectSlected] !== bone.name){
				gui.removeFolder(gui.__folders[guiFoldetState.objectSlected]);
				boneFolderEditor(bone);
			}else{
				boneFolderEditor(bone);
			}
		} 
		
		function boneEditor (bone){
			var l =  gui.__controllers.length;
			var i=0;
			for(i;i <l;i++){
				gui.__controllers[0].remove();
			} 

			if(gui.__folders['Bone Control'] !== undefined){
				gui.removeFolder(gui.__folders['Bone Control']);
			} 
			var boneFolder = gui.addFolder("Bone Control");
			boneFolder.open();

			var prams = {
				color: bone.material.color.getStyle(),
				delete:function(){
					controlObject.detach(bone);
					document.getElementById(bone.uuid).remove();
					bone.parent.remove(groupBones.getObjectByProperty("uuid",bone.uuid))
					var newObjects = objects.filter(child => child.name !== bone.name)
					objects = [...newObjects];
				}
			}
			

			boneFolder.add(bone.scale, 'x', 0.1, 5).name('Scale').onChange(function(value){
				bone.scale.y = value;
				bone.scale.z = value;
			});
			boneFolder.addColor(prams,'color').onChange(function(){
				var colorObj = new THREE.Color( prams.color );
				// var hex = colorObj.getHexString();
				var css = colorObj.getStyle();
				bone.material.color.set(css);
			});
			boneFolder.add(bone.position, 'x', -600, 600);
			boneFolder.add(bone.position, 'y', -600, 600);
			boneFolder.add(bone.position, 'z', -600, 600);
			boneFolder.add(prams, 'delete').onClick;
			// guiFoldetState = {
			// 	objectSlected : bone.name 
			// } 
		}
		
//////////////////////////////////////////////////////////////////////////////////////////
//________________________________________________________________________________________
/*
#
#
#
#
*/
//___Bones_Tree___________________________________________________________________________
//////////////////////////////////////////////////////////////////////////////////////////

		// on add group event
		newGroup.addEventListener("click",addGroupToGroupTree,false);
		boneList.addEventListener("drop",function(e){
			e.preventDefault();
			var data = e.dataTransfer.getData("text");
			this.appendChild(document.getElementById(data));

			groupBones.add(groupBones.getObjectByProperty('uuid',document.getElementById(data).id));
		});
		boneList.addEventListener("dragover",function (e){ 
			e.preventDefault(); 
		});
		boneList.addEventListener("dragend",function (e){ 
			e.preventDefault(); 
			var group = document.getElementsByClassName("group");
			[].forEach.call(group, el => {
				el.classList.replace('drop-enabled','drop-disabled');
			});
		});

		function addGroupToGroupTree(a,uuid,groupname){
			var id, group;
			if(uuid === undefined){
				group = new THREE.Group();
				groupBones.add(group);
				id = group.uuid;
			}else{
				id = uuid;
			}
			console.log(uuid);
			var ul = document.createElement('ul');
			ul.setAttribute("id",id);
			ul.setAttribute("class","drop-disabled group group-deselected");
			ul.addEventListener("dragenter",function (e){ 
				e.preventDefault(); 
				this.children.group_name.readOnly = false;
				this.classList.replace('drop-disabled','drop-enabled');
			});
			ul.addEventListener("dragend",function (e){ 
				e.preventDefault(); 
				var group = document.getElementsByClassName("group");
				[].forEach.call(group, el => {
					el.classList.replace('drop-enabled','drop-disabled');
				});
			});
			ul.addEventListener("drop",function (e) {
				e.preventDefault();
				this.children.group_name.readOnly = true;
				var data = e.dataTransfer.getData("text");
				this.insertAdjacentElement("beforeend",document.getElementById(data));

				groupBones.getObjectByProperty('uuid',this.id).add(groupBones.getObjectByProperty('uuid',document.getElementById(data).id));
			})

			var span = document.createElement('span');
			span.className = "icon-bin";
			span.addEventListener("click",function(){
				boxHelper.setFromObject(groupBones);
				controlObject.detach();
				var newObjects = objects.filter(
					function(child) {
					  return this.indexOf(child) < 0;
					},
					groupBones.getObjectByProperty('uuid',this.parentElement.id).children
				);
				objects = [...newObjects];
				groupBones.remove(groupBones.getObjectByProperty('uuid',this.parentElement.id));
				this.parentElement.remove();
			},false);

			var span1 = document.createElement('span');
			span1.className = "icon-pencil-square-o";
			span1.addEventListener("click",function(){
				var group_name = this.nextSibling;
				group_name.readOnly = false;
				group_name.focus();
			},false);

			var span2 = document.createElement('span');
			span2.className = "icon-unlocked unlocked";
			span2.id = "locker";
			span2.style.pointerEvents = 'all';
			span2.addEventListener("click",function(){
				if(span2.className.split(' ')[0] === 'icon-unlocked' ){
					this.classList.replace('icon-unlocked','icon-lock');
					this.classList.replace('unlocked','locked');
					objects = objects.filter(obj =>{
						if(groupBones.getObjectByProperty('uuid',obj.uuid).parent.uuid == this.parentElement.id){
							objectsLocked.push(obj);
							boxHelper.setFromObject(groupBones.getObjectByProperty('uuid',obj.uuid).parent);
							controlObject.attach(groupBones.getObjectByProperty('uuid',obj.uuid).parent);
							document.getElementById(obj.uuid).draggable = false;
							document.getElementById(obj.uuid).style.pointerEvents = 'none';
							document.getElementById(obj.uuid).style.opacity = 0.3;
							document.getElementById(obj.uuid).classList.replace("selected","deselected");
						}else{
							return obj;
						}
					})
				}else{
					this.classList.replace('icon-lock','icon-unlocked');
					this.classList.replace('locked','unlocked');
					objectsLocked = objectsLocked.filter(obj =>{
						if(groupBones.getObjectByProperty('uuid',obj.uuid).parent.uuid == this.parentElement.id){
							objects.push(obj)
							document.getElementById(obj.uuid).draggable = true;
							document.getElementById(obj.uuid).style.pointerEvents = 'all';
							document.getElementById(obj.uuid).style.opacity = 1;
						}else{
							return obj;
						}
					})
				}
			},false);

			var inputGroupName = document.createElement('input');
			inputGroupName.type = "text";
			inputGroupName.className = "selected"
			inputGroupName.readOnly = true;
			inputGroupName.name = "group_name";
			inputGroupName.placeholder = "Group Name ...";
			groupname !== undefined ? inputGroupName.value = groupname : inputGroupName = '';

			inputGroupName.addEventListener("change",function(e){
				groupBones.getObjectByProperty('uuid',this.parentElement.id).name = e.target.value;
			},false);
			inputGroupName.addEventListener("blur",function(){
				this.readOnly = true;
			})
			inputGroupName.addEventListener("click",function(e){
				var group = document.getElementsByClassName("group");
				[].forEach.call(group, el => {
					el.classList.replace('group-selected','group-deselected');
				});

				var bones = document.getElementsByClassName("bone");
				[].forEach.call(bones, el => {
					el.classList.replace('selected','deselected');
				});

				var group = groupBones.getObjectByProperty('uuid',this.parentElement.id);   

				this.parentElement.classList.replace('group-deselected','group-selected');
				boxHelper.setFromObject(group);
				controlObject.attach(group);
			})
			ul.appendChild(span2);
			ul.appendChild(span);
			ul.appendChild(span1);
			ul.appendChild(inputGroupName);
			groupTree.appendChild(ul);
		}


		function addBoneToTree(boneName,uuid,tree,groupid){
			var li = document.createElement('li');
			li.textContent = boneName;
			li.id = uuid;
			li.className = "bone deselected";
			li.setAttribute("draggable","true");
			li.addEventListener("mouseover",function (e){
				controls.enabled = false; controlObject.enabled = false;
			});	
			li.addEventListener("mouseleave",function (e){
				controls.enabled = true; controlObject.enabled = true;
			});	
			li.addEventListener("dragstart",function (e){
				e.dataTransfer.setData("text", e.target.id);
				e.dataTransfer.setData("idparent", e.target.parentElement.id);
			});
			
			/* Select Object from tree & Edit*/
			li.addEventListener("click",function (e){
				var boneSelected = groupBones.getObjectByProperty("uuid",e.target.id);

				var group = document.getElementsByClassName("group");
				[].forEach.call(group, el => {
					el.classList.replace('group-selected','group-deselected');
				});

				var bones = document.getElementsByClassName("bone");
				[].forEach.call(bones, el => {
					el.classList.replace('selected','deselected');
				});    
				this.classList.replace("deselected","selected");

				controlObject.attach(boneSelected);
				boneEditor(boneSelected);
				boxHelper.setFromObject(boneSelected);
				state.selectedBone = [];
				state.selectedBone.push(boneSelected);
			},false);

			if (tree === true) boneList.appendChild(li);
			if (tree === false){
				group = document.getElementById(groupid);
				group.appendChild(li);
			}
		}

//////////////////////////////////////////////////////////////////////////////////////////
//________________________________________________________________________________________
/*
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