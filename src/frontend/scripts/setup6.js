
//global data
var socket
var story = nostory, part = 0, data = story.parts[part]
var info = {name: []}
// info.prev = [], info.name = [], info.detail = []
//objects and resources
var scene = new THREE.Scene(), camera, renderer
var resources = {geos: {}, mtls: {}}
var seseme = new THREE.Group(), ground, lights, shadow
//global states
var facing = 0, startHash = window.location.hash.slice(1)
view = {text: false, content: '', help: false, helpContent: '', helpReady: true,
	height: '', zoom: '', zoomswitch: false,
	cycleDirection: false, zoomDirection: false},
init = true
var controls, mouse = new THREE.Vector2(), raycast
// 3d constants
var plrmax = 12, constspd = 10000, spdcompensator = 400,
thresholds = {zoom: [.675,1.15], height: [-3,-56]},
facingRotations = [-45,45,135,-135]
//dom
var dom = {}
// DEBUG / user / data collecting variables
var userPermission = true
var online = true
var performance = 'med'

function setup(){
	//ready waits for data & 3d before filling the scene
	//though, using THREE's load manager here feels a bit disingenuous...
	var ready = new THREE.LoadingManager()
	ready.itemStart('firstdata'); ready.itemStart('3d')
	ready.onLoad = function(){ fill(); behaviors(); display() }
	dataOps() //data from server
	initDOM() //dom
	assets() //animate & 3d

	function dataOps(){
			if(online){ //server is hooked up
				socket = io.connect('http://169.237.123.19:5000')
				socket.emit('ui request story')
				socket.on('ui acquire story', function(d){
					console.log('ui acquired story')
					ready.itemEnd('firstdata')
				})

				// socket.on('intro',function(d){
				// 	story = d.story; part = d.part
				// 	data = story.parts[part]
				// 	ready.itemEnd('firstdata')
				// })
				// socket.on('announce'),function(d){
				// 	//d = {story: story, part: x}
				// 	if(d.story.id === story.id){ //within same story
				// 		if(d.part === part) return //same part, do nothing
				// 		else{ //same story, new part
				// 			refill(false, d.part)
				// 		}
				// 	}
				// 	else refill(d.story, d.part) //new story
				// }
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
	function initDOM(){ // defining global DOM items
		document.addEventListener('DOMContentLoaded', function(){
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
		})
	} //end domOps
	function assets(){
		var allModels = ['quaped','pillar','outline3','outcap'] //symbolgeos?
		var allTextures = ['chevron','shadow','bookeyemag', 'circle'] //names of external imgs (PNG)
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
		//fixed geo resources
		{
			resources.geos.testbox = new THREE.BoxGeometry(2.75,2.75,2.75)
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
				var outcolor = data.color instanceof Array? data.color[i] : data.color? data.color : 0x00000
				outline = new THREE.Mesh(resources.geos.outline3, new THREE.MeshBasicMaterial({transparent: true, side: THREE.BackSide, depthWrite: false, opacity: 0, color: outcolor}))

				outline.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,-2.25,0))
				seseme['plr'+i].outline = outline; seseme['plr'+i].add(outline)
				//outcap
				var outcap = new THREE.Mesh(resources.geos.outcap, new THREE.MeshBasicMaterial({transparent: true, opacity: 0, color: outcolor}))
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
		heightCalc(); loadingManagers();

		initQuads() //completion of each also runs initPillar
		makeOrbiter()
		makeNames()
		makeTitleblock()
		makeSymbols()
		fillDOM()
		placeMainButton()
		populateHelp()

		function loadingManagers(){
			allMgr = new THREE.LoadingManager()
			quadMgr = new THREE.LoadingManager()
			plrMgr = new THREE.LoadingManager()
			projectionMgr = new THREE.LoadingManager()
			allMgr.itemStart('quadMgr'); allMgr.itemStart('plrMgr'); allMgr.itemStart('projectionMgr')
			projectionMgr.itemStart('titleblock'); projectionMgr.itemStart('mainbtn')
			for(var i= 0; i<4; i++){
				quadMgr.itemStart('quad')
				plrMgr.itemStart('plr'+i)
				projectionMgr.itemStart('name'+i)
				projectionMgr.itemStart('helpSection'+i)
			}
			allMgr.onLoad = function(){
				//all things done moving and animating; app is ready
				console.log('quads, pillars, projections initalized')
				check()
			}
			quadMgr.onLoad = function(){
				console.log('quads initialized'); allMgr.itemEnd('quadMgr')
				anim3d(shadow, 'opacity', {opacity: 1, spd: 800})
				seseme.remove(seseme.getObjectByName('covercube'))
			}
			quadMgr.onProgress = function(item,loaded,total){
				console.log('quad'+(loaded-1)+' loaded, starting plr'+(loaded-1))
				initPillar(loaded-1)
			}
			plrMgr.onLoad = function(){
				console.log('pillars initialized'); allMgr.itemEnd('plrMgr')
			}
			// projectionMgr.onProgress = function(item,loaded,total){console.log(item,loaded,total)}
			projectionMgr.onLoad = function(){
				console.log('projections initialized'); allMgr.itemEnd('projectionMgr')
			}
		}//end loadingManagers

		function makeNames(){
			console.log('make names')
			const lnheight = 1.4
			for(var i = 0; i<4; i++){
				//individual sprite name
				var n = new THREE.Group()
				var txt // group or sprite depending on name type
				var notxt = function(){ txt = new THREE.Object3D(); }
				if(data.details){
					if(data.details[i]){
						if(data.details[i].name){
							n.lines = 1
							//name is string
							if(typeof data.details[i].name === 'string'){
								console.log('string name')
								txt = new THREE.Sprite()
								var sprtxt = new Text(data.details[i].name,11,240,125,'black','Karla',30,600,'center')
								var sprmtl = new THREE.SpriteMaterial({transparent:true,map:sprtxt.tex,opacity:0 })
								txt.material = sprmtl
								txt.scale.set(sprtxt.cvs.width/100, sprtxt.cvs.height/100, 1)
							}
							//name is array
							else if(data.details[i].name instanceof Array){
								console.log('array name')
								txt = new THREE.Group()
								for(var it = 0; it<data.details[i].name.length; it++){
									var subtxt = new THREE.Sprite()
									var sprtxt = new Text(data.details[i].name[it],11,240,125,'black','Karla',30,600,'center')
									var sprmtl = new THREE.SpriteMaterial({transparent:true,map:sprtxt.tex,opacity:0 })
									subtxt.material = sprmtl
									subtxt.scale.set(sprtxt.cvs.width/100, sprtxt.cvs.height/100, 1)
									subtxt.position.y = subtxt.expand = -it*lnheight;
									subtxt.origin = -it*lnheight + lnheight
									if(it>0) n.lines += 1
									txt.add(subtxt)
								}
							}
							//invalid type
							else {
								console.log('data.details['+i+'].name is invalid type')
								txt = new THREE.Object3d()
							}
						}
						else notxt()
					}
					else notxt()
				}
				else notxt()
				n.txt = txt
				n.add(n.txt)
				n.position.set(-3.6, 17.5, 1.1)
				n.isoHt = 17.5; n.elevHt = seseme['plr'+i].targetY + 1.5 + (n.lines*lnheight)

				var pointer = new THREE.Sprite(new THREE.SpriteMaterial({transparent:true,map:resources.mtls.chevron.map,opacity:0, color: 0x000000}))
				pointer.position.y = pointer.isoHt = (-(n.lines*lnheight) - ((17.5 - seseme['plr'+i].targetY)-(n.lines*lnheight)))+2
				pointer.elevHt = -(n.lines*lnheight)
				n.pointer = pointer; n.add(n.pointer)

				var linelength = (17.5-seseme['plr'+i].targetY -(n.lines*lnheight)) - 2.5
				var line
				if(linelength > 3){
					line = new THREE.Mesh(new THREE.BoxGeometry(.15, linelength ,.15),
						new THREE.MeshBasicMaterial({color:0x000000, depthWrite: false, transparent: true, opacity: 0}))
					line.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,-linelength/2,0 ))
					line.position.y = -(n.lines*lnheight)
				}else{
					line = new THREE.Mesh(new THREE.BoxGeometry(.15,.15,.15), new THREE.MeshBasicMaterial(
						{color: 0x000000, transparent: true, depthWrite: false, opacity: 0}))
					line.visible = false
					pointer.position.y = pointer.isoHt = -(n.lines*lnheight)
				}
				n.line = line; n.add(n.line)

				info.name[i] = n; seseme['quad'+i].add(n)
				projectionMgr.itemEnd('name'+i)
			}

		}
		function makeOrbiter(){
			console.log('make orbiter')
			info.orbiter = new THREE.Group()
			info.orbiter.name = 'orbiter'
			info.orbiter.rotation.y = -rads(45)
			seseme.add(info.orbiter)
		}
		function makeTitleblock(){
			console.log('make titleblock')
			//title block
			info.titleblock = new THREE.Group()
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
						var txt = new THREE.Group()
						info.titleblock.add(txt)
						for(var it = 0; it<t[titlekeys[i]].c.length; it++){
							var arrtxt = meshify(new Text(t[titlekeys[i]].c[it],width,100, height, 'white', font, fontsize, weight, align))
							if(t[titlekeys[i]].size) info.titleblock.ht += t[titlekeys[i]].size/12.5
							else if(i>0) info.titleblock.ht += 1.65
							arrtxt.position.y = arrtxt.origin = -info.titleblock.ht
							arrtxt.expand = -info.titleblock.ht
							txt.add(arrtxt)
						}
					//single string
					}else{
						var txt = meshify(new Text(t[titlekeys[i]].c,width,100, height, 'white', font, fontsize, weight, align))
						if(t[titlekeys[i]].size) info.titleblock.ht += t[titlekeys[i]].size/12.5
						else if(i>0) info.titleblock.ht += 1.65
						txt.position.y = txt.origin = -info.titleblock.ht
						txt.expand = -info.titleblock.ht
						info.titleblock.add(txt)
					}
				}
			}// end data.title
			info.titleblock.position.y = info.titleblock.isoHt = info.titleblock.ht/4.25 - .5
			info.titleblock.position.z = 7.5
			info.orbiter.add(info.titleblock)
			projectionMgr.itemEnd('titleblock')
		}
		function placeMainButton(){
			var titlebtn = new THREE.Mesh(new THREE.PlaneBufferGeometry(4.5,4.5), new THREE.MeshBasicMaterial({ map: resources.mtls.circle.map, transparent: true, opacity: 0, color: 0xededed}))
			titlebtn.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,-1,0))
			titlebtn.position.y = 0
			// titlebtn.expand = -info.titleblock.ht - 3.2 + ((info.titleblock.children.length-1)*.5);
			titlebtn.rotation.x = camera.rotation.x;
			titlebtn.position.z = 12
			info.btn = titlebtn
			var btncolor = data.color instanceof Array? data.color[facing] : data.color? data.color : 0x000000
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
					x: 0, z: 14,
					color: '#ff0000', icon: '',
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
					x: 14, z: 0,
					color: '#00ff00', icon: '',
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
					x: 0, z: -14,
					color: '#0000ff', icon: '',
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
					x: -14, z: 0,
					color: '#000000', icon: '',
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
				new THREE.MeshBasicMaterial({map: resources.mtls.circle.map,
					color: sections[i].color, transparent: true, opacity: 0, depthWrite: false}))
				helpbtn.position.y = -17.5
				helpbtn.rotation.x = rads(-90)
				helpbtn.expand = {x: sections[i].x, z: sections[i].z, delay:50+i*35 }
				helpbtn.icon = new THREE.Mesh(new THREE.PlaneBufferGeometry(6,6), new THREE.MeshBasicMaterial({color:0x000000, depthWrite: false, transparent: true}))
				helpbtn.icon.position.z = 0.4
				helpbtn.add(helpbtn.icon)
				helpbtn.name=helpbtn.icon.name= sections[i].name; helpbtn.icon.class=helpbtn.class= 'btn'
				helpbtn.visible = helpbtn.icon.visible = false
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
			dom.navspans[2].innerHTML = 'PART <b>'+(part+1)+'</b> <em>of</em> <b>'+story.parts.length+ '</b>'
			dom.navfigures[0].style.backgroundImage = 'url(assets/infoicon.png)'
			dom.navfigures[1].style.backgroundImage = 'url(assets/seedling_'+story.seedling+'.png)'
			dom.navfigures[2].style.backgroundImage = 'url(assets/partbook.png)'
			for(var i = 0; i<4; i++){
				dom.databars[i].style.height = (plrOrder.indexOf(data.values[i])+1)*25+'%'
				Velocity(dom.databars[i], {translateX: i!==3?100+(i*100)+'%':0})
			}
			dom.bottom.style.backgroundColor = data.color
			dom.maintext.textContent = data.text
			dom.overtext.textContent = story.description

			//details fills
			if(data.details){
				for(var i = 0; i<4; i++){
					dom.navnames[i].textContent = data.details[i].name?data.details[i].name:''
					dom['detail'+i].textContent = data.details[i].text?data.details[i].text:''
				}
			}
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

			var hyphensettings = { onhyphenationdonecallback: function(){
				// only store offsetHeights when hyphenator is finished running
				// or, text can only be called once hyphenator's run
			} }
			Hyphenator.config(hyphensettings)
			Hyphenator.run()

		}
		function makeSymbols(){
			if(!story.parts[part].details) return
			for(var i = 0; i<4; i++){
				var symbol = story.parts[part].details[i].icon?story.parts[part].details[i].icon:{type:''}
				var symbolobj = new THREE.Mesh()
				if(symbol.type==='geo'){ //3d icon
					symbolobj.geometry = resources.geos[symbol.src]
					symbolobj.material = resources.mtls[symbol.src]
				}
				else if(symbol.type==='img'){ //image mapped plane
					symbolobj.geometry = new THREE.PlaneBufferGeometry(2.75,2.75)
				}
				else{ //no icon provided in data
					// seseme['plr'+i].symbol = new THREE.Object3d()
					// seseme['plr']
				}
				symbolobj.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,.5,0))
				symbolobj.position.y = 0
				symbolobj.expand = {y: 1.375, delay: i*75} //half the height; templatebox is 2.75Y
				symbolobj.origin = {x: 0.1, y:0.1, z:0.1, delay: i*75}
				seseme['plr'+i].symbol = symbolobj
				seseme['plr'+i].add(seseme['plr'+i].symbol)

			}
		}
		//startup animations
		function initPillar(which){
			var tgt = seseme['plr'+which]
			if(startHash) { tgt.position.y = tgt.targetY; plrMgr.itemEnd('plr'+which); return }
			anim3d(tgt, 'position', {y:tgt.targetY, spd:1250,
				cb: function(){ plrMgr.itemEnd('plr'+which) }})
		}
		function initQuads(){
			// var rgb = data.color ? hexToRgb(data.color) : {r:0,g:0,b:0}
				for(var i = 0; i<4; i++){
					var q = seseme['quad'+i]
					q.rotation.y = rads(i*90)
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
			event.preventDefault()
			mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1
			mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1
			raycast.setFromCamera(mouse, camera)
			if(view.height === 'plan' && view.zoom === 'far'){
				var intersects = raycast.intersectObjects(info.help.children, true)
				if(intersects.length > 0){
					var target = intersects[0].object
					console.log(target.name, target.class, target.index)
					if(target.class === 'btn') clickedHelpButton(target.name)
					else if(target.class === 'content') clickedHelpContent(target.name,target.index)
					else clickedHelpOutside()
				}
				else clickedHelpOutside()
			}
			else if(raycast.intersectObjects(info.btn.children).length>0) clickedMainButton()
			else if(view.text) clickedToClose()

		}) // end click event listener
		//HASHING
		//TODO: this could become the navigation standard...
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
