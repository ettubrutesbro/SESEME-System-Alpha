
var $ = document.getElementById.bind(document)
var $$ = document.getElementsByClassName.bind(document)

//DOM mutations for browsing through current data
var view = {
	//global UI changes
	enableUI: function(){
		$('all_ui').style.display = ''
		console.log('enabling UI')
		text.style.width = 0
		Velocity(text.openbtn, {translateY: '3rem'}, {duration: 0})
		Velocity(nav, {translateY: -nav.offsetHeight}, {duration:0})
		Velocity(help, {opacity:1},{duration:0})
		Velocity(help.openbtn, {translateY: -help.openbtn.offsetHeight}, {duration: 0})
		Velocity(nav, {translateY: 0}, {delay: 500, duration: 300, visibility: 'visible', easing: 'easeOutSine'})
		Velocity(help.openbtn, {translateY: 0}, {delay: 650, duration: 250, visibility: 'visible', easing: 'easeOutSine', complete: function(){ if(init) init = false}})
		//enabled but there's no textContent
		if((perspective.zoom==='normal'&&text.part.textContent!=='') || (perspective.zoom==='close'&&text.points[facing].textContent!==''))
		{
			Velocity(text, {width: '100%'}, {duration: 350, visibility: 'visible'})
			Velocity(text.openbtn, {translateY: 0}, {delay: 350, easing: 'easeOutSine'})
		}
		//normal: enabled with textContent
		else{
			Velocity([text.stuff, text.topline, text.bottomline], {translateY: '1.25rem'})
			Velocity([text.closebtn, text.openbtn], {translateY: '3.5rem', scale: 1})
			Velocity(text.part.label, {translateX: text.part.label.offsetWidth, translateY: '3.5rem'}, {visibility: 'hidden'})
			Velocity(text, {width: '100%'}, {delay: 500, visibility: 'visible'})
		}
	},
	disableUI: function(){
		console.log('disable UI')
	},
	nextpart: function(){
		console.log('going to part '+part)
		var attrlist = [ 'title', 'info', 'dataset', 'pointNames', 'pointCaptions', 'pointText', 'color', 'pointDetails', 'pointIcons' ]
		var attributes = {}
		//iterate through attributes, comparing current to new, passing t/f to refilling function
		attrlist.forEach(function(ele){

			//arrayed attributes
			if(data[ele] instanceof Array){
				if(story.parts[part][ele] instanceof Array){
					attributes[ele] = []
						for(var i = 0; i<data[ele].length ; i++){
							if(data[ele][i] !== story.parts[part][ele][i]){
								attributes[ele][i] = 'change'
							}else attributes[ele][i] = 'same'
						}
				//array to string
				}else attributes[ele] = 'change'
			}
			//simple attributes (strings/nums)
			else{
				attributes[ele] = 'same'
				if(data[ele]!==story.parts[part][ele]){ attributes[ele] = 'change' }
			}
		})
		console.log(attributes)
		data = story.parts[part]
		view.refill(attributes)
	},
	refill: function(attrs){
		//3D: pointNames*(y) pointCaptions(y) color* pointDetails pointIcons
		//DOM: title(y) info dataset(y) pointNames*(y) pointText color*(y)
		refill3d(); refillDOM()
		function refill3d(){
			//pillar moves
			{
				heightCalc()
				if(camera.zoom>1){
					var addzoom = camera.zoom - 1
					perspective.zoomswitch = true
					var switchdist = 250 + (seseme['plr'+facing].targetY * 30)
					move(scene,{x:0,y:-(seseme['plr'+facing].targetY)*(addzoom/1.5)-(addzoom*4),z:0},switchdist,0,'Quadratic','InOut',function(){perspective.zoomswitch = false})
				}
				var moves, travel

				for(var i = 0; i<4; i++){
					//queue determination - how many moves? how much each time?
					var s = seseme['plr'+i], orig = s.position.y,
					dist = s.targetY - orig, q = []
					//motionType bit
					if(data.motionType && data.motionType.bit){
						//bit type: by percentage of travel
						if(typeof data.motionType.bit === 'number'||typeof data.motionType.bit[i] === 'number'){
							var dbitnum = data.motionType.bit instanceof Array? data.motionType.bit[i] : data.motionType.bit
							moves = Math.ceil(dbitnum);	travel = dist/moves
						}
						//bit type: by set travel amt
						else if(typeof data.motionType.bit === 'string' || typeof data.motionType.bit[i] === 'string' ) {
							var dbitstr = data.motionType.bit instanceof Array? data.motionType.bit[i] : data.motionType.bit
							if(dbitstr === 'tiny') travel = plrmax/15
							else if(dbitstr === 'small') travel = plrmax/12
							else if(dbitstr === 'medium') travel = plrmax/10
							else if(dbitstr === 'large') travel = plrmax/6
							else if(dbitstr === 'huge') travel = plrmax/3
							else if(dbitstr === 'giga') travel = plrmax/2
							else travel = plrmax=4
							moves = Math.abs(Math.ceil(dist / travel))
							if(dist<0) travel*=-1
							else travel=Math.abs(travel)
						}
					}
						//linear motion type or undefined
						else if(data.motionType === 'linear' || !data.motionType){
							moves = 1; travel = dist
						}

						if(data.motionOrder && data.motionOrder.delay)
							{var delay = data.motionOrder.delay[i]?data.motionOrder.delay[i]:0}

						//queue generation
						for(var it = 0; it < moves; it++){
							var dest
							if(it===moves-1) dest = s.targetY
							else dest = orig+(travel*(it+1))
							q.push({dest:dest})
							if(delay) q[it].delay = delay
						}
						//if pointName changed, unshift a reset motion to the queue
						if(attrs.pointNames==='change'||attrs.pointNames[i]==='change'){
							console.log(i + ' has a reset motion')
							q.unshift({dest:0})
						}
					seseme['plr'+i].queue = q
				}//end 4 loop

				//post-definition queue operations (sync, init contingency)
				if(init){
					data.motionOrder='unison'
					for(var i=0; i<4; i++){ seseme['plr'+i].queue = [{dest: seseme['plr'+i].targetY}] }
				}
				// motionOrder: sync delays for synchronized finish
				if(data.motionOrder==='sync'){
					var alldelays = []
					for(var i = 0; i<4; i++){
						for(var it = 0; it<seseme['plr'+i].queue.length; it++){
							seseme['plr'+i].queue[it].delay = alldelays[i] =
							((plrmax - Math.abs(seseme['plr'+i].queue[it].travel))/plrmax)*constspd
						}
					}
					//sort alldelays, subtract all values by the smallest online
					var delaysubtractor = alldelays.min()
					for(var i = 0; i<4; i++){
						for(var it = 0; it<seseme['plr'+i].queue.length; it++){
							seseme['plr'+i].queue[it].delay -= delaysubtractor
						}
					}
				}
				// starting queue animation sequences (dependent on motionOrder)
				if(data.motionOrder==='biped' || data.motionOrder === 'altbiped') qMove('A')
				else if(data.motionOrder==='quadruped') qMove(0)
				else qMove()

			}
			//pointNames
			if((attrs.pointNames==='change')||(attrs.pointNames instanceof Array&& attrs.pointNames.indexOf('change')>-1)){
				for(var i = 0; i<4; i++){
					if(attrs.pointNames[i] === 'change' || attrs.pointNames === 'change'){
						if(i===facing&&perspective.zoom === 'normal'&&perspective.height === 'isometric') {
							prevcallbackhandler(i)}
						else newprevtitle(i)
						spritehandler(i)
				}}
				function prevcallbackhandler(which){
					if(info.prev[which].title.material){
						fade(info.prev[which].title, 0, 300, 0, function(){newprevtitle(which)})
						if(info.prev[which].title.children.length>0) fade(info.prev[which].title.children[0],0,250,0)
					}else newprevtitle(which)
				}
				function spritehandler(which){
					fade(info.sprite[which].title, 0, 300, 0, function(){newspritetitle(which)})
				}
				function newprevtitle(which){
					var newtext = data.pointNames instanceof Array ? data.pointNames[which] : data.pointNames
					info.prev[which].remove(info.prev[which].title)
					if(data.pointNames){
						if(newtext instanceof Array) var t = {width: 9.5, margin: 100, height: 110, fontSize:28, fontWeight: 500}
						else if(newtext.length < 13) var t = { width: 11.5, margin: 200, height: 200, fontSize:36, fontWeight:400 }
						else if(newtext.length < 17) var t = { width: 8, margin: 150, height: 100, fontSize:25, fontWeight:500 }
						else if(newtext.length >= 17) var t = { width: 10.5, margin: 50, height: 110, fontSize:25, fontWeight:500}
						if(newtext instanceof Array || newtext.length >= 17){
							var title = meshify(new Text(newtext instanceof Array?newtext[0]:newtext.substring(0,15),
								t.width, t.margin, t.height, 'white', 'Droid Serif', t.fontSize, t.fontWeight, 'center'))
							var addtext = meshify(new Text(newtext instanceof Array?newtext[1]:newtext.substring(15,newtext.length),
								t.width, t.margin, t.height, 'white', 'Droid Serif', t.fontSize, t.fontWeight, 'center'))
							title.add(addtext); addtext.origin = {x: 0, y: 0, z: 0}; addtext.expand = {x:0,y:-2,z:0}
							if(facing===which && perspective.height==='isometric'&&perspective.zoom==='normal'){ addtext.position.y = -2; fade(addtext, 1, 400, 120) }
						}else{
							var title = meshify(new Text(newtext, t.width, t.margin, t.height, 'white', 'Droid Serif', t.fontSize, t.fontWeight, 'center'))
						}
						title.rotation.x = Math.atan(-1/Math.sqrt(2)); title.origin={x:0,y:2.75,z:6.5}
						title.expand = {x:0,y:0,z:6.5}; title.position.set(0,2.75,6.5)
						info.prev[which].title = title; info.prev[which].add(info.prev[which].title)
						if(facing===which&&perspective.height === 'isometric'&&perspective.zoom==='normal') fade(info.prev[which].title,1,400,100); title.position.y=0
					}
				}//end newTitle
				function newspritetitle(which){
					var newtext = data.pointNames instanceof Array ? data.pointNames[which] : data.pointNames
					info.sprite[which].remove(info.sprite[which].title)
					if(data.pointNames){
						var sprite = new THREE.Sprite()
						var sprtxt = new Text(newtext,11,240,125,'black','Karla',30,600,'center')
						var sprmtl = new THREE.SpriteMaterial({transparent:true,map:sprtxt.tex,opacity:0 })
						sprite.material = sprmtl
						sprite.scale.set(sprtxt.cvs.width/150, sprtxt.cvs.height/150, 1)
						sprite.expand = {y:0,sx:sprtxt.cvs.width/100,sy:sprtxt.cvs.height/100}
						info.sprite[which].title = sprite
						info.sprite[which].add(info.sprite[which].title)
						if(perspective.height === 'elevation') info.sprite[which].show()
					}
				}
			} // end pointNames changes
			//pointCaptions
			if(attrs.pointCaptions === 'change' || (attrs.pointCaptions instanceof Array&&attrs.pointCaptions.indexOf('change')>-1)){
				for(var i = 0; i<4; i++){
					if(attrs.pointCaptions[i] === 'change' || attrs.pointCaptions ==='change'){
						if(i===facing&&perspective.zoom==='normal'&&perspective.height==='isometric')
						 {captcallbackhandler(i)}
						else newcaption(i)
					}
				}
				function captcallbackhandler(which){
					if(info.prev[which].caption.material) fade(info.prev[which].caption, 0, 400, 0, function(){ newcaption(which) })
					else newcaption(which)
				}
				function newcaption(which){
					info.prev[which].remove(info.prev[which].caption)
					if(data.pointCaptions && data.pointCaptions[which] !== ''){ //unduly excludes three letter words...
						var captiontext = data.pointCaptions instanceof Array? data.pointCaptions[which] : data.pointCaptions
						var caption = meshify(new Text(captiontext,11.5,200,80,'white','Karla',16,600,'center'))
						info.prev[which].position.y = captiontext.length>0?-3.5:-2.5
						caption.origin={x:0,y:3,z:5.8}; caption.expand={x:0,y:2,z:5.8}
						caption.rotation.x = Math.atan(-1/Math.sqrt(2))
						info.prev[which].caption = caption
						info.prev[which].add(info.prev[which].caption)
						if(which===facing&&perspective.zoom==='normal'&&perspective.height==='isometric') {fade(info.prev[which].caption, 1, 400, 50); caption.position.set(0,2,5.8)
						}else caption.position.set(0,2,5.8)
					}else info.prev[which].position.y = -2.5
				}
			}//end pointCaptions changes
			//color
			if(attrs.color === 'change'){
				var rgb = data.color ? hexToRgb(data.color) : {r:0,g:0,b:0}
				for(var i = 0; i<4; i++){
					recolor(seseme['plr'+i].outline, {r: rgb.r, g: rgb.g, b: rgb.b}, 400)
					recolor(seseme['plr'+i].outcap, {r: rgb.r, g: rgb.g, b: rgb.b}, 400)
				}
			}//end color change
		}//end refill3D
		function refillDOM(){
			if(init){ console.log('UI not enabled yet'); Velocity.mock = true }
			var comebacks = []
			//global story title
			if(!story.title && data.title)
				{nav.labels[0].textContent = 'STORY PART '+(part+1)+'/'+story.parts.length}
			else if(!story.title && !data.title)
				{nav.labels[0].textContent = 'STORY'}

			//info
			if(attrs.info === 'change'){
				Velocity(text.part, 'finish')
				comebacks.push(contentFade(text.part, data.info, '', 0, 350))
			}
			//title
			if(attrs.title === 'change'){
				Velocity([nav.names[0], text.part.label], 'finish')
				comebacks.push(contentFade(nav.names[0], data.title?data.title:'PART '+(part+1)+'/'+story.parts.length, '', 0, 350 ), contentFade(text.part.label, data.title, '', 0, 350))
			}
			//pointNames
			if((attrs.pointNames === 'change') || (attrs.pointNames instanceof Array && attrs.pointNames.indexOf('change')>-1 )){
				for(var i = 0; i<4; i++){
					if(attrs.pointNames[i] === 'change' || attrs.pointNames === 'change'){
						var ptname = Array.isArray(attrs.pointNames)? data.pointNames[i] : data.pointNames
						if(ptname instanceof Array) ptname = ptname.toString().replace(',',' ')
						Velocity(text.points[i].label, 'finish')
						comebacks.push(contentFade(text.points[i].label, ptname, '', 0, 350)
						,contentFade(nav.points[i], data.pointNames&&data.pointNames[i]?ptname:data.pointValues[i], '', 0, 350))
					}
				}
			}//end pointNames changes
			//dataset
			if((attrs.dataset === 'change') || (attrs.dataset instanceof Array && attrs.dataset.indexOf('change')>-1)){
				if(Array.isArray(data.dataset)){
					if(!$$('nav_label_data').length){
						nav.labels[1].textContent = ''
					 	for(var i = 0; i<4; i++){
							var datalabel = document.createElement('span'); datalabel.className = 'nav_label_data'
							datalabel.textContent = data.dataset[i]
							if(i===facing) datalabel.style.opacity = 1
							nav.labels[1].appendChild(datalabel)
						}
					}
					for(var i = 0; i<4; i++){
						if(attrs.dataset[i]==='change'){
							Velocity($$('nav_label_data')[i], 'finish')
							comebacks.push(contentFade($$('nav_label_data')[i], data.dataset[i]?data.dataset[i]:'DATA','',0,350))
						}
					}
				}
				else if(!Array.isArray(data.dataset)){
					Velocity(nav.labels[1], 'finish')
					comebacks.push(contentFade(nav.labels[1], data.dataset?data.dataset:'DATA','',0,350))
				}
			} //end dataset changes
			//pointText
			if(attrs.pointText === 'change' || (attrs.pointText instanceof Array && attrs.pointText.indexOf('change')>-1)){
				if(data.pointText instanceof Array){
					for(var i = 0; i<4; i++){
						if(attrs.pointText[i]==='change'){
							Velocity(text.points[i], 'finish')
							comebacks.push(contentFade(text.points[i], data.pointText[i], '', 0, 350))
						}
					}
				}
				else for(var i =0; i<4; i++){ Velocity(text.points[i],'finish');
				contentFade(text.points[i], data.pointText, '', 0, 350)}
			}
			//color
			if(attrs.color === 'change'){
				Velocity([text.openbtn, text.stuff, nav], {backgroundColor: data.color?data.color:'#000000'},{queue:false})
		  }

			//AFTERWARDS - FADING COMEBACKS BACK IN
			comebacks = comebacks.filter(function(n){ return n != undefined })
			console.log(comebacks)
			Velocity(comebacks, {opacity: 1}, {complete: function(){
				if(perspective.zoom==='normal') {console.log('calling'); callContent({tgt: 'part', inst: true})}
				else if(perspective.zoom==='close') callContent({tgt: 'points', index: facing, inst: true})
				view.navwidth()
				if(init) {$('all_ui').style.display = 'none'; Velocity.mock = false}
			}})
		}
	},
	//nav specific functions
	expandnav: function(){
		if(!nav.isOpen){
			nav.isOpen = true
			stopFinish([nav.stuff,nav.closebtn,nav.navlabel,nav.icons,nav.contents,nav.labels,nav.names,nav.items])
			var longlabel = nav.labels[0].textContent.length > nav.labels[1].textContent.length? nav.labels[0].offsetWidth*1.4 : nav.labels[1].offsetWidth*1.4

			Velocity(nav, {width: longlabel*1.25>$('top_ui').offsetWidth?'90%':longlabel < nav.navlabel.offsetWidth*1.5? '90%' : longlabel , height: '7.75rem', backgroundColorAlpha: 0.9})
			Velocity(nav.stuff, {translateX: '.5rem' ,translateY: '2.5rem'})
			Velocity(nav.closebtn, {translateX: 0}, {delay: 300, duration: 300})
			Velocity(nav.navlabel, {translateX: 0}, {delay: 250, duration: 400})
			Velocity(nav.icons, {scale: 1.25})
			Velocity(nav.contents, {translateX: '.5rem', translateY: '-.27rem'})
			Velocity(nav.labels, {opacity: 1})
			Velocity(nav.names, {opacity: 1, translateY: '.9rem', scale: 1.15, transformOriginY: [0,0], transformOriginX: [0,0]}, {duration: 350, easing: 'easeOutSine'})
			for(var i = 0; i < 2; i++){
				Velocity(nav.items[i], {translateY: i*2.5+'rem'}, {duration: (i*150)+300})
			}
		}
	},
	collapsenav: function(){
		if(nav.isOpen){
			nav.isOpen = false
			stopFinish([nav.stuff,nav.closebtn,nav.navlabel,nav.icons,nav.contents,nav.labels,nav.names,nav.items])
			Velocity(nav, {height: '1.5rem', backgroundColorAlpha: 1})
			Velocity(nav.closebtn, {translateX: '-3rem'})
			Velocity(nav.stuff, {translateX: 0}, {queue: false})
			Velocity(nav.navlabel, {translateX: -nav.navlabel.offsetWidth*1.5})
			Velocity(nav.icons, {scale: 1})
			Velocity(nav.contents, {translateX: 0, translateY: 0})
			var namesOp = 0
			if(!text.isOpen){ Velocity(nav.labels, {opacity: 0}); namesOp = 1}
			Velocity(nav.names, {translateY: 0, scale: 1, opacity: namesOp, transformOriginY: [0,0], transformOriginX: [0,0]})
			for(var i = 0; i < 3; i++){
				Velocity(nav.items[i], {translateY: i*1.5+'rem'})
			}
			view.navwidth()
			view.navscroll()
		}
	},
	navscroll: function(){
			if(!nav.isOpen){ //translateY
				var zoomlevel = perspective.zoom==='close'? 1: 0
				var rem = 1.5 //hopefully there's a better way to implement this
				Velocity(nav.stuff, {translateY: -zoomlevel * rem + 'rem'})
			}
		},
	navwidth: function(){
			if(perspective.zoom === 'normal'){
				nav.targetWidth = !text.isOpen? nav.names[0].offsetWidth : nav.labels[0].offsetWidth
			}else if(perspective.zoom === 'close'){
				if(!text.isOpen){
					nav.targetWidth = nav.points[facing].offsetWidth
				}else{
					nav.targetWidth = data.dataset instanceof Array&&data.pointNames? $$('nav_label_data')[facing].offsetWidth : nav.labels[1].offsetWidth
				}
			}
			nav.targetWidth += nav.iconwidth
			if(!nav.isOpen){
				// stopFinish([nav.names, nav.labels])
				// Velocity([nav.names, nav.labels],'stop')
				Velocity(nav.names, {opacity: text.isOpen?0:1})
				Velocity(nav.labels, {opacity: text.isOpen?1:0})
				Velocity(nav, {width: nav.targetWidth}, {queue: false})
			}
		}, // end navwidth
	navpoint: function(show){
			var others = [0,1,2,3], ndir, replacer
			others.splice(others.indexOf(facing),1)
			others.splice(others.indexOf(show),1)
			Velocity(nav.bars[show],'stop')
			Velocity(nav.bars[show], {translateX: '100%'})
			//backwards direction
			if((facing===0 && show===3) || (show<facing && facing!==3) || (show===2&&facing===3) ){
				ndir = ['200%',0,'-100%','300%',1]; replacer = show > 0? show-1 : 3
			}
			//forwards direction
			else{ ndir = [0,'200%','300%','-100%',-1]; replacer = show < 3? show+1 : 0	}

			others.splice(others.indexOf(replacer),1)
			Velocity([nav.bars[facing],nav.bars[replacer],nav.bars[others[0]]], 'stop')
			Velocity(nav.bars[facing], {translateX: ndir[0]})
			Velocity(nav.bars[replacer], {translateX: [ndir[1],ndir[2]]})
			Velocity(nav.bars[others[0]], {translateX: ndir[3]})

			Velocity(nav.points[facing], {opacity: 0, translateX: ndir[4]*2+'rem'})
			Velocity(nav.points[show], {opacity: 1, translateX: [0,-ndir[4]*2+'rem']})
			if($$('nav_label_data').length===4){
				Velocity($$('nav_label_data')[facing], {opacity: -.25, translateX: ndir[4]*2.3+'rem'}, {duration: 350})
				Velocity($$('nav_label_data')[show], {opacity: [1,-.25], translateX: [0,-ndir[4]*2.3+'rem']}, {duration: 450, easing: 'easeOutSine'})
			}
		},//end navpoint
	//help specific functions
	expandhelp: function(){
		// Velocity([help, help.stuff, help.backing, help.openbtn, help.closebtn, help.helplabel, help.buttons, help.captions], 'stop')
		stopFinish([help, help.stuff, help.openbtn, help.closebtn, help.buttons, help.captions])
		// Velocity(help, {width: '4.5rem'},{duration:200})
		Velocity(help.stuff, {translateY: '1.25rem'}, {duration: 650, visibility: 'visible'})
		Velocity(help.openbtn, {translateY: help.stuff.offsetHeight*.9}, {duration: 650})
		Velocity(help.closebtn, {translateY: 0}, {duration: 550, visibility: 'visible'})
		for(var i = 0; i<3; i++){
			Velocity(help.buttons[i], {translateX:0}, {easing: 'easeOutSine', duration: 400, delay: (100+(Math.abs(2-i))*90) })
			Velocity(help.captions[i], {translateY:0, opacity: 1}, {duration: 500, delay:500+i*80 })
		}
	},
	collapsehelp: function(){
		// Velocity([help, help.stuff, help.backing, help.openbtn, help.closebtn, help.helplabel, help.buttons, help.captions], 'stop')
		stopFinish([help, help.stuff, help.openbtn, help.closebtn, help.buttons, help.captions])
		// Velocity(help, {width: '2.15rem'}, {delay: 500, duration:200})
		Velocity(help.closebtn, {translateY: '-3rem'}, {duration: 400})
		Velocity(help.stuff, {translateY: -help.stuff.offsetHeight},{duration: 600, visibility: 'hidden'})
		Velocity(help.openbtn, {translateY: 0}, {duration: 550})
		for(var i = 0; i<3; i++){
			Velocity(help.buttons[i], {translateX:'150%'}, {duration: 300+(i*75), delay: 50+i*100})
			Velocity(help.captions[i], {translateY:'-50%',opacity:0}, {duration: 200})
		}
	},
	helphowto: function(){
		help.state = "howtos"; help.counter = 0
		Velocity(help.howtos[0], {translateX: [0, '100%']}, {visibility: 'visible'})
		Velocity(help.nextbtn, {translateY: '0'}, {visibility: 'visible'})
	},
	helpabout: function(){
		help.state = "abouts"; help.counter = 0
		Velocity(help.abouts[0], {translateX: [0, '100%']}, {visibility: 'visible'})
		Velocity(help.nextbtn, {translateY: '0'}, {visibility: 'visible'})
	},
	helpfeedback: function(){
		console.log(this)
	},
	helpnext: function(){
		if(help.counter === help[help.state].length-1){
			Velocity(help[help.state][help.counter], {translateX: '-100%'}, {visibility: 'hidden'})
			Velocity(help.nextbtn, {translateY: '4.5rem'}, {visibility: 'hidden'})
			help.counter = 0; help.state = ''
		}else{
			Velocity(help[help.state][help.counter], {translateX: '-100%'}, {visibility: 'hidden'})
			Velocity(help[help.state][help.counter+1], {translateX: [0, '100%']}, {visibility: 'visible'})
			help.counter++
		}
	},
	//text specific finctions
	expandtext: function(){
		if(perspective.zoom === 'normal') callContent({tgt:'part',do:'expand'})
		else if(perspective.zoom === 'close') callContent({tgt:'points', index: facing, do: 'expand'})
		if(!nav.isOpen){
			Velocity(nav.names, {opacity:0, scaleY: 0.6, transformOriginY: ['1.5rem','1.5rem']})
			Velocity(nav.labels, {opacity:1, scaleY: [1,0.6], transformOriginY: [0,0]})
			Velocity(nav.names , {scaleY:1},{duration:0})
			view.navwidth()
		}
	},
	collapsetext: function(){
		if(perspective.zoom === 'normal') callContent({tgt:'part',do:'collapse'})
		else if(perspective.zoom === 'close') callContent({tgt:'points', index: facing, do: 'collapse'})
		if(!nav.isOpen){
			Velocity(nav.labels, {opacity:0, scaleY: 0.6, transformOriginY: [0,0]})
			Velocity(nav.names, {opacity:1, scaleY: [1,0.6], transformOriginY: ['1.5rem','1.5rem']})
			Velocity(nav.labels , {scaleY:1},{duration:0})
			view.navwidth()
		}
	}
} // end view functions

