    
    //3d.js: all three.js code for SESEME UI. 1) DISPLAY   2) ANIMATE   3) INTERACT

    //basic display 
    var container //dom element
    var scene = new THREE.Scene()
    // in the near future this will need to be dependent on 
    // parent container's dimensions not the window
    var aspect = window.innerWidth / window.innerHeight

    var d = 20
    var camera = new THREE.OrthographicCamera( - d * aspect, d * aspect, d, - d, 1, 1000 )
    var loader = new THREE.JSONLoader()
    var renderer
   
    //dividing loaded model into manipulable groups 
    var seseme = new THREE.Group()
    var pedestal, orb
    var pillar1, pillar2, pillar3, pillar4
    var pillargroup = new THREE.Group()

    //data array stores all data
    //on user data shift (changing metric/scale),
    //sample requested section of data array and pass to value array
    //value(s) in array interface with the pillars

    var val1, val2, val3, val4
    var valarray = [val1, val2, val3, val4]


    //variables for INTERACT functions
    var raycaster
    var mouseLocation = new THREE.Vector2()
    var clickTarget

    //variables for ANIMATION
    var currentPosition = {x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0}
    var targetPosition = {x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0}

    //-----------------------------------------------
    // END GLOBAL VARIABLE DECLARATION
    //-----------------------------------------------


    //core functions setup scene and draw it every frame
    setup()
    animate() //render() is nested in here


    function setup(){
      camera.position.set( -20, 20, 20 )
      camera.rotation.order = 'YXZ'
      camera.rotation.y = - Math.PI / 4
      camera.rotation.x = Math.atan( - 1 / Math.sqrt( 2 ) )

      //place the renderer(canvas) within DOM element (div)
      container = document.createElement("div")
      document.body.appendChild(container)
      container.id = "containerSESEME"
      renderer = new THREE.WebGLRenderer()
      renderer.setSize( window.innerWidth, window.innerHeight )
      container.appendChild( renderer.domElement )

      //materials for seseme & orb (eventually need multiples for seseme?)
      var sesememtl = new THREE.MeshPhongMaterial(0x0000ff)
      //var sesememtl = new THREE.MeshNormalMaterial(0x0000ff)
      var orbmtl = new THREE.MeshPhongMaterial(0xffffff)
      var outlinemtl = new THREE.MeshBasicMaterial( { color: 0xff0000, linewidth: 4} )

      //LIGHTING
      light = new THREE.PointLight(0xffffff, 0.5)
      light2 = new THREE.AmbientLight(0x1a1a1a, 0)
      light.position.set(0,17,10)
      scene.add(light)
      scene.add(light2)

      // INTERACT setup -- event listener, initializing interact vars
      window.addEventListener( 'mousemove', onMouseMove, false)
      window.addEventListener( 'mouseup', onMouseUp, false)
      mouseLocation = { x:0, y:0, z:1 }
      raycaster = new THREE.Raycaster()

      //outline attempts

      
     

      // EXTERNAL LOADING - getting .js 3d models into the canvas
      loader.load("assets/pedestal.js", function(geometry,evt){

        pedestal = new THREE.Mesh(geometry, sesememtl)
        pedestal.applyMatrix( new THREE.Matrix4().makeTranslation(1.5, 0, 1))
        pedestal.scale.set(0.5,0.5,0.5)
        pedestal.name = "pedestal"
        pedestal.overdraw = true
        seseme.add(pedestal)

      }) 

      loader.load("assets/pillarA.js", function(geometry,evt){

         var outTgt = geometry.vertices
         // var outlineGeometry = new THREE.Geometry()
         // outlineGeometry.vertices.push(outTgt[2], outTgt[3], outTgt[0], outTgt[8])
        // var outlineGeometry2 = new THREE.Geometry()
        // outlineGeometry2.vertices.push(outTgt[2], outTgt[1], outTgt[0])
        // var outlineGeometry3 = new THREE.Geometry()
        // outlineGeometry3.vertices.push(outTgt[3], outTgt[5], outTgt[4])
        // var outlineGeometry4 = new THREE.Geometry()
        // outlineGeometry4.vertices.push(outTgt[1], outTgt[6], outTgt[7])
        // var outlineGeometry5 = new THREE.Geometry()
        // outlineGeometry5.vertices.push(outTgt[2], outTgt[9], outTgt[5]) 
        // var outlineGeometry6 = new THREE.Geometry()
        // outlineGeometry6.vertices.push(outTgt[9], outTgt[6])

        pillar1 = new THREE.Mesh(geometry, sesememtl)
        pillar1.applyMatrix( new THREE.Matrix4().makeTranslation( -5, 0, -5 ) )
        pillar1.scale.set(0.5,0.5,0.5)
        pillar1.overdraw = true
        pillar1.name = "pillar1"
        pillargroup.add(pillar1)

         var outlineGeometry = new THREE.Geometry()
         outlineGeometry.vertices = [outTgt[2], outTgt[3], outTgt[3],
         outTgt[0], outTgt[0], outTgt[1], outTgt[2],outTgt[1],outTgt[0],outTgt[8],outTgt[8],outTgt[4],
         outTgt[4],outTgt[5], outTgt[5], outTgt[3], outTgt[1],outTgt[6],outTgt[6],outTgt[7]]
         var line = new THREE.Line(outlineGeometry, outlinemtl)
         line.type = THREE.LinePieces
         line.name = "line1"
         pillar1.add(line)

        
        

        pillar3 = new THREE.Mesh(geometry, sesememtl)
        pillar3.applyMatrix( new THREE.Matrix4().makeTranslation( 5, 0, -5 ) )
        pillar3.scale.set(0.5,0.5,0.5)
        pillar3.rotation.y = -90 * Math.PI / 180
        pillar3.overdraw = true
        pillar3.name = "pillar3"
        pillargroup.add(pillar3)
      })

      loader.load("assets/pillarB.js", function(geometry,evt){
        pillar2 = new THREE.Mesh(geometry, sesememtl)
        pillar2.applyMatrix( new THREE.Matrix4().makeTranslation( -5, 0, -5 ) )
        pillar2.scale.set(0.5,0.5,0.5)
        pillar2.overdraw = true
        pillar2.name = "pillar2"
        pillargroup.add(pillar2)

        pillar4 = new THREE.Mesh(geometry, sesememtl)
        pillar4.applyMatrix( new THREE.Matrix4().makeTranslation( -5, 0, 5 ) )
        pillar4.scale.set(0.5,0.5,0.5)
        pillar4.rotation.y = 90 * Math.PI / 180
        pillar4.overdraw = true
        pillar4.name = "pillar4"
        pillargroup.add(pillar4)

      })

      //the orb is generated here (adjust segments for smooth)
      orb = new THREE.Mesh( new THREE.SphereGeometry( 2.75, 7, 5 ), orbmtl )
      orb.position.set(0,-3,0) //it's down but visible
      seseme.add (orb)

      seseme.add(pillargroup)
      scene.add (seseme)

      updateValues(1,10,100)
      updateValues(2,5,30)
      updateValues(3,9,90)
      updateValues(4,0,80)
    

      // updateValues(A,X,Y) targets pillar A, moves it X, over Y time (ms)
      // eventually, we'll query server for currentScale and currentMetric,
      // then call updateValues to all 4 pillars
    } //end setup

    function animate(){ //put 3d animations here
        requestAnimationFrame( animate )
        render()

        //PILLAR ANIMATION FUNCTION
        //pillars are always going to strive towards valarray values

        //this is a pretty broken function, mathematically.....
        //it has this weird simultaneous addition / subtraction and
        //produces insanely granular decimal values (hence the 
        // weird < 0.01 conditional....)

        pillargroup.children.forEach(function(ele,i,array){
          if(valarray[i].value > 0.01 || valarray[i].value < -0.01 ){
            var s = valarray[i].value / valarray[i].duration
            ele.position.y += s
            valarray[i].value -= s
          }else{
            valarray[i].value=0
          }
        })

        TWEEN.update()
        //seseme.rotation.y = 

     

      

      } // end animate

    function render() { //put frame-by-frame checks and operations here
      //such as RENDERING or checking

        //DISPLAY
        renderer.render( scene, camera )
        
        //DEBUG functions
        //seseme.rotation.y += 0.01
        // if(intersects.length > 0){ //intersection diagnostic: what's in front?
        //   console.log(intersects[0].object.name)
        // }
      

        //INTERACT functions
        //INTERACT functions
        //INTERACT functions
     

    } // end render

    function onMouseMove(evt){ //mouse movements update X / Y pos
      evt.preventDefault()
      mouseLocation.x = ( evt.clientX / window.innerWidth ) * 2 - 1;
      mouseLocation.y = - ( evt.clientY / window.innerHeight ) * 2 + 1;
     } // end onMouseMove

     function onMouseUp(evt){
      raycaster.setFromCamera(mouseLocation, camera)
   
      var intersects = raycaster.intersectObjects(pillargroup.children)
      console.log('moused up on ' + intersects[0].object.name)

      //prototype seseme rotation script
      //get current rotation (global), set target based on selection 
      //(local) [corresponding arrays], new tween b/w rotation/target,
      //then outside functions for tween.onUpdate etc.
 
     // if mouseUp'd over a pillar: 
      var index = (intersects[0].object.name).replace('pillar','') 
      var rotationTargetArray = [0, -90, 90, -180]
      console.log(rotationTargetArray[index-1])

      targetPosition.ry = rotationTargetArray[index-1]*(Math.PI / 180)


      var tween = new TWEEN.Tween(currentPosition)

      var update = function(){
        scene.rotation.y = currentPosition.ry
        console.log(currentPosition.ry)
      }

      tween.to(targetPosition,750) 
      tween.easing(TWEEN.Easing.Quadratic.Out)
      tween.onUpdate(update)

      tween.start()

     }


    function updateValues(index, change, duration){ //valarray[index] is updated,
      // causing pillar[index] to move by change over duration
      // causing pillar[index] to move by change over duration
      // causing pillar[index] to move by change over duration

      valarray[index-1] = {"value": change, "duration": duration}
      //console.log(valarray[index-1])

    }

   function lineDraw(){
    

   }

    