
var $ = document.getElementById.bind(document)
var $$ = document.getElementsByClassName.bind(document)

//DOM mutations for browsing through current data

function showName(tgt){
	var n = info.name[tgt]
	move(n, {y:1, spd:300})

	// fade(n.txt, 1, 300, 0)
	fade(n.txt, {opacity:1, spd: 300})
	// size(n.txt, {x:n.txt.expand.sx, y:n.txt.expand.sy, z:1},300)
	size(n.txt, {x:n.txt.expand.sx, y:n.txt.expand.sy, spd: 300})


	move(n.txt, {y:1, spd:300})

}

function heightCalc(){
	if(data.valueType !== 'disassociated'){
		if(data.values.allSame()){
			console.log('values are all the same')
			var autoset = data.values[0] < 1? 0 : plrmax
			for(var i = 0; i<4; i++){
				seseme['plr'+i].targetY = autoset
			}
			return
		}
		var top = 100, bottom = 0
		if(!data.valueType || data.valueType === "moreIsTall"){
			top = !data.customHi ? Math.max.apply(null, data.values) : data.customHi
			bottom = !data.customLo ? Math.min.apply(null, data.values) : data.customLo
		}else if(data.valueType === 'lessIsTall'){
			top = !data.customHi ? Math.min.apply(null, data.values) : data.customHi
			bottom = !data.customLo ? Math.max.apply(null, data.values) : data.customLo
		}
		var range = Math.abs(bottom-top)
		for(var i = 0; i<4; i++){
			seseme['plr'+i].targetY = Math.abs(bottom-data.values[i])/range * plrmax
		}
	}
	else if (data.valueType === 'disassociated'){
		for(var i = 0; i<4; i++){
			var range = Math.abs(data.pointRanges[i][0]-data.pointRanges[i][1])
			seseme['plr'+i].targetY = Math.abs(data.pointRanges[i][0] - data.values[i]) / range * plrmax
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
function move(obj, options){
	if(obj.moveTween) obj.moveTween.stop()
	var start = {x: obj.position.x, y: obj.position.y, z:obj.position.z}
	var translate = new TWEEN.Tween(start).to({x:options.x, y:options.y, z:options.z}, options.spd?options.spd:400)
	.onUpdate(function(){
		obj.position.x = start.x; obj.position.y = start.y; obj.position.z = start.z
	})
	.easing( options.easing? TWEEN.Easing[options.easing[0]][options.easing[1]]: TWEEN.Easing.Quadratic.Out )
	.delay( options.delay? options.delay: 0 )
	if(options.cb) translate.onComplete(function(){ options.cb(); delete obj.moveTween })
	else translate.onComplete(function(){ delete obj.moveTween })
	translate.start()
	obj.moveTween = translate
}
function yMove(obj,pos,delay,spd,twntype,twninout,cb){ //more efficient move func
	//also doesnt have the stop that seems to befuddle pillar ops
	var start = {y: obj.position.y}
	var translate = new TWEEN.Tween(start).to(pos,spd)
	.onComplete(function(){if(cb){cb()}; delete translate })
	.onUpdate(function(){obj.position.y = start.y})
	.easing(twntype&&twninout?TWEEN.Easing[twntype][twninout]:TWEEN.Easing.Quadratic.Out)
	if(delay){ translate.delay(delay) }
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
function fade(obj,options){
	if(obj.fadeTween){obj.fadeTween.stop()}
	var start = {opacity: obj.material.opacity}
	var transition = new TWEEN.Tween(start).to({opacity: options.opacity}, options.spd?options.spd:400)
	.onUpdate(function(){ obj.material.opacity = start.opacity })
	.delay(options.delay?options.delay:0)
	.easing(options.easing? TWEEN.Easing[options.easing[0]][options.easing[1]] : TWEEN.Easing.Quadratic.Out)
	if(options.cb) transition.onComplete(function(){ options.cb() ; delete obj.fadeTween })
	else transition.onComplete(function(){ delete obj.fadeTween })
	transition.start()
	obj.fadeTween = transition
}
function size(obj,options){
	if(obj.sizeTween){obj.sizeTween.stop()}
	var start = {x: obj.scale.x, y: obj.scale.y, z: obj.scale.z}
	var anim = new TWEEN.Tween(start).to({x:options.x, y: options.y, z:options.z},options.spd?options.spd:400)
	.onUpdate(function(){obj.scale.x = start.x; obj.scale.y=start.y; obj.scale.z=start.z})
	.easing(options.easing?TWEEN.Easing[options.easing[0]][options.easing[1]] : TWEEN.Easing.Quadratic.Out )
	.delay(options.delay?options.delay:0)
	if(options.cb) anim.onComplete(function(){ options.cb(); delete obj.sizeTween })
	else anim.onComplete(function(){ delete obj.sizeTween})
	anim.start()
	obj.sizeTween = anim
}
function rotate(obj,options){
	if(obj.rotateTween){obj.rotateTween.stop()}
	var start = {x: obj.rotation.x, y: obj.rotation.y, z: obj.rotation.z}
	obj.rotateTween = new TWEEN.Tween(start).to({x:options.x, y:options.y, z:options.z},options.spd?options.spd:400)
	.onUpdate(function(){ obj.rotation.x = start.x; obj.rotation.y = start.y; obj.rotation.z = start.z})
	.easing(options.easing?TWEEN.Easing[options.easing[0]][options.easing[1]] : TWEEN.Easing.Quadratic.Out )
	.delay(options.delay?options.delay:0)
	if(options.cb) obj.rotateTween.onComplete(function(){ options.cb(); delete obj.rotateTween })
	else obj.rotateTween.onComplete(function(){ delete obj.rotateTween})
	obj.rotateTween.start()
}

function anim3d(obj, property, options){


	var start = {}, destination = {}, update
	if(property === 'position' || property === 'scale' || property === 'rotation'){ //affecting XYZ
		start = { x: obj[property].x, y: obj[property].y, z:obj[property].z }
		destination = { x: options.x, y: options.y, z: options.z }
		update = function(){ obj[property].x = start.x; obj[property].y = start.y; obj[property].z = start.z }
	}
	else if(property === 'color'){ //affecting RGB
		start = {r: obj.material[property].r, g: obj.material[property].g, b: obj.material[property].b}
		destination = {r: options.r/255, g: options.g/255, b: options.b/255}
		update = function(){ obj.material[property].r = start.r; obj.material[property].g = start.g; obj.material[property].b = start.b }
	}else if(property === 'opacity'){ // affecting opacity
		start[property] = obj.material[property]
		destination[property] = options[property]
		update = function(){ obj.material[property] = start[property] }
	}
	else{ console.log('invalid tween type...'); return}

	if(obj[property+'Tween']) obj[property+Tween].stop()
	obj[property+'Tween'] = new TWEEN.Tween(start).to(destination, options.spd? options.spd: 400)
	.onUpdate(update).easing(options.easing?TWEEN.Easing[options.easing[0]][options.easing[1]]:TWEEN.Easing.Quadratic.Out).delay(options.delay?options.delay:0)
	if(options.cb) obj[property+'Tween'].onComplete(function(){ options.cb(); delete obj[property+'Tween'] })
	else obj[property+'Tween'].onComplete(function(){ delete obj[property+'Tween'] })
	obj[property+'Tween'].start()
}

function recolor(obj,tgt,spd){
	if(obj.colorTween){obj.colorTween.stop()}
	var start = {r: obj.material.color.r, g: obj.material.color.g, b: obj.material.color.b}
	obj.colorTween = new TWEEN.Tween(start).to({r: tgt.r/255, g: tgt.g/255, b: tgt.b/255},spd).onUpdate(function(){
		obj.material.color.r = start.r; obj.material.color.g = start.g; obj.material.color.b = start.b
	}).easing(TWEEN.Easing.Quadratic.Out).onComplete(function(){delete obj.colorTween}).start()
}

//OBJECT CREATION
function Text(words,width,widthmargin,height,color,font,fontSize,fontWeight,align){
	this.cvs = document.createElement('canvas'), this.ctx = this.cvs.getContext('2d')
	this.tex = new THREE.Texture(this.cvs); this.tex.needsUpdate = true
	this.cvs.width = this.ctx.measureText(words).width * width + widthmargin; this.cvs.height = height
	// this.ctx.strokeStyle = '#FF0000', this.ctx.lineWidth=5, this.ctx.strokeRect(0,0,this.cvs.width,this.cvs.height)
	this.ctx.scale(3,3); this.ctx.fillStyle = color; this.ctx.font = 'normal '+fontWeight+' '+fontSize+'pt '+font
	this.ctx.textAlign = align
	if(align==='center') this.ctx.fillText(words,this.cvs.width/6,this.cvs.height/6+fontSize/2.2)
	else if(align==='start') this.ctx.fillText(words,1,this.cvs.height/6+fontSize/2.2)
	else this.ctx.fillText(words,this.cvs.width/3-10,this.cvs.height/6+fontSize/2.2)
}
//turns Text objects into mesh/mat, storing them as attributes in the original obj
function meshify(target){
	var mtl = new THREE.MeshBasicMaterial({transparent: true, opacity: 1, depthWrite:false, map: target.tex})
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
