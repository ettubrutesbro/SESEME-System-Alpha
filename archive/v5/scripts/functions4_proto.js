
var $ = document.getElementById.bind(document)
var $$ = document.getElementsByClassName.bind(document)

//DOM mutations for browsing through current data
var view = {
	//global UI changes
	enableUI: function(){
		console.log('enabling UI')
		text.style.width = 0
		Velocity(text.openbtn, {translateY: '3rem'}, {duration: 0})
		Velocity(nav, {translateY: -nav.offsetHeight}, {duration:0})
		Velocity(help.openbtn, {translateY: -help.openbtn.offsetHeight}, {duration: 0})
		Velocity(nav, {translateY: 0}, {delay: 500, duration: 300, visibility: 'visible', easing: 'easeOutSine'})
		Velocity(help.openbtn, {translateY: 0}, {delay: 650, duration: 250, visibility: 'visible', easing: 'easeOutSine'})
		if((perspective.zoom==='normal'&&text.part.textContent!=='') || (perspective.zoom==='close'&&text.points[facing].textContent!==''))
		{
			Velocity(text, {width: '100%'}, {duration: 350, visibility: 'visible'})
			Velocity(text.openbtn, {translateY: 0}, {delay: 350, easing: 'easeOutSine'})
		}else{
			Velocity([text.partlabel, text.pointlabel, text.openbtn, text.closebtn], 'stop')
			Velocity([text.stuff, text.topline, text.bottomline], {translateY: '1.25rem'})
			Velocity([text.closebtn, text.pointlabel, text.openbtn], {translateY: '3.5rem', scale: 1})
			Velocity(text.partlabel, {translateX: text.partlabel.offsetWidth, translateY: '3.5rem'}, {visibility: 'hidden'})
			Velocity(text, {width: '100%'}, {delay: 500, visibility: 'visible'})
		}
	},
	disableUI: function(){
		console.log('disable UI')
	},
	story: function(){
		// dunno
	},
	part: function(){
		if(text.intransit){
			stopFinish(text.openbtn)
			Velocity(text.openbtn, {translateY: '2.5rem'})
		}
		stopFinish([text.part, text.points])
		Velocity(text.part, {opacity: 1}, {visibility: 'visible'})
		Velocity(text.points[facing], {opacity: 0, translateY: '3rem'}, {visibility: 'hidden'})
		if(text.part.disabled) view.disabletext()
		else view.enabletext()
	},
	point: function(){
		if(text.intransit){
			stopFinish(text.openbtn)
			Velocity(text.openbtn, {translateY: '2.5rem'})
		}
		stopFinish([text.part, text.points])
		Velocity(text.part, {opacity: 0},{visibility: 'hidden'})
		Velocity(text.points[facing], {opacity: 1, translateY: [0,'3rem']},{visibility: 'visible'})
		if(text.points[facing].disabled) view.disabletext()
		else view.enabletext()
	},
	cyclePoints: function(show){
		// zoomed in
		if(perspective.zoom === 'close'){ //user is zoomed in, so text = point
			if(text.points[facing].disabled && !text.points[show].disabled) view.enabletext()
			text.targetHeight = text.points[show].offsetHeight
			if(text.isOpen){
				stopFinish([text.points[facing],text.points[show],text.pointtitles[facing],text.pointtitles[show],text.stuff,text.partlabel])
				Velocity([text.stuff, text.topline, text.closebtn], {translateY: -text.targetHeight},
					{visibility: 'visible'})
				//directions
				var dir = show===facing+1 || show===facing-3 ? [3,1.5,-1.5,0,3] : [-3,0,3,1.5,-1.5]
				Velocity(text.points[facing], {opacity:0,translateX:[-dir[0]+'rem',0],translateY:0},
				{duration: 400, easing: 'easeInSine', visibility: 'hidden'})
				Velocity(text.points[show], {opacity: 1, translateX: [0,dir[0]+'rem'], translateY: 0},
				{duration: 600, easing: 'easeOutSine', visibility: 'visible'})
				Velocity(text.pointtitles[facing], {opacity: 0, translateY: [dir[1]+'rem',0], translateX: [dir[2]+'rem',0]},
				{visibility: 'hidden'})
				if(text.pointtitles[show].textContent !== ''){
					Velocity(text.pointlabel, {width: text.pointtitles[show].offsetWidth,
						translateX:0, translateY: -text.targetHeight}, {visibility: 'visible'})
					Velocity(text.pointtitles[show], {opacity: 1, translateY:[0,dir[3]+'rem'],
						translateX: [0,dir[4]+'rem']}, {visibility: 'visible'})
				}else Velocity(text.pointlabel, {translateY: -text.targetHeight + text.pointlabel.offsetHeight*2})
			}
			// enabled --> disabled
			if(!text.points[facing].disabled&&text.points[show].disabled)view.disabletext()
			//disabled --> disabled
			if(text.points[facing].disabled&&text.points[show].disabled)view.disabletext()



			//end of text.isOpen check


			}

		//not zoomed in
		else if(perspective.zoom !== 'close'){ //not zoomed in; text = part
			Velocity(text.points[show], {translateX: 0}, {duration: 0, visibility: 'visible'})
			Velocity(text.pointtitles[facing], {opacity: 0}, {duration:0, visibility: 'hidden'})
			Velocity(text.pointtitles[show], {opacity: 1, translateY:0, translateX:0}, {duration:0, visibility: 'visible'})
			text.pointlabel.style.width = text.pointtitles[show].offsetWidth
		}
		//NAV mutations
		var navdir = (facing===0 && show===3)||(show<facing && facing!==3)||(show===2&&facing===3)?1:-1
		Velocity(nav.points[facing], {opacity: 0, translateX: navdir*2+'rem'})
		Velocity(nav.points[show], {opacity: 1, translateX: [0,-navdir*2+'rem']})
		if(data.dataset instanceof Array){
			Velocity($$('nav_label_data')[facing], {opacity: 0, translateX: navdir*2+'rem'}, {duration: 350})
			Velocity($$('nav_label_data')[show], {opacity: 1, translateX: [0,-navdir*2+'rem']}, {duration: 450, easing: 'easeOutSine'})
		}
	}, //end cyclePoints
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
								t.width, t.margin, t.height, 'white', 'Source Serif Pro', t.fontSize, t.fontWeight, 'center'))
							var addtext = meshify(new Text(newtext instanceof Array?newtext[1]:newtext.substring(15,newtext.length),
								t.width, t.margin, t.height, 'white', 'Source Serif Pro', t.fontSize, t.fontWeight, 'center'))
							title.add(addtext); addtext.origin = {x: 0, y: 0, z: 0}; addtext.expand = {x:0,y:-2,z:0}
							if(facing===which && perspective.height==='isometric'&&perspective.zoom==='normal'){ addtext.position.y = -2; fade(addtext, 1, 400, 120) }
						}else{
							var title = meshify(new Text(newtext, t.width, t.margin, t.height, 'white', 'Source Serif Pro', t.fontSize, t.fontWeight, 'center'))
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
						var sprtxt = new Text(newtext,11,240,125,'black','Fira Sans',30,500,'center')
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
						var caption = meshify(new Text(captiontext,11.5,200,80,'white','Fira Sans',16,500,'center'))
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
			//info
			if(attrs.info === 'change'){
				var textpart = data.info?data.info:''
				comeBack(text.part, textpart, ['-1rem','-=0',[0,'1rem'],'-=0'], 0, 400, textpartsetter)
				function textpartsetter(){
					text.targetHeight = text.part.offsetHeight
					text.part.disabled = text.part.textContent !== ''? false : true
					if(perspective.zoom==='normal'){
						if(text.part.disabled) view.disabletext()
						else view.enabletext()
					}
				}
			}
			//title
			if(attrs.title === 'change'){
				var titlename, titlelabel
				//content determination
				if(data.title&&story.title){ titlename = data.title+' ('+(part+1)+'/'+story.parts.length+')'
					titlelabel = story.title }
				else if(data.title) { titlename = data.title; titlelabel = 'STORY PART '+(part+1)+'/'+story.parts.length}
				else if(story.title) { titlename = 'PART '+(part+1)+'/'+story.parts.length; titlelabel = story.title }
				else {titlename = 'PART '+(part+1)+'/'+story.parts.length; titlelabel = 'STORY ?'}
				//content mutation
				if(nav.labels[0].textContent !== titlelabel) {comeBack(nav.labels[0], titlelabel,'', 0, 400) }
				if(nav.names[0].textContent !== titlename)
					{	comeBack(nav.names[0], titlename, ['-1rem','-=0',[0,'2rem'],'-=0'], 0, 400) }
				if(text.partlabel.textContent !== titlename){
					comeBack(text.partlabel, data.title?titlename:'',
 					['-=2rem','+=2rem',[0,'3rem'],[-text.targetHeight,-text.targetHeight]],0,400)
				}
			}
			//pointNames
			if((attrs.pointNames === 'change') || (attrs.pointNames instanceof Array && attrs.pointNames.indexOf('change')>-1 )){
				for(var i = 0; i<4; i++){
					if(attrs.pointNames[i] === 'change' || attrs.pointNames === 'change'){
						var pointnav, pointnametext
						//content determination
						if(Array.isArray(data.pointNames)&&data.pointNames[i]){
							if(Array.isArray(data.pointNames[i]))
							{ pointnav = pointnametext = data.pointNames[i].toString().replace(',',' ')}
							else pointnav = data.pointNames[i]; pointnametext = data.pointNames[i]
						}
						else if(Array.isArray(data.pointNames)&&!data.pointNames[i])
							{pointnav = data.pointValues[i]; pointnametext = ''}
						else if(data.pointNames) pointnav = pointnametext = data.pointNames
						else { pointnav = data.pointValues[i]; pointnametext = '' }
						//content mutation
						comeBack(nav.points[i], pointnav, '', 0, 400, i===facing?view.navwidth:'')
						comeBack(text.pointtitles[i], pointnametext, '', 0, 400,i===facing?relabel:'')
					}
				}
				function relabel(){
					Velocity(text.pointlabel,{width:text.pointtitles[facing].offsetWidth})
					if(text.pointtitles[facing].textContent === '')Velocity(text.pointlabel, {translateY: '1.5rem'})
				}
			}//end pointNames changes
			//dataset
			if((attrs.dataset === 'change') || (attrs.dataset instanceof Array && attrs.dataset.indexOf('change')>-1)){
				if(Array.isArray(data.dataset) && attrs.dataset === 'change'){ //simple to array
					comeBack(nav.labels[1], '', '', 0, 350, spanmaker)
				}
				if(Array.isArray(data.dataset) && attrs.dataset instanceof Array){ //array to array
					for(var i = 0; i<4; i++){
						var datasetnav = data.dataset[i]? data.dataset[i] : 'DATA'
						if(attrs.dataset[i] === 'change'){
							if(i===facing) comeBack($$('nav_label_data')[i],datasetnav,'',0,350,datasetwidth)
							else $$('nav_label_data')[i].textContent = datasetnav
						}
					}
				}

				if(!Array.isArray(data.dataset)){ //anything to simple
					var datasetnav = data.dataset?data.dataset : 'DATA'
					comeBack(nav.labels[1], datasetnav, '', 0, 350,datasetwidth)
				}
				function spanmaker(){
					for(var i = 0; i<4; i++){
						var pt = document.createElement('span'); pt.className = 'nav_label_data'
						pt.textContent = data.dataset[i]? data.dataset[i] : 'DATA'
						nav.labels[1].appendChild( pt )
						if(i===facing) pt.style.opacity = 1; view.navwidth()
					}
				}
				function datasetwidth(){
					if(perspective.zoom==='close' && text.isOpen) view.navwidth()
				}
			} //end dataset changes
			//pointText
			if(attrs.pointText === 'change' || (attrs.pointText instanceof Array && attrs.pointText.indexOf('change')>-1)){
				if(data.pointText instanceof Array){
					for(var i = 0; i<4; i++){
						if(attrs.pointText[i]==='change'){
							var pttext = data.pointText[i]?data.pointText[i]:''
							if(i===facing && perspective.zoom === 'close')
							{ comeBack(text.points[i],pttext,'',0,400,textheight) }
							else {
								text.points[i].textContent = data.pointText[i]
								if(!data.pointText[i]) text.points[i].disabled = true
								else text.points[i].disabled = false
							}
						}
					}
				}else{
					for(var i =0; i<4; i++){
						if(perspective.zoom==='close'&&i===facing)
							{comeBack(text.points[i],data.pointText,'',0,400,textheight)}
						else {
							text.points[i].textContent = data.pointText
							if(!data.pointText) text.points[i].disabled = true
							else text.points[i].disabled = false
						}
					}
				}
				function textheight(){
					text.targetHeight = text.points[facing].offsetHeight
					if(text.isOpen){
						Velocity([text.closebtn,text.topline,text.stuff,text.pointlabel], {translateY: -text.targetHeight})
					}
					if(text.points[facing].textContent === '') { text.points[facing].disabled = true; view.disabletext() }
					else{ text.points[facing].disabled = false; if(text.isOpen)view.enabletext()}
				}
			}
			//color
			if(attrs.color === 'change'){
				Velocity([text.openbtn, text.stuff, nav], {backgroundColor: data.color?data.color:'#000000'},{queue:false})
		  }
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
			Velocity(nav.names, {opacity: 1, translateY: '.9rem', scale: 1.15}, {duration: 350, easing: 'easeOutSine'})
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
			Velocity(nav.closebtn, {translateX: '-2.25rem'})
			Velocity(nav.stuff, {translateX: 0}, {queue: false})
			Velocity(nav.navlabel, {translateX: -nav.navlabel.offsetWidth*1.25})
			Velocity(nav.icons, {scale: 1})
			Velocity(nav.contents, {translateX: 0, translateY: 0})
			var namesOp = 0
			if(!text.isOpen){ Velocity(nav.labels, {opacity: 0}); namesOp = 1}
			Velocity(nav.names, {translateY: 0, scale: 1, opacity: namesOp})
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
			var others = [0,1,2,3]
			others.splice(others.indexOf(facing),1)
			others.splice(others.indexOf(show),1)
			Velocity(nav.bars[show],'stop')
			Velocity(nav.bars[show], {translateX: '100%'})
			//backwards direction
			if((facing===0 && show===3) || (show<facing && facing!==3) || (show===2&&facing===3) ){
				var replacer = show > 0? show-1 : 3
				others.splice(others.indexOf(replacer),1)
				Velocity([nav.bars[facing],nav.bars[replacer],nav.bars[others[0]]], 'stop')
				Velocity(nav.bars[facing], {translateX: '200%'})
				Velocity(nav.bars[replacer], {translateX: [0,'-100%']})
				Velocity(nav.bars[others[0]], {translateX: '300%'})
			}
			//forwards direction
			else{
				var replacer = show < 3? show+1 : 0
				others.splice(others.indexOf(replacer),1)
				Velocity([nav.bars[facing],nav.bars[replacer],nav.bars[others[0]]], 'stop')
				Velocity(nav.bars[facing], {translateX: 0})
				Velocity(nav.bars[replacer], {translateX: ['200%','300%']})
				Velocity(nav.bars[others[0]], {translateX: '-100%'})
			}
		},//end navpoint
	//help specific functions
	expandhelp: function(){
		// Velocity([help, help.stuff, help.backing, help.openbtn, help.closebtn, help.helplabel, help.buttons, help.captions], 'stop')
		stopFinish([help, help.stuff, help.backing, help.openbtn, help.closebtn, help.helplabel, help.buttons, help.captions])
		Velocity(help, {width: '4.5rem'},{duration:200})
		Velocity([help.stuff,help.backing], {translateY: '1.25rem'}, {duration: 650, visibility: 'visible'})
		Velocity(help.openbtn, {translateY: help.stuff.offsetHeight*.95}, {duration: 650})
		Velocity(help.closebtn, {translateY: 0}, {duration: 650, visibility: 'visible'})

		Velocity(help.helplabel, {translateX: 0, opacity: 1},{delay:400, easing: 'easeOutSine', visibility: 'visible'})
		for(var i = 0; i<3; i++){
			Velocity(help.buttons[i], {translateX:0}, {easing: 'easeOutSine', duration: 400, delay: (100+(Math.abs(2-i))*90) })
			Velocity(help.captions[i], {translateY:0, opacity: 1}, {duration: 500, delay:500+i*80 })
		}
	},
	collapsehelp: function(){
		// Velocity([help, help.stuff, help.backing, help.openbtn, help.closebtn, help.helplabel, help.buttons, help.captions], 'stop')
		stopFinish([help, help.stuff, help.backing, help.openbtn, help.closebtn, help.helplabel, help.buttons, help.captions])
		Velocity(help, {width: '2.15rem'}, {delay: 500, duration:200})
		Velocity(help.helplabel, {translateX: help.helplabel.offsetWidth/2, opacity: 0}, {visibility: 'hidden'})
		Velocity([help.stuff,help.backing, help.closebtn], {translateY: -help.stuff.offsetHeight},{duration: 600, visibility: 'hidden'})
		Velocity(help.openbtn, {translateY: 0}, {duration: 300})
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
		text.intransit = true
		stopFinish([text.stuff, text.topline, text.openbtn, text.closebtn, text.partlabel, text.pointlabel])
		Velocity([text.stuff, text.topline, text.openbtn], {translateY: [-text.targetHeight,0]}, {easing: 'easeOutSine'})
		Velocity(text.openbtn, {translateY: '+=2.5rem'},{visibility:'hidden',
		complete: function(){ text.intransit = false; view.navwidth() }})
		Velocity(text.closebtn, {translateY: [-text.targetHeight,0]}, {delay: 300, easing: 'easeOutSine', visibility: 'visible'})
		if(perspective.zoom==="normal"&& text.part.textContent!==''){
			Velocity(text.partlabel, {translateX: [0,text.partlabel.offsetWidth], translateY: [-text.targetHeight, -text.targetHeight], opacity: [1,1] }, {visibility: 'visible', delay: 500, easing: 'easeOutSine', duration: 500})
		}else if(perspective.zoom==="close"&& text.pointtitles[facing].textContent!==''){
			Velocity(text.pointlabel, {translateY: [-text.targetHeight, -text.targetHeight], translateX: [0,text.pointlabel.offsetWidth], opacity: 1}, {visibility: 'visible', delay: 500, easing: 'easeOutSine'})
		}
		text.isOpen = true
	},
	collapsetext: function(){
		text.intransit = true
		stopFinish([text.stuff, text.topline, text.openbtn, text.closebtn, text.partlabel, text.pointlabel])
		Velocity([text.stuff, text.topline], {translateY: 0}, {easing: 'easeInOutSine',
		complete: function(){ text.isOpen = false; view.navwidth()}})
		Velocity(text.closebtn, {translateY: ['2.5rem']}, {easing: 'easeInOutSine',visibility: 'hidden'})
		Velocity(text.openbtn, {translateY: [0,-text.targetHeight/3], scale: [1,0.5]}, {delay: 0, visibility: 'visible', complete: function(){ text.intransit = false }})
		Velocity(text.partlabel, {translateX: '2rem', translateY: '1.5rem'}, {visibility: 'hidden', duration: 400})
		Velocity(text.pointlabel, {translateX: '2rem', translateY: '1.5rem'}, {visibility: 'hidden', duration: 400})
	},
	disabletext: function(){
		stopFinish([text.partlabel, text.pointlabel, text.openbtn, text.closebtn, text.topline, text.stuff, text.bottomline])
		Velocity([text.stuff, text.topline], {translateY: '1.25rem'})
		Velocity(text.bottomline, {translateY: '1.25rem'}, {delay: text.isOpen?350:150, duration: 250})
		Velocity([text.closebtn, text.pointlabel, text.partlabel, text.openbtn], {translateY: '3.5rem', scale: 1})
	},
	enabletext: function(){
		stopFinish([text.partlabel,text.pointlabel,text.openbtn,text.closebtn,text.topline,text.stuff,text.bottomline])
		text.targetHeight = perspective.zoom === 'close'? text.points[facing].offsetHeight : text.part.offsetHeight
		if(text.isOpen){
			Velocity([text.stuff, text.topline, text.closebtn], {translateY: -text.targetHeight},
				{easing: 'easeOutSine', visibility: 'visible'})
			Velocity(text.bottomline, {translateY: 0}, {easing: 'easeOutSine'})
			var labels
			if(perspective.zoom==='close'){
				labels = {open: text.pointlabel, close: text.partlabel, xy: [] }
				labels.xy[0] = 0; labels.xy[1] = -text.targetHeight
				labels.xy[2] = text.partlabel.offsetWidth/2
				labels.xy[3] = -text.targetHeight + text.partlabel.offsetHeight
			}else if(perspective.zoom==='normal'){
				labels = {open: text.partlabel, close: text.pointlabel, xy:[0,-text.targetHeight,'-1rem','1rem'] }
				labels.xy[0] = 0;
				labels.xy[1] = text.points[facing].disabled? [-text.targetHeight, '1.5rem'] : -text.targetHeight
				labels.xy[2] = -text.pointlabel.offsetWidth/2
				labels.xy[3] = -text.targetHeight + text.pointlabel.offsetHeight*2
			}
			Velocity(labels.open, {opacity: 1, translateX: labels.xy[0], translateY: labels.xy[1]},
				{visibility: 'visible', easing: 'easeOutSine'})
			Velocity(labels.close, {opacity: 0, translateX: labels.xy[2], translateY: labels.xy[3]},
				{visibility: 'hidden', easing: 'easeOutSine'})
		}else{
			Velocity([text.stuff, text.topline, text.bottomline, text.openbtn], {translateY: 0, scale: 1})
			Velocity([text.closebtn, text.pointlabel], {translateY: '3.5rem'})
		}
	},
} // end view functions

