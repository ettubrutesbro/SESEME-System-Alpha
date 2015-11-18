
var $ = document.getElementById.bind(document)
var $$ = document.getElementsByClassName.bind(document)

var view = {

	next: function(){
		part++
		view.fill()
	},

	enableUI: function(){
		//check if data.info OR if data.pointText[facing] -- if not, just do the
		//nav and help elements
		Velocity($('bottom_ui'), {translateY: [0,$('bottom_ui').offsetHeight]},'easeOutCubic', {duration: 300})
		Velocity($('bottom_line'), {opacity: 1})
	},
	disableUI: function(){
		Velocity($('bottom_ui'),{translateY: $('bottom_ui').offsetHeight}, {duration: 300})
		Velocity($('bottom_line'), {opacity: 0})
	},
	expandnav: function(){
		if(!nav.isOpen){
			nav.isOpen = true
			Velocity(nav, {width: '90%', height: '10rem', backgroundColorAlpha: 0.9})
			Velocity(nav.stuff, {translateX: '.5rem' ,translateY: '2.5rem'})
			Velocity(nav.closebtn, {translateX: 0}, {delay: 300, duration: 300})
			Velocity(nav.navlabel, {translateX: 0}, {delay: 250, duration: 400})
			Velocity(nav.icons, {scale: 1.25})
			Velocity(nav.contents, {translateX: '.5rem', translateY: '-.27rem'})
			Velocity(nav.labels, {opacity: 1})
			Velocity(nav.names, {opacity: 1, translateY: '.9rem', scale: 1.15}, {delay: 75})
			for(var i = 0; i < 3; i++){
				Velocity(nav.items[i], {translateY: i*2.5+'rem'})
			}
		}
	},
	collapsenav: function(){
		nav.isOpen = false
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
			Velocity(nav.items[i], {translateY: i*1.25+'rem'})
		}
		view.navwidth()
		view.navscroll()
	},

	expandhelp: function(){
		Velocity(help, {translateY: 0}, {easing: 'easeOutSine', duration: 650} )
		Velocity(help.stuff, {backgroundColorAlpha: 0.8, translateY: 0}, {delay: 450})
		Velocity(help.backing, {translateY: 0}, {delay: 450})
		Velocity(help.openbtn, {translateY: -help.openbtn.offsetHeight}, {delay: 150, visibility: 'hidden'})
		Velocity(help.line, {height: 0})
		for(var i = 0; i<3; i++){
			Velocity(help.buttons[i], {translateX:0}, {easing: 'easeOutSine', duration: 400, delay: ((Math.abs(2-i))*70) })
			Velocity(help.captions[i], {translateY:0, opacity: 1}, {duration: 500, delay:400+i*70 })

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
			helpfeedback: function(){console.log(this)},

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

	collapsehelp: function(){
		Velocity(help, {translateY: -help.stuff.offsetHeight}, {easing: 'easeInOutSine', duration: 600} )
		Velocity(help.stuff, {backgroundColorAlpha: 1, translateY: '-1.3rem'})
		Velocity(help.backing, {translateY: '-1.3rem'})
		Velocity(help.openbtn, {translateY: 0}, {duration: 300, visibility: 'visible'})
		Velocity(help.line, {height: '.25rem'})
		for(var i = 0; i<3; i++){
			Velocity(help.buttons[i], {translateX:'150%'}, {duration: 300+(i*75), delay: 50+i*100})
			Velocity(help.captions[i], {translateY:'-50%',opacity:0}, {duration: 200})
		}
	},

	expandtext: function(){
		Velocity(text, {translateY: [-text.targetHeight,0]}, {easing: 'easeOutSine'})
		Velocity(text.openbtn, {translateY: ['3rem',0]}, {delay: 300})
		Velocity(text.closebtn, {translateY: ['-4rem',0]}, {delay: 300, easing: 'easeOutSine'})
		if(perspective.zoom==="normal"){
			Velocity(text.partlabel, {translateX: 0, translateY: 0, opacity: 1}, {visibility: 'visible', delay: 400})
		}else if(perspective.zoom==="close"){
			Velocity(text.pointlabel, {translateY: 0, translateX: 0, opacity: 1}, {visibility: 'visible', delay: 400})
		}
		text.isOpen = true
		//nav manipulation:
		if(!nav.isOpen){ //nav closed? show names
			for(var i = 0; i<3; i++){
				Velocity(nav.names[i], {opacity: 0})
				Velocity(nav.labels[i], {opacity: 1})
			}
			view.navwidth()
		}
	},
	collapsetext: function(){
		Velocity(text, {translateY: 0})
		Velocity(text.openbtn, {translateY: 0})
		Velocity(text.closebtn, {translateY: 0})
		Velocity(text.partlabel, {translateY: '1.25rem'})
		Velocity(text.pointlabel, {translateY: '1.25rem'})
		text.isOpen = false
		//nav manipulation:
		if(!nav.isOpen){
			for(var i = 0; i<3; i++){
				Velocity(nav.names[i], {opacity: 1})
				Velocity(nav.labels[i], {opacity: 0})
			}
			view.navwidth()
		}
	},

	story: function(){

	},

	part: function(){
		console.log('text shows chapter text')

		Velocity(text.part, {opacity: 1}, {visibility: 'visible'})
		Velocity(text.points[facing], {opacity: 0, translateY: '3rem'}, {visibility: 'hidden'})
		text.targetHeight = text.part.offsetHeight
		if(text.isOpen){
			Velocity(text, {translateY: -text.targetHeight})
			Velocity(text.partlabel, {translateX: 0, translateY: 0, opacity: 1}, {visibility: 'visible'})
			Velocity(text.pointlabel, {translateY: '1.5rem', translateX: '-1.25rem'}, {duration: 350, visibility: 'hidden'})
		}
	},
	point: function(){
		console.log('text shows data point')

		Velocity(text.part, {opacity: 0},{visibility: 'hidden'})
		Velocity(text.points[facing], {opacity: 1, translateY: [0,'3rem']},{visibility: 'visible'})
		text.targetHeight = text.points[facing].offsetHeight
		if(text.isOpen){
			Velocity(text, {translateY: -text.targetHeight})
			Velocity(text.partlabel, {translateX: text.partlabel.offsetWidth, opacity: 0.75}, {visibility: 'hidden'})
			Velocity(text.pointlabel, {translateY: 0, translateX: 0, opacity: 1}, {duration: 350, visibility: 'visible'})
		}

	},
	cyclePoints: function(show){
		if(perspective.zoom === 'close'){ //user is zoomed in, so text = point

			text.targetHeight = text.points[show].offsetHeight

			if(text.isOpen){
				Velocity(text.pointlabel, {width: text.pointtitles[show].offsetWidth})
				Velocity(text, {translateY: -text.targetHeight})
				// if((show===0&&facing===3) || ((show > facing)&&(show!==3&&facing!==0))){
				if(show===facing+1 || show===facing-3 ){
					Velocity(text.points[facing], {opacity: 0, translateX: ['-3rem',0], translateY: 0}, {duration: 400, easing: 'easeInSine', visibility: 'hidden'})
					Velocity(text.points[show], {opacity: 1, translateX: [0,'3rem'], translateY: 0}, {duration: 600, easing: 'easeOutSine', visibility: 'visible'})
					Velocity(text.pointtitles[facing], {opacity: 0, translateY: ['1.5rem',0], translateX: ['-1.5rem',0]}, {visibility: 'hidden'})
					Velocity(text.pointtitles[show], {opacity: 1, translateY:[0,0], translateX: [0,'3rem']}, {visibility: 'visible'})
				}else{
					Velocity(text.points[facing], {opacity: 0, translateX: ['3rem',0], translateY: 0}, {duration: 400, easing: 'easeInSine', visibility: 'hidden'})
					Velocity(text.points[show], {opacity: 1, translateX: [0,'-3rem'], translateY: 0}, {duration: 600, easing: 'easeOutSine', visibility: 'visible'})
					Velocity(text.pointtitles[facing], {opacity: 0, translateY: [0,0], translateX: ['3rem',0]}, {visibility: 'hidden'})
					Velocity(text.pointtitles[show], {opacity: 1, translateY: [0, '1.5rem'], translateX: [0,'-1.5rem']}, {visibility: 'visible'})
				} //end of text.isOpen check
			}else{ //zoomed in, but text field is collapsed (invisible anim here)
				Velocity(nav, {width: nav.points[show].offsetWidth + nav.iconwidth })
				Velocity(text.points[facing], {opacity: 0}, {duration: 0, visibility: 'hidden'})
				Velocity(text.points[show], {opacity: 1, translateX: 0, translateY: 0}, {duration: 0, visibility: 'visible'})
				Velocity(text.pointtitles[show], {opacity: 1, translateX: 0, translateY: 0}, {duration: 0, visibility: 'visible'})
				Velocity(text.pointtitles[facing], {opacity: 0}, {duration: 0, visibility: 'hidden'})
				text.pointlabel.style.width = text.pointtitles[show].offsetWidth
			}
		}else if(perspective.zoom !== 'close'){ //not zoomed in; text = part
			console.log('rewidth')

			Velocity(text.points[show], {translateX: 0}, {duration: 0, visibility: 'visible'})
			Velocity(text.pointtitles[facing], {opacity: 0}, {duration:0, visibility: 'hidden'})
			Velocity(text.pointtitles[show], {opacity: 1, translateY:0, translateX:0}, {duration:0, visibility: 'visible'})
			text.pointlabel.style.width = text.pointtitles[show].offsetWidth
		}

		//for NAV points
		Velocity(nav.points[facing], {opacity: 0})
		Velocity(nav.points[show], {opacity: 1})

	},
	outline: function(which, opacity, dur){
		fade(seseme['plr'+which].outline,opacity,dur,0)
		fade(seseme['plr'+which].outcap,opacity,dur,0)
	},

	navscroll: function(){
		if(!nav.isOpen){ //translateY
			var zoomlevel = perspective.zoom==='normal'? 1: perspective.zoom==='close'? 2: 0
			var rem = 1.25 //hopefully there's a better way to implement this
			Velocity(nav.stuff, {translateY: -zoomlevel * rem + 'rem'})
		}else{ //highlighting

		}

	},

	navwidth: function(){
		if(perspective.zoom === 'normal'){
			nav.targetWidth = !text.isOpen? nav.names[1].offsetWidth : nav.labels[1].offsetWidth
		}else if(perspective.zoom === 'close'){
			nav.targetWidth = !text.isOpen? nav.points[facing].offsetWidth : nav.labels[2].offsetWidth
		}else if(perspective.zoom === 'far'){
			nav.targetWidth = !text.isOpen? nav.names[0].offsetWidth : nav.labels[0].offsetWidth
		}
		nav.targetWidth += nav.iconwidth
		if(!nav.isOpen){
			Velocity(nav, {width: nav.targetWidth}, {queue: false})
		}
	}

}

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
	.onComplete(function(){if(callback!==undefined){callback()}})
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

function Text(words,width,widthmargin,height,color,font,fontSize,fontWeight,align){ //'400 36pt Source Serif Pro'
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

function meshify(target){ //takes Text objects and turns them into mesh/mat, storing them as attributes in the original obj
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



// function showSprites()
// function hideSprites()
//
// function showPreview(i)
// function hidePreview(i)
