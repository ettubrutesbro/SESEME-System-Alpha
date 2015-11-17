
var $ = document.querySelector.bind(document)
var $$ = document.querySelectorAll.bind(document)

var view = {
	enableUI: function(){
		Velocity($('#bottom_ui'), {translateY: [0,$('#bottom_ui').offsetHeight]},'easeOutCubic', {duration: 300})
		setTimeout(nav.scroll,125)
	},
	disableUI: function(){
		Velocity($('#bottom_ui'),{translateY: $('#bottom_ui').offsetHeight}, {duration: 300})
	},
	expandnav: function(){
		nav.isOpen = true
		Velocity(nav.stuff, {translateY: 0, translateX: 0})
		Velocity(nav, {width: $('#all_ui').offsetWidth*.9, height: '4.1rem'}, {duration: 350}, 'easeInSine')
		Velocity(nav.closebtn, {translateX: [0, '-2.25rem']}, {delay: 100, duration: 250}, 'easeInCubic')
		for(var i =0; i<3; i++){ //show both labels / names, expand icon
			Velocity(nav.icons[i], {scale: 1.5})
			Velocity(nav.contents[i], {height: '2rem'})
			// Velocity(nav.labels[i], {height: nav.labels[i].height, opacity: 1})
			// Velocity(nav.names[i], {height: nav.names[i].height, opacity: 1})
		}

	},
	collapsenav: function(){
		nav.isOpen = false
		Velocity(nav.closebtn, {translateX: '-2.25rem'})
		if(text.isOpen){
			for(var i =0; i<3; i++){
				// Velocity(nav.labels[i], {width:0, opacity: 0})
				Velocity(nav.icons[i], {scale: 1})
			}
		}else{
			for(var i=0;i<3;i++){
				// Velocity(nav.names[i],{width:0,opacity:0})
				Velocity(nav.icons[i], {scale: 1})
			}
		}
		nav.scroll()
	},
	expandtext: function(){
		Velocity(text, {translateY: [-text.targetHeight,0]})
		Velocity(text.openbtn, {translateY: ['4rem',0]})
		Velocity(text.closebtn, {translateY: ['-4rem',0]})
		text.isOpen = true
		//nav manipulation:
		if(!nav.isOpen){ //nav closed? show names
			for(var i = 0; i<3; i++){
				Velocity(nav.labels[i], {opacity: 0, height: 0})
				Velocity(nav.names[i], {opacity: 1, height: nav.names[i].height, width: nav.names[i].width})
				var zoomlevel = perspective.zoom === 'normal'? 1: perspective.zoom === 'close'? 2: 0
				nav.rewidth(zoomlevel)
			}
		}
	},
	collapsetext: function(){
		Velocity(text, {translateY: 0})
		Velocity(text.openbtn, {translateY: 0})
		Velocity(text.closebtn, {translateY: 0})
		text.isOpen = false
		//nav manipulation:
		if(!nav.isOpen){
			for(var i = 0; i<3; i++){
				Velocity(nav.names[i], {opacity: 0, height: 0}, {duration: 350})
				Velocity(nav.labels[i],{height: nav.labels[i].height, opacity: 1}, {delay: 150,duration: 350})
				var zoomlevel = perspective.zoom === 'normal'? 1: perspective.zoom === 'close'? 2: 0
				nav.rewidth(zoomlevel)
			}
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
		}
	},
	point: function(){
		console.log('text shows data point')

		Velocity(text.part, {opacity: 0},{visibility: 'hidden'})
		Velocity(text.points[facing], {opacity: 1, translateY: [0,'3rem']},{visibility: 'visible'})
		text.targetHeight = text.points[facing].offsetHeight

		if(text.isOpen){
			Velocity(text, {translateY: -text.targetHeight})
		}

	},
	cyclePoints: function(show){
		if(perspective.zoom === 'close'){ //user is zoomed in, so text = point
			text.targetHeight = text.points[show].offsetHeight
			if(text.isOpen){
				Velocity(text, {translateY: -text.targetHeight})
				if((show===0&&facing===3) || ((show > facing)&&(show!==3&&facing!==0))){
					Velocity(text.points[facing], {opacity: 0, translateX: ['-3rem',0], translateY: 0}, {visibility: 'hidden'})
					Velocity(text.points[show], {opacity: 1, translateX: [0,'3rem'], translateY: 0}, {visibility: 'visible'})
				}else{
					Velocity(text.points[facing], {opacity: 0, translateX: ['3rem',0], translateY: 0}, {visibility: 'hidden'})
					Velocity(text.points[show], {opacity: 1, translateX: [0,'-3rem'], translateY: 0}, {visibility: 'visible'})
				} //end of text.isOpen check
			}else{ //zoomed in, but text field is collapsed (invisible anim here)
				Velocity(text.points[facing], {opacity: 0, translateX: 0, translateY: 0}, {duration: 0, visibility: 'hidden'})
				Velocity(text.points[show], {opacity: 1, translateX: 0, translateY: 0}, {duration: 0, visibility: 'visible'})
			}
		}else if(perspective.zoom !== 'close'){ //not zoomed in
			Velocity(text.points[show], {translateX: 0}, {duration: 0, visibility: 'visible'})
			Velocity($$('.name span')[show], {translateX: 0}, {duration: 0})
		}
		//for NAV points
		nav.names[2].width = $$('.name span')[show].offsetWidth
		console.log(nav.names[2].width)

		if(nav.isOpen || perspective.zoom === 'close'){
			if(show===0&&facing===3 || show > facing){
				Velocity($$('.name span')[facing], {opacity: 0, translateX: ['-3rem',0]})
				Velocity($$('.name span')[show], {opacity: 1, translateX: [0,'3rem']})
			}else{
				Velocity($$('.name span')[facing], {opacity: 0, translateX: ['3rem',0]})
				Velocity($$('.name span')[show], {opacity: 1, translateX: [0,'-3rem']})
			}//end directional checks
		}

		if(!nav.isOpen){
			if(perspective.zoom==='close'){ nav.rewidth(2) }else{
				Velocity($$('.name span')[facing],{opacity: 0}, {duration:0})
				Velocity($$('.name span')[show],{opacity:1, translateX:0},{duration:0})
			}
		}
	},
	outline: function(which, opacity, dur){
		fade(seseme['plr'+which].outline,opacity,dur,0)
		fade(seseme['plr'+which].outcap,opacity,dur,0)
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
