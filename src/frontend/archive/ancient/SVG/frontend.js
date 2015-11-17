
var socket = io('10.0.1.241:5000')

var tag = [tagMorn, tagNoon, tagNite, tagLate], building = [buildingMorn, buildingNoon, buildingNite, buildingLate], school = [schoolMorn, schoolNoon, schoolNite, schoolLate]
var scaleSet = [tag, building, school]

var stateArray = [dataMorning, dataNoon, dataEvening, dataMidnight]
var currentSet = 1
var valueArray = [[500],[500],[500],[500]]

var mainSvg = Snap("#mainSvg")

var ht = window.screen.availHeight
var wid = window.screen.availWidth


Snap.load("sesemeiso3.svg", function(svgFile){
	var g
	g = svgFile.select("svg")
	mainSvg.append(g)

	myElement = document.getElementById('mainSvg')
	//mc.x for touch functions
	var mc = new Hammer(myElement)
	//the pillars and their masks
	var a = g.select("#a"), b = g.select("#b"), c = g.select("#c"), d = g.select("#d")
	var pillarArray = [a,b,c,d]
	var themasks = g.select("#themasks")
	//icon highlighting for dataset
	var firstRed = $("#dataSetIcons li").get(currentSet)
	$(firstRed).css('border','3px red solid')


	g.attr({ //hacky init transforms make stuff look right...adjust as necessary 
		viewBox: "220 100 550 1920",
		transform: "t 0 30 s 1.3"
	})
	themasks.attr({ //these are just off, so this transform fixes their positioning
		transform: "t 200 120"
	})

	moveToData(stateArray[currentSet]) //right away, go to dataset

	pillarArray.forEach(function(ele,i){ //every pillar when clicked does selectPillar
		ele.click(function(){
			selectPillar(ele,450)
		})
	})	

	//swiping in directions changes the displayed data set
	mc.on("swipeleft", function(ev){
		metricSwipe("left")
	})
	mc.on("swiperight", function(ev){
		metricSwipe("right")
	})


	function metricSwipe(direction){  
		if(direction=="right"){ //-1
			console.log("right")
			if(currentSet==0){
				currentSet = stateArray.length-1
			} else{
			currentSet-=1
			}
		}
		else if(direction=="left"){ //+1
			console.log("left" + currentSet)
			if(currentSet==stateArray.length-1){
				currentSet = 0
			} else{
			currentSet+=1
			console.log(currentSet)
			}
		} //end of direction conditionals

		moveToData(stateArray[currentSet])
		if(currentSet==0){
				$("#metric").text('scc energy - morning')
			}else if(currentSet==1){
				$("#metric").text('scc energy - afternoon')
			}else if(currentSet==2){
				$("#metric").text('scc energy - evening')
			}else if(currentSet==3){
				$("#metric").text('scc energy - midnight')
			}

		var listSelect = $("#dataSetIcons li").get(currentSet) //highlights icons
		$("#dataSetIcons li").not($(listSelect)).css('border','0px red solid')
		$(listSelect).css('border','3px red solid')
	
	} //end function metricSwipe


	function moveToData(dataSet){ //new dataset = pillar translation and server msg
		var lightv = 0

		pillarArray.forEach(function(ele,i){
			//console.log(dataSet[i])
			valueArray[i].unshift(500-((dataSet[i].height)*5))
			var translation = valueArray[i][0]
			movePillar(ele,translation,0)
			var nameSlot =  $('#names li').get(i)
			$(nameSlot).text(dataSet[i].name) //pushes names into li

			var valSlot =  $('#values li').get(i)
			$(valSlot).text(dataSet[i].value+ " " + dataSet[i].metric) //pushes values into li

			lightv += dataSet[i].height
		})
		
		var jsonData = { //data push to server for pillar movement / light change
			height: dataSet[0].height,
			lightValue: Math.round(lightv/100)
		}
		//console.log(JSON.stringify(jsonData))
		socket.emit('demo shit', jsonData)

	} //end function moveToData

	function movePillar(pillar, amount, delay){ //pillar motion function
		//set delay 
		var ltr = pillar.attr('id')
		var mask = g.select("#mask" + ltr ).select("#m" + ltr)
		var strokemask = themasks.select("#strokemask" + ltr).select('rect')

		pillar.animate({
			transform: "t 0 " + amount
		},(amount*2.5)+500,mina.easeinout)
		
		mask.animate({
			transform: "t 0 " + -amount
		},(amount*2.5)+500,mina.easeinout)

		strokemask.animate({
			transform: "t 0 " + -amount
		},(amount*2.5)+500,mina.easeinout)

	}//end function movePillar



	function selectPillar(pillar, speed){ //pillar highlighting function
		var ltr = pillar.attr('id')
		unselectPillars(450)
		var stroker = pillar.select('#' + ltr + '_stroker')
		stroker.animate({
			strokeDashoffset: 0
		}, speed)

		//hacky workaround --------------------------------------
		if(ltr=='a'){
			console.log('lets go')
			var listHilight1 = $('#names li').get(0)
			var listHilight2 = $('#values li').get(0)
			$('#names li').css('background-color','rgba(255,0,0,0)')
			$('#values li').css('background-color','rgba(255,0,0,0)')
			$(listHilight1).css('background-color','#34A849')
			$(listHilight2).css('background-color','#34A849')
		}

		if(ltr=='b'){
			console.log('lets go')
			var listHilight1 = $('#names li').get(1)
			var listHilight2 = $('#values li').get(1)
			$('#names li').css('background-color','rgba(255,0,0,0)')
			$('#values li').css('background-color','rgba(255,0,0,0)')
			$(listHilight1).css('background-color','#0FA1C5')
			$(listHilight2).css('background-color','#0FA1C5')
		}

		if(ltr=='c'){
			console.log('lets go')
			var listHilight1 = $('#names li').get(2)
			var listHilight2 = $('#values li').get(2)
			$('#names li').css('background-color','rgba(255,0,0,0)')
			$('#values li').css('background-color','rgba(255,0,0,0)')
			$(listHilight1).css('background-color','#F8A71A')
			$(listHilight2).css('background-color','#F8A71A')
		}

		if(ltr=='d'){
			console.log('lets go')
			var listHilight1 = $('#names li').get(3)
			var listHilight2 = $('#values li').get(3)
			$('#names li').css('background-color','rgba(255,0,0,0)')
			$('#values li').css('background-color','rgba(255,0,0,0)')
			$(listHilight1).css('background-color','rgba(255,255,255,0.1)')
			$(listHilight2).css('background-color','rgba(255,255,255,0.1)')
		}

	}//end function selectPillar

	function unselectPillars(speed){ //generic deselect for selecting new pillars
		strokerArray = [a.select('#a_stroker'),b.select('#b_stroker'),c.select('#c_stroker'),d.select('#d_stroker')]
		offsetArray = [1600,1600,1600,1600]
		strokerArray.forEach(function(ele,i){
			ele.attr({
				strokeDashoffset: offsetArray[i]
			})			
		})

	} //end function unselectPillars




	
})

