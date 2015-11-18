//global data
var story = 0, part = 0

//objects and resources
var scene = new THREE.Scene(), camera, renderer, controls,
resources = {geos: {}, mtls: {}}
var seseme = new THREE.Group(), ground, lights, shadow, orbitpointer
var info = {prev: [], sprite: [], detail: []}

//global states (thresholds for zoom and height are packaged in behaviors())
var facing = 0, perspective = {height: 'isometric', zoom: 'normal', zoomswitch: false}, init = true

//DOM
var nav = $('nav'), help = $('help'), text = $('text')

// DEBUG
//use var online to test with socket integration or not (false )
var socket
var online = false

function setup(){
	loader()

function loader(){
	var allModels = ['quaped','pillarA','pillarB','pillarA_outline','pillarB_outline'] //symbolgeos?
	var allTextures = ['orbitpointer','storypointer','diamond','circle','chevron','tri','shadow'] //names of external imgs (PNG)
	var plrmax = 12, defaultiso //helper values
	stories.forEach(function(ele){ allModels.push(ele.geo); allTextures.push(ele.geo) })
	var resourceMgr = new THREE.LoadingManager()
	resourceMgr.itemStart('mdlMgr'); resourceMgr.itemStart('mtlMgr'); resourceMgr.itemStart('fonts')
	resourceMgr.onLoad = function(){
		console.log('all resources done')
		//////////////////////////////////////////////////////////////////////////////////
		///--------------CORE FUNCTIONS FOR INITIALIZING EVERYTHING--------------------//
		build(); query(); if(!online){view.fill()}; display()
		//-----------------------END CORE FUNCTIONS FOR INIT---------------------------//
		//////////////////////////////////////////////////////////////////////////////////
	}
	var mdlMgr = new THREE.LoadingManager()
	mdlMgr.onProgress = function(item,loaded, total){console.log(item,loaded, total)}
	mdlMgr.onLoad = function(){console.log('models done'); resourceMgr.itemEnd('mdlMgr')}
	for(var i = 0; i<allModels.length;i++){ mdlMgr.itemStart('assets/'+allModels[i]+'.js') }
	var mdlLoader = new THREE.JSONLoader()
	allModels.forEach(function(ele){
		mdlLoader.load('assets/'+ele+'.js',function(geo){
			resources.geos[ele] = geo; mdlMgr.itemEnd('assets/'+ele+'.js')
		})
	})
	//shapes for geo resources
	triangleA = new THREE.Shape() //normal triangle
	triangleA.moveTo(-0.75,0);triangleA.lineTo(0.75,0);triangleA.lineTo(0,-1);triangleA.lineTo(-0.75,0)
	resources.geos.triangleA = new THREE.ShapeGeometry(triangleA)
	rightTri = new THREE.Shape() //right triangle
	rightTri.moveTo(-1,-1);rightTri.lineTo(1,1);rightTri.lineTo(-1,1);rightTri.lineTo(-1,-1)
	resources.geos.rightTri = new THREE.ShapeGeometry(rightTri)

	var mtlMgr = new THREE.LoadingManager()
	mtlMgr.onProgress = function(item,loaded,total){console.log(item,loaded,total)}
	mtlMgr.onLoad = function(){console.log('textures done'); resourceMgr.itemEnd('mtlMgr')}
	var texLoader = new THREE.TextureLoader( mtlMgr )
	allTextures.forEach(function(ele){
		texLoader.load('assets/'+ele+'.png',function(texture){
			resources.mtls[ele] = new THREE.MeshBasicMaterial({depthWrite: false, map:texture, transparent: true, opacity: 1})
		})
	})
	WebFontConfig = {
		google: {families: ['Source Serif Pro', 'Fira Sans']},
		classes: false,
		active: function(){ console.log('fonts loaded'); resourceMgr.itemEnd('fonts') }
	}


	function query(){
		//doesnt run if !online, so that there's no waiting on socket
		if(online){ //server is hooked up
			socket = io('http://169.237.123.19:5000')
			socket.emit('whereWeAt')
			socket.on('hereWeAt',function(d){
				part = d.page
				view.fill()
				for(var i=1; i<5; i++){
					var mpos = (seseme['plr'+i].position.y / plrmax) * 100
					socket.emit('moveMotorJack',{name: 'm'+i, position: mpos})
				}
				//current hue value doesnt translate the UI color - not sustainable
				//if we want there to be crowd sourced stories eventually
				socket.emit('setHSL',stories[story].parts[part].hueVal)
			})

			socket.on('buttonPressed',function(){
				//this eventually should be different bc data wont be clientside
				socket.emit('whereWeAt')
			})
		}
	}
	function build(){
		//camera/renderer/dom
		var containerSESEME = $("containerSESEME")
		var aspect = containerSESEME.offsetWidth / containerSESEME.offsetHeight; var d = 20
		camera = new THREE.OrthographicCamera( - d * aspect, d * aspect, d, - d, 0, 100 )
		camera.position.set( -d, 10, d ); camera.rotation.order = 'YXZ'
		camera.rotation.y = - Math.PI / 4 ; camera.rotation.x = Math.atan( - 1 / Math.sqrt( 2 ) );
		camera.zoom = .875
		camera.updateProjectionMatrix(); defaultiso = camera.rotation.x

		renderer = new THREE.WebGLRenderer({antialias: true, alpha: true})
		// renderer.setClearColor(0xbbbbbb)
		renderer.setSize( containerSESEME.offsetWidth, containerSESEME.offsetHeight)
		containerSESEME.appendChild( renderer.domElement )
		controls = new THREE.OrbitControls(camera)
		//materials
		resources.mtls.seseme = new THREE.MeshPhongMaterial({color: 0x80848e,shininess:21,specular:0x9e6f49,emissive: 0x101011})
		// resources.mtls.seseme = new THREE.MeshLambertMaterial({color: 0x80848e})
		resources.mtls.orb = new THREE.MeshPhongMaterial({color:0xff6666,emissive:0x771100,shininess:1,specular:0x272727})
		resources.mtls.ground = new THREE.MeshBasicMaterial({color: 0xededed})
		//meshes
		ground = new THREE.Mesh(new THREE.PlaneBufferGeometry( 150, 150 ), resources.mtls.ground)
		ground.rotation.x = rads(-90); ground.position.set(0,-18,0)

		xlats = [
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
			var outline, outlineColor = stories[story].parts[part].color
			if(ele.type==='A'){
				outline = new THREE.Mesh(resources.geos.pillarA_outline, new THREE.MeshBasicMaterial({color: outlineColor}))
			}else{
				outline = new THREE.Mesh(resources.geos.pillarB_outline, new THREE.MeshBasicMaterial({color: outlineColor}))
			}
			outline.material.side = THREE.BackSide
			outline.material.transparent = true; outline.material.depthWrite = false
			outline.material.opacity = 0
			outline.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,-4,0))

			seseme['plr'+i].outline = outline; seseme['plr'+i].add(outline)

			var outcap = new THREE.Mesh(resources.geos.rightTri, new THREE.MeshBasicMaterial({color: outlineColor, transparent: true, opacity: 0}))
			outcap.rotation.x=rads(-90); outcap.rotation.z=rads(90)
			outcap.scale.set(1.9,1.9,1.9); outcap.position.set(-4,-0.6,1.5)
			seseme['plr'+i].outcap = outcap; seseme['quad'+i].add(outcap)

			seseme['quad'+i].add(seseme['plr'+i])
		})

		//lighting
		lights = new THREE.Group(); amblight = new THREE.AmbientLight( 0x232330 )
		backlight = new THREE.SpotLight(0xeaddb9, 1.2); camlight = new THREE.PointLight(0xffffff, .35)
	  	backlight.position.set(-7,25,-4); camlight.position.set(-40,-7,-24)
	  	lights.add(backlight); lights.add(amblight); lights.add(camlight)
	  	//other FX
	  	shadow = new THREE.Mesh(new THREE.PlaneBufferGeometry(16,16), resources.mtls.shadow)
	  	shadow.rotation.x = rads(-90); shadow.position.set(-0.1,-17.99,0.1)
			shadow.material.opacity = 0
			//adding to scene
		scene.add(ground); scene.add(seseme); scene.add(lights); scene.add(shadow)

	}//build
