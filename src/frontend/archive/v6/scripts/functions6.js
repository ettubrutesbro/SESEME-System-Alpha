
//extensions and shortcuts
var $ = document.getElementById.bind(document)
var $$ = document.getElementsByClassName.bind(document)
Array.prototype.allSame = function(){
	for(var i = 0; i<this.length; i++){
		if(this[i] !== this[0]) return false
	}
	return true
}
Array.prototype.min = function( ){
	return Math.min.apply( Math, this )
}
Array.prototype.equals = function (array) {
    if (!array)
        return false;
    if (this.length != array.length)
        return false;
    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            if (!this[i].equals(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            return false;
        }
    }
    return true;
}
THREE.Object3D.prototype.fadeOut = function(delay){
	var obj = this
	anim3d(this, 'opacity', {opacity: 0, delay: delay?delay:0, cb: function(){ obj.visible = false }})
}
THREE.Object3D.prototype.fadeIn = function(delay){
	this.visible = true
	anim3d(this, 'opacity', {opacity: 1, delay: delay?delay:0 })
}

//check function sets states when 'controls' update
function check(){
	const height = degs(camera.rotation.x)>thresholds.height[0]?'elevation': degs(camera.rotation.x)<thresholds.height[1]?'plan':'isometric';
	const zoom = camera.zoom>thresholds.zoom[1]? 'close' : camera.zoom<thresholds.zoom[0]? 'far' : 'normal'
	const addzoom = camera.zoom - 1
	// controls.zoomSpeed = 0.7-(Math.abs(camera.zoom-1)/3)
	controls.zoomSpeed = 0.7-(Math.abs(camera.zoom-1)/3)
	controls.rotateSpeed = 0.1 - (Math.abs(camera.zoom-1)/20)
	lights.rotation.set(-camera.rotation.x/2, camera.rotation.y + rads(45), -camera.rotation.z/2)

	// rotation change block
	info.orbiter.rotation.y = camera.rotation.y
	facingRotations.some(function(ele,i){
		if(Math.abs(degs(camera.rotation.y)-ele)<45){
			if(facing!==i){
				if(camera.zoom>1){
					view.zoomswitch = true
					var switchdist = Math.abs(seseme['plr'+facing].targetY - seseme['plr'+i].targetY) * 50
					anim3d(scene, 'position', {y: -(seseme['plr'+i].targetY)*(addzoom/1.5)-(addzoom*3),
					spd: 300+switchdist, easing: ['Quadratic', 'InOut'], cb: function(){ view.zoomswitch = false }})
				}
				if(((i>facing) || (i===0 && facing===3)) && !(i===3 && facing===0)) view.cycleDirection = true
				else view.cycleDirection = false
				facing = i
				setView()
			}
		return true }
	})
	//zoom change
	if(view.zoom!==zoom){
		if((zoom==='close') || (zoom==='normal' && view.zoom==='far')) view.zoomDirection = true
		else if((zoom === 'far') || (zoom === 'normal' && view.zoom === 'close')) view.zoomDirection = false
		view.zoom = zoom
		setView()
		return
	}
	// height change
	if(view.height!==height){
		view.height = height
		setView(false, true)
	}
	//zoom offseting -obj scaling and scene position
	if(camera.zoom > 1){
		info.btn.scale.set(1-(addzoom/3.5),1-(addzoom/3.5),1-(addzoom/3.5))
		if(!view.zoomswitch) scene.position.y = -(seseme['plr'+facing].targetY)*(addzoom/1.5)-(addzoom*3)
	}
	if(init) init = false
}//end 'check'
//package function uses states to set displayed objects
function setView(button,height){
	console.log('set view')
	viewTitleblock()
	viewMainButton()
	viewPillarOutlines()
	viewPillarNames()
	viewNavigationHelper()
	viewLRArrows()
	camHeight()
	viewColors()
	if(view.height==='plan') viewHelp()
	if(!button && !height) shiftNavBars()
	else if(height && view.height!=='plan') {viewHelp(); return}
	viewInfoText()
}
//constituent functions determine obj states
function viewPillarOutlines(){
	if(view.zoom === 'far' || view.height ==='plan'){ //none
		for(var i = 0; i<4; i++) {highlight(i, 0, 300)}
	}
	else if(view.zoom==='normal'){ //all
		for(var i = 0; i<4; i++) {highlight(i, 1, 300)}
	}
	else if(view.zoom==='close'){ //one
		for(var i = 0; i<4; i++){ if(i!==facing) highlight(i, 0, 300)}
		highlight(facing,1,300)
	}
	function highlight(which, opacity, dur, delay){
		anim3d(seseme['plr'+which].outline, 'opacity', { 'opacity': opacity, spd: dur, delay: delay})
		anim3d(seseme['plr'+which].outcap, 'opacity', { 'opacity': opacity, spd: dur, delay: delay})
	}
}
function viewPillarNames(){
	if(view.zoom === 'far' || view.zoom === 'close' || view.height==='plan'){ //all disappear
		for(var i = 0; i<4; i++){
			showName(i, false)
			anim3d(info.name[i].line, 'scale', {y:0.001})
			anim3d(info.name[i].line, 'opacity', {opacity:0})
			anim3d(info.name[i].pointer, 'position', {y: info.name[i].pointer.elevHt})
			anim3d(info.name[i].pointer, 'opacity', {opacity: 0})
		}
	}
	else if(view.height === 'isometric'){ //1 at a time, fixed height
		for(var i = 0; i<4; i++){
			if(i!==facing){ //hide others (and set their positions in CB?)
				showName(i, false)
				anim3d(info.name[i].line, 'scale', {y:0.001})
				anim3d(info.name[i].line, 'opacity', {opacity:0})
				anim3d(info.name[i].pointer, 'position', {y: info.name[i].pointer.elevHt})
				anim3d(info.name[i].pointer, 'opacity', {opacity: 0})
			}
		}
		showName(facing, true)
		anim3d(info.name[facing], 'position', {y: info.name[facing].isoHt})
		anim3d(info.name[facing].pointer, 'position', {y:info.name[facing].pointer.isoHt, delay:100})
		anim3d(info.name[facing].pointer, 'opacity', {opacity: 1})
		anim3d(info.name[facing].line, 'opacity', {opacity: 1})
		anim3d(info.name[facing].line, 'scale', {y:1, delay:100})
	}
	else if(view.height === 'elevation'){ //all 4, relative heights
		for(var i = 0; i<4; i++){
			showName(i, true)
			anim3d(info.name[i], 'position', {y: info.name[i].elevHt})
			anim3d(info.name[i].pointer, 'opacity', {opacity: 1})
			anim3d(info.name[i].line, 'opacity', {opacity: 0})
			anim3d(info.name[i].pointer, 'position', {y: info.name[i].pointer.elevHt})
			anim3d(info.name[i].line, 'scale', {y: 0.001})
		}
	}
	function showName(tgt, on){
		var n = info.name[tgt], ite = 0
		var n = info.name[tgt], ite = 0
		n.txt.traverse(function(child){
			if(child.material) anim3d(child, 'opacity', {opacity: on?1:0, delay: on?50*ite:0})
			if(child.expand) anim3d(child, 'position', {y:on?child.expand:child.origin, delay: on?50*ite:0})
			ite++
		})
	}
} // end viewNames
function viewTitleblock(){
	var on = view.text || view.zoom === 'close' || view.zoom === 'far' ? false: true
	if(view.height==='isometric'){
		anim3d(info.orbiter, 'position', {y: 0})
		anim3d(info.titleblock, 'rotation', {x: Math.atan( - 1 / Math.sqrt( 2 )) })
		anim3d(info.titleblock, 'position', {y: info.titleblock.isoHt})
	}
	else if(view.height==='elevation'){
		anim3d(info.orbiter, 'position', {y: -2.5})
		anim3d(info.titleblock, 'rotation', {x: 0, delay: 100})
		anim3d(info.titleblock, 'position', {y: 2.5})
	}
	else if(view.height==='plan'){
		on = false
	}
	var ite = 0
	info.titleblock.traverse(function(child){
		if(child.material){
			if(on) child.fadeIn(ite*100); else child.fadeOut((info.titleblock.children.length-ite)*50)
			anim3d(child, 'position', {y: on?child.expand:child.origin,
				delay:on?ite*100:(info.titleblock.children.length-ite)*50})
			ite++
		}
	})
} //end showBlock
function viewMainButton(){
	//fade in or out?
	if((view.height==='plan')||(view.text && view.zoom === 'close')
	|| (!view.text && view.zoom === 'close' && !dom['detail'+facing].textContent)
	|| (view.zoom === 'normal' && !data.text) || (view.zoom===''&&!data.text) ){
		//text open and viewing close, or viewing from far, or viewing content-less detail
		if(info.btn.visible){
			info.btn.traverse(function(child){ child.fadeOut() })
			anim3d(info.btn, 'rotation', {x: rads(-75), spd: 500})
		}
	}
	else { //fade in, as normal....
		info.btn.traverse(function(child){ child.fadeIn() })
		if(view.height === 'isometric') anim3d(info.btn, 'rotation', {x: Math.atan(-1/Math.sqrt(2)), delay: 100})
		else if(view.height === 'elevation') anim3d(info.btn, 'rotation', {x: 0})
	}
	//Y destination?
	var destination
	if(!view.text){
		if(view.zoom==='normal'){
			destination = -info.titleblock.ht; anim3d(info.btn, 'scale', {x:1,y:1,z:1})
			anim3d(info.btn.icon, 'sprite', {dest:info.btn.icon.eye,frames:info.btn.frames,spd:700})
		}
		else if(view.zoom==='close') {
			destination = seseme['plr'+facing].targetY;
			anim3d(info.btn.icon, 'sprite', {dest:info.btn.icon.mag,frames:info.btn.frames,spd:700})
		}
		else if(view.zoom==='far') {
			destination = -25; anim3d(info.btn, 'scale', {x:2,y:2,z:2})
			anim3d(info.btn.icon, 'sprite', {dest:info.btn.icon.book, frames:info.btn.frames , spd:700 })
		}
	}
	else if(view.text){
		if(view.zoom==='normal'){
			destination = 0; anim3d(info.btn.icon, 'sprite', {dest:36,frames: 37,spd:700})
			anim3d(info.btn, 'scale', {x:1,y:1,z:1})
		}
		else if(view.zoom==='close'){ destination = seseme['plr'+facing].targetY + 2.5 }
		else if(view.zoom==='far') {
			destination = 0; anim3d(info.btn, 'scale', {x:2,y:2,z:2})
			anim3d(info.btn.icon, 'sprite', {dest:18, frames:37 , spd:700 })
		}
	}
	var btnspd = 350+(Math.abs(info.btn.position.y - destination) * 35)
	anim3d(info.btn, 'position', {y: destination, spd: btnspd })
} // end viewMainButton
function viewInfoText(){
	if(view.text){
		if(view.height === 'plan') view.text = false
		// if(view.height === 'plan') { }
		else if(view.zoom==='normal'){
			if(view.content==='maintext') return //already
			callText(dom.maintext)
		 }
		else if(view.zoom === 'close'){
			// console.log('get detail #' + facing+ ' text')
			callText(dom['detail'+facing])
		}
		else if(view.zoom === 'far') {
			if(view.content==='overtext') return
			callText(dom.overtext)
		}
	}

	if(!view.text){
		if(view.content === '') return
		console.log('hide text')
		Velocity([dom.bottom, dom.closebutton, dom[view.content]], 'stop')
		if(view.content){ //hide old text (if applicable), translate
			Velocity(dom[view.content], {opacity: 0}, {visibility: 'hidden'})
		}
		Velocity(dom.bottom, {translateY: 0, backgroundColorAlpha: 0.35}, {delay: 50, duration: 350, visibility: 'hidden',
		complete: function(){ dom.bottomwrapper.style.height = 0 }})
		dom.closebutton.hide()
		// Velocity(dom.closebutton, {translateX: '100%'}, {duration: 250, visibility: 'hidden'})
		Velocity(dom.rule, {translateY: '100%'})
		view.content = ''
	}
	function callText(targettext){
		var newheight = 0, bottomspd, feedX = 0, feedY = 0,
		heightcb = function(){ console.log('height anim finished') }, wrapperwait = false

		if(view.content){ //hide old text (if applicable), translate
			var animOld = {opacity: 0}
			if(view.zoom === 'close'){ // REQUEST DETAIL TEXT
				if(view.content==='maintext') { //zoomed in
					animOld.translateY = '-25%'
					feedY = '50%'
				}
				else if(view.content.indexOf('detail')>-1){ //scrolled sideways
					if(view.cycleDirection) { animOld.translateX = '-2.5rem'; feedX = '2rem' }
					else {animOld.translateX = '2.5rem'; feedX = '-2rem' }
				}
			}
			else if(view.zoom === 'normal'){ // REQUEST MAIN TEXT
				if(view.content.indexOf('detail')>-1) { //zoomed out from detail
					animOld.translateY = '50%'; feedY = '-50%'
				}
				else if(view.content === 'overtext'){//zoomed in from over
					animOld.translateY = '-25%'; feedY: '50%'
				}
			}
			else if(view.zoom === 'far'){ // REQUEST OVER TEXT
				if(view.content === 'maintext'){ //zoomed out from main
					animOld.translateY = '25%'; feedY = '-50%'
				}
			}
			Velocity(dom[view.content], animOld, {duration: 300, visibility: 'hidden'})
			newheight = targettext.offsetHeight
			if(newheight > dom[view.content].offsetHeight) wrapperwait = false
			else wrapperwait = true
			heightcb = function(){ dom.bottomwrapper.style.height = newheight }
		}//end check for / collapsing of old text-

		view.content = targettext.id

		//if calling text-less content, 'semi-hide':
		if(view.zoom === 'close' && !dom['detail'+facing].textContent){
			dom.closebutton.hide()
			heightcb = function(){ dom.bottomwrapper.style.height = 0 }
			wrapperwait = true
		}
		//normal operation:
		else{
			if(!wrapperwait){
				newheight = targettext.offsetHeight
				dom.bottomwrapper.style.height = newheight
			}
			dom.closebutton.show()
		}

		//is newheight greater than oldheight?
		//there's only an oldheight if the first condition (pre existing view content) is met, do the camprison there
		//

		Velocity(targettext, {opacity: 1, translateX: [0, feedX], translateY: [0, feedY]},
			{duration: 500, delay: 100, visibility: 'visible'})
		Velocity(dom.bottom, {translateX: [0,0], translateY: -newheight, backgroundColorAlpha: 0.91}, {duration: 275+ newheight ,
			visibility: 'visible', complete: heightcb })
		// dom.closebutton.show()
		// Velocity(dom.closebutton, {translateX: 0}, {duration: 250, delay: 100, visibility: 'visible'})
		Velocity(dom.rule, {translateY: 0})
	}
}
function viewNavigationHelper(){
	if(view.zoom==='normal') showSection(2)
	else if(view.zoom==='close') {showSection(3); showNavName()}
	else if(view.zoom==='far' && view.height !== 'plan') showSection(1)
	else if(view.zoom==='far' && view.height==='plan') showSection(0)

	function showNavName(){
		var animOut = {opacity: 0}, animIn = {opacity: 1}
		if(view.cycleDirection) {animOut.translateX = '-2.5rem'; animIn.translateX = [0, '3.5rem']}
		else {animOut.translateX = '2.5rem'; animIn.translateX = [0, '-3.5rem']}
		for(var i = 0; i<4; i++){
			if(i!==facing) { if(dom.navnames[i].style.opacity!=='0') Velocity(dom.navnames[i], animOut)}
			else if(dom.navnames[i].style.opacity!=='1') Velocity(dom.navnames[i], animIn)
		}
	}
	function showSection(which, temp){
		var animOut = {opacity: 0} , animIn = {opacity: 1}
		if(view.zoomDirection) {
			animOut.translateY = '-3.5rem'; animOut.translateX = '4rem'
			animIn.translateX = [0, '-4rem']; animIn.translateY = [0,'3.5rem']
		}
		else {
			animOut.translateY = '3.5rem'; animOut.translateX = '-4rem'
			animIn.translateX = [0,'4rem']; animIn.translateY = [0, '-3.5rem']
		}
		for(var i = 0; i<4; i++){
			(function(){
				if(i!==which){
					Velocity([dom.navitems[i], dom.navspans[i]], 'stop')
					if(dom.navitems[i].style.opacity!=='0') Velocity(dom.navitems[i], animOut, {delay: 200, visibility: 'hidden' })
					if(dom.navspans[i].style.opacity!=='0')Velocity(dom.navspans[i], {opacity:0, translateX: ['-3rem',0]},
						{duration: 300, visibility: 'hidden'})
				}
				else{
					if(dom.navitems[i].style.opacity==='1') return
					else Velocity([dom.navitems[i], dom.navspans[i]], 'stop')
					Velocity(dom.navitems[i], animIn, {delay: 200, duration:375, visibility: 'visible'})
					Velocity(dom.navspans[i], {opacity:1, translateX: [0,'-3rem']}, {duration: 550, delay:600,visibility: 'visible'})
				}
			})()
		}
		if(which<3 && view.height !=='plan'){
			Velocity(dom.navspans[which], {opacity:0, translateX: '-5rem'}, {delay:4000,visibility: 'hidden',complete:function(){
				console.log('delay fadeout callback')
				Velocity(dom.navspans[which], 'stop', true)
			}})
		}
		else if(which<3 && view.height==='plan'){
			Velocity(dom.navspans[which], 'stop', true)
			if(dom.navspans[which].style.opacity!=='1'){
				Velocity(dom.navspans[which], {opacity: 1, translateX: 0, translateY: 0}, {visibility: 'visible'})
			}
		}
	}
}
function shiftNavBars(){
	var others = [0,1,2,3], navdir, emerger, oldFacing
	others.splice(others.indexOf(facing),1)
	if(view.cycleDirection){ //right
		oldFacing = facing>0? facing-1 : 3
		emerger = facing < 3? facing+1 : 0
		navdir = [0,'200%','300%','-100%']
	}
	else if(!view.cycleDirection){ //left
		oldFacing = facing<3? facing+1 : 0
		emerger = facing>0? facing-1 : 3
		navdir = ['200%',0,'-100%','300%']
	}
	others.splice(others.indexOf(oldFacing),1)
	others.splice(others.indexOf(emerger),1)
	Velocity(dom.databars, 'stop')
	Velocity(dom.databars[facing], {translateX: '100%'})
	Velocity(dom.databars[oldFacing], {translateX: navdir[0]})
	Velocity(dom.databars[emerger], {translateX: [navdir[1],navdir[2]]})
	Velocity(dom.databars[others[0]], {translateX: navdir[3]})
}
function viewLRArrows(){
	Velocity([dom.leftarrow, dom.rightarrow], 'stop')
	if(view.zoom === 'close' && view.height !== 'plan'){ //show
		if(dom.leftarrow.style.opacity!=='0.75' || dom.rightarrow.style.opacity!=='0.75'){
			Velocity(dom.leftarrow, {opacity: .75, translateX: 0, scale: 1}, {visibility: 'visible'})
			Velocity(dom.rightarrow, {opacity: .75, translateX: 0, scale: 1}, {visibility: 'visible'})
		}
	}
	else{ //hide
		Velocity(dom.leftarrow, {opacity: 0, translateX: '500%', scale: 0.3}, {visibility: 'hidden'})
		Velocity(dom.rightarrow, {opacity: 0, translateX: '-500%', scale: 0.3}, {visibility: 'hidden'})
	}
}
function viewColors(){
	if(data.color instanceof Array){ //arrayed colors
		var rgb = hexToRgb(data.color[facing])
		Velocity(dom.bottom, {backgroundColor: data.color[facing]})
		anim3d(info.btn.color, 'color',{r:rgb.r, g:rgb.g, b:rgb.b})
	}
}
function viewHelp(){
	//base 'shallow' help shows 4 buttons
	if((view.height === 'plan' && view.zoom === 'far') && ((view.helpContent === '')||( view.helpContent==='back'))){
		dom.help.className = 'open'
		if(view.helpContent==='back') for(var i = 0; i<4; i++){contentTraversal(info.help.children[i], false)}
		for(var i = 0; i<4; i++){
			var section = info.help.children[i]
			anim3d(section.btn, 'position', section.btn.expand)
			section.btn.visible = section.btn.icon.visible = true
			anim3d(section.btn, 'opacity', {opacity: 1, delay: i*20})
			anim3d(section.btn.icon, 'opacity', {opacity: 1, delay: i*20})
			anim3d(section.btn, 'scale', {x:1,y:1})
		}
	}
	//making a selection within view calls content and hides other buttons
	else if(view.height === 'plan' && view.zoom === 'far'){
		for(var i = 0; i<4; i++){
			if(info.help.children[i].name !== view.helpContent){
				info.help.children[i].btn.fadeOut() // anim3d(info.help.children[i].btn, 'opacity', {opacity:0})
				anim3d(info.help.children[i].btn, 'position', {x:0,z:0})
				contentTraversal(info.help.children[i], false)
			}
		}
		anim3d(info.help[view.helpContent].btn, 'scale', {x: 1.25, y:1.25, z: 1.25})
		contentTraversal(info.help[view.helpContent], true)
		view.helpSelection = view.helpContent
	}
	else if(view.height!=='plan' || view.zoom !== 'far'){
		dom.help.className = 'close'
		if(view.height==='elevation') return //FOH
		if(view.helpContent !== '' && view.helpContent !== 'back'){
			contentTraversal(info.help[view.helpContent], false)
		}
		view.helpContent = ''
		for(var i = 0; i<4; i++){
			var section = info.help.children[i]
			anim3d(section.btn, 'position', {x: 0, z:0})
			section.btn.fadeOut() // anim3d(section.btn, 'opacity', {opacity: 0})
			section.btn.icon.fadeOut() // anim3d(section.btn.icon, 'opacity', {opacity: 0})
			anim3d(section.btn, 'scale', {x: 0.75, y: 0.75})
		}
	}
	function contentTraversal(target, on){
		target.content.traverse(function(child){
			if(child.material){
				if(on) child.fadeIn(child.expand.delay); else child.fadeOut(child.origin.delay)
				anim3d(child, 'position', on?child.expand:child.origin)
				// anim3d(child, 'scale', {x:on?1:0.5,z:on?1:0.5})
			}
		})
	}
}
function camHeight(){
	if(view.height==='elevation' && view.zoom !== 'far') anim3d(controls, 'target', {y: -1, spd: 600})
	else anim3d(controls, 'target', {y: -4, spd: 600})
	if(camera.zoom <= 1) scene.position.y = 0
}

