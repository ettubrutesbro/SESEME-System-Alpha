

$(document).ready(function(){
	
	var items = [];
	
	
	
	var altmode = false; //boolean for determining whether to display in main unit or alternate unit

	//integer for determining selection modes - 1 is planar, 2 is dimensional, 3 is bar
	var selectionMode=2;

	
	
// BUILDING(0) WHEN(1) WHAT(2) SERVO HEIGHT 15-165(3) ACTUAL NUMBER(4) UNIT(5) GRADE(6)  
// ALTERNATIVE NUMBER (7) ALTERNATIVE UNIT (8) ALTERNATIVE QUERY (9) REGULAR QUERY (10)

		var metric1=["Tranquility Base", "This time Yesterday", "Power Use", 35, 20, "Watts", "D", "$2.49", "Per 4 minutes", "see in dollars...", "see in kilowatt hours.."]; 
		var metric2=["Tranquility Base", "Right Now", "Solar Gain", 26, 15, "Watts", "D", "$2.07", "Per 4 minutes", "see in dollars...", "see in kilowatt hours.."];
		var metric3=["Tranquility Base", "Right Now", "Power Use", 80, 100, "Watts", "B", "$8.62", "Per 4 minutes", "see in dollars...", "see in kilowatt hours.."];
		var metric4=["Tranquility Base", "This time Yesterday", "Solar Gain", 120, 135, "Watts", "C", "$12.89", "Per 4 minutes", "see in dollars...", "see in kilowatt hours.."];
		
		metric1.name= 'metric1';
		metric2.name= 'metric2';
		metric3.name= 'metric3';
		metric4.name= 'metric4';
		var onDisplay = metric3;
		var selectedBox = onDisplay.name.replace('metric','box');
		
planarPush(metric3);
dataDisplay('#dimensionalInfo');
	
// for BAR MODE, this function will update all 4 lines of data.
// it will be nested within an interval function because it's 'passive' - not called through a mouseclick like the other states.
	function barUpdate(line, metric){ //this function updates the bar data display that shows all 4 stats
		if(metric=='metric1'){
			//another inelegant solution...if there were a way to parse out the quotes or something
			// in the passed variable/array....str.replace didn't seem to do it.
			metric = metric1;
			line = '#line1';
			} else if(metric=='metric2'){
			metric = metric2;
			line = '#line2';
			} else if (metric=='metric3'){
			metric = metric3;
			line = '#line3';
			} else if (metric=='metric4'){
			metric = metric4;
			line = '#line4';
			}
	$(line + ' #data').text(metric[4]);
	$(line + ' #dataUnit').text(metric[5]);
	$(line + ' #time').text(metric[1]);
	$(line + ' #locationStatistic').text(metric[2] + "  |  " + metric[0]);
	}
	
	function allbarUpdate(){
		for(var i = 1; i<5; i++){ //this for loop should update lines1-4 with metrics 1-4
			barUpdate("line" + i, "metric" + i);
		}
	}
	
//this function animates pillar heights that show up in DIMENSIONAL MODE and BAR MODE.
// it gets nested within an interval function so that the pillars are always matching their variables even as the latter undergoes changes. 
			function pillarUpdate(pillar, metric){ 
				$(pillar + '.sides').animate({
				height: (metric*3) + 'px'
				}, 900);	
				$(pillar +'#top').animate({
				bottom: (metric*3) - 100 + 'px'
				}, 900);
			};
	
		function allPillarsUpdate(){
			console.log('ran all update');
			pillarUpdate('#box1 ', metric4[3]);
			pillarUpdate('#box2 ', metric1[3]);
			pillarUpdate('#box3 ', metric2[3]);
			pillarUpdate('#box4 ', metric3[3]);
		}
	
	
		setInterval(function(){
10
			metric4[3] = Math.random() * (130-5) + 5
			metric3[3] = Math.random() * (130-5) + 5
			metric2[3] = Math.random() * (130-5) + 5
			metric1[3] = Math.random() * (130-5) + 5
			
	
		},1800)
	
//to be used after a JSON call, this function puts new values into the metrics, then updates the on-screen pillars, then pushes data to the data display field
function allUpdate(){
		
		items.splice(0,9);
		$.getJSON('http://10.0.1.201:8080/rest/testdata?hour='+jsonHr+'&minute='+jsonMin, function(data) {
			$.each(data, function(key, val) {
			items.push(val);
			}
			)
		metric4[4]=items[0];
		metric3[4]=items[2];
		metric4[3]=items[4];
		metric1[3]=items[8];
		metric2[4]=items[5];
		metric3[3]=items[3];
		metric1[4]=items[7];
		metric2[3]=items[6];
		allPillarsUpdate();
			}
			
			)
		
		var target = $(this).attr('id');
		console.log(target);
		
		}
		
setInterval(function(){			
			planarPush(onDisplay);
			allPillarsUpdate();
			console.log(metric4[3]);
	},800)


	
		
	//parametered animation for transitioning between different data displays (fade dimensional, intro planar, etc.)
		function dataDisplay(show){
			$('.below article').not(show).fadeOut(300, function(){
			var fadecheck = $('.below article').css('display');
			
			if(fadecheck=='none'){
				$(show).delay(300).fadeIn(300);
			}
		})
		}
		
		
// THESE 3 functions add animation classes to the pillars when buttons are pressed as well as run dataDisplay, removing and revealing relevant data per mode
// PLANAR and BAR modes rely on a "selection mask", non-3d implicit shape layers overlaid over the document (don't account for 3d distortion), for item
// selection...so the mask is brought to the fore in their modes, and pushed to the back in DIMENSIONAL
		
	//PLANAR MODE 	
	$('#planar').click(function(){
		selectionMode=1;
		dataDisplay('#planarInfo');
		$('#container').removeClass().addClass('planar');
		$('.box figure').animate({'background-color': 'rgba(0,0,0,0)'},1000);
		
		$('#selectionmask').css('z-index','6');
		$('#selectionlayer1').css('display','block');
		$('#selectionlayer2').css('display','none');
		
	});
	
	//DIMENSIONAL MODE
	$('#dimensional').click(function(){
		$('.box figure').not('#' + selectedBox + ' figure').animate({'border-color': 'rgba(255,255,255,0.5)'},300);
		$('.box figure').animate({'background-color': 'rgba(0,0,0,0.9)'},300);
		
		selectionMode=2;
		dataDisplay('#dimensionalInfo');
		
		$('#selectionmask').css('z-index','-1');
		//this part of the function checks WHICH MODE we are transitioning from, so that it can push in the correct animation class. 
		var fromBar = $('#container').hasClass('bar')
		var fromPlanar = $('#container').hasClass('planar')
		
		
		if(fromPlanar) {
			$('#container').removeClass().addClass('fromPlanar dimensional');
		} else if(fromBar){
			$('#container').removeClass().addClass('fromBar dimensional');
			$('#box3').removeClass('backLeft');
			$('#box4').removeClass('backRight');
			$('#box3').addClass('backBackLeft');
			$('#box4').addClass('backBackRight');
		}		
	});
	
	//BAR MODE
	$('#bar').click(function(){
		selectionMode=3;
		$('.box figure').animate({'background-color': 'rgba(0,0,0,0.6)'},500);
		$('.box figure').not('#' + selectedBox + ' figure').animate({'border-color': 'rgba(255,255,255,0)'},500);
		dataDisplay('#barInfo');
		$('#selectionmask').css('z-index','30');
		$('#selectionlayer1').css('display','none');
		$('#selectionlayer2').css('z-index','30');
		$('#selectionlayer2').css('display','block');
		

		$('#container').removeClass().addClass('bar');
		$('#box3').removeClass('backBackLeft');
		$('#box4').removeClass('backBackRight');
		$('#box3').addClass('backLeft');
		$('#box4').addClass('backRight');
	
	});
	
//MODE SELECTION: The following functions are for when users interact with items that can be 'selected'. Upon selection in PLANAR and DIMENSIONAL, data about one pillar is pushed to the display.
//these SELECTION FUNCTIONS can be more efficient if we streamline them and combine them. that's complicated by the fact that all modes use different methods of selecting pillars,
//but relevant data should be pushed to displays whether or not the display modes are visible. 


	//DIMENSIONAL SELECTION
	$('.box').click(function(){ 
		if(selectionMode==2){
		dataDisplay('#dimensionalInfo');
		$('.box figure').css('border-color','rgba(255,255,255,0.5)');
		var target = $(this).attr('id');
		$("#"+target+" figure").css('border-color','rgba(255,255,255,1)');
		var getNumber = target.replace('box', '');
			// var metric = 'metric' + getNumber + []; -- there is some weird difficulty with 'piecing together' array names as function 
			// arguments from variables and addition, resulting in a less elegant solution below. if we figure out how to use the above...that'd be good.			
			if(getNumber==1){
					metric=metric1;
				}else if(getNumber==2){
					metric=metric2;
				}else if(getNumber==3){
					metric=metric3;
				}else if(getNumber==4){
					metric=metric4;
			}	
			//push data
			planarPush(metric);
			
			
		}
	})
		
		
	// PLANAR SELECTION
		//streamlined style changes on selection
		function planarBorderSelect(whichBox){
			
			$('.box figure').not(whichBox).css('border-color','rgba(255,255,255,0.5)');
			$(whichBox + " figure").css('border-color', 'rgba(255,255,255,1)');
		}
		//universal data push
		function planarPush(metric){
			onDisplay = metric;
			selectedBox = onDisplay.name.replace('metric','box');
			//planar
			$('#planarInfo #locationSelect').text(metric[0]);
			$('#planarInfo #statistic').text(metric[2]);
			$('#planarInfo #time').text(metric[1]);
			//dimensional
			stillIntro = false;
			$('#unitStatisticTime').text(metric[1] +" "+ metric[2]);
			$('#locationSelect').text(metric[0]);
			$('#data').text(metric[4]);
			$('#dataUnit').text(metric[5]);
			//bar
			allbarUpdate();
			var lineNo = metric.name.replace('metric', '');
			
			$('#barInfo div').not('#line'+lineNo).css('color','rgba(255,255,255,0.4)');
			$('#line'+lineNo).css('color','rgba(255,255,255,1)');
			
			
		}
		
		//the planar selection itself
		$('.planarQuads').click(function(){
			var target = $(this).attr('id')
			if(target=='bottomleft'){
				planarBorderSelect('#box1');
				planarPush(metric1);
				}else if(target=='bottomright'){
				planarBorderSelect('#box2');
				planarPush(metric2);
				}else if(target=='topleft'){
				planarBorderSelect('#box3');
				planarPush(metric3);
				}else if(target=='topright'){
				planarBorderSelect('#box4');
				planarPush(metric4);
				}
		});
		
		
		
		
	//BAR SELECTION
		$('.barQuads').click(function(){ //this just highlights text since data should already be displayed
			var target = $(this).attr('id');
			
			if(target=='leftleft'){
				$('.box figure').not('#box3').css('border-color', 'rgba(255,255,255,0)');
				$('#box3 figure').css('border-color', 'rgba(255,255,255,1)');	
				$('#barInfo div').not('#line3').css('color','rgba(255,255,255,0.4)');
				$('#line3').css('color','rgba(255,255,255,1)');
				planarPush(metric3);
			}
			if(target=='rightright'){
				$('#barInfo div').not('#line4').css('color','rgba(255,255,255,0)');
				$('#line4').css('color','rgba(255,255,255,1)');
				$('.box figure').not('#box4').css('border-color', 'rgba(255,255,255,0)');
				$('#box4 figure').css('border-color', 'rgba(255,255,255,1)');	
				planarPush(metric4);
			}
			if(target=='middleright'){
				$('#barInfo div').not('#line2').css('color','rgba(255,255,255,0)');
				$('#line4').css('color','rgba(255,255,255,1)');
				$('.box figure').not('#box2').css('border-color', 'rgba(255,255,255,0)');
				$('#box2 figure').css('border-color', 'rgba(255,255,255,1)');	
				planarPush(metric2);
			} if(target=='middleleft'){
				$('#barInfo div').not('#line1').css('color','rgba(255,255,255,0)');
				$('#line1').css('color','rgba(255,255,255,1)');
				$('.box figure').not('#box2').css('border-color', 'rgba(255,255,255,0)');
				$('#box1 figure').css('border-color', 'rgba(255,255,255,1)');
				planarPush(metric1);
			}
			})
			
		
		//reverse bar selection: selecting lines of text in bar mode will highlight bars and push data as well.
		$('#barInfo div').click(function(){
			var target = $(this).attr('id');
			$('#barInfo div').not('#'+target).css('color','rgba(255,255,255,0.4)');
			$('#'+target).css('color','rgba(255,255,255,1)');
			if(target == "line1"){
				planarPush(metric1);
				$('.box figure').not('#box1').css('border-color', 'rgba(255,255,255,0)');
				$('#box1 figure').css('border-color', 'rgba(255,255,255,1)');		
			}else if (target == "line2"){
				planarPush(metric2);
				$('.box figure').not('#box2').css('border-color', 'rgba(255,255,255,0)');
				$('#box2 figure').css('border-color', 'rgba(255,255,255,1)');	
			}else if (target =="line3"){
				planarPush(metric3);
				$('.box figure').not('#box3').css('border-color', 'rgba(255,255,255,0)');
				$('#box3 figure').css('border-color', 'rgba(255,255,255,1)');	
			}else if (target=="line4"){
				planarPush(metric4);
				$('.box figure').not('#box4').css('border-color', 'rgba(255,255,255,0)');
				$('#box4 figure').css('border-color', 'rgba(255,255,255,1)');	
				}
		})
	
	
// CLOCK CODE

		var d = new Date();
		var hours = d.getHours();
		var mins = d.getMinutes();
		var clockpile = (hours*60)+mins;
		var displayhrs2;
		var displaymins2;
		var ampm;
		var jsonMin;
		var jsonHr;
		var newValue = new Array("0");
		
		var displayhrs = Math.floor(clockpile/60);
		
		var displaymins = clockpile-(displayhrs*60);
		
		timeDisplay(displayhrs, displaymins);
		
	jsonHr = hours;	
	jsonMinuteConversion(mins);

	allUpdate();
	

	//SUBTRACTION AND ADDITION FUNCTIONS
	function timeSubtract(val){
		hours = d.getHours();
		mins = d.getMinutes();
		clockpile = (hours*60)+mins;
		var difference = val*4
		clockpile=clockpile-difference;
		displayhrs2 = Math.floor(clockpile/60);
		displaymins2 = clockpile-(displayhrs2*60);
	}
	function timeAddition(val, oldval){
		var difference = (oldval-val)*4
		clockpile=clockpile+difference;
		displayhrs2 = Math.floor(clockpile/60);
		displaymins2 = clockpile-(displayhrs2*60);
	}
	
	//12 hour conversion, minute +0 etc
	
	function timeDisplay(hrs, mins){
		if(hrs>12){
			hrs-=12;
			ampm = "pm";
		}else if (hrs<12){
			ampm = "am";
			}
		if(mins<10){
			mins = "0" + mins;
		}
		
		if(hrs==0){
			hrs=12;
			if(ampm == "am"){
				ampm = "am";}
				else{
				ampm = "pm";
				}
			}
		
		$("#clock").text(hrs + ":" + mins + " " +ampm);
	}
	
	//JSON MINUTE (4 MIN INTERVAL) CONVERSIOn
	function jsonMinuteConversion(when){
		if(when<=6){
				jsonMin = 4;
			}else if(when>6&&when<=10){
				jsonMin = 8;
			}else if(when>10&&when<=14){
				jsonMin = 12;
			}else if(when>14&&when<=18){
				jsonMin = 16;
			}else if(when>18&&when<=22){
				jsonMin = 20;
			}else if(when>22&&when<=26){
				jsonMin = 24;
			}else if(when>26&&when<=30){
				jsonMin = 28;
			}else if(when>30&&when<=34){
				jsonMin = 32;
			}else if(when>34&&when<=38){
				jsonMin = 36;
			}else if(when>38&&when<=42){
				jsonMin = 40;
			}else if(when>42&&when<=46){
				jsonMin = 44;
			}else if(when>46&&when<=50){
				jsonMin = 48;
			}else if(when>50&&when<=54){
				jsonMin = 52;
			}else if(when>54&&when<=58){
				jsonMin = 56;
			}else if(when>58&&when<=60){
				jsonMin = 0;
			}
	}

	
	
	
		min: 0,
	$('#timeSlider').slider({
		isRTL: true,
		min: 0,
		max: 360,
		range: 'max',
		
		change: function(){
			
			var valey = $('#timeSlider').slider("value");
	
			newValue.unshift(valey);
			var oldValue = newValue.pop();

			if(newValue[0]>oldValue){
				timeSubtract(newValue[0]);
			} else if (newValue[0]<oldValue){
				timeAddition(newValue[0], oldValue);
			}
			
			if(displayhrs2<0){
				displayhrs2+=24;
			}
			
			
			if(displayhrs2>=6&&displayhrs2<12){
			$('.ui-slider-horizontal .ui-slider-handle').css('background', 'url("svg/morning.svg") no-repeat 50% 50%');
			$('.ui-slider-horizontal .ui-slider-handle').css('-webkit-transform', 'scale(2)');
			} else if(displayhrs2>=12&&displayhrs2<17){
			$('.ui-slider-horizontal .ui-slider-handle').css('background', 'url("svg/afternoon.svg") no-repeat 50% 50%');
			$('.ui-slider-horizontal .ui-slider-handle').css('-webkit-transform', 'scale(3)');
			} else if (displayhrs2>=17||displayhrs2<6){
			$('.ui-slider-horizontal .ui-slider-handle').css('background', 'url("svg/night.svg") no-repeat 50% 50%');
			$('.ui-slider-horizontal .ui-slider-handle').css('-webkit-transform', 'scale(2)');
			}
			
			jsonHr = displayhrs2;
			
			jsonMinuteConversion(displaymins2);
			
			
			allUpdate();
			timeDisplay(displayhrs2, displaymins2);
		}
	
	
	})
		
		// end document ready function
		})

 
	