var info = {
	reorient: function(){
		if(perspective.height==='elevation'){
			for(var i = 0; i<4; i++){
				rotate(info.prev[i].caption, {x: 0}, 350,200)
				rotate(info.prev[i].title, {x: 0}, 350,0)
				move(info.prev[i], {x:info.prev[i].position.x, y:-4.5, z:info.prev[i].position.z},400,1,'Quadratic','Out')
			}
		}
		else if(perspective.height==='isometric'){
			for(var i = 0; i<4; i++){
				rotate(info.prev[i].caption, {x: Math.atan( - 1 / Math.sqrt( 2 ))}, 350,0)
				rotate(info.prev[i].title, {x: Math.atan( - 1 / Math.sqrt( 2 ))}, 350,200)
				move(info.prev[i], {x:info.prev[i].position.x, y:-3.5, z:info.prev[i].position.z},400,1,'Quadratic','Out')
			}
		}
	},
	showprev: function(tgtprev){
		info.prev[tgtprev].traverse(function(child){
			if(child.material) fade(child, 1, 500, 0)
			if(child.expand) move(child,child.expand,400,0,'Quadratic','Out')
		})
	},
	hideprev: function(tgtprev){
		info.prev[tgtprev].traverse(function(child){
			if(child.material) fade(child, 0, 400, 0)
			if(child.origin) move(child,child.origin,500,0,'Quadratic','Out')
		})
	},
	showsprite: function(tgtsprite){
		sprite = info.sprite[tgtsprite]
		if(sprite.title){
			size(sprite.title,{x:sprite.title.expand.sx,y:sprite.title.expand.sy,z:1},300)
			var ite = 0
			sprite.traverse(function(child){
				if(child.material){fade(child,1,300+(ite*100),0)}
				move(child,{x:child.position.x,y:child.expand.y,z:child.position.z},300+(ite*125),1,'Quadratic','Out',function(){},0)
				ite++
			})
		}
	},
	hidesprite: function(tgtsprite){
		sprite = info.sprite[tgtsprite]
		if(sprite.title){
			size(sprite.title,{x:sprite.title.expand.sx/1.5,y:sprite.title.expand.sy/1.5,z:1},300)
			var ite = 0
			sprite.traverse(function(child){if(child.material){
				fade(child,0,200,ite*100)}
				move(child,{x:child.position.x,y:child.expand.y-(ite),z:child.position.z},200+(ite*100),1,'Quadratic','Out',function(){},0)
				ite++
			})
		}
	}
}