//clicking buttons
function clickedMainButton(){ //clicked big button
	view.text = true
	if(view.zoom==='normal' && view.content==='maintext') anim3d(camera, 'zoom', {zoom: 2.1, spd: 1000, easing: ['Quadratic','InOut']})
	else if(view.zoom==='far' && view.content === 'overtext') anim3d(camera, 'zoom', {zoom: 0.875, spd: 750, easing: ['Quadratic','InOut']})
	setView(true)
}
function clickedToClose(){ //clicked main triangular close OR just off text
	view.text = false
	setView(true)
}
function clickedNav(){ //clicked nav zooms in by one level
	if(view.zoom === 'normal') anim3d(camera,'zoom',{zoom:2.1, spd: 1000, easing: ['Quadratic', 'InOut']})
	else if(view.zoom === 'close') anim3d(camera,'zoom',{zoom:.5, spd: 1250, easing: ['Quadratic', 'InOut']})
	else if(view.zoom === 'far') anim3d(camera,'zoom',{zoom:.875, spd: 750, easing: ['Quadratic', 'InOut']})
}
function clickedGoToHelp(){
	if(view.zoom!=='far' || view.height !== 'plan'){
		zoomspd = view.zoom === 'far'? 200: view.zoom === 'close'? 600: 250
		anim3d(camera,'zoom',{zoom:0.5, spd: zoomspd})
		rotateTo('top')
		rotateTo(0)
	}
	else{
		anim3d(camera, 'zoom', {zoom: .875, spd: 350})
		rotateTo('mid')
		rotateTo(0)
	}
	setView(true)
}
	function clickedHelpButton(which){
		console.log('clicked help sub button')
		if(view.height==='plan'){
			if(which === view.helpContent) view.helpContent = 'back'
			else view.helpContent = which
		}
		setView(true)
	}
	function clickedHelpContent(helpcategory, index){
		console.log(helpcategory, index)
		var target = info.help[helpcategory].content.children[index]
		if(target.onClick) target.onClick()
		else console.log('target content has no function')
	}
	function clickedHelpOutside(){
		if(view.helpContent && view.helpContent!=='back'){
			view.helpContent = 'back'
			setView(true)
		}
	}