view.fill = function(){
//values-to-heights handling
		if(stories[story].parts[part].valueType === 'smallerIsHigher'){
			var top = stories[story].parts[part].valueRange[0]; var bottom = stories[story].parts[part].valueRange[1]
		}else if(stories[story].parts[part].valueType === 'biggerIsHigher'){
			var top = stories[story].parts[part].valueRange[1]; var bottom = stories[story].parts[part].valueRange[0]
		}
		range = Math.abs(bottom-top)
	//checking when objects finish - moving or loading in
	var plrMgr = new THREE.LoadingManager()
	var projectionMgr = ''
	projectionMgr = new THREE.LoadingManager()
	for(var i= 0; i<4; i++){
		plrMgr.itemStart('plr'+i)
		projectionMgr.itemStart('projection'+i)
		seseme['plr'+i].targetY = Math.abs(bottom-stories[story].parts[part].pointValues[i])/range * plrmax
	}
	plrMgr.onLoad = function(){
		console.log('all pillars done moving')
		if(init){ //the first time the pillars finish, ....
			view.enableUI()
			if(perspective.zoom==='normal'&&perspective.height==="isometric"){
				info.prev[facing].show(); view.outline(facing,1,600)
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

// the first time it runs, fill does this:
		if(init){
			initAnim(); initDom(); behaviors()

			function initAnim(){
				var whichAnim = dice(3) //2=flyin, 1=riseup, 0/other= flower
				var pillarInitAnim = function(which){
					projection(which)
					move(seseme['plr'+which],{x: seseme['plr'+which].position.x, y: seseme['plr'+which].targetY,
					z: seseme['plr'+which].position.z}, 1500, 5, 'Quadratic', 'Out', function(){plrMgr.itemEnd('plr'+which)}, 500+(which*300))
				}
				//init anim: set position and rotation of quads, then animate them to correct position
				if(whichAnim === 2){ //fly in (sides) animation
					for(var i = 0; i<4; i++){
						var q = seseme['quad'+i]
						q.position.set(q.end.x*-13, 0, q.end.z*-13)
						q.rotation.y = rads(i*90)
						move(q,{x:q.end.x,y:q.end.y,z:q.end.z},1700,1,'Quadratic','Out',pillarInitAnim(i),0)
					}
					fade(shadow, 1, 800, 1200)
				} else if (whichAnim === 1){ // rise up animation
					for(var i = 0; i<4; i++){
						var q = seseme['quad'+i]
						q.position.set(q.end.x, -31, q.end.z)
						q.rotation.y = rads(i*90)
						move(q,{x:q.end.x,y:q.end.y,z:q.end.z},1700,1,'Quadratic','Out',pillarInitAnim(i),i*250)
					}
					fade(shadow, 1, 800, 1200)
				} else { //flower animation
					for(var i = 0; i<4; i++){
						var q = seseme['quad'+i]
						q.position.set(q.end.x*-1.5,q.end.y,q.end.z*-1.5)
						q.rotation.y = rads((i*90)-30)
						move(q,{x:q.end.x,y:q.end.y,z:q.end.z},1700,1,'Quadratic','Out',pillarInitAnim(i),0)
						rotate(q,{x:0,y:rads(i*90),z:0},1700,0)
					}
					fade(shadow, 1, 800, 1200)
				}
			}

			function initDom(){
				// defining DOM relationships
						var ui = [nav, help, text]
						ui.forEach(function(ele){ //establinhisg controls / open booleans
							ele.openbtn = ele.querySelector('.open'); ele.closebtn = ele.querySelector('.close'); ele.stuff = ele.querySelector('.info')
							ele.isOpen = false
						})
						text.part = $('text_part'); text.points = $$('text_point')
						text.partlabel = $('text_title_part'); text.pointlabel = $('text_title_point')
						text.pointtitles = text.pointlabel.getElementsByTagName('span')

						nav.items = $$('nav_item'); nav.icons = $$('nav_icon'); nav.contents = $$('nav_content');
						nav.labels = $$('nav_label'); nav.names = $$('nav_name'); nav.points = $$('nav_point')
						nav.navlabel = $('nav_title')

						// nav.points = document.querySelectorAll('.nav_point')

						help.line = $('help_line'); help.buttons = help.getElementsByClassName('help_button')
						help.helplabel = $('help_label'); help.captions = help.getElementsByClassName('caption')
						help.backing = $('help_backing'); help.howtos = $$('overlay_howto')
						help.abouts = $$('overlay_about'); help.feedback = $('overlay_feedback')
						help.nextbtn = $('nextbutton')

				//DOM snap-ins (animate after init)
						//colors
						text.openbtn.style.backgroundColor = text.stuff.style.backgroundColor =
						nav.style.backgroundColor = stories[story].parts[part].color
						//textContent
						text.part.textContent = stories[story].parts[part].text
						text.partlabel.textContent = stories[story].parts[part].name
							//nav items
							nav.labels[1].textContent ='PART '+(part+1) +'/'+stories[story].parts.length
							nav.labels[2].textContent = stories[story].parts[part].pointData
							nav.names[0].textContent = stories[story].title
							nav.names[1].textContent = stories[story].parts[part].name
							nav.points[facing].style.opacity = 1
							//point-corresponding text fields
							for(var i = 0; i < 4; i++){
								text.points[i].textContent = stories[story].parts[part].pointText[i]
								text.pointtitles[i].textContent = stories[story].parts[part].pointNames[i]
								nav.points[i].textContent = stories[story].parts[part].pointNames[i]
							}
						//attributes for dynamic behaviors

						for(var i = 0; i<3; i++){
							nav.labels[i].width = nav.labels[i].offsetWidth
							nav.names[i].width = nav.names[i].offsetWidth
							Velocity(nav.items[i], {translateY: i*1.25+'rem'}, {duration: 0})
						}
						nav.iconwidth = nav.icons[0].offsetWidth
						nav.targetWidth = nav.names[1].offsetWidth + nav.iconwidth

						text.targetHeight = text.part.offsetHeight
						text.partlabel.width = text.partlabel.offsetWidth

						//initial style states
						nav.style.width = nav.targetWidth
						nav.names[2].width = nav.points[facing].offsetWidth
						Velocity(nav.stuff, {translateY: '-1.25rem'}, {duration: 0})
						Velocity(nav.navlabel, {translateX: -nav.navlabel.offsetWidth*1.25}, {duration: 0})
						Velocity(nav.closebtn, {translateX: '-2.25rem'}, {duration: 0})

						help.style.height = help.stuff.offsetHeight
						Velocity(help, {translateY: -help.stuff.offsetHeight}, {duration: 0})
						Velocity(help.nextbtn, {translateY: '4.5rem'}, {duration: 0})
						Velocity(help.stuff, {translateY: '-1.3rem'}, {duration: 0})
						Velocity(help.backing, {translateY: '-1.3rem'}, {duration: 0})
						Velocity(help.buttons, {translateX: '150%'}, {duration: 0})
						Velocity(help.captions, {translateY: '-50%', opacity: 0}, {duration: 0})

						text.pointlabel.style.width = text.pointtitles[facing].offsetWidth
						text.pointtitles[0].style.opacity = 1
						Velocity(text.partlabel, {translateX: text.partlabel.offsetWidth, opacity: 0}, {duration: 0})
						Velocity(text.pointlabel, {translateY: text.pointlabel.offsetWidth, opacity: 0}, {duration: 0})


			}
			function projection(i){
				 //pillar-matching infos
					//PREVIEWS: label(title,caption,pointer) and stat showing facing pillar data
					// if(!init){ seseme['quad'+i].remove(info.prev[i]) }

					info.prev[i] = new THREE.Group()
					info.prev[i].position.set(-3.5,-3.5,1)
					info.prev[i].rotation.y = rads(-45)
						var label = meshify(new Text(stories[story].parts[part].pointNames[i],11.5,200,200,'white','Source Serif Pro',
						36, 400, 'center'))
						label.rotation.x = defaultiso; label.origin = {x:0,y:2.5,z:6.5}
						label.expand = {x: 0, y: 0, z:6.5}; label.position.set(0,0,6.5)
							var caption = meshify(new Text(stories[story].parts[part].pointTitles[i],11.5,200,80,'white','Fira Sans',16,500,'center'))
							caption.origin={x:0,y:3,z:0};caption.expand={x:0,y:2,z:0};
							caption.position.set(caption.origin.x,caption.origin.y,caption.origin.z)
							label.add(caption);
						info.prev[i].label = label
						info.prev[i].add(info.prev[i].label)

							//PREVIEW FUNCTIONS: transform, show, hide, newdata, enable, disable
							info.prev[i].show = function(){
								var label_i = 0
								this.label.traverse(function(child){
									fade(child,1,200,label_i*100)
									move(child,child.expand,400,1,'Quadratic','Out',function(){},0);label_i++
								})
							}
							info.prev[i].hide = function(){
								var label_i = 0
								this.label.traverse(function(child){
									fade(child,0,400-(label_i*150),0, function(){})
									move(child,child.origin,400,1,'Quadratic','Out',function(){},0)
									label_i++
								})
							}
							info.prev[i].change = function(){
								var finish = new THREE.LoadingManager
								finish.onLoad = function(){
									console.log('all prev hidden, removing and re-projecting')
									seseme['quad'+i].remove(info.prev[i]); projection(i)
								}
								var label_i = 0
								this.label.traverse(function(child){
									finish.itemStart(child)
									fade(child,0,400-(label_i*150),0, function(){finish.itemEnd(child)})
									move(child,child.origin,400,1,'Quadratic','Out',function(){},0)
									label_i++
								})

							}

						seseme['quad'+i].add(info.prev[i])

					//SPRITES: objects for height="elevation"
						info.sprite[i] = new THREE.Group();
						var txt = new Text(stories[story].parts[part].pointNames[i],
						11,240,125,'black','Fira Sans',30,500,'center')
						var sprmtl = new THREE.SpriteMaterial({transparent:true,map:txt.tex,opacity:0})
						var sprite = new THREE.Sprite(sprmtl); sprite.scale.set(txt.cvs.width/150,txt.cvs.height/150,1)

						var sprpointer = new THREE.Sprite(new THREE.SpriteMaterial({transparent: true, map: resources.mtls.chevron.map, opacity:0}))

						sprite.expand = {y: 0, sx: txt.cvs.width/100, sy:txt.cvs.height/100 }
						sprpointer.expand = {y: -1}; info.sprite[i].expand = {y: 2.7}
						sprpointer.position.y = -2; info.sprite[i].add(sprpointer); info.sprite[i].obj = sprite
						info.sprite[i].add(info.sprite[i].obj)

						seseme['plr'+i].add(info.sprite[i])

						info.sprite[i].show = function(){
							size(this.obj,{x:this.obj.expand.sx,y:this.obj.expand.sy,z:1},300)
							var spr_i = 0
							this.traverse(function(child){
								if(child.material){fade(child,1,300+(spr_i*100),i*100)}
								move(child,{x:child.position.x,y:child.expand.y,z:child.position.z},300+(spr_i*125),1,'Quadratic','Out',function(){},i*100)
								spr_i++
							})
						}
						info.sprite[i].hide = function(){
							size(this.obj,{x:this.obj.expand.sx/1.5,y:this.obj.expand.sy/1.5,z:1},300)
							var spr_i = 0
							this.traverse(function(child){if(child.material){
								fade(child,0,200+(spr_i*50),i*100)}
								move(child,{x:child.position.x,y:child.expand.y-(spr_i),z:child.position.z},200+(spr_i*100),1,'Quadratic','Out',function(){},i*50)
								spr_i++
							})
						}
				projectionMgr.itemEnd('projection'+i)
			} // end projection

		}else{ // after the first time, fill does the following instead::
			for(var i = 0; i<4; i++){
				info.prev[i].change()
				move(seseme['plr'+i],{x:seseme['plr'+i].position.x, y: seseme['plr'+i].targetY,
				z:seseme['plr'+i].position.z},6000,45,'Cubic','InOut',function(){plrMgr.itemEnd('plr'+i)})
			}

			refillDom()
			reZoom()
			//function here for zoomswitching with plr change

			function refillDom(){
				Velocity(text.openbtn, {backgroundColor: stories[story].parts[part].color})
				Velocity(text.stuff, {backgroundColor: stories[story].parts[part].color})
				Velocity(nav, {backgroundColor: stories[story].parts[part].color})

				if(nav.isOpen){
						//if same story....else fade em all
						Velocity(nav.items[2], {translateY: '-=1rem', opacity: 0}, {complete: function(){
							for(var i = 0; i<4; i++){
								nav.points[i].textContent = stories[story].parts[part].pointNames[i]
							}
							nav.labels[2].textContent = stories[story].parts[part].pointData
						}} )
						Velocity(nav.names[1], {translateX: '-2rem', opacity: 0}, {delay: 250, complete: function(){
							nav.names[1].textContent = stories[story].parts[part].name
							nav.names[1].width = nav.names[1].offsetWidth
							nav.labels[1].textContent = 'PART '+ (part+1) + '/'+ stories[story].parts.length
							Velocity(nav.icons[1], {opacity: 0}, {complete: function(){
								//change icon src
								Velocity(nav.icons[1], {opacity: 1})
							}})
						}} )
						Velocity(nav.names[1], {translateX: 0, opacity: 1})
						Velocity(nav.items[2], {translateY: '5rem', opacity: 1}, {delay: 800})

				}else {
					//replace all the shit in nav, sneaky like...

					nav.labels[1].textContent = 'PART ' + (part+1) + '/' + stories[story].parts.length
					nav.names[1].textContent = stories[story].parts[part].name
					nav.labels[2].textContent = stories[story].parts[part].pointData
					for(var i = 0; i<4; i++){
						nav.points[i].textContent = stories[story].parts[part].pointNames[i]
					}

				}
				view.navwidth()

				if(text.isOpen){
					if(perspective.zoom === 'normal'){
						for(var i = 0; i<4; i++){
							text.points[i].textContent = stories[story].parts[part].pointText[i]
							text.pointtitles[i].textContent = stories[story].parts[part].pointNames[i]
						}
						Velocity(text.part, {opacity: 0},{visibility: 'hidden', complete: function(){
							text.part.textContent = stories[story].parts[part].text
							text.targetHeight = text.part.offsetHeight
							Velocity(text, {translateY: -text.targetHeight})
						}})
						Velocity(text.partlabel, {translateX: text.partlabel.offsetWidth, opacity: 0}, {complete: function(){
							text.partlabel.textContent = stories[story].parts[part].name
						}})
						//faded and moved parts come back into the scene
						Velocity(text.part, {opacity: 1}, {visibility: 'visible'})
						Velocity(text.partlabel, {translateX: 0, opacity: 1})
					} // end in-situ changes @ normal perspective (part)
					//in-situ changes when zoomed in (point)
					else if(perspective.zoom === 'close'){
						text.part.textContent = stories[story].parts[part].text
						// whether point label moves or not should be a matter of reference consistency
						Velocity(text.pointlabel, {translateY: text.pointlabel.offsetHeight}, {complete: function(){
							for(var i=0;i<4;i++){ text.pointtitles[i].textContent = stories[story].parts[part].pointNames[i]}
							text.pointlabel.style.width = text.pointtitles[facing].offsetWidth
							}})
						Velocity(text.points, {opacity: 0}, {complete: function(){
							for(var i = 0; i<4; i++){text.points[i].textContent = stories[story].parts[part].pointText[i]}
						}})
						Velocity(text.points[facing], {opacity: 1})
						Velocity(text.pointlabel, {translateY: 0})
						text.targetHeight = text.points[facing].offsetHeight
						Velocity(text, {translateY: -text.targetHeight})
					}
				}else{ //user isn't viewing text - stealth snap in
					text.part.textContent = stories[story].parts[part].text
					for(var i = 0; i<4; i++){text.points[i].textContent = stories[story].parts[part].pointText[i]	}
					text.targetHeight = perspective.zoom==='normal'? text.part.offsetHeight : text.points[facing].offsetHeight
				} // end text.isOpen conditional

			} // end refillDom()

			function reZoom(){ //reoffsets scene if zoomed and plr height changes
				if(camera.zoom>1){
					perspective.zoomswitch = true
					zoomswitchcallback = function(){perspective.zoomswitch = false}
					move(scene,{x:0,y:-(seseme['plr'+facing].targetY)*(addzoom/1.5)-(addzoom*4),z:0},100,70,'Quadratic','InOut',zoomswitchcallback)
				}
			}

		}//end init check

//stuff that happens everytime below:
		var rgb = hexToRgb(stories[story].parts[part].color)
		for(var i = 0; i < 4; i++){
			recolor(seseme['plr'+i].outline, {r: rgb.r, g: rgb.g, b: rgb.b}, 400)
			recolor(seseme['plr'+i].outcap, {r: rgb.r, g: rgb.g, b: rgb.b}, 400)
		}
	} //end view.fill() --------------------

/**/
	function behaviors(){
		//thresholds for interaction states
		var thresholds = {zoom: [.65,1.3], height: [-3,-60]}

		Origami.fastclick(document.body) //attaches fastclick so iOS doesnt wait 300ms
		window.addEventListener('deviceorientation', function(evt){
			//device tilt event
		})

		//dom UI element interactions
		var ui = [nav, help, text]
		ui.forEach(function(ele){
			ele.openbtn.addEventListener('click',view['expand'+ele.getAttribute('id')])
			ele.closebtn.addEventListener('click',view['collapse'+ele.getAttribute('id')])
		})
		for(var i = 0; i<3; i++){
				help.buttons[i].addEventListener('click',view['help'+help.buttons[i].getAttribute('id')])
		}
		help.nextbtn.addEventListener('click',view.helpnext)

		//3d controls manipulation
		controls.addEventListener( 'change', function(){
			lights.rotation.set(-camera.rotation.x/2, camera.rotation.y + rads(45), -camera.rotation.z/2)

			//ROTATING: WHAT IS FACING PILLAR? WHAT INFO? + MOVE LIGHTS
			facingRotations = [-45,45,135,-135]
			facingRotations.some(function(ele,i){
				if(Math.abs(degs(camera.rotation.y)-ele)<45){
					if(facing!==i){
						console.log('facing diff plr')
						if(perspective.height==='isometric'&&perspective.zoom!=='close'&&perspective.zoom!=='far'){
							info.prev[facing].hide();	info.prev[i].show()
							view.outline(i,1,350); view.outline(facing,0,300)
						}
						view.cyclePoints(i)
						facing = i
						if(camera.zoom>1){
							perspective.zoomswitch = true
							zoomswitchcallback = function(){perspective.zoomswitch = false}
							move(scene,{x:0,y:-(seseme['plr'+facing].targetY)*(addzoom/1.5)-(addzoom*4),z:0},100,70,'Quadratic','InOut',zoomswitchcallback)
						}
					}
				return true }
			})

			//HEIGHT AND ZOOM: NEW HEIGHt/ZOOM? WHAT ACTION?
			height = degs(camera.rotation.x)>thresholds.height[0]?'elevation': degs(camera.rotation.x)<thresholds.height[1]?'plan':'isometric'
			zoom = camera.zoom>thresholds.zoom[1]? 'close' : camera.zoom<thresholds.zoom[0]? 'far' : 'normal'
			// addzoom = camera.zoom-thresholds.zoom[1]
			addzoom = camera.zoom - 1
			controls.zoomSpeed = 0.7-(Math.abs(camera.zoom-1)/3)
			controls.rotateSpeed = 0.1 - (Math.abs(camera.zoom-1)/20)

			if(perspective.height!==height){ //on height change
				perspective.height = height
				if(perspective.height!=='isometric'){
					for(var i = 0; i<4; i++){
						info.prev[i].hide()
						fade(seseme['plr'+i].outline,0,350,0);fade(seseme['plr'+i].outcap,0,350,0)
						view.outline(i,0,350)
						if(perspective.height==='elevation'&&perspective.zoom!=='far'){info.sprite[i].show()}
						else if(perspective.height==='plan'&&perspective.zoom!=='far'){  }
					}
				}else if(zoom!=='far'&&zoom!=='close'){
					info.prev[facing].show(); for(var i=0;i<4;i++){info.sprite[i].hide()}
					view.outline(facing,1,350)
				}
			} // end height change check

			if(perspective.zoom!==zoom){ //on zoom change
				perspective.zoom = zoom
				view.navscroll(); view.navwidth()
				if(zoom === 'close'){
					view.point();
					for(var i=0;i<4;i++){
						view.outline(i,0,500)
						info.prev[i].hide()};
				} else if(zoom === 'far'){
					info.prev.forEach(function(ele,i){
						ele.hide(); info.sprite[i].hide()
						view.outline(i,0,500)
					})
				} else if(zoom === 'normal'){
					if(perspective.height==='isometric'){
						info.prev[facing].show()
						view.outline(facing,1,500)
					} else if(perspective.height==='elevation'){
						for(var i =0;i<4;i++){info.sprite[i].show()}}
					view.part()
				}
			} // end check zoom change

			if(camera.zoom > 1){ //addzoom
				info.sprite.forEach(function(ele){ele.scale.set(1-addzoom/4,1-addzoom/4,1-addzoom/4)})
				if(perspective.zoomswitch===false){//scene moves up and down at close zoom levels
				scene.position.y = -(seseme['plr'+facing].position.y)*(addzoom/1.5)-(addzoom*4)
				}
			}

		})//end controls 'change' event

		window.addEventListener('resize', function(){
			var aspect = window.innerWidth / window.innerHeight; var d = 20
			camera.left = -d*aspect; camera.right = d*aspect; camera.top = d; camera.bottom = -d
	  		renderer.setSize( window.innerWidth, window.innerHeight); camera.updateProjectionMatrix()
		}, false)

	}//behaviors
}//loader
}//setup

function display(){
    requestAnimationFrame( display ); renderer.render( scene, camera )
    controls.update(); TWEEN.update();
}
