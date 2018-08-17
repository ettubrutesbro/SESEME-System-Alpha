
//1. EXTENSIONS AND SHORTCUTS
{
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
        if(this.material) anim3d(this, 'opacity', {opacity: 0, delay: delay?delay:0, cb: function(){ obj.visible = false }})
    }
    THREE.Object3D.prototype.fadeIn = function(delay){
        this.visible = true
        if(this.material) anim3d(this, 'opacity', {opacity: 1, delay: delay?delay:0 })
    }
}
//2. VIEW FUNCTIONS / SUBFUNCTIONS
//check function sets states when 'controls' update
{
    function check(){
        const height = degs(camera.rotation.x)>thresholds.height[0]?'elevation': degs(camera.rotation.x)<thresholds.height[1]?'plan':'isometric';
        var zoom = camera.zoom>thresholds.zoom[1]? 'close' : camera.zoom<thresholds.zoom[0]? 'far' : 'normal'

        const addzoom = camera.zoom - 1
        controls.zoomSpeed = 0.7-(Math.abs(camera.zoom-1)/3)
        controls.rotateSpeed = 0.1 - (Math.abs(camera.zoom-1)/20)
        lights.rotation.set(-camera.rotation.x/2, camera.rotation.y + rads(45), -camera.rotation.z/2)

        // rotation change block
        info.orbiter.rotation.y = camera.rotation.y
        facingRotations.some(function(ele,i){
            if(Math.abs(degs(camera.rotation.y)-ele)<45){
                if(facing!==i){
                    if(camera.zoom>1){
                        view.zoomswitch = true; controls.noZoom = true
                        var switchdist = Math.abs(seseme['plr'+facing].targetY - seseme['plr'+i].targetY) * 50
                        anim3d(scene, 'position', {y: -(seseme['plr'+i].targetY)*(addzoom/1.5)-(addzoom*3.5),
                        spd: 300+switchdist, easing: ['Quadratic', 'InOut'], cb: function(){ view.zoomswitch = false; controls.noZoom = false }})
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
            setView(false,false,true)
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
                if(!view.zoomswitch) scene.position.y = -(seseme['plr'+facing].targetY)*(addzoom/1.5)-(addzoom*3.5)
            }

        if(init) init = false
    }//end 'check'
    //package function uses states to set displayed objects
    function setView(button,height,zoom){
        console.log('set view')
        viewTitleblock()
        viewMainButton()
        viewPillarOutlines()
        viewPillarNames()
        viewSymbols()
        viewZoomLabels()
        viewStatBoxes()
        viewLinks()
        viewNavigationHelper()
        viewLRArrows()
        camHeight()
        if(view.height==='plan') viewHelp()
        if(!button && !height && !zoom) shiftNavBars()
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
        if(!data.pNames) return
        if(view.zoom === 'far' || view.zoom === 'close' || view.height==='plan'){ //all disappear
            for(var i = 0; i<4; i++){
                showName(i, false)
                anim3d(info.name[i].line, 'scale', {y:0.001})
                anim3d(info.name[i].line, 'opacity', {opacity:0})
                anim3d(info.name[i].pointer, 'position', {y: info.name[i].pointer.elevHt})
                anim3d(info.name[i].pointer, 'opacity', {opacity: 0})
            }
        }
        else if(view.height === 'isometric' || view.height === ''){ //1 at a time, fixed height
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
        var on = view.text||view.zoom === 'close'||view.zoom === 'far'||view.height==='plan'?false: true
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
                if(child.opacityTween) child.opacityTween.stop()
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
        || (view.zoom === 'normal' && !data.maintext) || (view.zoom===''&&!data.maintext) ){
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
        console.log('viewinfotext')
        if(view.text){
            Velocity([dom.bottom, dom.closebutton], 'stop') //necessary for zoom trolling
            if(view.height === 'plan') view.text = false
            else if(view.zoom==='normal'){
                if(view.content==='maintext' && dom.maintext.style.visibility === 'visible') {console.log('FOH') ;return} //already
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
            Velocity([dom[view.content], dom.bottom],'stop')
            Velocity(dom[view.content], {opacity: 0}, {visibility: 'hidden'})
            Velocity(dom.bottom, {translateY: 0, backgroundColorAlpha: 0.35}, {delay: 50, duration: 350, visibility: 'hidden',
            complete: function(){ dom.bottomwrapper.style.height = 0 }})
            dom.closebutton.hide()
            Velocity(dom.rule, {translateY: '100%'})
            view.content = ''
            view.lastTextHeight = 0
        }
        function callText(targettext){
            var newheight = targettext.offsetHeight,
            bottomspd, feedX = 0, feedY = 0,
            heightcb = function(){ console.log('height anim finished') },
            wrapperwait = false

            if(newheight > view.lastTextHeight) wrapperwait = false
            else wrapperwait = true

            //different content sections
            if(view.content && !view.filling){ //hide old text (if applicable), translate
                var animOld = {opacity: 0}
                Velocity(dom[view.content], 'stop')
                //determining how old content will animate away
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
                //running animation
                Velocity(dom[view.content], animOld, {duration: 300, visibility: 'hidden'})
                //determining if wrapper snaps height after or before
                heightcb = function(){ dom.bottomwrapper.style.height = newheight }
            }//end check for old content
            //same content sections, but new part

            //if calling text-less content, 'semi-hide':
            if(view.zoom ==='close'&& !dom['detail'+facing].textContent){
                newheight = 0
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
            // console.log(newheight)
            console.log(newheight, view.lastTextHeight, wrapperwait)
            // console.log('wrapperwait is ' + wrapperwait)
            Velocity(targettext, 'stop')
            Velocity(targettext, {opacity: 1, translateX: [0, feedX], translateY: [0, feedY]},
                {duration: 500, delay: 100, visibility: 'visible'})
            Velocity(dom.bottom, {translateX: [0,0], translateY: -newheight, backgroundColorAlpha: 0.91}, {duration: 275+ newheight ,
                visibility: 'visible', complete: heightcb })
            Velocity(dom.rule, {translateY: 0})

            view.content = targettext.id
            view.lastTextHeight = newheight
        }
    }
    function viewSymbols(rtn){
        var loadcb = false
        if(view.filling && !view.controls){ //replacement mode
            loadcb = true
            var allgone = new THREE.LoadingManager()
            allgone.onLoad = function(){ makeSymbols(rtn); return }
            for(var i = 0; i<4; i++){ allgone.itemStart('symbol') }
            if(view.zoom !== 'close' || !data.pSymbols){ makeSymbols(rtn); return }
        }
        if(view.zoom === 'close' && !view.filling ){
            for(var i = 0; i<4; i++){
                if(!data.pSymbols[i]) continue
                var s = seseme['plr'+i].symbol
                var d = Math.abs(facing - i) * 75
                anim3d(s, 'scale', {x:s.expand.s,y:s.expand.s,z:s.expand.s,delay:d})
                anim3d(s, 'position', {y:s.expand.y, delay: d})
            }
        }else{
            for(var i = 0; i<4; i++){
                if(!seseme['plr'+i].symbol){ if(loadcb){allgone.itemEnd('symbol'); continue} else continue }
                if(rtn){if(rtn[i]){ if(loadcb){allgone.itemEnd('symbol')}; continue }}
                var s = seseme['plr'+i].symbol
                anim3d(s, 'scale', {x:s.origin.s, y:s.origin.s, z:s.origin.s, spd: 350} )
                anim3d(s, 'position', {y: s.origin.y, spd: 350,
                    cb: loadcb? function(){allgone.itemEnd('symbol')}: ''} )
            }
        }
    }
    function viewZoomLabels(rtn){
        console.log('viewing zoomlabels')
        var loadcb = false
        if(view.filling && !controls.enabled){
            loadcb = true
            var allgone = new THREE.LoadingManager()
            allgone.onLoad = function(){ makeZoomLabels(rtn); return }
            if(view.zoom !== 'close' || !view.text || !data.pLabels){ makeZoomLabels(rtn); return }
        }
        if(view.text && view.zoom === 'close' && !view.filling){
            var previous
            if(view.cycleDirection) previous = facing===0?3:facing-1
            else previous = facing ===3?0:facing+1
            if(data.pLabels[previous] || data.pNames[previous]){
                seseme['plr'+previous].label.traverse(function(child){
                    if(child.material) anim3d(child, 'opacity', {opacity:0})
                })
            }
            if(data.pLabels[facing] || data.pNames[facing]){
                seseme['plr'+facing].label.traverse(function(child){
                    if(child.material) anim3d(child, 'opacity', {opacity: 1})
                })
            }
        }
        else{
            if(!seseme['plr'+facing].label){ if(loadcb){ makeZoomLabels([false,false,false,false]); return } else return }
            if(loadcb) seseme['plr'+facing].label.traverse(function(child){ if(child.material)allgone.itemStart('labelsub') })
            seseme['plr'+facing].label.traverse(function(child){
                if(child.material) anim3d(child, 'opacity', {opacity: 0,
                    cb: loadcb?function(){ allgone.itemEnd('labelsub')}: '' })
            })
        }
    }
    function viewStatBoxes(){
        var loadcb = false
        if(view.filling && !controls.enabled){
            loadcb = true
            var allgone = new THREE.LoadingManager()
            allgone.onLoad = function(){ makeStatboxes(); return }
            if(view.zoom!=='close' || view.text || !data.pStatboxes){ makeStatboxes(); return }
        }
        if(!data.pStatboxes) return
        if(view.zoom === 'close' && !view.text && !view.filling){
            var previous
            if(view.cycleDirection) previous = facing===0?3:facing-1
            else previous = facing ===3?0:facing+1
            if(data.pStatboxes[previous]){
                anim3d(seseme['plr'+previous].statbox, 'position', {y:4})
                anim3d(seseme['plr'+previous].statbox, 'scale', {x:.5,y:.5,z:.5})
                seseme['plr'+previous].statbox.traverse(function(child){
                    if(child.material)anim3d(child, 'opacity', {opacity: 0})
                })
            }
            if(data.pStatboxes[facing]){
                anim3d(seseme['plr'+facing].statbox, 'position', seseme['plr'+facing].statbox.expand)
                anim3d(seseme['plr'+facing].statbox, 'scale', {x:1,y:1,z:1})
                seseme['plr'+facing].statbox.traverse(function(child){
                    if(child.material)anim3d(child, 'opacity', {opacity: 1})
                })
            }
        }else{
            if(!seseme['plr'+facing].statbox){ 
                if(loadcb){ makeStatboxes(); return }
                else return  
            }
            if(loadcb){
                seseme['plr'+facing].statbox.traverse(function(child){ if(child.material) allgone.itemStart('statboxsub') })
            }
            anim3d(seseme['plr'+facing].statbox, 'position', {y: 4})
            anim3d(seseme['plr'+facing].statbox, 'scale', {x:.5,y:.5,z:.5})
            seseme['plr'+facing].statbox.traverse(function(child){
                if(child.material) anim3d(child, 'opacity', {opacity: 0,
                    cb: loadcb?function(){ allgone.itemEnd('statboxsub') }:'' })
            })
        }
    }
    function viewLinks(){
        var loadcb = false
        if(view.filling && !controls.enabled){
            console.log('remake links')
            makeLinks()
        }
        if(view.text && view.zoom === 'close' && !view.filling && !loadcb){
            console.log('show links')
            var previous
            if(view.cycleDirection) previous = facing===0?3:facing-1
            else previous = facing ===3?0:facing+1
            if(data.pLinks[previous]){
                seseme['plr'+previous].links.traverse(function(child){
                    if(child.origin) anim3d(child, 'position', child.origin)
                    if(child.material) anim3d(child, 'opacity', {opacity:0})
                })
            }
            if(data.pLinks[facing]){
                seseme['plr'+facing].links.traverse(function(child){
                    if(child.expand) anim3d(child, 'position', child.expand)
                    if(child.material) anim3d(child, 'opacity', {opacity: 1})
                })
            }
        }
        else{
            console.log('hide links')
            if(seseme['plr'+facing].links.children.length<1){ if(loadcb){ makeLinks(); return } else return }
            if(loadcb) seseme['plr'+facing].links.traverse(function(){ allgone.itemStart('linksub') })
            seseme['plr'+facing].links.traverse(function(child){
                if(child.origin) anim3d(child, 'position', child.origin)
                if(child.material) anim3d(child, 'opacity', {opacity: 0,
                    cb: loadcb?function(){ allgone.itemEnd('linksub') }:'' })
            })
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
                if(i!==facing) {
                    if(dom.navnames[i].style.opacity!=='0'){
                        Velocity(dom.navnames[i], 'stop')
                        Velocity(dom.navnames[i], animOut)
                    }
                }
                else if(dom.navnames[i].style.opacity!=='1'){
                    Velocity(dom.navnames[i], 'stop')
                    Velocity(dom.navnames[i], animIn)
                }
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
    function viewHelp(){
        //base 'shallow' help shows 4 buttons
        if((view.height === 'plan' && view.zoom === 'far') && ((view.helpContent === '')||( view.helpContent==='back'))){
            dom.help.className = 'open'
            if(view.helpContent==='back') for(var i = 0; i<4; i++){contentTraversal(info.help.children[i], false)}
            for(var i = 0; i<4; i++){
                var section = info.help.children[i]
                anim3d(section.btn, 'position', section.btn.expand)
                section.btn.visible = true
                anim3d(section.btn, 'opacity', {opacity: 1, delay: i*20})
                anim3d(section.btn, 'scale', {x:1,y:1})
            }
            //2018 debug:
            document.getElementById('debug').style.display = 'block'
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
                anim3d(section.btn, 'scale', {x: 0.75, y: 0.75})
            }

            //2018 debug
            if(!document.getElementById('debug').classList.contains('open')){
                document.getElementById('debug').style.display = 'none'
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
        if(view.height==='elevation' && view.zoom !== 'far') anim3d(controls, 'target', {y: !cameraPerspective?-1:1, spd: 600})
        else anim3d(controls, 'target', {y: !cameraPerspective?-4:-2, spd: 600})
        if(camera.zoom <= 1) scene.position.y = 0
    }
}
//3. CLICK RESPONSES
{
    function clickedMainButton(){ //clicked big button
        console.log('clicked main button')
        if(!controls.enabled) return
        view.text = true
        if(view.zoom==='normal' && view.content==='maintext') anim3d(camera, 'zoom', {zoom: 2.35, spd: 1000, easing: ['Quadratic','InOut']})
        else if(view.zoom==='far' && view.content === 'overtext') anim3d(camera, 'zoom', {zoom: 0.875, spd: 750, easing: ['Quadratic','InOut']})
        setView(true)
    }
    function clickedToClose(){ //clicked main triangular close OR just off text
        if(!controls.enabled) return
        view.text = false
        setView(true)
    }
    function clickedNav(){
        if(!controls.enabled) return //clicked nav zooms in by one level
        if(view.zoom === 'normal') anim3d(camera,'zoom',{zoom:2.35, spd: 1000, easing: ['Quadratic', 'InOut']})
        else if(view.zoom === 'close') anim3d(camera,'zoom',{zoom:.5, spd: 1250, easing: ['Quadratic', 'InOut']})
        else if(view.zoom === 'far') anim3d(camera,'zoom',{zoom:.875, spd: 750, easing: ['Quadratic', 'InOut']})
    }
    function clickedGoToHelp(){
        if(!controls.enabled) return
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
                else {
                    view.helpContent = which;
                    if(info.help[view.helpContent].btn.frames >1){
                        var f = info.help[view.helpContent].btn.frames
                        anim3d(info.help[view.helpContent].btn, 'sprite', {frames: f, dest: f-1,
                            spd: f*30})  
                    } 
                }
            }
            setView(true)
        }
        function clickedHelpContent(helpcategory, index){
            console.log(helpcategory, index)
            if(helpcategory !== view.helpContent) {
                view.helpContent = 'back'
                setView(true)
                return
            }
            var target = info.help[helpcategory].content.children[index]
            if(target.onClick) target.onClick()
            else console.log('target content has no function')
        }
        function clickedHelpOutside(){
            if(view.helpContent && view.helpContent!=='back'){
                if(info.help[view.helpContent].btn.frames > 1){
                    var f = info.help[view.helpContent].btn.frames
                    anim3d(info.help[view.helpContent].btn, 'sprite', {frames: f, dest: 0,
                        spd: f*30})
                    
                }
                view.helpContent = 'back'
                setView(true)
            }
        }
    function clickedLR(left){
        if(!controls.enabled) return
        var target
        if(left) target = facing===3?0: facing+1
        else target = facing===0?3: facing-1
        rotateTo(target)
    }
    function clickedDetailLink(){

    }
}
//4. REFILLING AND GLOBAL CONTENT POPULATION (shared b/w setup and refill)
{
    function refill(debug){
        console.log('refilling')
        //CHECKING FOR RETENTION
        var retainMainText = false, retainDetailText = [false,false,false,false],
        retainName = [false,false,false,false], retainSymbol = [false,false,false,false],
        retainLabel = [false,false,false,false]

        if(data.maintext === stories[story].parts[part].maintext) retainMainText = true
        for(var i = 0; i<4; i++){ //per-pillar data
            if(data.pTexts && stories[story].parts[part].pTexts){//detail text in the DOM
                if(!data.pTexts[i] || !stories[story].parts[part].pTexts[i]) retainDetailText[i] = false
                else if(data.pTexts[i] === stories[story].parts[part].pTexts[i]) retainDetailText[i] = true
            }else retainDetailText[i] = false

            if(data.pNames && stories[story].parts[part].pNames){//pillar names in 3d and DOM
                if(!data.pNames[i] || !stories[story].parts[part].pNames[i]) retainName[i] = false
                else if(typeof data.pNames[i] !== typeof stories[story].parts[part].pNames[i]) retainName[i] = false
                else if(typeof data.pNames[i] === 'string') {
                    if(data.pNames[i] === stories[story].parts[part].pNames[i]) retainName[i] = true
                }
                else if(data.pNames[i] instanceof Array){
                    if(data.pNames[i].equals(stories[story].parts[part].pNames[i])) retainName[i] = true
                }
            }else retainName[i] = false

            if(data.pSymbols && stories[story].parts[part].pSymbols){//pillar symbols in 3d
                if(!data.pSymbols[i] || !stories[story].parts[part].pSymbols[i]) retainSymbol[i] = false
                else if(data.pSymbols[i].src === stories[story].parts[part].pSymbols[i].src) retainSymbol[i] = true
            }
            if(data.pLabels && stories[story].parts[part].pLabels){
                if(!data.pLabels[i] || !stories[story].parts[part].pLabels[i]) retainLabel[i] = false
                else if(typeof data.pLabels[i] !== typeof stories[story].parts[part].pLabels[i]) retainLabel[i] = false
                else if(typeof data.pLabels[i] === 'string'){
                    if(data.pLabels[i] === stories[story].parts[part].pLabels[i]) retainLabel[i] = true
                }
                else if(data.pLabels[i] instanceof Array){
                    if(data.pLabels[i] === stories[story].parts[part].pNames[i]) retainLabel[i] = true
                }
            }else retainLabel[i] = false
        }
        console.log('retention check complete')
        //ESTABLISHING DATA, DISABLING CONTROLS, AND 'WAITING' FOR CONTENT FILLING
        data = stories[story].parts[part]
        var refillMgr = new THREE.LoadingManager()
        controls.enabled = false; view.filling = true

        refillMgr.itemStart('DOM'); refillMgr.itemStart('names'); refillMgr.itemStart('titleblock')
        refillMgr.itemStart('sceneHt')
        // refillMgr.itemStart('labels')
        // refillMgr.itemStart('statboxes')
        // refillMgr.itemStart('links')
        // refillMgr.itemStart('allPillarComponents')
        refillMgr.onLoad = function(){
            console.log('done replacing, reenabling controls')
            view.filling = false
            setView(true)
            controls.enabled = true
        }
        refillMgr.onProgress = function(item,loaded,total){ console.log(item,loaded,total)}
        //3D SHIT - color, namesprites, titleblock, main button position
        if(debug) pctCalc() //for frontend simulation shit
        pctsToHeights();
        movePillars();
        makeNames(retainName);
        refillMgr.itemEnd('names')
        replaceTitleblock()
        //plr components
        viewSymbols(retainSymbol)
        viewZoomLabels(retainLabel)
        viewStatBoxes()
        viewLinks()
        //other
        recolor3d()
        sceneHeightTransition()
        //DOM shit
        refillDOM()
        //REAPPEAR AND REENABLE
        function movePillars(){
            //get distance, multiply/add, anim3d
            //future: flags and queueing?
            for(var i = 0; i<4; i++){
                var plrspd = ((Math.abs(seseme['plr'+i].targetY - seseme['plr'+i].position.y) / plrmax) * constspd) + spdcompensator
                anim3d(seseme['plr'+i], 'position', {y: seseme['plr'+i].targetY, spd: plrspd})
            }
            if(seseme.plr0.targetY < 0.8) signifier.visible = false
            else if(!signifier.visible) signifier.visible = true
        }
        function replaceTitleblock(){
            //if titleblock isnt visible at time of replacement, no need for fade
            if(view.zoom==='close' || view.zoom === 'far' || view.height === 'plan' || view.text){
                makeTitleblock()
                refillMgr.itemEnd('titleblock')
                return
            }
            var allFaded = new THREE.LoadingManager, ite = 0
            allFaded.onLoad = function(){
                makeTitleblock()
                refillMgr.itemEnd('titleblock')
            }
            for(var i = 0; i<info.titleblock.children.length; i++){
                if(info.titleblock.children[i].material) allFaded.itemStart('titleblockItem')
            }
            info.titleblock.traverse(function(child){
                if(child.material) anim3d(child, 'opacity', {opacity: 0, delay:(info.titleblock.children.length-ite)*50,
                    cb: function(){ allFaded.itemEnd('titleblockItem')}})
                ite++
            })
        }

        function recolor3d(){
            var rgb = data.color.ui? hexToRgb(data.color.ui): {r:0,g:0,b:0}
            console.log('recolor to: ' + rgb.r, rgb.g, rgb.b)
            for(var i = 0; i<4; i++){
                anim3d(seseme['plr'+i].outline, 'color', rgb)
                anim3d(seseme['plr'+i].outcap, 'color', rgb)
            }
            anim3d(info.btn.color, 'color', rgb)
            anim3d(orb, 'color', {r: rgb.r/2, g: rgb.g/2, b: rgb.b/2})
            anim3d(orb, 'emissive', {r: rgb.r*1.25, g: rgb.g*1.25, b: rgb.b*1.25})
        }
        function sceneHeightTransition(){
            if(camera.zoom > 1){
                var addzoom = Math.abs(1-camera.zoom)
                var switchdist = Math.abs(seseme['plr'+facing].targetY - seseme['plr'+facing].position.y) * 100
                anim3d(scene, 'position', {y: -(seseme['plr'+facing].targetY)*(addzoom/1.5)-(addzoom*3.5),
                spd: 200+switchdist, easing: ['Quadratic', 'InOut'], cb: function(){ refillMgr.itemEnd('sceneHt') }})
            }
            else refillMgr.itemEnd('sceneHt')
        }
        function refillDOM(){
            console.log('running refillDOM')
            //STORY CHANGES?
            dom.navspans[1].textContent = stories[story].seedling
            dom.navfigures[1].style.backgroundImage = 'url(assets/seedling_'+stories[story].seedling+'.png)'
            dom.overtext.textContent = stories[story].description
            //MAJOR CONTENT CHANGES / FADE
            Velocity(dom.bottom, {backgroundColor: data.color? data.color.ui : '#000000'})
            //just hide what's being viewed, cb changes content and animates bottom
            var allContent = ['maintext', 'overtext', 'detail0', 'detail1', 'detail2', 'detail3']
            if(view.content){
                Velocity(dom[view.content],'finish')
                Velocity(dom[view.content], {opacity:0}, {visibility:'hidden', complete: function(){
                    console.log('faded viewed content, refilling it')
                    dom[view.content].refill()
                    Hyphenator.run()
                    refillMgr.itemEnd('DOM')
                }})
                allContent.splice(allContent.indexOf(view.content),1)
            }
            for(var i = 0; i<allContent.length; i++){ dom[allContent[i]].refill()}
            if(!view.content){ Hyphenator.run(); refillMgr.itemEnd('DOM') }
            //NAV AND ACCESSORIES
            var plrOrder = data.values.concat().sort(function(a,b){return a-b})
            if(data.valueType === 'lessIsTall'){plrOrder.reverse()}
            Velocity(dom.navnames[facing], 'stop')
            Velocity(dom.navnames[facing], {opacity: 0, translateX: '-4rem'}, {visibility: 'hidden', complete:
                function(){ dom.navnames[facing].textContent = data.pNames[facing]; dom.navnames[facing].style.visibility = 'visible' }})
            for(var i = 0; i<4; i++){
                var navname = data.pNames[i] || ''
                if(i!==facing) dom.navnames[i].textContent = navname
                Velocity(dom.databars[i], {height: (plrOrder.indexOf(data.values[i])+1)*25+'%' })
            }
            dom.navspans[2].innerHTML = 'PART <b>'+(part+1)+'</b> <em>of</em> <b>'+stories[story].parts.length+ '</b>'
        }//end refillDOM
    } //END REFILL
    //
    function pctsToHeights(){
        for(var i=0; i<4; i++){
            seseme['plr'+i].targetY = percentages[i]*plrmax
        }
    }
    function makeNames(rtn){
        console.log('make names')
        const lnheight = 1.4
        for(var i = 0; i<4; i++){
            //individual sprite name
            var n = init? new THREE.Group() : info.name[i]
            if(rtn[i]){ //name is the same from last part: just make height adjustment
                n.elevHt = seseme['plr'+i].targetY + 1.5 + (n.lines*lnheight)
                if(view.height === 'elevation') anim3d(n, 'position', {y: n.elevHt})
            }else{
                if(!init) { n.remove(n.txt); delete n.txt } //delete old
                var txt
                    n.lines = 1
                    //name is string
                    if(typeof data.pNames[i] === 'string'){
                        txt = new THREE.Sprite()
                        var sprtxt = new Text(data.pNames[i],1100,125,'black','Karla',30,600,'center')
                        var sprmtl = new THREE.SpriteMaterial({transparent:true,map:sprtxt.tex,opacity:0 })
                        txt.material = sprmtl
                        txt.scale.set(sprtxt.cvs.width/100, sprtxt.cvs.height/100, 1)
                    }
                    //name is array
                    else if(data.pNames[i] instanceof Array){
                        txt = new THREE.Group()
                        for(var it = 0; it<data.pNames[i].length; it++){
                            var subtxt = new THREE.Sprite()
                            var sprtxt = new Text(data.pNames[i][it],1100,125,'black','Karla',30,600,'center')
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
                    else console.log('data.pNames['+i+'] is invalid type')
                n.txt = txt
                n.add(n.txt)
                n.position.set(-3.6, 17.5, 1.1)
                n.isoHt = 17.5; n.elevHt = seseme['plr'+i].targetY + 1.5 + (n.lines*lnheight)
            }
            var pointer
            if(init){
                pointer = new THREE.Sprite(new THREE.SpriteMaterial({transparent:true,map:resources.mtls.chevron.map,opacity:0, color: 0x000000}))
                n.pointer = pointer; n.add(n.pointer)
            }
            else if(!init) pointer = n.pointer
            pointer.isoHt = (-(n.lines*lnheight) - ((17.5 - seseme['plr'+i].targetY)-(n.lines*lnheight)))+2
            pointer.elevHt = -(n.lines*lnheight)
            if(init) pointer.position.y = pointer.isoHt

            var linelength = (17.5-seseme['plr'+i].targetY -(n.lines*lnheight)) - 2.5
            var line
            if(!init) {n.remove(n.line); delete n.line}
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

            if(init) {info.name[i] = n; seseme['quad'+i].add(n)}
        }
    }
    function makeTitleblock(){
        console.log('make titleblock')
        //title block
        if(init) info.titleblock = new THREE.Group()
        else if(!init) info.titleblock.children = []
        info.titleblock.ht = 0
        var t = data.title
        var titlekeys = Object.keys(data.title)
        for(var i = 0; i<titlekeys.length; i++){
            if(t[titlekeys[i]].margin) info.titleblock.ht+=t[titlekeys[i]].margin
            var width = 750,
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
                    var arrtxt = meshify(new Text(t[titlekeys[i]].c[it], width, height, 'white', font, fontsize, weight, align))
                    if(t[titlekeys[i]].size) info.titleblock.ht += t[titlekeys[i]].size/12.5
                    else if(i>0) info.titleblock.ht += 1.65
                    arrtxt.position.y = arrtxt.origin = -info.titleblock.ht
                    arrtxt.expand = -info.titleblock.ht
                    txt.add(arrtxt)
                }
            //single string
            }else{
                var txt = meshify(new Text(t[titlekeys[i]].c, width, height, 'white', font, fontsize, weight, align))
                if(t[titlekeys[i]].size) info.titleblock.ht += t[titlekeys[i]].size/12.5
                else if(i>0) info.titleblock.ht += 1.65
                txt.position.y = txt.origin = -info.titleblock.ht
                txt.expand = -info.titleblock.ht
                info.titleblock.add(txt)
            }
        }
        info.titleblock.position.y = info.titleblock.isoHt = info.titleblock.ht/4.25 - .5
        info.titleblock.position.z = 7.5
        info.orbiter.add(info.titleblock)
        // if(!init) setView()
        // projectionMgr.itemEnd('titleblock')
    }//END MAKETITLEBLOCK
    function makeSymbols(rtn){
        console.log('making symbols')
        if(!data.pSymbols) return
        console.log(rtn)
        for(var i = 0; i<4; i++){
            if(!rtn) continue
            else if(rtn[i] || !data.pSymbols[i]) continue
            if(!init) {
                if(seseme['plr'+i].symbol) seseme['plr'+i].remove(seseme['plr'+i].symbol)
                delete seseme['plr'+i].symbol
            }
            var symbol = data.pSymbols[i] || {type: ''}, obj

            if(symbol.type === 'img'){
                obj = new THREE.Mesh( new THREE.PlaneBufferGeometry(3.5,3.5), resources.mtls[symbol.src] )
                obj.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,1.75,0))
                obj.expand = {y: 0, s:1}; obj.origin = {y: -1, s: 0.25}
            }
            else if(symbol.type === 'geo'){
                obj = new THREE.Mesh( resources.geos[symbol.src], resources.mtls[symbol.src] )
                obj.expand = {y: 0, s:1}; obj.origin = {y: -1, s: 0.25}
            }
            else if(symbol.type === 'spr'){
                var sprmtl = new THREE.SpriteMaterial({transparent: true, map: resources.mtls[symbol.src].map})
                obj = new THREE.Sprite( sprmtl )
                obj.expand = {y: 1.75, s:3.5}; obj.origin = {y: -.5, s: 0.75}
            }

            obj.material.depthWrite = true
            obj.scale.set(obj.origin.s,obj.origin.s,obj.origin.s)
            obj.position.y = obj.origin.y; obj.rotation.y = rads(45)
            seseme['plr'+i].symbol = obj
            seseme['plr'+i].add(seseme['plr'+i].symbol)
        }
    }
    function makeZoomLabels(rtn){
        if(!data.pLabels) {console.log('no labels in dataset');return}
        for(var i = 0; i<4; i++){
            if((rtn[i]) || (!data.pLabels[i] && !data.pNames[i])) {console.log('no label at slot '+i) ;continue}
            if(!init) {
                if(seseme['plr'+i].label) seseme['plr'+i].remove(seseme['plr'+i].label)
                delete seseme['plr'+i].label
            }
            var txt = data.pLabels[i].c || data.pNames[i] || '',
            font = data.pLabels[i].font || 'Karla',
            fontsize = data.pLabels[i].size || 13,
            fontweight = data.pLabels[i].weight || 600,
            txtalign = data.pLabels[i].align || 'center',
            label

            if(typeof txt === 'string'){
                var label = meshify(new Text(txt,400,fontsize*6,'white',font,fontsize,fontweight,txtalign))
                label.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(Math.atan(-1/Math.sqrt(2))))
                label.position.y = -.5
            }
            else if(txt instanceof Array){
                var label = new THREE.Group()
                label.position.y = -.5 + ((txt.length-1)*.25)
                for(var it = 0; it<txt.length; it++){
                    var objtext = txt[it]
                    var labelobj = meshify(new Text(txt[it],400,fontsize*6,'white',font,fontsize,fontweight,txtalign))
                    labelobj.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(Math.atan(-1/Math.sqrt(2))))
                    label.add(labelobj)
                    labelobj.position.y = -it*(fontsize/12)
                    labelobj.position.z =  it*(fontsize/15)
                }
            }

            label.position.x = label.position.z = 2.05
            label.scale.set(0.625,0.625,0.625)
            label.rotation.y = rads(45)

            seseme['plr'+i].label = label
            seseme['plr'+i].add(seseme['plr'+i].label)
        }
    }
    function makeStatboxes(){
        if(!data.pStatboxes) return
        for(var i = 0; i<4; i++){
            if(!init){
                if(seseme['plr'+i].statbox) seseme['plr'+i].remove(seseme['plr'+i].statbox);
                delete seseme['plr'+i].statbox
            }
            if(!data.pStatboxes[i]) continue
            var sb = data.pStatboxes[i], content,
            width, font, fontsize, fontweight, txtalign, statbox, pointer

            if(typeof sb.c === 'string'){ //single line
                width = sb.width || (sb.c.length * (sb.size))*1.75 + 75 || 600
                font = sb.font || 'Droid Serif'; fontsize = sb.size || 24
                fontweight = sb.weight || 400; txtalign = sb.align || 'center'
                statbox = meshify(new Text(sb.c, width, fontsize * 6, 'white', font, fontsize, fontweight, txtalign),true)
                statbox.expand = {y: 6}
                pointer = new THREE.Mesh(resources.geos.triangleA, new THREE.MeshBasicMaterial({color:0x000000,
                     transparent: true, depthWrite: false, opacity: 0}))
                pointer.position.y = -fontsize/24; pointer.scale.set(.75,.75,.75)
                statbox.add(pointer)
            }
            else if(sb.c instanceof Array){ //multiline
                statbox = new THREE.Group()
                var longest = sb.c.concat().sort(function (a, b) { return b.length - a.length; })[0]
                for(var it = 0; it<sb.c.length; it++){
                    width = sb.width || sb.size instanceof Array? 1.75*(sb.size[0])*longest.length+75: sb.size*longest.length || 500
                    font = sb.font instanceof Array? sb.font[it] : sb.font || 'Droid Serif'
                    fontsize = sb.size instanceof Array? sb.size[it] : sb.size || 24
                    fontweight = sb.weight instanceof Array? sb.weight[it] : sb.weight || 400
                    txtalign = sb.align || 'center'
                    var statboxobj = meshify(new Text(sb.c[it],width,fontsize*6,'white',font,fontsize,fontweight,txtalign),true)
                    statbox.add(statboxobj)
                    statboxobj.position.y = -it * (fontsize/10)
                    statbox.expand = {y: 6+((it/2)*(fontsize/10))}
                    if(it===sb.c.length-1){
                        pointer = new THREE.Mesh(resources.geos.triangleA, new THREE.MeshBasicMaterial({color:0x000000,
                             transparent: true, depthWrite: false, opacity: 0}))
                        pointer.position.y = -fontsize/24; pointer.scale.set(.75,.75,.75)
                        statboxobj.add(pointer)
                    }
                }
            }

            statbox.position.y = 4
            statbox.rotation.y = rads(45)
            seseme['plr'+i].statbox = statbox
            seseme['plr'+i].add(seseme['plr'+i].statbox)
        }
    } // end makeStatboxes
    function makeLinks(){
        console.log('running makelinks')
        if(!data.pLinks) {console.log('no links in dataset') ; return}
        for(var i = 0; i<4; i++){
            if(!init)   seseme['plr'+i].links.children = []
            var links = init? new THREE.Group() : seseme['plr'+i].links
            if(init){
                links.rotation.y = rads(45); links.position.y = 4
                seseme['plr'+i].links = links ; seseme['plr'+i].add(seseme['plr'+i].links)
            }
            if(!data.pLinks[i] || data.pLinks[i].length < 1) {console.log('no links at '+i) ; continue}

            for(var it = 0; it<data.pLinks[i].length; it++){
                console.log('adding link to plr'+i+ ' :' + linkinfo)
                var linkinfo = data.pLinks[i][it]
                if(!linkinfo.type) continue
                var l = new THREE.Mesh(new THREE.PlaneBufferGeometry(2,2), new THREE.MeshBasicMaterial({
                    map: resources.mtls['link_'+linkinfo.type].map, transparent: true, depthWrite: false, opacity: 0
                }))
                l.goTo = linkinfo.c
                links.add(l)
            }
            if(data.pLinks[i].length === 3){
                links.children[0].expand = {x:0,y:2.75,z:0,spd:300}
                links.children[0].origin = {x:0,y:4,z:0,delay:50,spd:300}
                links.children[1].expand = {x:-2,y:1,z:0,delay:50,spd:300}
                links.children[1].origin = {x:-3,y:3,z:0,spd:300}
                links.children[2].expand = {x:2,y:1,z:0,delay:50,spd:300}
                links.children[2].origin = {x:3,y:3,z:0,spd:300}
            }
            else if(data.pLinks[i].length === 2){
                links.children[0].expand = {x:-1.5,y:1.5,z:0,delay:50,spd:350}
                links.children[0].origin = {x:-2,y:3,z:0,spd:300}
                links.children[1].expand = {x:1.5,y:1.5,z:0,delay:50,spd:350}
                links.children[1].origin = {x:2,y:3,z:0,spd:300}
            }
            else if(data.pLinks[i].length === 1){
                links.children[0].expand = {x:0,y:2,z:0}
                links.children[0].origin = {x:0,y:3.5,z:0}
            }
        }
    }//end makeLinks
}
//5. MATH / UTILITY FUNCTIONS
{
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
}
//6. LOW-LEVEL: TWEENS / ANIMATIONS
{
    function anim3d(obj, property, options){
        var start = {}, destination = {}, update
        //property defines how obj gets updated....
        if(property === 'position' || property === 'scale' || property === 'rotation' || property === 'target'){ //affecting XYZ
            start = { x: obj[property].x, y: obj[property].y, z:obj[property].z }
            destination = { x: options.x, y: options.y, z: options.z }
            if(start.x === destination.x && start.y === destination.y && start.z === destination.z) return
            update = function(){ obj[property].x = start.x; obj[property].y = start.y; obj[property].z = start.z }
        }
        else if(property === 'color' || property === 'emissive'){ //affecting RGB
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
            // controls.enabled = false
            controls.noRotate = controls.noZoom = true
            start[property] = obj[property]; destination[property] = options[property]
            update = function(){ obj[property] = start[property]; camera.updateProjectionMatrix(); check() }
            options.cb = function(){ controls.noRotate = controls.noZoom = false }
        }
        else if(property === 'sprite'){ //{dest: , frames: } required
            start.f = obj.material.map.offset.x * options.frames
            if(start.f === options.dest) return
            destination.f = options.dest
            options.easing = ['Linear','None']
            update = function(){ obj.material.map.offset.x = Math.ceil(start.f)/ options.frames }
        }
        else if(property === 'scrollmap'){ //give a percentage value
            start = {x: obj.material.map.offset.x, y: obj.material.map.offset.y}
            if(start.x === options.x && start.y === options.y) return
            destination = {x: options.x, y: options.y}
            update = function(){ obj.material.map.offset.x = start.x; obj.material.map.offset.y = start.y}
        }
        else{ console.log('invalid tween type...'); return}
        //the actual tween:
        if(obj[property+'Tween']) obj[property+'Tween'].stop()
        obj[property+'Tween'] = new TWEEN.Tween(start).to(destination, options.spd? options.spd: 400)
        .onUpdate(update).easing(options.easing?TWEEN.Easing[options.easing[0]][options.easing[1]]:TWEEN.Easing.Quadratic.Out).delay(options.delay?options.delay:0)
        if(options.loop) {obj[property+'Tween'].repeat(Infinity); obj[property+'Tween'].yoyo( true )}
        if(options.cb) obj[property+'Tween'].onComplete(function(){ delete this; options.cb()  })
        else obj[property+'Tween'].onComplete(function(){ delete this })
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
            //exception for 1--2
            if((facing===1&&which===2)||(facing===2&&which===1)){
                var full = which>facing?-90:90
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
}
//7. 3D TEXT CREATION
{
    function Text(words,width,height,color,font,fontSize,fontWeight,align){
        this.cvs = document.createElement('canvas'), this.ctx = this.cvs.getContext('2d')
        this.tex = new THREE.Texture(this.cvs); this.tex.needsUpdate = true
        this.cvs.width = width; this.cvs.height = height
        // this.ctx.strokeStyle = '#FF0000', this.ctx.lineWidth=5, this.ctx.strokeRect(0,0,this.cvs.width,this.cvs.height)
        this.ctx.scale(3,3); this.ctx.fillStyle = color; this.ctx.font = 'normal '+fontWeight+' '+fontSize+'pt '+font
        this.ctx.textAlign = align
        if(align==='center' || !align) this.ctx.fillText(words,this.cvs.width/6,this.cvs.height/6+fontSize/2.2)
        else if(align==='start') this.ctx.fillText(words,1,this.cvs.height/6+fontSize/2.2)
        else this.ctx.fillText(words,this.cvs.width/3-10,this.cvs.height/6+fontSize/2.2)
    }
    //turns Text objects into mesh/mat, storing them as attributes in the original obj
    function meshify(target, backing){
        var mtl = new THREE.MeshBasicMaterial({transparent: true, opacity: 0, depthWrite:false, map: target.tex})
        var obj = new THREE.Mesh(new THREE.PlaneBufferGeometry(target.cvs.width/60,target.cvs.height/60), mtl)
        if(backing) {
            var backing = new THREE.Mesh(new THREE.PlaneBufferGeometry(target.cvs.width/60,
              target.cvs.height/60), new THREE.MeshBasicMaterial({color:0x000000, transparent: true, opacity: 0,
              depthWrite: false}))
            obj.add(backing)
            backing.position.z = -0.1
         }
        obj.canvas = target
        return obj
    }
}
//9. ETC / other
    function performanceLevel(){
        var sprite = info.help.options.content.children[0], caption = info.help.options.content.children[3]
        var allLevels = ['lo', 'med', 'hi', 'ultra']
        performance = allLevels.indexOf(performance)<allLevels.length-1? allLevels[allLevels.indexOf(performance)+1]: allLevels[0]
        // alert('performance is now ' + performance)

        if(performance === 'lo'){
            anim3d(sprite,'sprite',{frames:23,dest:22,spd:275,cb:function(){sprite.material.map.offset.x=0}})
            anim3d(caption,'scrollmap',{y:0.75})
            //no orb geometry, no mock shadow, no 2d anims, no backlight or orb, half camlight, lambert materials
            Velocity.mock = true
            shadow.visible = orb.visible = lights.children[0].castShadow = false
            lights.children[0].intensity = orb.children[0].intensity = 0
            lights.children[2].intensity = .5
            for(var i = 0; i<4; i++){
                seseme['plr'+i].material = seseme['quad'+i].material = resources.mtls.seseme_lambert
                seseme['quad'+i].castShadow = seseme['plr'+i].castShadow = false
                seseme['quad'+i].receiveShadow = seseme['plr'+i].receiveShadow = false
            }
        }
        else if(performance === 'med'){
            anim3d(sprite, 'sprite', {frames: 23, dest: 5, spd:300})
            anim3d(caption,'scrollmap',{y:0.5})
            // normal lights on and full, 2d animations restored, visible mock shadow
            Velocity.mock = false
            shadow.visible = orb.visible = true
            lights.children[0].intensity = lights.children[0].default
            lights.children[2].intensity = lights.children[2].default
        }
        else if(performance === 'hi'){
            anim3d(sprite, 'sprite', {frames: 23, dest: 10,spd:300})
            anim3d(caption,'scrollmap',{y:0.25})
            // + specular / phong material, orb light on
            for(var i = 0; i<4; i++){
                seseme['plr'+i].material = seseme['quad'+i].material = resources.mtls.seseme_phong
            }
            orb.children[0].intensity = orb.children[0].default
        }
        else if(performance === 'ultra'){
            anim3d(sprite,'sprite',{frames:23,dest:17,spd:425})
            anim3d(caption,'scrollmap',{y:0})
            //+ realtime shadows
            lights.children[0].castShadow = true
            for(var i =0; i<4; i++){
                seseme['quad'+i].castShadow = true
                seseme['quad'+i].receiveShadow = true
                seseme['plr'+i].castShadow = true
                seseme['plr'+i].receiveShadow = true
            }
        }
    }
    function collectDataMode(){
        var sprite = info.help.children[2].children[1].children[2]
        var caption = info.help.children[2].children[1].children[5]
        if(userPermission){ // turn it off
            anim3d(sprite, 'sprite', {frames: 10, dest: 9, spd: 400, cb: function(){
                userPermission = false
            }})
            anim3d(caption, 'scrollmap', {x: 0.5})

        }
        else{ // turn it on
            anim3d(sprite, 'sprite',{frames:10,dest:0,spd:400, cb: function(){
                userPermission = true
            }})
            anim3d(caption, 'scrollmap', {x: 0})
        }
    }
    function cameraMode(){
        var aspect = dom.containerSESEME.offsetWidth / dom.containerSESEME.offsetHeight, d = 20,
        sprite = info.help.children[2].children[1].children[1], caption = info.help.children[2].children[1].children[4],
        savePos = camera.position, saveZoom = camera.zoom, saveRot = camera.rotation


        if(cameraPerspective){ // change to ortho
            camera = new THREE.OrthographicCamera( - d * aspect, d * aspect, d, - d, 0, 100 )
            camera.position = savePos; camera.rotation.order = 'YXZ'
            camera.zoom = saveZoom
            camera.updateProjectionMatrix()

            anim3d(info.orbiter, 'scale', {x:1,y:1,z:1})
            anim3d(info.titleblock, 'position', {z:7.5})
            anim3d(info.btn, 'position', {z:12})

            controls = new THREE.OrbitControls(camera)
            anim3d(controls, 'target', {y: -2})
            camera.translateZ(0);
            camera.rotation = saveRot
            controls.addEventListener( 'change', check )
            anim3d(sprite, 'sprite', {frames: 11, dest: 0, spd: 400})
            anim3d(caption, 'scrollmap', {x: 0})

        } else { // change to perspective
            console.log(saveRot)
            camera = new THREE.PerspectiveCamera(50, aspect, 0.5, 100)
            camera.rotation = saveRot; camera.rotation.order = 'YXZ'
            camera.zoom = saveZoom; camera.position = savePos;
            camera.updateProjectionMatrix()

            anim3d(info.orbiter, 'scale', {x:0.8,y:0.8,z:0.8})
            anim3d(info.titleblock, 'position', {z:9})
            anim3d(info.btn, 'position', {z:13})

            controls = new THREE.OrbitControls(camera)
            anim3d(controls, 'target', {y: -2})
            camera.translateZ(15);
            controls.addEventListener( 'change', check )
            anim3d(sprite, 'sprite', {frames: 11, dest: 10, spd: 400})
            anim3d(caption, 'scrollmap', {x: 0.5})
        }
        rotateTo(0)
        cameraPerspective = !cameraPerspective
        console.log('camera is now perspective: '+cameraPerspective)
        check()
    }
    function forceNext(){
        part++; refill(true)
    }
    function forceToPart(which){
        part = which
        refill(true)
    }
    function forceStory(storynumber){
        story = storynumber; refill(true)
    }
    function pctCalc(){
        //calc percentages for pillar change in offline mode
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
        percentages = percentagesArray
    }