function clickedLR(left){
	var target
	if(left) target = facing===0?3: facing-1
	else target = facing===3?0: facing+1
	rotateTo(target)
}
function refill(newstory, newpart){
	// show new data - could be next, could be first, could be totally diff
	refillObj(info.titleblock, compareObjs(data.title, story.parts[newpart].title))

	function refillObj(obj, diffs){
		//mesh, sprite, or group
		//how to avoid replacing things like line / pointer?

		//info.name[i].txt = sprite/group or info.titleblock = group
		//if its a group, iterate through its children alongside diffs
			// everything that is 'true' (different) gets removed/replaced
				//how to ensure preservation of position...???
				//recalculation of all position y's (size change)?
		//if its not, look at it

	}
}
function compareObjs(oldobj, newobj){
	// compares 2 objects and finds differences (when showing new content)
	// true = needs to change
	var newkeys = Object.keys(newobj),
	oldkeys = Object.keys(oldobj),
	diffs = []

	for(var i = 0; i<newkeys.length; i++){
		if(oldobj[oldkeys[i]] && newobj[newkeys[i]]){
			var oldcontent = oldobj[oldkeys[i]].c
			newcontent = newobj[newkeys[i]].c
			// console.log(oldcontent, newcontent)
			if(oldcontent instanceof Array && newcontent instanceof Array) diffs.push(!newcontent.equals(oldcontent))
			else if(oldcontent === newcontent) diffs.push(false) //same
			else diffs.push(true) //different key at index
		}
	}
	if(newkeys.length < oldkeys.length){
		for(var i = 0; i< oldkeys.length-newkeys.length; i++){
			diffs.push(true)
		}
	}
	return diffs
}