function callContent(c){
	//  c = { tgt: 'part', mode:  }
		var target = text[c.tgt]
		if(target instanceof HTMLCollection) target = target[c.index]
		var label = target.label
		Velocity([target, text.stuff, text.topline, text.bottomline, text.closebtn, text.openbtn, label], 'finish')
		//cycled / zoomed to DISABLED target
		if(target.textContent === '' || !target.textContent){
			if(c.prev && c.prev.textContent){
				Velocity([c.prev, c.prev.label], 'finish')
				Velocity(c.prev, {opacity:0}, {visibility: 'hidden'})
				Velocity(c.prev.label, {translateY: '2.5rem'}, {visibility: 'hidden'})
				Velocity([text.stuff, text.topline], {translateY: '1.25rem'}, {visibility: 'hidden'})
				Velocity(text.bottomline, {translateY: '1.25rem'}, {delay: 200, duration: 250}, {visibility: 'hidden'})
				Velocity([text.closebtn,text.openbtn], {translateY: '2.75rem'}, {visibility: 'hidden'})
			}
			//when being refilled -> disabled
			if(c.inst){
				Velocity([text.stuff, text.topline], {translateY: '1.25rem'}, {visibility: 'hidden'})
				Velocity(text.bottomline, {translateY: '1.25rem'}, {delay: 200, duration: 250}, {visibility: 'hidden'})
				Velocity([text.closebtn,text.openbtn,label], {translateY: '2.75rem'}, {visibility: 'hidden'})
				text.isOpen = false
			}
		}
		//cycled / zoomed to ENABLED target
		else if(target.textContent && !c.do){
			if(c.prev){
				Velocity([c.prev, c.prev.label], 'finish')
				Velocity(c.prev, {opacity: 0, translateX: (c.dir*-2)+'rem'}, {visibility: 'hidden'})
				Velocity(c.prev.label, {translateX: (c.dir*-1.5)+'rem',translateY:tgtHeight+c.prev.label.offsetHeight},
					{visibility: 'hidden'})
			}
			if(label.textContent === ''){ Velocity(label, {opacity:0,translateY:'2.5rem'},{display:'none'}) }
			else Velocity(label, {opacity:1},{display:'inline',duration:0})
			if(text.isOpen){
				var tgtHeight = -target.offsetHeight
				//enabled to enabled (text already open)
				if(c.prev && c.prev.textContent){

					Velocity(target, {opacity: 1, translateX: [0,(c.dir*2)+'rem'], translateY: 0}, {visibility: 'visible', delay: 50})
					Velocity(label, {opacity: 1, translateX: [0,(c.dir*2)+'rem'], translateY: [tgtHeight,tgtHeight+label.offsetHeight]},
						{visibility: 'visible', delay: 50})
				}
				//disabled to enabled (text already open) OR refilling -> enabled & open
				else if(c.prev && !c.prev.textContent){
					Velocity(target, {opacity: 1, translateX: [0,0], translateY: [0,'3rem']}, {visibility: 'visible'})
					Velocity(label, {opacity: 1, translateX: [0,0], translateY: [tgtHeight,'2.5rem']},{visibility: 'visible'})
				}
				else if(c.inst){
					Velocity(label, {translateY: tgtHeight})
				}
				//if text is open / has content, then always tgtHeight the following
				Velocity([text.stuff, text.closebtn, text.topline], {translateY: tgtHeight}, {visibility: 'visible'})
			}else{
				if((c.prev && !c.prev.textContent)||(c.inst)){
					Velocity([text.stuff,text.topline,text.bottomline],{translateY: 0}, {visibility: 'visible'})
					Velocity(text.openbtn, {translateY: 0}, {visibility: 'visible'})
				}
			}
			//either way about text.open, bottomline always appears for enableds
			Velocity(text.bottomline, {translateY: 0}, {visibility: 'visible'})
		}
		//ebplicit actions (expand, collapse)
		else{
			if(c.do==='expand' && !text.isOpen){
				var tgtHeight = -target.offsetHeight
				text.isOpen = true
				Velocity(target, {opacity: 1, translateX: [0,0], translateY: [0,0]}, {visibility: 'visible'})
				Velocity([text.stuff, text.topline, text.closebtn], {translateY: tgtHeight}, {visibility: 'visible'})
				Velocity(text.openbtn, {translateY: tgtHeight + text.openbtn.offsetHeight/2}, {visibility: 'hidden'})
				Velocity(text.openbtn, {translateY: text.openbtn.offsetHeight/2}, {duration:0, complete: function(){

				}})
				if(label.textContent === '' || !label.textContent) Velocity(label, {opacity: 0}, {visibility: 'hidden'})
				else Velocity(label, {opacity: [1,1], translateY:[tgtHeight,'1.5rem'], translateX:[0,0]}, {visibility: 'visible'})
			}
			else if(c.do==='collapse' && text.isOpen){
				text.isOpen = false
				Velocity(target, {opacity: 0}, {visibility: 'hidden'})
				Velocity([text.stuff, text.topline, text.openbtn], {translateY: 0}, {visibility: 'visible'})
				Velocity(text.closebtn, {translateY: '2.75rem'}, {visibility: 'hidden'})
				Velocity(label, {translateY: '1.5rem'}, {visibility: 'hidden'})
			}
		}

		//nav ops
		//if prev, width / scroll, if 'do', toggle names/labels & width
} // end callContent
function heightCalc(){
	if(data.rangeType !== 'disassociated'){
		if(data.pointValues.allSame()){
			console.log('values are all the same')
			var autoset = data.pointValues[0] < 1? 0 : plrmax
			for(var i = 0; i<4; i++){
				seseme['plr'+i].targetY = autoset
			}
			return
		}
		var top = 100, bottom = 0
		if(!data.rangeType || data.rangeType === "moreIsTall"){
			top = !data.customMax ? Math.max.apply(null, data.pointValues) : data.customMax
			bottom = !data.customMin ? Math.min.apply(null, data.pointValues) : data.customMin
		}else if(data.rangeType === 'lessIsTall'){
			top = !data.customMax ? Math.min.apply(null, data.pointValues) : data.customMax
			bottom = !data.customMin ? Math.max.apply(null, data.pointValues) : data.customMin
		}
		var range = Math.abs(bottom-top)
		for(var i = 0; i<4; i++){
			seseme['plr'+i].targetY = Math.abs(bottom-data.pointValues[i])/range * plrmax
		}
	}
	else if (data.rangeType === 'disassociated'){
		for(var i = 0; i<4; i++){
			var range = Math.abs(data.pointRanges[i][0]-data.pointRanges[i][1])
			seseme['plr'+i].targetY = Math.abs(data.pointRanges[i][0] - data.pointValues[i]) / range * plrmax
		}
	}

} // end heightCalc
function highlight(which, opacity, dur){
	fade(seseme['plr'+which].outline,opacity,dur,0)
	fade(seseme['plr'+which].outcap,opacity,dur,0)
}

