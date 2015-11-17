
//global data
var socket
var story=0, part=0, data = stories[story].parts[part], percentages
var info = {name: []}
// info.prev = [], info.name = [], info.detail = []
//objects and resources
var scene = new THREE.Scene(), camera, renderer
var resources = {geos: {}, mtls: {}}
var seseme = new THREE.Group(), ground, lights, shadow
//global states
var facing = 0, startHash = window.location.hash.slice(1)
view = {text: false, content: '', lastTextHeight: 0, filling: false,
	help: false, helpContent: '', helpReady: true,
	height: '', zoom: '', zoomswitch: false,
	cycleDirection: false, zoomDirection: false},
init = true
var controls, mouse = new THREE.Vector2(), raycast
// 3d constants
var plrmax = 12, constspd = 10000, spdcompensator = 400,
// plrSlope = 638.5, plrConstant = 1112.2,
thresholds = {zoom: [.675,1.15], height: [-3,-56]},
// facingRotations = [-45,45,135,-135]
facingRotations = [-45,-135,135,45]
//dom
var dom = {}
// DEBUG / user / data collecting variables
var userPermission = true
var online = false
var performance = 'med'

function setup(){
	//ready waits for data & 3d before filling the scene
	//though, using THREE's load manager here feels a bit disingenuous...
	var ready = new THREE.LoadingManager()
	ready.itemStart('firstdata'); ready.itemStart('3d')
	ready.onLoad = function(){ fill(); behaviors(); display() }
	netOps() //data from server
	initDOM() //dom

	function netOps(){
			if(online){ //server is hooked up
				socket = io.connect('http://169.237.123.19:5000')
				socket.once('connect', function(){
					console.log('successfully connected')
					socket.emit('ui request story')
					// socket.on('debug status report', function(d){console.log(d)})
			 	})
				socket.once('ui acquire story', function(d){
					console.log('ui acquired story')
					console.log(d)
						story = d.story; part = d.part; percentages = d.percentages
						console.log(story)
						data = stories[story].parts[part]
					ready.itemEnd('firstdata')
				})
				socket.on('ui update', function(d){
					// if(d.story.id === story.id && d.part === part) {console.log('updated to same shit') ; return}
					console.log('ui updating')
					console.log(d)
					story = d.story
					part = d.part
					percentages = d.percentages
					refill()
				})
				socket.on('ui check desync', function(){
					console.log('XPS is checking desync')
					socket.emit('ui report status', {story: story.id, part: part})
				})
				socket.on('disconnect',function(){ console.log('disconnected')})
				socket.on('reconnect', function(){ console.log('reconnected') })
				// socket.on('receive something', function(d){ console.log(d) })
				socket.on('status report', function(d){ console.log(d) })
			}
			//development w/o server: mock
			else if(!online){
				console.log('let\'s pretend we\'re online...')
				story = 0; part = 0
				data = stories[story].parts[part]
				percentages = heightCalc(data)
				ready.itemEnd('firstdata')

				function heightCalc(data){
						//pass in story[i].parts[part].values, get percentages
						var top = 100, bottom = 0
						if(!data.valueType || data.valueType === "moreIsTall"){
							top = !data.customHi ? Math.max.apply(null, data.values) : data.customHi
							bottom = !data.customLo ? Math.min.apply(null, data.values) : data.customLo
						}
						else if(data.valueType === 'lessIsTall'){
							top = !data.customHi ? Math.min.apply(null, data.values) : data.customHi
							bottom = !data.customLo ? Math.max.apply(null, data.values) : data.customLo
						}
						var range = Math.abs(bottom-top)
						var percentagesArray = []
						for(var i = 0; i < 4; i++){
							percentagesArray[i] = Math.abs(bottom-data.values[i])/range
						}
						return percentagesArray
				}
				// setTimeout(function(){ part++; view.nextpart() }, 7500)
			}
	} // end query
	function initDOM(){ // defining global DOM items
		// document.addEventListener('DOMContentLoaded', function(){
			dom.containerSESEME = $('containerSESEME')
			dom.bottom = $('bottom'); dom.closebutton = $('closebutton');
			dom.bottomwrapper = $('bottomwrapper')
			dom.rule = $('rule')
			dom.maintext = $('maintext'); dom.overtext = $('overtext')
			for(var i = 0; i<4; i++){
				dom['detail'+i] = $('detail'+i)
			}
			dom.nav = $('nav'); dom.help = $('help')
			dom.navitems = $$('navitem')
			dom.databars = $$('databar')
			dom.navspans = []; dom.navfigures = [];
			dom.navnames = dom.navitems[3].querySelectorAll('span span')
			for(var i = 0; i<4; i++){
				dom.navspans.push( dom.navitems[i].querySelector('span') )
				dom.navfigures.push( dom.navitems[i].querySelector('figure') )
			}
			dom.leftarrow = $('leftarrow'); dom.rightarrow = $('rightarrow')
			assets()
		// })
	} //end initDOM
	function assets(){
		var allModels = ['quaped','pillar','outline3','outcap','templategeo'] //symbolgeos?
		var allTextures = ['chevron','shadow','bookeyemag', 'circle', 'templategeo', 'planetest',
			,'link_chain','link_list','link_data','link_www','link_yt','link_pix',
			'link_article','link_book','link_site','link_convo','link_tw','link_tw2','link_tw3','link_ig',
			'link_ig2','link_fb','link_podcast', 'btn_howto','btn_feedback','btn_about','btn_settings'] //names of external imgs (PNG)
		// stories.forEach(function(ele){ allModels.push(ele.geo); allTextures.push(ele.geo) })
		var resourceMgr = new THREE.LoadingManager()
		resourceMgr.itemStart('mdlMgr'); resourceMgr.itemStart('mtlMgr'); resourceMgr.itemStart('fonts')
		resourceMgr.onLoad = function(){
			console.log('all resources done')
			build(); ready.itemEnd('3d')
		}
		var mdlMgr = new THREE.LoadingManager()
		mdlMgr.onProgress = function(item,loaded, total){console.log(item,loaded, total)}
		mdlMgr.onLoad = function(){console.log('models done'); resourceMgr.itemEnd('mdlMgr')}
		for(var i = 0; i<allModels.length;i++){ mdlMgr.itemStart('assets/'+allModels[i]+'.js') }
		var mdlLoader = new THREE.JSONLoader()
		allModels.forEach(function(ele){
			mdlLoader.load('assets/'+ ele +'.js',function(geo){
				resources.geos[ele] = geo; mdlMgr.itemEnd('assets/'+ ele +'.js')
			})
		})
		//fixed geo resources
		{
			resources.geos.testbox = new THREE.BoxGeometry(2.75,2.75,2.75)
			var triA = new THREE.Shape() //normal triangle
			triA.moveTo(-0.75,0); triA.lineTo(0.75,0); triA.lineTo(0,-1); triA.lineTo(-0.75,0)
			resources.geos.triangleA = new THREE.ShapeGeometry(triA)
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
		{
			resources.mtls.testbox = new THREE.MeshNormalMaterial()
		}
		window.WebFontConfig = {
			google: {families: ['Droid Serif:400', 'Karla']},
			classes: false,
			active: function(){ console.log('fonts loaded'); resourceMgr.itemEnd('fonts') }
		}

		function build(){
			//camera/renderer/dom
			var aspect = dom.containerSESEME.offsetWidth / dom.containerSESEME.offsetHeight; var d = 20
			camera = new THREE.OrthographicCamera( - d * aspect, d * aspect, d, - d, 0, 100 )
			camera.position.set( -d, 10, d ); camera.rotation.order = 'YXZ'
			camera.rotation.y = - Math.PI / 4 ; camera.rotation.x = Math.atan( - 1 / Math.sqrt( 2 )); camera.zoom = .875
			camera.updateProjectionMatrix();

			renderer = new THREE.WebGLRenderer({antialias: true, alpha: true})
			// renderer.setClearColor(0xbbbbbb)
			renderer.setSize( dom.containerSESEME.offsetWidth, dom.containerSESEME.offsetHeight)
			dom.containerSESEME.appendChild( renderer.domElement )
			controls = new THREE.OrbitControls(camera)
			raycast = new THREE.Raycaster()
			//materials
			resources.mtls.seseme_phong = new THREE.MeshPhongMaterial({color: 0x80848e,shininess:17,specular:0x9a6a40,emissive: 0x101011})
			resources.mtls.seseme_lambert = new THREE.MeshLambertMaterial({color: 0x80848e})
			resources.mtls.seseme_worst = new THREE.MeshBasicMaterial({color: 0x000})
			resources.mtls.seseme = resources.mtls.seseme_lambert
			resources.mtls.orb = new THREE.MeshPhongMaterial({color:0xff6666,emissive:0x771100,shininess:1,specular:0x272727})
			resources.mtls.ground = new THREE.MeshBasicMaterial({color: 0xededed})
			//meshes
			// ground = new THREE.Mesh(new THREE.PlaneBufferGeometry( 150, 150 ), resources.mtls.ground)
			// ground.rotation.x = rads(-90); ground.position.set(0,-18,0)
			covercube = new THREE.Mesh(new THREE.BoxGeometry( 15,30,15 ),resources.mtls.ground)
			covercube.position.y = -33; covercube.name = 'covercube'

			var qPos= [{x:1.5,z:1,r:0},{x:-1,z:1.5,r:270},{x:-1.5,z:-1,r:180},{x:1,z:-1.5,r:90}]
		 	var pillarStartY = dice(2)===1? 0: 72
			for(var i = 0; i<4; i++){
				seseme['quad'+i] = new THREE.Mesh(resources.geos.quaped,resources.mtls.seseme)
				seseme['quad'+i].position.set(qPos[i].x,0,qPos[i].z)
				seseme['quad'+i].rotation.y = rads(qPos[i].r)
				seseme.add(seseme['quad'+i])
				//plr
				seseme['plr'+i] = new THREE.Mesh(resources.geos.pillar,resources.mtls.seseme)
				seseme['plr'+i].geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,-2.25,0))
				seseme['plr'+i].position.set(-3.6, pillarStartY, 1.1)
				seseme['plr'+i].rotation.y = rads(-90)
				//outline addition
				outline = new THREE.Mesh(resources.geos.outline3, new THREE.MeshBasicMaterial({transparent: true, side: THREE.BackSide, depthWrite: true, opacity: 0, color: 0xff0000, needsUpdate: true}))

				outline.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,-2.25,0))
				seseme['plr'+i].outline = outline; seseme['plr'+i].add(outline)
				//outcap
				var outcap = new THREE.Mesh(resources.geos.outcap, new THREE.MeshBasicMaterial({transparent: true, opacity: 0, color: 0xff0000, needsUpdate: true}))
				outcap.position.set(-3.6, 8.3, 1.1); outcap.rotation.y = rads(-90)
				seseme['plr'+i].outcap = outcap; seseme['quad'+i].add(outcap)
				seseme['quad'+i].add(seseme['plr'+i])
			}

			//lighting
			{
				lights = new THREE.Group(); var amblight = new THREE.AmbientLight( 0x232330 )
				var backlight = new THREE.SpotLight(0xeaddb9, 1.2); var camlight = new THREE.PointLight(0xffffff, .35)
		  	backlight.position.set(-7,25,-4); camlight.position.set(-40,-7,-24)
				backlight.default = 1.2, camlight.default = .35
		  	lights.add(backlight); lights.add(amblight); lights.add(camlight)
				lights.rotation.set(-camera.rotation.x/2, camera.rotation.y + rads(45), -camera.rotation.z/2)
			}
		  	//other FX
		  	shadow = new THREE.Mesh(new THREE.PlaneBufferGeometry(16,16), resources.mtls.shadow)
		  	shadow.rotation.x = rads(-90); shadow.position.set(-0.1,-17.99,0.1)
				shadow.material.opacity = 0
				//adding to scene
				seseme.add(covercube)
				// scene.add(ground); // ground may be obselete....
				scene.add(seseme); scene.add(lights); scene.add(shadow)
		}//build
	}//assets
	function fill(){
		var plrMgr, projectionMgr
		// heightCalc();
		pctsToHeights()
		loadingManagers();

		initQuads() //completion of each also runs initPillar
		makeOrbiter()
		highlightColor()
		makeNames([false,false,false,false]); projectionMgr.itemEnd('names')
		makeTitleblock(); projectionMgr.itemEnd('titleblock')
		makeSymbols([false,false,false,false])
		makeZoomLabels([false,false,false,false])
		makeStatboxes()
		makeLinks()
		fillDOM()
		placeMainButton()
		populateHelp()

		function loadingManagers(){
			allMgr = new THREE.LoadingManager()
			quadMgr = new THREE.LoadingManager()
			plrMgr = new THREE.LoadingManager()
			projectionMgr = new THREE.LoadingManager()
			allMgr.itemStart('quadMgr'); allMgr.itemStart('plrMgr'); allMgr.itemStart('projectionMgr')
			allMgr.itemStart('hyphenation')
			projectionMgr.itemStart('titleblock'); projectionMgr.itemStart('mainbtn'); projectionMgr.itemStart('names')
			for(var i= 0; i<4; i++){
				quadMgr.itemStart('quad')
				plrMgr.itemStart('plr'+i)
				projectionMgr.itemStart('helpSection'+i)
			}
			allMgr.onLoad = function(){
				//all things done moving and animating; app is ready
				console.log('quads, pillars, projections, hyphenation initalized')
				init = false
				Velocity(dom.help, {opacity: [1,0], translateX: [0, '2rem']}, {delay: 650, visibility: 'visible'})
				check()
			}
			allMgr.onProgress = function(item,loaded,total){ console.log(item,loaded,total) }
			quadMgr.onLoad = function(){
				console.log('quads in place'); allMgr.itemEnd('quadMgr')
				anim3d(shadow, 'opacity', {opacity: 1, spd: 800})
				seseme.remove(seseme.getObjectByName('covercube'))
			}
			quadMgr.onProgress = function(item,loaded,total){
				initPillar(loaded-1)
			}
			plrMgr.onLoad = function(){
				console.log('pillars in place'); allMgr.itemEnd('plrMgr')
			}
			// projectionMgr.onProgress = function(item,loaded,total){console.log(item,loaded,total)}
			projectionMgr.onLoad = function(){
				console.log('projections initialized'); allMgr.itemEnd('projectionMgr')
			}
		}//end loadingManagers
		function highlightColor(){
				var rgb = data.color.ui? hexToRgb(data.color.ui): {r:0,g:0,b:0}
				for(var i = 0; i<4; i++){
					seseme['plr'+i].outline.material.color = {r: rgb.r/255, g: rgb.g/255, b: rgb.b/255}
					seseme['plr'+i].outcap.material.color = {r: rgb.r/255, g: rgb.g/255, b: rgb.b/255}
				}
		}
		function makeOrbiter(){
			console.log('make orbiter')
			info.orbiter = new THREE.Group()
			info.orbiter.name = 'orbiter'
			info.orbiter.rotation.y = -rads(45)
			seseme.add(info.orbiter)
		}

		function placeMainButton(){
			var titlebtn = new THREE.Mesh(new THREE.PlaneBufferGeometry(4.5,4.5), new THREE.MeshBasicMaterial({ map: resources.mtls.circle.map, transparent: true, opacity: 0, color: 0xededed}))
			titlebtn.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,-1,0))
			titlebtn.position.y = 0
			// titlebtn.expand = -info.titleblock.ht - 3.2 + ((info.titleblock.children.length-1)*.5);
			titlebtn.rotation.x = camera.rotation.x;
			titlebtn.position.z = 12
			info.btn = titlebtn
			var btncolor = data.color.ui || 0x000000
			var colorbtn = new THREE.Mesh(new THREE.PlaneBufferGeometry(4,4), new THREE.MeshBasicMaterial({map:resources.mtls.circle.map ,transparent: true, opacity: 0,
				color: btncolor, depthWrite: false}))
			colorbtn.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,-1,0))
			info.btn.color = colorbtn; info.btn.add(info.btn.color); colorbtn.position.z+=0.1
			var icon = new THREE.Mesh(new THREE.PlaneBufferGeometry(3,3), new THREE.MeshBasicMaterial({map: resources.mtls.bookeyemag.map, transparent: true, opacity: 0, depthWrite: false}))
			icon.material.map.repeat.set(1/37, 1); icon.material.map.offset.x = 18/37
			icon.position.set(0,-1,.35)
			info.btn.icon = icon; info.btn.color.add(info.btn.icon)
				info.btn.frames = 37; info.btn.icon.eye = 18;
				info.btn.icon.mag = 36, info.btn.icon.book = 0; info.btn.icon.help = 0;
			info.orbiter.add(info.btn)
			projectionMgr.itemEnd('mainbtn')
		}
		function populateHelp(){
			info.help = new THREE.Group()
			var sections = [
				{name: 'about',
					x: 0, z: 14, icon: 'about',
					objs: [
						//team rows
						{dims: {x:40,y:7}, pos: {x:0, z:-28.75}, origin: {x:0,z:-30,delay:150, }},
						{dims: {x:40,y:7}, pos: {x:0, z:-20.75, delay: 75}, origin: {x:0,z:-29,delay:75}},
						{dims: {x:40,y:7}, pos: {x:0, z:-12.75, delay: 150, }, origin: {x:0,z:-25}},
						// paragraph
						{dims: {x:40,y:18}, pos: {x:0,z:28}, origin:{x:0,z:36}}
					]
				},
				{name: 'howto',
					x: 14, z: 0, icon: 'howto',
					objs: [
						//app animations
						{dims: {x:12,y:16},pos:{x:-14,z:-21,delay:100},origin:{x:10,z:-21}},
						{dims: {x:12,y:16},pos:{x:-0,z:-21,delay:50},origin:{x:12,z:-21,delay:50}},
						{dims: {x:12,y:16},pos:{x:14,z:-21},origin:{x:16,z:-21,delay:100,}},
						//blurb
						{dims: {x:20,y:16},pos:{x:-10,z:0},origin:{x:-3,z:0}},
						//below: seedling graphic & text
						{dims: {x:40,y:16},pos:{x:0,z:21,delay:100},origin:{x:0,z:14,delay:70}},
						{dims: {x:40,y:5},pos:{x:0,z:34,delay:200,},origin:{x:0,z:23}}
					]
				},
				{name: 'options',
					x: 0, z: -14, icon: 'settings',
					objs: [
						//settings: performance and collect usage data
						{dims: {x:15,y:15}, pos: {x:-9, z:18}, origin: {x:0,z:0,delay:150},
							clicked: performanceLevel},
						{dims: {x:15,y:15}, pos: {x:9, z:18,delay:250}, origin:{x:-9,z:18,delay:50},
							clicked: function(){ console.log('user data collection on/off') }},
						//captions
						{dims: {x:15,y:5}, pos: {x:-9, z:30, delay: 250,spd:250}, origin:{x:-9,z:25,spd:250}},
						{dims: {x:15,y:5}, pos: {x:9, z:30, delay: 500,spd:250,}, origin:{x:9,z:25,spd:250,}}
					]
				},
				{name: 'feedback',
					x: -14, z: 0, icon: 'feedback',
					objs: [
						{dims: {x:16,y:18 }, pos: {x:13,z:-20},origin:{x:0,z:0,delay:100,}},
						{dims: {x:16,y:18 }, pos: {x:13,z:0,delay:50},origin:{x:0,z:0,delay:50},
						clicked:function(){ window.location = "http://twitter.com/hi_datalith" }},
						{dims: {x:16,y:18 }, pos: {x:13,z:20,delay:100,},origin:{x:0,z:0},
						clicked: function(){ window.location= "mailto:Jack.Leng@gmail.com" }}
					]
				}
			]

			for(var i = 0; i<4; i++){
				var helpsection = new THREE.Group()
				helpsection.name = sections[i].name
				//button placement & color
				var helpbtn = new THREE.Mesh(new THREE.PlaneBufferGeometry(8,8),
				new THREE.MeshBasicMaterial({map: resources.mtls['btn_'+sections[i].icon].map,
					transparent: true, opacity: 0, depthWrite: false}))
				helpbtn.position.y = -17.5
				helpbtn.rotation.x = rads(-90)
				helpbtn.expand = {x: sections[i].x, z: sections[i].z, delay:50+i*35 }
				helpbtn.name=sections[i].name; helpbtn.class= 'btn'
				helpbtn.visible = false
				helpsection.btn = helpbtn
				helpsection.add(helpsection.btn)

				var helpcontent = new THREE.Group()
				for(var it = 0; it<sections[i].objs.length; it++){
					var objInfo = sections[i].objs[it]
					var helpObj = new THREE.Mesh(new THREE.PlaneBufferGeometry(objInfo.dims.x,objInfo.dims.y), new THREE.MeshBasicMaterial({color: 0x00000, transparent: true, opacity: 0, depthWrite: false}))
					helpObj.expand = {x:objInfo.pos.x, y:-17.75, z:objInfo.pos.z}
					helpObj.origin = objInfo.origin? {x:objInfo.origin.x,y:-17.9,z:objInfo.origin.z}: {x:0,y:-17.9,z:0}
					helpObj.onClick = objInfo.clicked
					helpObj.position.set(helpObj.origin.x, -17.9, helpObj.origin.z)
					helpObj.rotation.x = rads(-90)
					helpObj.name = sections[i].name; helpObj.class = 'content'; helpObj.index = it
					helpObj.visible = false
					helpcontent.add(helpObj)
				}
				helpsection.content = helpcontent
				helpsection.add(helpsection.content)

				info.help[sections[i].name] = helpsection
				info.help.add(info.help[sections[i].name])
				projectionMgr.itemEnd('helpSection'+i)
			}
			info.orbiter.add(info.help)
		}
		function fillDOM(){
			Velocity.mock = true
			var plrOrder = data.values.concat().sort(function(a,b){return a-b})
			if(data.valueType === 'lessIsTall'){plrOrder.reverse()}

			dom.navspans[1].textContent = story.seedling
			dom.navspans[2].innerHTML = 'PART <b>'+(part+1)+'</b> <em>of</em> <b>'+stories[story].parts.length+ '</b>'
			dom.navfigures[0].style.backgroundImage = 'url(assets/infoicon.png)'
			dom.navfigures[1].style.backgroundImage = 'url(assets/seedling_'+story.seedling+'.png)'
			dom.navfigures[2].style.backgroundImage = 'url(assets/partbook.png)'
			for(var i = 0; i<4; i++){
				dom.databars[i].style.height = (plrOrder.indexOf(data.values[i])+1)*25+'%'
				Velocity(dom.databars[i], {translateX: i!==3?100+(i*100)+'%':0})
				dom.navnames[i].textContent = data.pNames? data.pNames[i] : ''
				dom['detail'+i].textContent = data.pTexts? data.pTexts[i] : ''
			}
			dom.bottom.style.backgroundColor = data.color? data.color.ui : '#000000'
			dom.maintext.textContent = data.maintext
			dom.overtext.textContent = story.description
			Velocity(dom.closebutton, {translateX: '0%'})

			Velocity(dom.leftarrow, {translateX: '500%', scale: 0.3})
			Velocity(dom.rightarrow, {translateX: '-500%', scale: 0.3})

			Velocity.mock = false

			//embedded animations (only really works for binary things)
			dom.closebutton.show = function(){
				Velocity(this, {translateX:0}, {duration:250,delay:100,visibility:'visible'} )
			}
			dom.closebutton.hide = function(){
				Velocity(this, {translateX:'100%'}, {duration:250,visibility:'hidden'})
			}
			//content changers
			dom.maintext.refill = function(){ this.textContent = data.maintext}
			dom.overtext.refill = function(){ this.textContent = story.description}
			dom.detail0.refill = function(){ this.textContent = data.pTexts[0] }
			dom.detail1.refill = function(){ this.textContent = data.pTexts[1] }
			dom.detail2.refill = function(){ this.textContent = data.pTexts[2] }
			dom.detail3.refill = function(){ this.textContent = data.pTexts[3] }

			var hyphensettings = { onhyphenationdonecallback: function(){
				console.log('hyphenation complete')
				if(init) {allMgr.itemEnd('hyphenation'); return }
			} }
			Hyphenator.config(hyphensettings)
			Hyphenator.run()
		}
		//startup animations
		function initPillar(which){
			var tgt = seseme['plr'+which]
			if(startHash) { tgt.position.y = tgt.targetY; plrMgr.itemEnd('plr'+which); return }
			anim3d(tgt, 'position', {y:tgt.targetY, spd:1250,
				cb: function(){ plrMgr.itemEnd('plr'+which) }})
		}
		function initQuads(){
				for(var i = 0; i<4; i++){
					var q = seseme['quad'+i]
					q.position.y = -31
					if(startHash) { q.position.y = 0; quadMgr.itemEnd('quad') }
					else anim3d(q, 'position', {y:0, delay: i*300, spd: 1000, cb:function(){ quadMgr.itemEnd('quad') } })
				}
		}//end initQuads

	} //END FILL --------------------
	function behaviors(){
		//UTILITY
		Origami.fastclick(document.body) //attaches fastclick for iOs
		//3D CONTROL REACTIONS
		controls.addEventListener( 'change', check )//end controls 'change' event
		//CLICKS
		dom.nav.addEventListener('click',clickedNav)
		dom.help.addEventListener('click', clickedGoToHelp)
		dom.rightarrow.addEventListener('click',function(){clickedLR(false)})
		dom.leftarrow.addEventListener('click',function(){clickedLR(true)})
		dom.bottom.addEventListener('click',function(){
			console.log('clicked bottom')	//some kind of callout/jiggle for bottom?
		})
		dom.closebutton.addEventListener('click',clickedToClose)
		dom.containerSESEME.addEventListener('click', function(event){
			console.log('clicked container seseme')
			event.preventDefault()
			mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1
			mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1
			raycast.setFromCamera(mouse, camera)
			var intersects
			if(view.zoom === 'close' && view.text){ //links
				intersects = raycast.intersectObject(seseme['plr'+facing].links, true)
				if(intersects.length > 0){
					var target = intersects[0].object
					window.location.href = target.goTo
				}
			}
			else if(view.height === 'plan' && view.zoom === 'far'){ //help
				intersects = raycast.intersectObject(info.help, true)
				if(intersects.length > 0){
					var target = intersects[0].object
					console.log(target.name, target.class, target.index)
					if(target.class === 'btn') clickedHelpButton(target.name)
					else if(target.class === 'content') clickedHelpContent(target.name,target.index)
					else clickedHelpOutside()
				}
				else clickedHelpOutside()
			}
			if(raycast.intersectObject(info.btn,true).length>0) clickedMainButton()
			else if(view.text) clickedToClose()
		}) // end click event listener
		//HASHING
		window.addEventListener('hashchange', function(){
			console.log('hash is now: ' + window.location.hash)
			if(window.location.hash===''){
				anim3d(camera,'zoom',{zoom: .875, spd: 400})
				rotateTo('mid'); rotateTo(0)
			}
		})
		//DEVICE ORIENTATION
		window.addEventListener('deviceorientation', function(evt){
			//uber prototype based on andrew's code
			//maybe it multiplies against an attribute so that the effect
			//is 'depth' scaled....
			var gamma = evt.gamma, beta = evt.beta, alpha = evt.alpha
			if(beta/1.8 > 35) { beta = 40*1.8; gamma = 0; }
			else if(beta/1.8 < -35) { beta = -40*1.8; gamma = 0; }

			var xlatY = evt.gamma>25?.25:evt.gamma<-25?-.25:evt.gamma/100
			var xlatX = evt.beta>25?.25:evt.beta<-25?-.25:evt.beta/100

			seseme.position.x = xlatX
			seseme.position.y = xlatY

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
