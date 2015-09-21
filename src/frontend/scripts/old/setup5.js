
//global data
var socket
var story = 0, part = 0, data
var info = {name: []}
// info.prev = [], info.name = [], info.detail = []
//objects and resources
var scene = new THREE.Scene(), camera, renderer
var resources = {geos: {}, mtls: {}}
var seseme = new THREE.Group(), ground, lights, shadow
//global states / constants
var facing = 0, perspective = {height: 'isometric', zoom: 'normal', zoomswitch: false}, init = true
var controls, mouse = new THREE.Vector2(), raycast
var plrmax = 12, constspd = 10000, spdcompensator = 400
// DEBUG variables
var online = false

function setup(){
	//ready waits for data & 3d before filling the scene
	//though, using THREE's load manager here feels a bit disingenuous...
	var ready = new THREE.LoadingManager()
	ready.itemStart('firstdata'); ready.itemStart('3d')
	ready.onLoad = function(){ fill(); behaviors(); display() }
	dataOps() //data from server
	instDOM() //dom
	assets() //animate & 3d

	// setInterval(function(){ part++; view.nextpart() },15000)

	function dataOps(){
			if(online){ //server is hooked up
				socket = io('http://169.237.123.19:5000')
				socket.emit('ask')
				socket.on('intro',function(d){
					//d = {story: story, part: x}
					story = d.story; part = d.part
					data = story.parts[part]
					ready.itemEnd('firstdata')
				})
				socket.on('announce'),function(d){
					//simple next operation
					if(d.type === 'next'){
						part = d.part
						view.nextpart()
					}
					//new story
					else if(d.type === 'new'){
						story = d.story; part = d.part
						data = story.parts[part]
					}
				}
			}
			//development w/o server: mock
			else if(!online){
				console.log('let\'s pretend we\'re online...')
				story = teststory; part = 0
				data = story.parts[part]
				ready.itemEnd('firstdata')
				// setTimeout(function(){ part++; view.nextpart() }, 7500)
			}
	} // end query
	function instDOM(){
		document.addEventListener('DOMContentLoaded', function(){
			// defining DOM relationships
			{


			 }

		})
	} //end domOps
	function assets(){
		var allModels = ['quaped','pillar','plroutline'] //symbolgeos?
		var allTextures = ['chevron','tri','shadow'] //names of external imgs (PNG)
		// stories.forEach(function(ele){ allModels.push(ele.geo); allTextures.push(ele.geo) })
		var resourceMgr = new THREE.LoadingManager()
		resourceMgr.itemStart('mdlMgr'); resourceMgr.itemStart('mtlMgr'); resourceMgr.itemStart('fonts')
		resourceMgr.onLoad = function(){
			console.log('all resources done')
			build(); ready.itemEnd('3d')
		}
		var mdlMgr = new THREE.LoadingManager()
		// mdlMgr.onProgress = function(item,loaded, total){console.log(item,loaded, total)}
		mdlMgr.onLoad = function(){console.log('models done'); resourceMgr.itemEnd('mdlMgr')}
		for(var i = 0; i<allModels.length;i++){ mdlMgr.itemStart('assets/'+allModels[i]+'.js') }
		var mdlLoader = new THREE.JSONLoader()
		allModels.forEach(function(ele){
			mdlLoader.load('assets/'+ele+'.js',function(geo){
				resources.geos[ele] = geo; mdlMgr.itemEnd('assets/'+ele+'.js')
			})
		})
		//shapes for geo resources
		{
			var triangleA = new THREE.Shape() //normal triangle
			triangleA.moveTo(-0.75,0);triangleA.lineTo(0.75,0);triangleA.lineTo(0,-1);triangleA.lineTo(-0.75,0)
			resources.geos.triangleA = new THREE.ShapeGeometry(triangleA)
			var rightTri = new THREE.Shape() //right triangle
			rightTri.moveTo(-1,-1);rightTri.lineTo(1,1);rightTri.lineTo(-1,1);rightTri.lineTo(-1,-1)
			resources.geos.rightTri = new THREE.ShapeGeometry(rightTri)
		}

		var mtlMgr = new THREE.LoadingManager()
		// mtlMgr.onProgress = function(item,loaded,total){console.log(item,loaded,total)}
		mtlMgr.onLoad = function(){console.log('textures done'); resourceMgr.itemEnd('mtlMgr')}
		var texLoader = new THREE.TextureLoader( mtlMgr )
		allTextures.forEach(function(ele){
			texLoader.load('assets/'+ele+'.png',function(texture){
				resources.mtls[ele] = new THREE.MeshBasicMaterial({depthWrite: false, map:texture, transparent: true, opacity: 1})
			})
		})
		window.WebFontConfig = {
			google: {families: ['Droid Serif:400', 'Karla:400,700']},
			classes: false,
			active: function(){ console.log('fonts loaded'); resourceMgr.itemEnd('fonts') }
		}

		function build(){
			//camera/renderer/dom
			var containerSESEME = $("containerSESEME")
			var aspect = containerSESEME.offsetWidth / containerSESEME.offsetHeight; var d = 20
			camera = new THREE.OrthographicCamera( - d * aspect, d * aspect, d, - d, 0, 100 )
			camera.position.set( -d, 10, d ); camera.rotation.order = 'YXZ'
			camera.rotation.y = - Math.PI / 4 ; camera.rotation.x = Math.atan( - 1 / Math.sqrt( 2 )); camera.zoom = .875
			camera.updateProjectionMatrix();

			renderer = new THREE.WebGLRenderer({antialias: true, alpha: true})
			// renderer.setClearColor(0xbbbbbb)
			renderer.setSize( containerSESEME.offsetWidth, containerSESEME.offsetHeight)
			containerSESEME.appendChild( renderer.domElement )
			controls = new THREE.OrbitControls(camera)
			raycast = new THREE.Raycaster()
			//materials
			resources.mtls.seseme = new THREE.MeshPhongMaterial({color: 0x80848e,shininess:21,specular:0x9e6f49,emissive: 0x101011})
			// resources.mtls.seseme = new THREE.MeshLambertMaterial({color: 0x80848e})
			resources.mtls.sesemelambert = new THREE.MeshLambertMaterial({color: 0x80848e})
			resources.mtls.orb = new THREE.MeshPhongMaterial({color:0xff6666,emissive:0x771100,shininess:1,specular:0x272727})
			resources.mtls.ground = new THREE.MeshBasicMaterial({color: 0xededed})
			//meshes
			ground = new THREE.Mesh(new THREE.PlaneBufferGeometry( 150, 150 ), resources.mtls.ground)
			ground.rotation.x = rads(-90); ground.position.set(0,-18,0)

			var qPos = [{x:1.5,z:1},{x:1,z:-1.5},{x:-1.5,z:-1},{x:-1,z:1.5}]
		 	var pillarStartY = dice(2)===1? 0: 72
			for(var i = 0; i<4; i++){
				seseme['quad'+i] = new THREE.Mesh(resources.geos.quaped,resources.mtls.seseme)
				seseme['quad'+i].position.set(qPos[i].x,0,qPos[i].z)
				seseme.add(seseme['quad'+i])
				//plr
				seseme['plr'+i] = new THREE.Mesh(resources.geos.pillar,resources.mtls.seseme)
				seseme['plr'+i].geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,-2.25,0))
				seseme['plr'+i].position.set(-3.6, pillarStartY, 1.1)
				seseme['plr'+i].rotation.y = rads(-90)
				//outline addition
				outline = new THREE.Mesh(resources.geos.plroutline, new THREE.MeshBasicMaterial({transparent: true, side: THREE.BackSide, depthWrite: false, opacity: 0}))
				outline.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,-2.25,0))
				seseme['plr'+i].outline = outline; seseme['plr'+i].add(outline)
				//outcap
				var outcap = new THREE.Mesh(resources.geos.rightTri, new THREE.MeshBasicMaterial({transparent: true, opacity: 0}))
				outcap.rotation.x=rads(-90); outcap.rotation.z=rads(90)
				outcap.scale.set(1.9,1.9,1.9); outcap.position.set(-4,-0.6,1.5)
				seseme['plr'+i].outcap = outcap; seseme['quad'+i].add(outcap)
				//properties for later
				seseme['plr'+i].queue = []
				seseme['plr'+i].moving = false

				seseme['quad'+i].add(seseme['plr'+i])
			}

			//lighting
			{
				lights = new THREE.Group(); var amblight = new THREE.AmbientLight( 0x232330 )
				var backlight = new THREE.SpotLight(0xeaddb9, 1.2); var camlight = new THREE.PointLight(0xffffff, .35)
		  	backlight.position.set(-7,25,-4); camlight.position.set(-40,-7,-24)
		  	lights.add(backlight); lights.add(amblight); lights.add(camlight)
			}
		  	//other FX
		  	shadow = new THREE.Mesh(new THREE.PlaneBufferGeometry(16,16), resources.mtls.shadow)
		  	shadow.rotation.x = rads(-90); shadow.position.set(-0.1,-17.99,0.1)
				shadow.material.opacity = 0
				//adding to scene
			scene.add(ground); scene.add(seseme); scene.add(lights); scene.add(shadow)
		}//build
	}//assets
	function fill(){
		var plrMgr, projectionMgr
		heightCalc(); loadingManagers();
		first3Danims();
		// fillDOM();
		globalProjections()

		function loadingManagers(){
			plrMgr = new THREE.LoadingManager()
			projectionMgr = new THREE.LoadingManager()
			for(var i= 0; i<4; i++){
				plrMgr.itemStart('plr'+i)
				projectionMgr.itemStart('projection'+i)
			}
			plrMgr.onLoad = function(){
				console.log('all pillars done moving')
				if(init){ //the first time the pillars finish, ....
					// view.enableUI() //callbacks here make init = false
					if(perspective.zoom==='normal'&&perspective.height==="isometric"){
						// info.showprev(facing)
						highlight(facing,1,600)
					}
				} // end init conditional for plrMgr.onload
			}
			projectionMgr.onProgress = function(item,loaded,total){console.log(item,loaded,total)}
			projectionMgr.onLoad = function(){
				console.log('all projections loaded, show facing')
				if(!init){
					if(perspective.zoom === 'normal' && perspective.height === 'isometric'){
						// info.showprev(facing)
					}else{}
				}
				for(var i = 0; i<4; i++){ projectionMgr.itemStart('projection'+i)} //wtf lol
			}
		}
		function first3Danims(){
			var rgb = data.color ? hexToRgb(data.color) : {r:0,g:0,b:0}
				for(var i = 0; i<4; i++){
					var q = seseme['quad'+i]
					q.rotation.y = rads(i*90)
					q.position.y = -31
					// pillarAnim(i)
					// move(q,q.end,1700,'','',pillarAnim(i),i*250)
					move(q, {y:0, cb: pillarAnim(i), delay: i*300, spd:1700})
					//problematic: with parentheses pillarAnim() just runs right away.....
					recolor(seseme['plr'+i].outline, {r: rgb.r, g: rgb.g, b: rgb.b}, 400)
					recolor(seseme['plr'+i].outcap, {r: rgb.r, g: rgb.g, b: rgb.b}, 400)
				}
				// fade(shadow, 1, 800, 1200)
				fade(shadow, {opacity: 1, spd: 800, delay: 1200})

				function pillarAnim(which){
					var tgt = seseme['plr'+which]
					projection(which)
					// move(seseme['plr'+which],{y: seseme['plr'+which].targetY}, 1500, '', '', function(){
					// 	plrMgr.itemEnd('plr'+which)
					// }, 500+(which*300))
					move(tgt, {y:tgt.targetY, spd: 1500, delay: 500+(which*300), cb: function(){ plrMgr.itemEnd('plr'+which) }})
				}
		}//end first3Danims
		function projection(i){

			//individual sprite title
			info.name[i] = new THREE.Group()
			var name = new THREE.Sprite()
			var pointer = new THREE.Sprite(new THREE.SpriteMaterial({transparent:true,map:resources.mtls.chevron.map,opacity:1}))
			pointer.expand = {y: -1}


			if(data.details && data.details[i] && data.details[i].name){
				var sprtxt = new Text(data.details[i].name,11,240,125,'black','Karla',30,600,'center')
				var sprmtl = new THREE.SpriteMaterial({transparent:true,map:sprtxt.tex,opacity:1 })
				name.material = sprmtl
				name.scale.set(sprtxt.cvs.width/150, sprtxt.cvs.height/150, 1)
				name.expand = {y:0,sx:sprtxt.cvs.width/100,sy:sprtxt.cvs.height/100}

			}

			info.name[i].txt = name; info.name[i].pointer = pointer
			delete name; delete pointer
			info.name[i].add(info.name[i].txt); info.name[i].add(info.name[i].pointer)
			seseme['plr'+i].add(info.name[i])

		}
		function globalProjections(){
			//title block
			info.titleblock = new THREE.Group()
			info.titleblock.rotation.y = -rads(45)
			info.titleblock.ht = 0
			if(data.title){
				var t = data.title
				var titlekeys = Object.keys(data.title)
				for(var i = 0; i<titlekeys.length; i++){
					if(t[titlekeys[i]].margin) info.titleblock.ht+=t[titlekeys[i]].margin
					var width = t[titlekeys[i]].size?t[titlekeys[i]].size/2:9,
					height = t[titlekeys[i]].size?t[titlekeys[i]].size*5:110,
					font = t[titlekeys[i]].font?t[titlekeys[i]].font:'Karla',
					fontsize = t[titlekeys[i]].size?t[titlekeys[i]].size:21,
					weight = t[titlekeys[i]].weight?t[titlekeys[i]].weight:600,
					align = t[titlekeys[i]].align?t[titlekeys[i]].align:'center'
					//arrayed title (multi-line)
					if(t[titlekeys[i]].c instanceof Array){
						for(var it = 0; it<t[titlekeys[i]].c.length; it++){
							var txt = meshify(new Text(t[titlekeys[i]].c[it],width,100, height, 'white', font, fontsize, weight, align))
							if(t[titlekeys[i]].size) info.titleblock.ht += t[titlekeys[i]].size/12.5
							else info.titleblock.ht += 1.65
							txt.position.z = 8; txt.position.y = -info.titleblock.ht; txt.rotation.x = camera.rotation.x
							info.titleblock.add(txt)
						}
					//single string
					}else{
						var txt = meshify(new Text(t[titlekeys[i]].c,width,100, height, 'white', font, fontsize, weight, align))
						if(t[titlekeys[i]].size) info.titleblock.ht += t[titlekeys[i]].size/12.5
						else info.titleblock.ht += 1.65
						txt.position.z = 8; txt.position.y = -info.titleblock.ht; txt.rotation.x = camera.rotation.x
						info.titleblock.add(txt)
					}
				}
			}// end data.title
			info.titleblock.position.y = info.titleblock.ht/4.25
			// var titlebtn = new THREE.Mesh(new THREE.PlaneBufferGeometry(3.75,3.75), new THREE.MeshNormalMaterial())
			var titlebtn = new THREE.Mesh(new THREE.CircleGeometry(1.9,24), new THREE.MeshNormalMaterial())
			titlebtn.position.y = -info.titleblock.ht - 3.25; titlebtn.position.z = 9; titlebtn.rotation.x = camera.rotation.x
			info.titleblock.btn = titlebtn; info.titleblock.add(titlebtn)

			seseme.add(info.titleblock)
		}


	} //end view.fill() --------------------
	function behaviors(){
		Origami.fastclick(document.body) //attaches fastclick for iOs
		window.addEventListener('deviceorientation', function(evt){})
		//DOM CLICK REACTIONS

		//3D CONTROL REACTIONS
		controls.addEventListener( 'change', function(){
			const thresholds = {zoom: [.65,1.3], height: [-3,-60]}
			const facingRotations = [-45,45,135,-135]
			// what should the scoping of above be??
			const height = degs(camera.rotation.x)>thresholds.height[0]?'elevation': degs(camera.rotation.x)<thresholds.height[1]?'plan':'isometric';
			const zoom = camera.zoom>thresholds.zoom[1]? 'close' : camera.zoom<thresholds.zoom[0]? 'far' : 'normal'
			const addzoom = camera.zoom - 1
			controls.zoomSpeed = 0.7-(Math.abs(camera.zoom-1)/3)
			controls.rotateSpeed = 0.1 - (Math.abs(camera.zoom-1)/20)
			lights.rotation.set(-camera.rotation.x/2, camera.rotation.y + rads(45), -camera.rotation.z/2)

			// rotation change block
			info.titleblock.rotation.y = camera.rotation.y
			facingRotations.some(function(ele,i){
				if(Math.abs(degs(camera.rotation.y)-ele)<45){
					if(facing!==i){
						console.log('facing new')
						if(zoom!=='far' && height==='elevation'){
							var prevbehind = facing<2? facing+2 : facing-2
							var behind = i<2? i+2 : i-2
							// info.showsprite(facing); info.hidesprite(i)
							// info.showsprite(prevbehind)
							if(seseme['plr'+i].position.y-2 > seseme['plr'+behind].position.y){
								// info.hidesprite(behind)
							}
						}
						if(zoom!=='close'&&zoom!=='far'&&height!=='plan'){
							// info.hideprev(facing); info.showprev(i)
							highlight(i,1,350); highlight(facing,0,300)
						}
						else if(perspective.zoom==='close'){
							var direction = i===facing+1 || i===facing-3 ? 1: -1
							// callContent({tgt:'points', index:i, prev: text.points[facing], dir: direction})
						}
						// view.navpoint(i)
						facing = i
						// view.navwidth()

						if(camera.zoom>1){
							perspective.zoomswitch = true
							var switchdist = 250 + (seseme['plr'+facing].targetY * 30)
							move(scene, {y:-(seseme['plr'+facing].targetY)*(addzoom/1.5)-(addzoom*4), spd: switchdist,
							easing: ['Quadratic','InOut'], cb: function(){ perspective.zoomswitch=false }})
							// move(scene,{x:0,y:-(seseme['plr'+facing].targetY)*(addzoom/1.5)-(addzoom*4),z:0},switchdist,'Quadratic','InOut',function(){perspective.zoomswitch = false})
						}
					}
				return true }
			})
			// height change block
			if(perspective.height!==height){
				perspective.height = height
				// info.reorient()
				//normal only
				if(zoom==='normal'){
					if(height==='isometric'){ /*info.showprev(facing);*/ highlight(facing,1,350) }
					else if(height==='plan'){ /*info.hideprev(facing);*/ highlight(facing,0,350) }
				}
			 //normal or close
				 if(zoom==='close' || zoom ==='normal'){
					 if(height==='elevation'){
						 var behind = facing<2? facing+2 : facing-2
						//  if(seseme['plr'+facing].position.y-2 > seseme['plr'+behind].position.y){
							//  for(var i = 0; i<4; i++){ if(i!==facing && i!==behind) info.showsprite(i) }
						//  }else for(var i = 0; i<4; i++){ if(i!==facing) info.showsprite(i) }
						 if(controls.target.twn) controls.target.twn.stop()
						 controls.target.twn = new TWEEN.Tween({y:controls.target.y}).to({y:-1.5},700).onUpdate(function(){
							 controls.target.y = this.y}).onComplete(function(){delete controls.target.twn}).start()
					 }
					 else if(height==='isometric'){
						for(var i =0; i<4; i++){ /*info.hidesprite(i)*/ }
						if(controls.target.twn) controls.target.twn.stop()
 						controls.target.twn = new TWEEN.Tween({y:controls.target.y}).to({y:-4},700).onUpdate(function(){
 							controls.target.y = this.y}).onComplete(function(){delete controls.target.twn}).start()
					 }
				 }
			}
			//zoom change block
			if(perspective.zoom!==zoom){ //on zoom change
				perspective.zoom = zoom
				// view.navscroll()

				if(zoom === 'close'){
					// view.navwidth()
					// info.hideprev(facing)
					highlight(facing,0,500)
					// callContent({tgt:'points', index: facing, prev: text.part})
					Velocity($('bottom_ui'), {translateY: '.25rem', scale: 1.065})
				}
				else if(zoom === 'far') {
					if(height==='elevation' || height==='isometric'){
						highlight(facing,0,500);
						// info.hideprev(facing)
						// for(var i = 0; i<4; i++) info.hidesprite(i)
						if(height==='elevation'){
							if(controls.target.twn) controls.target.twn.stop()
							controls.target.twn = new TWEEN.Tween({y:controls.target.y}).to({y:-4},700).onUpdate(function(){
								controls.target.y = this.y}).onComplete(function(){delete controls.target.twn}).start()
						}
					}
				}
			 	else if(zoom === 'normal'){
					// view.navwidth()
					if(height==='elevation' || height==='isometric'){
						// info.showprev(facing);
						highlight(facing,1,500)
						if(height==='elevation'){
							var behind = facing<2? facing+2 : facing-2
							// 	if(seseme['plr'+facing].position.y-2 > seseme['plr'+behind].position.y){
 							// 	for(var i = 0; i<4; i++){ if(i!==facing && i!==behind) info.showsprite(i) }
							// 	}else for(var i = 0; i<4; i++){ if(i!==facing) info.showsprite(i) }
	 						controls.target.twn = new TWEEN.Tween({y:controls.target.y}).to({y:-1.5},700).onUpdate(function(){
		 						controls.target.y = this.y}).onComplete(function(){delete controls.target.twn}).start()
						}
					}
					// callContent({tgt:'part', prev: text.points[facing]})
					Velocity($('bottom_ui'), {translateY: 0, scale: 1})
				}
			} // end check zoom change
			//scene zoom offset
			if(camera.zoom > 1){
				// info.sprite.forEach(function(ele){ele.scale.set(1-addzoom/4,1-addzoom/4,1-addzoom/4)})
				if(perspective.zoomswitch===false){//scene moves up and down at close zoom levels
					scene.position.y = -(seseme['plr'+facing].targetY)*(addzoom/1.5)-(addzoom*4)
				}
			}

		})//end controls 'change' event

		//CLICKS
		document.addEventListener('click', function(event){
			event.preventDefault()
			mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1
			mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1
			raycast.setFromCamera(mouse, camera)
			console.log(raycast.intersectObjects(info.titleblock.children))
		})

		//WINDOW RESIZING
		window.addEventListener('resize', function(){
			var aspect = window.innerWidth / window.innerHeight; var d = 20
			camera.left = -d*aspect; camera.right = d*aspect; camera.top = d; camera.bottom = -d
				renderer.setSize( window.innerWidth, window.innerHeight); camera.updateProjectionMatrix()
		}, false)

	}//behaviors
	function display(){
    requestAnimationFrame( display ); renderer.render( scene, camera )
    controls.update(); TWEEN.update();
	}
}//end setup