function lightsOn(on){
	lights.traverse(function(child){
		if(child.intensity) anim3d(child, 'intensity', {intensity: on?child.default:0.01, spd: child.default*500})
	})
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
		}
		else if(data.valueType === 'lessIsTall'){
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
function performanceLevel(){
	var allLevels = ['barren', 'lo', 'med', 'hi']
	performance = allLevels.indexOf(performance)<allLevels.length-1? allLevels[allLevels.indexOf(performance)+1]: 'barren'
	// alert('performance is now ' + performance)
	if(performance === 'hi'){
		// 128^2 texture maps, realtime shadows (someday), and phong material
		for(var i = 0; i<4; i++){
			seseme['plr'+i].material = seseme['quad'+i].material = resources.mtls.seseme_phong
		}
	}
	else if(performance === 'med'){
		//64^2 texture maps, lambert material
		lights.children[0].intensity = lights.children[0].default
		lights.children[2].intensity = lights.children[2].default
	}
	else if(performance === 'lo'){
		//single light, 32^2 textures
		var viewport = document.querySelector("meta[name=viewport]")
		viewport.setAttribute('content', 'width=device-width, initial-scale=0.5, maximum-scale=0.5, user-scalable=no')
		Velocity.mock = false
		lights.children[2].intensity = .5
		shadow.visible = true
		for(var i = 0; i<4; i++){
			seseme['plr'+i].material = seseme['quad'+i].material = resources.mtls.seseme_lambert
		}
	}
	else if(performance === 'barren'){
		//affect meta viewport (less AA), 32^2 textures, turn off lights, no 2d animations
		var viewport = document.querySelector("meta[name=viewport]")
		viewport.setAttribute('content', 'width=device-width, initial-scale=0.75, maximum-scale=0.75, user-scalable=no')
		Velocity.mock = true
		lights.children[0].intensity = lights.children[2].intensity =  0
		shadow.visible = false
		for(var i = 0; i<4; i++){
			seseme['plr'+i].material = seseme['quad'+i].material = resources.mtls.seseme_worst
		}
	}
}

//TWEENS / ANIMATIONS

function direct(destination, spd, dolly){ //camera angle control
}
function anim3d(obj, property, options){
	var start = {}, destination = {}, update
	//property defines how obj gets updated....
	if(property === 'position' || property === 'scale' || property === 'rotation' || property === 'target'){ //affecting XYZ
		start = { x: obj[property].x, y: obj[property].y, z:obj[property].z }
		destination = { x: options.x, y: options.y, z: options.z }
		if(start.x === destination.x && start.y === destination.y && start.z === destination.z) return
		update = function(){ obj[property].x = start.x; obj[property].y = start.y; obj[property].z = start.z }
	}
	else if(property === 'color'){ //affecting RGB
		start = {r: obj.material[property].r, g: obj.material[property].g, b: obj.material[property].b}
		destination = {r: options.r/255, g: options.g/255, b: options.b/255}
		if(start.r === destination.r && start.g === destination.g && start.b === destination.z) return
		update = function(){ obj.material[property].r = start.r; obj.material[property].g = start.g; obj.material[property].b = start.b }
	}
	else if(property === 'opacity'){ // affecting opacity
		if(obj.material[property] === options[property]) return
		start[property] = obj.material[property]; destination[property] = options[property]
		update = function(){ obj.material[property] = start[property] }
	}
	else if(property === 'intensity'){ //affecting light intensity
		if(obj[property]===options[property]) return
		start[property] = obj[property]; destination[property] = options[property]
		update = function(){ obj[property] = start[property] }
	}
	else if(property === 'zoom'){ //manipulating the camera
		if(obj[property]===options[property]) return
		controls.enabled = false
		start[property] = obj[property]; destination[property] = options[property]
		update = function(){ obj[property] = start[property]; camera.updateProjectionMatrix(); check() }
		options.cb = function(){ controls.enabled = true }
	}
	else if(property === 'sprite'){ //{dest: , frames: } required
		start.f = obj.material.map.offset.x * options.frames
		if(start.f === options.dest) return
		destination.f = options.dest
		options.easing = ['Linear','None']
		update = function(){ obj.material.map.offset.x = Math.ceil(start.f)/ options.frames }
	}
	else{ console.log('invalid tween type...'); return}
	//the actual tween:
	if(obj[property+'Tween']) obj[property+'Tween'].stop()
	obj[property+'Tween'] = new TWEEN.Tween(start).to(destination, options.spd? options.spd: 400)
	.onUpdate(update).easing(options.easing?TWEEN.Easing[options.easing[0]][options.easing[1]]:TWEEN.Easing.Quadratic.Out).delay(options.delay?options.delay:0)
	if(options.cb) obj[property+'Tween'].onComplete(function(){ options.cb(); delete obj[property+'Tween'] })
	else obj[property+'Tween'].onComplete(function(){ delete obj[property+'Tween'] })
	obj[property+'Tween'].start()
}
function rotateTo(which){
	var dist, travel, dir
	if(typeof which === 'string'){ //vertical rotation
		var angle = which==='top'? 0: which==='bottom'? 89 : 63.665
		dist = degs(controls.getPolarAngle()) - angle
		dir = 'Up'
	}
	else if(typeof which === 'number'){ // horizontal rotation
		//exception for 2--3
		if((facing===2&&which===3)||(facing===3&&which===2)){
			var full = which>facing?90:-90
			var dev = degs(controls.getAzimuthalAngle()) - facingRotations[facing]
			dist = -(full-dev)
		}
		//most of the time:
		else dist = degs(controls.getAzimuthalAngle()) - facingRotations[which]
		dir = 'Left'
	}
	else return //FOH
	console.log('rotate '+dir+' '+dist+ ' degrees')
	travel = 4.8795 / (dist/90)
	controls['rotate'+dir](1/travel)
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