//MATH / UTILITY FUNCTIONS
function degs(rads){return rads*(180/Math.PI)}
function rads(degs){return degs*(Math.PI/180)}
function dice(possibilities){return Math.floor(Math.random()*possibilities)}
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
Array.prototype.allSame = function(){
	for(var i = 0; i<this.length; i++){
		if(this[i] !== this[0]) return false
	}
	return true
}
Array.prototype.min = function( ){
	return Math.min.apply( Math, this )
}

//TWEENS / ANIMATIONS
function move(obj,pos,spd,multiplier,twntype,twninout,callback,delay){
	if(obj.moveTween) obj.moveTween.stop()
	var start = {x: obj.position.x, y: obj.position.y, z: obj.position.z}
	var translate = new TWEEN.Tween(start).to(pos,spd)
	.onComplete(function(){if(callback){callback()}; delete obj.moveTween })
	.onUpdate(function(){
		obj.position.x = start.x; obj.position.y = start.y; obj.position.z = start.z
	})
	.easing(TWEEN.Easing[twntype][twninout])
	if(delay!==undefined){translate.delay(delay)}
	translate.start()
	obj.moveTween = translate
}
function yMove(obj,pos,delay,spd,twntype,twninout,cb){ //more efficient move func
	//also doesnt have the stop that seems to befuddle pillar ops
	var start = {y: obj.position.y}
	var translate = new TWEEN.Tween(start).to(pos,spd)
	.onUpdate(function(){obj.position.y = start.y})
	.easing(TWEEN.Easing[twntype][twninout])
	if(delay){ translate.delay(delay) }
	if(cb){ translate.onComplete(cb) }
	translate.start()
}
function qMove(mode){
	console.log('queues: ' + seseme.plr0.queue.length, seseme.plr1.queue.length,
	seseme.plr2.queue.length, seseme.plr3.queue.length)
	var targets = []
	var qM = new THREE.LoadingManager()
	qM.onLoad = function(){
		if(seseme.plr0.queue.length > 0 || seseme.plr1.queue.length>0 || seseme.plr2.queue.length>0 || seseme.plr3.queue.length >0){
			if(data.motionOrder==='biped') if(mode==='A'){qMove('B')}else{qMove('A')}
			else if(data.motionOrder==='quadruped') if(mode<3){qMove(mode+1)}else{qMove(0)}
			else if(data.motionOrder==='altbiped'){
				if(mode==='A'){qMove('B')}else if(mode==='B'){qMove('C')}else if(mode==='C'){qMove('D')}else{qMove('A')}
			}
			else qMove() //unison / undefined
		}
		else console.log('all queues complete')
	}
	qM.onProgress = function(item, loaded, total){console.log(item + ' progressed: ' + loaded, total)}
	if(data.motionOrder==='biped') mode === 'A'? targets = [0,1] : targets = [2,3]
	else if(data.motionOrder==='quadruped') targets = mode
	else if(data.motionOrder==='altbiped'){
		mode==='A'?targets=[0,1]:mode==='B'?targets=[2,3]:mode==='C'?targets=[0,2]:targets=[3,1]
	}
	else targets = [0,1,2,3] //unison or undefined
	if(targets instanceof Array){
		for(var i = 0; i<targets.length;i++){
			qM.itemStart(targets[i])
		}
		for(var i = 0; i<targets.length;i++){
			itemAnim(targets[i])
		}
	}else if(typeof targets === 'number'){
		qM.itemStart(targets)
		itemAnim(targets)
	}
	function itemAnim(tgt){
			var p = seseme['plr'+tgt]
			if(p.queue.length >= 1) var d = p.queue[0]
			else { console.log(tgt + '\'s queue finished'); qM.itemEnd(tgt); return}
			// var dest = p.position.y + d.travel
			// var spd = Math.abs((d.travel/plrmax) * constspd) + spdcompensator
			var spd = (((Math.abs(p.position.y - d.dest))/plrmax) * constspd) + spdcompensator
			console.log(tgt + ' moving')
			console.log(tgt + ' delayed: '+ d.delay)
			yMove(p, {y: d.dest}, d.delay?d.delay:0, spd, 'Cubic', 'InOut', function(){
				p.queue.splice(0,1); qM.itemEnd(tgt)
			})
	}
}
function fade(obj,tgtopacity,spd,delay,callback){
	if(obj.fadeTween){obj.fadeTween.stop()}
	var start = {opacity: obj.material.opacity}
	var transition = new TWEEN.Tween(start).to({opacity: tgtopacity}, spd)
	.onComplete(function(){if(callback){callback()} delete obj.fadeTween })
	.onStop(function(){if(callback)callback();})
	.onUpdate(function(){obj.material.opacity = start.opacity}).delay(delay)
	.easing(TWEEN.Easing.Quadratic.Out).start(); obj.fadeTween = transition
}
function size(obj,tgtscale,spd,callback,delay){
	if(obj.sizeTween){obj.sizeTween.stop()}
	var start = {x: obj.scale.x, y: obj.scale.y, z: obj.scale.z}
	var anim = new TWEEN.Tween(start).to(tgtscale,spd).onComplete(function(){
	if(callback!==undefined){callback()} delete obj.sizeTween })
	.onUpdate(function(){obj.scale.x = start.x
	obj.scale.y= start.y; obj.scale.z = start.z}).easing(TWEEN.Easing.Quadratic.Out)
	if(delay){anim.delay(delay)}else{}
	anim.start()
	obj.sizeTween = anim
}
function rotate(obj,tgtrotation,spd,delay,callback){
	if(obj.rotateTween){obj.rotateTween.stop()}
	var start = {x: obj.rotation.x, y: obj.rotation.y, z: obj.rotation.z}
	obj.rotateTween = new TWEEN.Tween(start).to(tgtrotation,spd).delay(delay)
	.onComplete(function(){ if(callback!==undefined){callback() } delete obj.rotateTween })
	.onUpdate(function(){
		obj.rotation.x = start.x
		obj.rotation.y = start.y
		obj.rotation.z = start.z
	})
	.easing(TWEEN.Easing.Quadratic.Out)
	.start()
}
function recolor(obj,tgt,spd){
	if(obj.colorTween){obj.colorTween.stop()}
	var start = {r: obj.material.color.r, g: obj.material.color.g, b: obj.material.color.b}
	obj.colorTween = new TWEEN.Tween(start).to({r: tgt.r/255, g: tgt.g/255, b: tgt.b/255},spd).onUpdate(function(){
		obj.material.color.r = start.r; obj.material.color.g = start.g; obj.material.color.b = start.b
	}).easing(TWEEN.Easing.Quadratic.Out).onComplete(function(){delete obj.colorTween}).start()
}
function stopFinish(tgt){
	if(Array.isArray(tgt)){
		 tgt.forEach(function(ele){
			 if(ele instanceof Array || ele instanceof NodeList || ele instanceof HTMLCollection){
			  	for(var i = 0; i<ele.length; i++){ if(ele[i].changing){ Velocity(ele[i],'finish') }else Velocity(ele[i], 'stop') }
			 }
			 if(ele.changing){ Velocity(ele,'finish')}else{ Velocity(ele,'stop')}
		 })
	 }else{ if(tgt.changing) Velocity(tgt, 'finish'); else Velocity(tgt, 'stop')}
}
function contentFade(tgt, content, xy, del, dur){
		tgt.changing = true
		Velocity(tgt, {opacity: 0, translateX: xy?xy[0]:'-=0', translateY: xy?xy[1]:'-=0'}, {delay: del, duration: dur,
			complete: function(){
				tgt.textContent = content
				tgt.textContent = Hyphenator.hyphenate(tgt.textContent, 'en')
				tgt.changing = false
		}})
		//nav scroll / textOpen based
		if(!nav.isOpen){
			if(tgt.classList.contains('nav_label') && !text.isOpen) return
			else if(tgt.classList.contains('nav_name')&& text.isOpen) return
		}
		// facing based
		if(tgt.classList.contains('nav_label_data') || tgt.classList.contains('nav_point')){
			if([].indexOf.call(tgt.parentNode.children, tgt)!==facing){
				console.log('dont reshow ' + tgt.classList + [].indexOf.call(tgt.parentNode.children, tgt))
				return
			}
		}
		//not excepted? go on and add it
	 	console.log(tgt.className + ' sent'); return tgt
}
//OBJECT CREATION
function Text(words,width,widthmargin,height,color,font,fontSize,fontWeight,align){
	this.cvs = document.createElement('canvas'), this.ctx = this.cvs.getContext('2d')
	this.tex = new THREE.Texture(this.cvs); this.tex.needsUpdate = true
	this.cvs.width = this.ctx.measureText(words).width * width + widthmargin; this.cvs.height = height
	// this.ctx.strokeStyle = '#FF0000', this.ctx.lineWidth=5, this.ctx.strokeRect(0,0,this.cvs.width,this.cvs.height)
	this.ctx.scale(3,3); this.ctx.fillStyle = color; this.ctx.font = 'normal '+fontWeight+' '+fontSize+'pt '+font
	this.ctx.textAlign = align;
	if(align==='center'){this.ctx.fillText(words,this.cvs.width/6,this.cvs.height/6+fontSize/2.2)
	}else if(align==='start'){this.ctx.fillText(words,1,this.cvs.height/6+fontSize/2.2)}
	else{this.ctx.fillText(words,this.cvs.width/3-10,this.cvs.height/6+fontSize/2.2)}
}
//turns Text objects into mesh/mat, storing them as attributes in the original obj
function meshify(target){
	var mtl = new THREE.MeshBasicMaterial({transparent: true, opacity: 0, depthWrite:false, map: target.tex})
	var obj = new THREE.Mesh(new THREE.PlaneBufferGeometry(target.cvs.width/60,target.cvs.height/60), mtl)
	obj.canvas = target
	return obj
}
function backer(target, hex, margins){
	var mtl = new THREE.MeshBasicMaterial({transparent: true, opacity: 0, color: hex})
	target.backing = new THREE.Mesh(new THREE.PlaneBufferGeometry(target.canvas.cvs.width/60 + margins[0],
	target.canvas.cvs.height/60 + margins[1]), mtl); target.backing.position.z -= 0.1
	target.add(target.backing)
}
