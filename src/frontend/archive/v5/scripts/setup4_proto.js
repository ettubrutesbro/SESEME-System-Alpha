
//global data
var socket
var story = 0, part = 0, data
var info = {prev: [], sprite: [], detail: []}
//objects and resources
var scene = new THREE.Scene(), camera, renderer
var resources = {geos: {}, mtls: {}}
var seseme = new THREE.Group(), ground, lights, shadow
//global states
var facing = 0, perspective = {height: 'isometric', zoom: 'normal', zoomswitch: false}, init = true
var controls, mouse = new THREE.Vector2(), raycast
// DEBUG variables
var online = false

function setup(){
	//ready waits for data & 3d before filling the scene
	//though, using THREE's load manager here feels a bit disingenuous...
	var ready = new THREE.LoadingManager()
	ready.itemStart('firstdata'); ready.itemStart('3d')
	ready.onLoad = function(){ fill(); display() }
	dataOps() //data from server
	instDOM() //dom
	assets() //animate & 3d

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
				var ui = [nav, help, text]
				ui.forEach(function(ele){ //establinhisg controls / open booleans
					ele.openbtn = ele.querySelector('.open'); ele.closebtn = ele.querySelector('.close'); ele.stuff = ele.querySelector('.info')
					ele.isOpen = false
				})
				text.part = $('text_part'); text.points = $$('text_point'); text.topline = $('text_top_line')
				text.partlabel = $('text_title_part'); text.pointlabel = $('text_title_point')
				text.bottomline = $('text_bottom_line')
				text.pointtitles = text.pointlabel.getElementsByTagName('span')

				nav.items = $$('nav_item'); nav.icons = $$('nav_icon'); nav.contents = $$('nav_content');
				nav.labels = $$('nav_label'); nav.names = $$('nav_name'); nav.points = $$('nav_point')
				nav.navlabel = $('nav_title'); nav.bars = $$('nav_point_bar')

				help.buttons = help.getElementsByClassName('help_button')
				help.helplabel = $('help_label'); help.captions = help.getElementsByClassName('caption')
				help.backing = $('help_backing'); help.howtos = $$('overlay_howto')
				help.abouts = $$('overlay_about'); help.feedback = $('overlay_feedback')
				help.nextbtn = $('nextbutton')
			 }

		})
	} //end domOps
	function assets(){
		var allModels = ['quaped','pillarA','pillarB','pillarA_outline','pillarB_outline'] //symbolgeos?
		var allTextures = ['orbitpointer','storypointer','diamond','circle','chevron','tri','shadow'] //names of external imgs (PNG)
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
			google: {families: ['Source Serif Pro', 'Fira Sans']},
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
			resources.mtls.orb = new THREE.MeshPhongMaterial({color:0xff6666,emissive:0x771100,shininess:1,specular:0x272727})
			resources.mtls.ground = new THREE.MeshBasicMaterial({color: 0xededed})
			//meshes
			ground = new THREE.Mesh(new THREE.PlaneBufferGeometry( 150, 150 ), resources.mtls.ground)
			ground.rotation.x = rads(-90); ground.position.set(0,-18,0)

			var xlats = [
				{type:'A', qua: {x:1.5,z:1, r: 0}},
				{type:'B', qua: {x:1,z:-1.5, r: 90}},
				{type:'B', qua: {x:-1.5,z:-1, r: 180}},
				{type:'A', qua: {x:-1,z:1.5, r: -90}}
			]
		 	var pillarStartY = dice(2)===1? 0: 72
			xlats.forEach(function(ele,i){
				seseme['quad'+i] = new THREE.Mesh(resources.geos.quaped,resources.mtls.seseme)
				seseme['quad'+i].end = {x:ele.qua.x, y:0, z:ele.qua.z}
				seseme.add(seseme['quad'+i])
				seseme['plr'+i] = new THREE.Mesh(resources.geos['pillar'+ele.type],resources.mtls.seseme)
				seseme['plr'+i].position.set(-3.5,pillarStartY,1)
				seseme['plr'+i].geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,-4,0))
				seseme['plr'+i].rotation.y = ele.type==='B'?rads(-90) : 0
				//outline addition
				outline = new THREE.Mesh(ele.type==='A'?resources.geos.pillarA_outline:resources.geos.pillarB_outline, new THREE.MeshBasicMaterial({transparent: true, side: THREE.BackSide, depthWrite: false, opacity: 0}))
				outline.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,-4,0))

				seseme['plr'+i].outline = outline; seseme['plr'+i].add(outline)

				var outcap = new THREE.Mesh(resources.geos.rightTri, new THREE.MeshBasicMaterial({transparent: true, opacity: 0}))
				outcap.rotation.x=rads(-90); outcap.rotation.z=rads(90)
				outcap.scale.set(1.9,1.9,1.9); outcap.position.set(-4,-0.6,1.5)
				seseme['plr'+i].outcap = outcap; seseme['quad'+i].add(outcap)

				seseme['quad'+i].add(seseme['plr'+i])
			})
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
		initAnim(); behaviors(); fillDOM();

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
					view.enableUI()
					if(perspective.zoom==='normal'&&perspective.height==="isometric"){
						info.prev[facing].show(); highlight(facing,1,600)
					}
					init = false
				} // end init conditional for plrMgr.onload
			}
			projectionMgr.onProgress = function(item,loaded,total){console.log(item,loaded,total)}
			projectionMgr.onLoad = function(){
				console.log('all projections loaded, show facing')
				if(!init){
					if(perspective.zoom === 'normal' && perspective.height === 'isometric'){
						info.prev[facing].show()
					}else{}
				}
				for(var i = 0; i<4; i++){ projectionMgr.itemStart('projection'+i)} //wtf lol
			}
		}
		function initAnim(){
			var rgb = data.color ? hexToRgb(data.color) : {r:0,g:0,b:0}
				for(var i = 0; i<4; i++){
					var q = seseme['quad'+i]
					q.position.set(q.end.x, -31, q.end.z)
					q.rotation.y = rads(i*90)
					move(q,{x:q.end.x,y:q.end.y,z:q.end.z},1700,1,'Quadratic','Out',pillarAnim(i),i*250)
					recolor(seseme['plr'+i].outline, {r: rgb.r, g: rgb.g, b: rgb.b}, 400)
					recolor(seseme['plr'+i].outcap, {r: rgb.r, g: rgb.g, b: rgb.b}, 400)
				}
				fade(shadow, 1, 800, 1200)

				function pillarAnim(which){
					projection(which)
					move(seseme['plr'+which],{x: seseme['plr'+which].position.x, y: seseme['plr'+which].targetY,
					z: seseme['plr'+which].position.z}, 1500, 5, 'Quadratic', 'Out', function(){
						plrMgr.itemEnd('plr'+which)
					}, 500+(which*300))
				}
		}
		function projection(i){
			info.prev[i] = new THREE.Group()
			info.prev[i].position.set(-3.5,-2.5,1)
			info.prev[i].rotation.y = rads(-45)
			seseme['quad'+i].add(info.prev[i])

			info.sprite[i] = new THREE.Group()
			info.sprite[i].expand = {y: 2.7}
			seseme['plr'+i].add(info.sprite[i])

			populateProjection()
			projectionBehaviors()
			projectionMgr.itemEnd('projection'+i)

			function populateProjection(){
				var title = new THREE.Object3D()
				var caption = new THREE.Object3D()
				var sprite = new THREE.Sprite()
				var pointer = new THREE.Sprite(new THREE.SpriteMaterial({transparent:true,map:resources.mtls.chevron.map,opacity:0}))

				//actual population of objs with text
					if(data.pointNames){
						var pointName = typeof data.pointNames==='number'? data.pointNames.toString(): typeof data.pointNames==='string'? data.pointNames : data.pointNames[i]
						//previmw title block
						{
							if(pointName instanceof Array){ //nested array = double line title
								title = meshify(new Text(pointName[0], 9.5, 100, 110, 'white','Source Serif Pro',28,500, 'center'))
								var addtext = meshify(new Text(pointName[1], 9.5, 100, 110, 'white', 'Source Serif Pro',28, 500, 'center'))
								addtext.origin = {x: 0, y: 0, z: 0}, addtext.expand = {x:0,y:-2.1,z:0}
								title.add(addtext)
							}else if(pointName.length < 13 ){
								title = meshify(new Text(pointName, 11.5, 200, 200, 'white','Source Serif Pro',36,400, 'center'))
							}else if(pointName.length < 17){
								title = meshify(new Text(pointName, 8, 150, 150, 'white','Source Serif Pro',25,500, 'center'))
							}else if(pointName.length >= 17){
								title = meshify(new Text(pointName.substring(0,15), 10.5, 50, 110, 'white','Source Serif Pro',25,500, 'center'))
								var addtext = meshify(new Text(pointName.substring(15,pointName.length), 10.5, 150, 110, 'white', 'Source Serif Pro',25, 500, 'center'))
								addtext.origin = {x: 0, y: 0, z: 0}, addtext.expand = {x:0,y:-2,z:0}
								title.add(addtext)
							}
						}
						//sprite title block
						{
							var sprtxt = new Text(pointName,11,240,125,'black','Fira Sans',30,500,'center')
							var sprmtl = new THREE.SpriteMaterial({transparent:true,map:sprtxt.tex,opacity:0 })
							sprite.material = sprmtl
							sprite.scale.set(sprtxt.cvs.width/150, sprtxt.cvs.height/150, 1)
							sprite.expand = {y:0,sx:sprtxt.cvs.width/100,sy:sprtxt.cvs.height/100}
						}
					}//end data.pointNames check
					if(data.pointCaptions){
						var captiontext = data.pointCaptions instanceof Array? data.pointCaptions[i] : data.pointCaptions
						caption = meshify(new Text(captiontext,11.5,200,80,'white','Fira Sans',16,500,'center'))
						info.prev[i].position.y = -3.5
					}else info.prev[i].position.y = -2.5;

					//xforms
					title.rotation.x = Math.atan(-1/Math.sqrt(2)); title.origin = {x:0,y:2.75,z:6.5}
					title.expand = {x: 0, y: 0, z:6.5}; title.position.set(0,2.75,6.5)
					caption.origin={x:0,y:3,z:5.8}; caption.expand={x:0,y:2,z:5.8}
					caption.rotation.x = Math.atan(-1/Math.sqrt(2)); caption.position.set(0,3,5.8)
					pointer.expand = {y: -1}
					if(!sprite.expand) sprite.expand = {y:0,sx:0,sz:0};

					//assignments and addition
					info.prev[i].title = title
					info.prev[i].caption = caption
					info.sprite[i].title = sprite
					info.prev[i].add(info.prev[i].title)
					info.prev[i].add(info.prev[i].caption)
					info.sprite[i].add(pointer)
					info.sprite[i].add(info.sprite[i].title)

				}
			function projectionBehaviors(){
					//preview block
					{
						info.prev[i].show = function(){
							this.traverse(function(child){
								if(child.material) fade(child, 1, 400, 0)
								if(child.expand) move(child,child.expand,400,1,'Quadratic','Out',function(){},0)
							})
						}
						info.prev[i].hide = function(){
							this.traverse(function(child){
								if(child.material) fade(child, 0, 400, 0)
								if(child.origin) move(child,child.origin,400,1,'Quadratic','Out',function(){},0)
							})
						}
						info.prev[i].change = function(){
							if(this.title){
								var finish = new THREE.LoadingManager
								finish.onLoad = function(){
									console.log('all prev hidden, removing and re-projecting')
									seseme['quad'+i].remove(info.prev[i]); projection(i)
								}
								var ite = 0
								this.title.traverse(function(child){
									finish.itemStart(child)
									fade(child,0,400-(ite*150),0, function(){finish.itemEnd(child)})
									move(child,child.origin,400,1,'Quadratic','Out',function(){},0)
									label_i++
								})
							}
						}
					}
					//sprite block
					{
						info.sprite[i].show = function(){
							if(this.title){
								size(this.title,{x:this.title.expand.sx,y:this.title.expand.sy,z:1},300)
								var ite = 0
								this.traverse(function(child){
									if(child.material){fade(child,1,300+(ite*100),i*100)}
									move(child,{x:child.position.x,y:child.expand.y,z:child.position.z},300+(ite*125),1,'Quadratic','Out',function(){},i*100)
									ite++
								})
							}
						}
						info.sprite[i].hide = function(){
							if(this.title){
								size(this.title,{x:this.title.expand.sx/1.5,y:this.title.expand.sy/1.5,z:1},300)
								var ite = 0
								this.traverse(function(child){if(child.material){
									fade(child,0,200,ite*100)}
									move(child,{x:child.position.x,y:child.expand.y-(ite),z:child.position.z},200+(ite*100),1,'Quadratic','Out',function(){},i*50)
									ite++
								})
							}
						}
					}
				}
		} // end projection
		function behaviors(){
			Origami.fastclick(document.body) //attaches fastclick for iOs
			window.addEventListener('deviceorientation', function(evt){})
			//DOM CLICK REACTIONS
			{
				const ui = [nav, help, text]
				ui.forEach(function(ele){
					ele.openbtn.addEventListener('click',view['expand'+ele.getAttribute('id')])
					ele.closebtn.addEventListener('click',view['collapse'+ele.getAttribute('id')])
				})
				for(var i = 0; i<3; i++){
						help.buttons[i].addEventListener('click',view['help'+help.buttons[i].getAttribute('id')])
				}
				help.nextbtn.addEventListener('click',view.helpnext)
			}
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
				facingRotations.some(function(ele,i){
					if(Math.abs(degs(camera.rotation.y)-ele)<45){
						if(facing!==i){
							console.log('facing diff plr')
							if(perspective.height==='isometric'&&perspective.zoom!=='close'&&perspective.zoom!=='far'){
								info.prev[facing].hide();	info.prev[i].show()
								highlight(i,1,350); highlight(facing,0,300)
							}
							view.cyclePoints(i)
							view.navpoint(i)
							facing = i
							view.navwidth()

							if(camera.zoom>1){
								perspective.zoomswitch = true
								move(scene,{x:0,y:-(seseme['plr'+facing].targetY)*(addzoom/1.5)-(addzoom*4),z:0},100,70,'Quadratic','InOut',function(){perspective.zoomswitch = false})
							}
						}
					return true }
				})
				// height change block
				if(perspective.height!==height){
					perspective.height = height
					if(perspective.height!=='isometric'){
						for(var i = 0; i<4; i++){
							info.prev[i].hide()
							fade(seseme['plr'+i].outline,0,350,0);fade(seseme['plr'+i].outcap,0,350,0)
							highlight(i,0,350)
							if(perspective.height==='elevation'&&perspective.zoom!=='far'){info.sprite[i].show()}
							else if(perspective.height==='plan'&&perspective.zoom!=='far'){  }
						}
					}else if(zoom!=='far'&&zoom!=='close'){
						info.prev[facing].show(); for(var i=0;i<4;i++){info.sprite[i].hide()}
						highlight(facing,1,350)
					}
				}
				//zoom change block
				if(perspective.zoom!==zoom){ //on zoom change
					perspective.zoom = zoom
					view.navscroll(); view.navwidth()
					if(zoom === 'close'){
						view.point();
						for(var i=0;i<4;i++){
							highlight(i,0,500)
							info.prev[i].hide()
						}
						Velocity($('bottom_ui'), {translateY: '.25rem', scale: 1.065})
					} else if(zoom === 'far'){
						info.prev.forEach(function(ele,i){
							ele.hide(); info.sprite[i].hide()
							highlight(i,0,500)
						})
					} else if(zoom === 'normal'){
						if(perspective.height==='isometric'){
							info.prev[facing].show()
							highlight(facing,1,500)
						} else if(perspective.height==='elevation'){
							for(var i =0;i<4;i++){info.sprite[i].show()}}
						view.part()
						Velocity($('bottom_ui'), {translateY: 0, scale: 1})
					}
				} // end check zoom change
				//scene offset on zoom
				if(camera.zoom > 1){
					info.sprite.forEach(function(ele){ele.scale.set(1-addzoom/4,1-addzoom/4,1-addzoom/4)})
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
			})

			//WINDOW RESIZING
			window.addEventListener('resize', function(){
				var aspect = window.innerWidth / window.innerHeight; var d = 20
				camera.left = -d*aspect; camera.right = d*aspect; camera.top = d; camera.bottom = -d
					renderer.setSize( window.innerWidth, window.innerHeight); camera.updateProjectionMatrix()
			}, false)

		}//behaviors
		function fillDOM(){
			//for a better tomorrow
			{
				var attrlist = [ 'title', 'info', 'dataset', 'pointNames', 'pointCaptions', 'pointText', 'color', 'pointDetails', 'pointIcons' ]
				var attributes = {}
				attrlist.forEach(function(ele){
					if(data[ele] instanceof Array){
						attributes[ele] = []
						for(var i = 0; i<data[ele].length; i++){
							attributes[ele][i] = 'change'
						}
					}else{
						attributes[ele] = 'change'
					}
				})
			}

			// DOM data / style assignments
				//textContent
				{
					//data.info
					{
						if(data.info){ text.part.textContent = data.info; text.part.disabled = false }
						else {text.part.textContent = '' ; text.part.disabled = true}
					}
					//titles (story and part)
					{
						var titlename, titlelabel
						if(data.title&&story.title)
						{ titlename = data.title+' ('+(part+1)+'/'+story.parts.length+')';	titlelabel = story.title }
						else if(data.title) { titlename = data.title; titlelabel = 'STORY PART '+(part+1)+'/'+story.parts.length}
						else if(story.title) { titlename = 'PART '+(part+1)+'/'+story.parts.length; titlelabel = story.title }
						else {titlename = 'PART '+(part+1)+'/'+story.parts.length; titlelabel = 'STORY ?'}
						nav.names[0].textContent = titlename
						nav.labels[0].textContent = titlelabel
						text.partlabel.textContent = data.title?titlename: ''
					}
					//pointNames
					{
						for(var i = 0; i<4; i++){
							var pointnav, pointnametext
							if(Array.isArray(data.pointNames)&&data.pointNames[i]){
								if(Array.isArray(data.pointNames[i]))
								{ pointnav = pointnametext = data.pointNames[i].toString().replace(',',' ')}
								else pointnav = data.pointNames[i]; pointnametext = data.pointNames[i]
							}
							else if(Array.isArray(data.pointNames)&&!data.pointNames[i])
								{pointnav = data.pointValues[i]; pointnametext = ''}
							else if(data.pointNames) pointnav = pointnametext = data.pointNames
							else { pointnav = data.pointValues[i]; pointnametext = '' }
							nav.points[i].textContent = pointnav
							text.pointtitles[i].textContent = pointnametext
						}
					}
					//dataset
					{
						if(data.dataset instanceof Array){
							for(var i = 0; i<4; i++){
								var pt = document.createElement('span'); pt.className = 'nav_label_data'
								pt.textContent = data.dataset[i]? data.dataset[i] : 'DATA'
								nav.labels[1].appendChild( pt ); if(i===facing) $$('nav_label_data')[i].style.opacity = 1
							}
						}else nav.labels[1].textContent = data.dataset?data.dataset: 'DATA'
					}
					//pointText??
					{
						if(data.pointText instanceof Array){
							for(var i = 0; i<4; i++){
								if(data.pointText[i]){ text.points[i].textContent = data.pointText[i]; text.points[i].disabled = false }
								else {text.points[i].textContent = '' ; text.points[i].disabled = true}
							}
						}else{
							for(var i = 0; i<4; i++){
								text.points[i] = data.pointText
								if(!data.pointText) text.points[i].disabled = true
							}
						}
					}
				}
				//attributes for dynamic behaviors
				{
					var hypsettings = { onhyphenationdonecallback: function(){ text.targetHeight = text.part.offsetHeight } }
					Hyphenator.config(hypsettings)
					Hyphenator.run()
					nav.iconwidth = nav.icons[0].offsetWidth
					nav.targetWidth = nav.names[0].offsetWidth + nav.iconwidth

					var plrOrder = data.pointValues.concat().sort(function(a,b){return a-b})
					if(data.rangeType === 'lessIsTall'){plrOrder.reverse()}
					data.pointValues.forEach(function(ele,i){
						nav.bars[i].style.height = (plrOrder.indexOf(ele)+1)*25+'%'
						Velocity(nav.bars[i], {translateX: i!=3?100+(i*100)+'%':0})
					})
				 }
					//initial style states
				//assigning initial styles
				{
					text.openbtn.style.backgroundColor = text.stuff.style.backgroundColor =
					nav.style.backgroundColor = data.color? data.color : 'black'

					nav.style.width = nav.targetWidth
					nav.points[facing].style.opacity = 1
					Velocity(nav.items[1], {translateY: '1.5rem'}, {duration: 0})
					Velocity(nav.navlabel, {translateX: -nav.navlabel.offsetWidth*1.25}, {duration: 0})
					Velocity(nav.closebtn, {translateX: '-2.25rem'}, {duration: 0})

					help.style.height = help.stuff.offsetHeight+help.openbtn.offsetHeight
					help.backing.style.height = help.stuff.offsetHeight
					Velocity(help.nextbtn, {translateY: '4.5rem'}, {duration: 0})
					Velocity([help.stuff, help.backing, help.closebtn], {translateY: -help.stuff.offsetHeight}, {duration: 0})
					Velocity(help.helplabel, {translateX: help.helplabel.offsetWidth},{duration:0})
					Velocity(help.buttons, {translateX: '150%'}, {duration: 0})
					Velocity(help.captions, {translateY: '-50%', opacity: 0}, {duration: 0})
					Velocity(help, {borderColorAlpha: 0}, {duration: 0})

					text.pointlabel.style.width = text.pointtitles[facing].offsetWidth
					text.openbtn.style.bottom = -text.openbtn.offsetHeight/2.7
					text.pointtitles[0].style.opacity = 1
					Velocity(text.partlabel, {translateX: text.partlabel.offsetWidth}, {duration: 0})
					Velocity(text.pointlabel, {translateY: text.pointlabel.offsetHeight}, {duration: 0})
					Velocity(text.closebtn, {translateY: '3rem'},{duration:0, visibility:'hidden'})
				}

		}
	} //end view.fill() --------------------
	function display(){
    requestAnimationFrame( display ); renderer.render( scene, camera )
    controls.update(); TWEEN.update();
	}
}//end setup