function heightCalc(){
	var plrmax = 12
	if(data.rangeType !== 'disassociated'){
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
	}else if (data.rangeType === 'disassociated'){
		for(var i = 0; i<4; i++){
			var range = Math.abs(data.pointRanges[i][0]-data.pointRanges[i][1])
			seseme['plr'+i].targetY = Math.abs(data.pointRanges[i][0] - data.pointValues[i]) / range * plrmax
		}
	} // end disassociated codnitional
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

//TWEENS / ANIMATIONS
function move(obj,pos,spd,multiplier,twntype,twninout,callback,delay){
	// console.log('move operation')
	if(obj.moveTween){obj.moveTween.stop()}
	var diffs = [Math.abs(obj.position.x-pos.x), Math.abs(obj.position.y-pos.y), Math.abs(obj.position.z-pos.z)]
	, biggest = diffs.indexOf(Math.max.apply(Math, diffs))
	var start = {x: obj.position.x, y: obj.position.y, z: obj.position.z}
	var dist = multiplier*diffs[biggest]
	var translate = new TWEEN.Tween(start).to(pos,spd+dist)
	.onComplete(function(){if(callback){callback()}})
	.onUpdate(function(){
		obj.position.x = start.x; obj.position.y = start.y; obj.position.z = start.z
	})
	.easing(TWEEN.Easing[twntype][twninout])
	if(delay!==undefined){translate.delay(delay)}
	translate.start()
	obj.moveTween = translate
}
function fade(obj,tgtopacity,spd,delay,callback){
	if(obj.fadeTween){obj.fadeTween.stop()}
	var start = {opacity: obj.material.opacity}
	var transition = new TWEEN.Tween(start).to({opacity: tgtopacity}, spd)
	.onComplete(function(){if(callback)callback(); }).onStop(function(){if(callback)callback();})
	.onUpdate(function(){obj.material.opacity = start.opacity}).delay(delay)
	.easing(TWEEN.Easing.Quadratic.Out).start(); obj.fadeTween = transition
}
function size(obj,tgtscale,spd,callback,delay){
	if(obj.sizeTween){obj.sizeTween.stop()}
	var start = {x: obj.scale.x, y: obj.scale.y, z: obj.scale.z}
	var anim = new TWEEN.Tween(start).to(tgtscale,spd).onComplete(function(){
	if(callback!==undefined){callback()}}).onUpdate(function(){obj.scale.x = start.x
	obj.scale.y= start.y; obj.scale.z = start.z}).easing(TWEEN.Easing.Quadratic.Out)
	if(delay){anim.delay(delay)}else{}
	anim.start()
	obj.sizeTween = anim
}
function rotate(obj,tgtrotation,spd,delay,callback){
	if(obj.rotateTween){obj.rotateTween.stop()}
	var start = {x: obj.rotation.x, y: obj.rotation.y, z: obj.rotation.z}
	obj.rotateTween = new TWEEN.Tween(start).to(tgtrotation,spd).delay(delay).onComplete(
		function(){ if(callback!==undefined){callback()} }).onUpdate(function(){obj.rotation.x = start.x
		obj.rotation.y = start.y; obj.rotation.z = start.z}).easing(TWEEN.Easing.Quadratic.Out)
	.start()
}
function recolor(obj,tgt,spd){
	if(obj.colorTween){obj.colorTween.stop()}
	var start = {r: obj.material.color.r, g: obj.material.color.g, b: obj.material.color.b}
	obj.colorTween = new TWEEN.Tween(start).to({r: tgt.r/255, g: tgt.g/255, b: tgt.b/255},spd).onUpdate(function(){
		obj.material.color.r = start.r; obj.material.color.g = start.g; obj.material.color.b = start.b
	}).easing(TWEEN.Easing.Quadratic.Out).start()
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
function comeBack(tgt, content, xy, del, dur, add){
	var returnopacity = window.getComputedStyle(tgt).opacity
	if(returnopacity > 0){
		tgt.changing = true
		Velocity(tgt, {opacity: 0, translateX: xy?xy[0]:'-=0', translateY: xy?xy[1]:'-=0'}, {delay: del, duration: dur, complete: function(){
			tgt.textContent = Hyphenator.hyphenate(content,'en')
			Velocity(tgt, {opacity: returnopacity, translateX: xy?xy[2]:'-=0', translateY: xy?xy[3]:'-=0'})
			tgt.changing = false
			if(add){ add() }
		}})
	}else tgt.textContent = content
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

//DEBUG, ETC
function debugDisabled(){
	for(var i = 0; i<4; i++){
		text.points[i].disabled = text.points[i].textContent !== ''? false: true
	}
}
