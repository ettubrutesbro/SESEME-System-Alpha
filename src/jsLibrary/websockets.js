var path = require('path');
var lifxState = {};
var readySeedlings = [];

////////////////////////////////////////////////
//  Create Objects Vars
////////////////////////////////////////////////

function seedlingObj(story, currentPart, totalStoryParts, seedlingOnline, seedlingSocket, buttonPressed, number, readyState){
  this.story = story;
  this.currentPart = currentPart;
  this.totalStoryParts = totalStoryParts;
  this.online = seedlingOnline;
  this.socket = seedlingSocket;
  this.buttonPressed = buttonPressed;
  this.number = number;
  this.ready = readyState;
}

function lightTrailObj(trailColor, nodes, time, revolutions){
  this.trailColor = trailColor
  this.nodes = nodes;
  this.time = time;
  this.revolutions = revolutions;
}

function systemOnline(debug) {
    // Check if the beagle is connected
    var print = [];
    var isOnline = true;
        print.push("Beagle status: [offline]");
        isOnline = false;
    //} else print.push("Beagle status: [online]");
    for(var i = 0; i < 3; i++) {
        // Check if all seedlings are connected
        if(!seedlings[i].online) {
            isOnline = false;
            print.push("Seedling "+(i+1)+": [offline]");
        } else if(!seedlings[i].ready) {
            isOnline = false;
            print.push("Seedling "+(i+1)+": [online, not ready]");
        } else {
            print.push("Seedling "+(i+1)+": [online and ready]");
        }
    }
    var status = isOnline ? "ONLINE" : "OFFLINE";
    console.log("======================= [SYSTEM "+status+"] =======================");
    if(debug) for(var logs in print) console.log(print[logs]);
    return isOnline;
}

// Check the system every 5 mins
setInterval(function() { systemOnline(1); }, 300000);

////////////////////////////////////////////////
//  Constants
////////////////////////////////////////////////

var hue = require(path.join(__dirname, 'hue.js'));
var stories = require(path.join(__dirname, 'stories.js'));
var led = require(path.join(__dirname, 'led.js'));
var soundObj = require(path.join(__dirname, 'soundObj.js'));
var sounds = require(path.join(__dirname, 'sounds.js'));
var lifx = require(path.join(__dirname, 'lifx.js'));
var motorMoveSlope = 0.001532452;
var motorMoveConstant = 1.11223288003;
var socket = require('socket.io');

lifx.test = 'test';

////////////////////////////////////////////////
//  SEEDLING Vars
////////////////////////////////////////////////
var seedlings = new Array(3); // 3 seedling objects
var totalStoryParts = new Array(3);
var seedlingIO = new Array(3);
var story = new Array(3);

story[0] = stories["testStory"];
story[1] = stories["finalStory"];
story[2] = stories["finalStory"];

for(var i = 0; i < 3; i++){
  seedlingIO[i] = new socket.listen(6000+i);
  totalStoryParts[i] = story[i].parts.length; // number of parts in a story
}

var currentPart = 0; // set story Part currently on
var seedlingOnline = false;
var seedlingSocket = null;
var buttonPressed = false;
var readyState = false;
for(var i = 0; i < 3; i++){
  seedlings[i] = new seedlingObj(story[i], currentPart, totalStoryParts[i], seedlingOnline, seedlingSocket, buttonPressed, i, readyState);
}

////////////////////////////////////////////////
// COUNTDOWN 'TIL IDLE STATE
////////////////////////////////////////////////
var seconds = 120; // Global seconds variable
var lastActiveSeedling = 0; // Global variable to store the seedling pressed last
var idleCountdown;
var desperation;
var idleBehavior;

// Function to start the lifx idle behavior
function idleBehavior(lifx) {

	// Start breathing (no maintenance needed to clear it)
	console.log("Lifx: Started breathing");
	var repeatBreathe = lifx.breathe();

	// Set a timeout to start desperation after a minute of breathing
	setTimeout(function() {
        clearTimeout(repeatBreathe);
		// Start desperation immediately after breathing ends
		console.log("Lifx: Started desperation");
		var states = getStates();
		lifx.desperation(states);

		// Set the interval of cycles through the story part colors
		desperation = setInterval(function() {
			lifx.desperation(states)
		}, states.length * 5000);
	}, 120000);
}

function countdown() {
	if (seconds < 1) {
        console.log("[SESEME NOW IN IDLE MODE]!");

		// Begin the lifx idle state behavior
		idleBehavior(lifx);

		// Set a 4 minute timeout to turn off the bulb after the idle behavior
		setTimeout(function() {
			if(desperation) clearInterval(desperation);
			lifx.fadeOff(5).then(console.log("Lifx: Fading Off"));
		}, 240000);

		// Broadcast to all clients that state is now idle
        for(var i = 0; i < 3; i++) {
            // Check if the seedlings are connected first to emit to them
            if(seedlings[i].socket) {
                // For the seedling that was active last, set the interval to 6s
                if(lastActiveSeedling === i)  // Set interval for 12s for the others
                    seedlings[i].socket.emit('seedling start breathing', 6, seedlings[i].number);
                else seedlings[i].socket.emit('seedling start breathing', 12, seedlings[i].number);
            }
        }
		// Stop decrementing counting down and return
		return;
	}
	seconds--;
	idleCountdown = setTimeout(countdown, 1000);
}
// Make sure to broadcast to all when the button is pressed
countdown();

function getStates() {
	var states = [];
	for(var i = 0; i < story[lastActiveSeedling].parts.length; i++) {
		var state = {};
		if(story[lastActiveSeedling].parts[i].color.monument) {
			state.color = story[lastActiveSeedling].parts[i].color.monument.hex;
			state.brightness = 1 * story[lastActiveSeedling].parts[i].color.monument.bri;
		} else if(story[lastActiveSeedling].parts[i].color) {
			state.color = story[lastActiveSeedling].parts[i].color;
			state.brightness = 0.5;
		} else {
			state.color = 'red',
			state.brightness = 0;
		}
		states.push(state);
	}
	return states;
}

////////////////////////////////////////////////
//  web
////////////////////////////////////////////////
var io = new socket.listen(5000);
var webbyOnline = 0;
var webby = null;
var uiSocket = null;
var lastSeedlingPlayed = 0;
var previousSounds = [];
initPreviousSounds();

function initPreviousSounds() {
	for(var i = 0; i < 4; i++) {
		previousSounds.push({
			'soundName': null,
			'index': null,
			'type': null,
		});
	}
}

function randomSoundWeight(obj, type, socket){
  var randValue;
  for(;;) { // Keep replacing the random value until it is a desired value
    randValue = Math.floor((Math.random() * obj[type].length-1) + 1);
    if((randValue === previousSounds[0].index) ||
       (randValue === previousSounds[1].index) ||
       (randValue === previousSounds[2].index) ||
       (randValue === previousSounds[3].index)) continue;
    else break;
  }
  // ['1', '2', '3', '4']  <-- '4' would be the sound index to avoid most
  if(previousSounds.length === 4) previousSounds.shift();
  previousSounds.push({
    'soundName':obj[type][randValue],
    'index':randValue,
    'type':type
  });
  console.log("Sending '"+obj[type][randValue]+"' to the seedling")
  socket.emit('seedling play sound', obj[type][randValue]);
}

io.on('connection', function (socket) {
  webbyOnline = 1;
  webby = socket;
  console.log(socket.request.connection.remoteAddress + ' connected to web socket.io');

  // ===========================================================================================
  // Seedling communication related to sounds
  var seedlingToPlay = Math.floor(Math.random() * 3);
  if(seedlingToPlay === lastSeedlingPlayed)
      seedlingToPlay = (seedlingToPlay + 1) % 3;
  // Check if the seedlings are connected first to emit to them
  if(seedlings[seedlingToPlay].socket) {
      console.log("Playing random sound from seedling "+seedlingToPlay);
    //   seedlings[seedlingToPlay].socket.emit('seedling play random-sound', 'dumb', previousSounds);
      randomSoundWeight(soundObj, 'dumb', seedlings[seedlingToPlay].socket);

      lastSeedlingPlayed = seedlingToPlay;
  } else {
      console.log("Error playing login sound: Seedling " + seedlingToPlay + " is disconnected.");
      lastSeedlingPlayed = seedlingToPlay;
  }

  socket.on('xps update previous-sounds', function(updatedSounds) {
    previousSounds = updatedSounds;
  });

  // ===========================================================================================
  // Front-end communication
  uiSocket = socket;

  socket.on('ui request story', function() {
		// Have the frontend acquire the story data
		io.sockets.emit('ui acquire story', {
			story: story[lastActiveSeedling],
			part: seedlings[lastActiveSeedling].currentPart,
			percentages: heightCalcGeneric(story[lastActiveSeedling].parts[currentPart])
		});
  });

  socket.on('sim lifx', function(data) {
		lifx.validButtonPress(data.hex, data.bri);
		lifxState.color = data.hex; lifxState.brightness = 0.5 * data.bri;
  });

  socket.on('sim breathe', function(data) {
		console.log("Simulating breathe");
		lifx.breathe();
  });

  socket.on('sim desperation', function(data) {
		console.log("Simulating desperation");
		var states = getStates();
		lifx.desperation(states);

		if(desperation) clearInterval(desperation);
		desperation = setInterval(function() {
			lifx.desperation(states)
		}, states.length * 5000);
  });

  // Front-end simulation of a button press
  socket.on('sim button', function(seedlingNum) {
      if(!seedlings[seedlingNum].buttonPressed){
          seedlings[seedlingNum].buttonPressed = true;
          bigRedButton(seedlings[seedlingNum]);
      } else { console.log('Wrong'); }
  });

  // Update the seconds in the web page
  setInterval(function(){
    socket.emit('updateTime', seconds);
  }, 1000);

  socket.on('webMoveMotor', function(data){
    console.log('motor:' + data.motor + '  steps:' + data.steps + '  direction:' + data.dir)
    if(beagleOnline){
      console.log('beagle ONLINE')
      beagle.emit('webMoveMotor', data);
    }
  })


});


////////////////////////////////////////////////
//  BEAGLE Vars
////////////////////////////////////////////////
var beagleIO = new socket.listen(4000);
var beagle = null;
var beagleOnline = false;
var sesemeRunning = false;
var updateFlag = false;
var beagleStatsFlag = false;
var maxDistanceFlag = false;
var beagleStats = null;
var beagleTime = -1;
var plrmax = 5000; // lazy without sockets
// this plrmax refers to steps (motors)

function heightCalcGeneric(data){
  //pass in story[i].parts[part].values, get percentages
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
  return percentagesArray
}

/*
// delete if heightcalc generic work
function heightCalc(data){
  var top = 100, bottom = 0
  var destSteps = {m1: null, m2: null, m3: null, m4: null};
  if(!data.valueType || data.valueType === "moreIsTall"){
    top = !data.customHi ? Math.max.apply(null, data.values) : data.customHi
    bottom = !data.customLo ? Math.min.apply(null, data.values) : data.customLo
  }
  else if(data.valueType === 'lessIsTall'){
    top = !data.customHi ? Math.min.apply(null, data.values) : data.customHi
    bottom = !data.customLo ? Math.max.apply(null, data.values) : data.customLo
  }
  var range = Math.abs(bottom-top)
  for(var i = 0; i < 4; i++){
    destSteps["m"+(i+1)] = Math.round( Math.abs(bottom-data.values[i])/range * plrmax )
  }
  return destSteps;
}
*/

function fadeCircleObj(targetColor, duration, diodePct){
    this.targetColor = targetColor;
    this.duration = duration;
    this.diodePct = diodePct;
}

function seedlingConnected(seedSocket, seedlingNum){
  var seedling = seedlings[seedlingNum];
  console.log('[SEEDLING ' + (seedlingNum+1) + ': CONNECTED]')
  seedling.socket = seedSocket;

  seedling.socket.on('checkin', function(data){
    console.log('[SEEDLING ' + (seedlingNum+1) + ': CHECKED IN]')
    console.log(data)
  });

  seedling.socket.on('bigRedButton', function(){
    if(!seedling.buttonPressed){
      console.log('[SEEDLING ' + (seedlingNum+1) + ': VALID BUTTON PRESS]')
      seedling.buttonPressed = true;
      seedling.socket.emit('seedling play sound', seedling.story.sound);
      bigRedButton(seedling);
    }
    else{
      console.log('[SEEDLING ' + (seedlingNum+1) + ': INVALID BUTTON PRESS]')
    } // currently in animation
  });

  seedling.socket.on('seedling ' + (seedlingNum+1) + ' On', function(){
    seedling.online = true;
    seedling.currentPart = 0;
    console.log('[SEEDLING ' + (seedlingNum+1) + ': ONLINE]')
  });

  seedling.socket.on('seedling finished inits', function(num) {
      seedlings[num].ready = true;
      if(systemOnline())
        seedlingIO[0].emit('seedling start sync-sequence-1');
        //   seedlings[0].socket.emit('seedling start sync-sequence-1');
  });

  seedling.socket.on('disconnect', function(){
    seedling.online = false;
    console.log('[SEEDLING ' + (seedlingNum+1) + ': DISCONNECTED]')
  })
}

function bigRedButtonHelper(seedling, maxDistance, targetPercentagesArray, plrmax, error){
  var trailColor = led.hexToObj("FFFFFF");
  var monumentHexColor = led.hexToObj(seedling.story.parts[seedling.currentPart].color.monument.hex;
  var uiColor = led.hexToObj(seedling.story.parts[seedling.currentPart].color.ui;
  console.log("monumentHexColor", monumentHexColor);
  console.log("uiColor", uiColor);
  var targetColor = monumentHexColor ? led.hexToObj(monumentHexColor) : led.hexToObj(uiColor);
  var hueColor = led.hexToObj(seedling.story.parts[seedling.currentPart].ledColor);
  var duration = Math.ceil(maxDistance * motorMoveSlope + motorMoveConstant); // simple motion get time(sec) rounded up
  var diodePct = (seedling.currentPart+1) / seedling.totalStoryParts * 100;
  var fadeCircleData = new fadeCircleObj(targetColor, duration, diodePct);

  if(seedling.currentPart + 1 == seedling.totalStoryParts){
    duration += 3;
  } // will run fill circle so add 3 sec to duration of lightTrail and timeout

  //var lightTrailData = new lightTrailObj(trailColor, 6, duration / seedling.totalStoryParts, seedling.totalStoryParts);
  var timePerRev = 2;
  var lightTrailData = new lightTrailObj(trailColor, 6, timePerRev, Math.ceil(duration/timePerRev));


  if(error) {
    if(seedling.socket)
        seedling.socket.emit("error buttonPressed", seedling.number, fadeCircleData, lightTrailData, seedling.buttonPressed);
  }

  else {
    // // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    // // COMMENT THIS SECTION OUT TO MAKE BUTTON PRESS WORK WITHOUT SOUND (along with the }); at the bottom)
    // // --> This block is to play a sound upon button press
    // // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    // var buttonSounds = story[lastActiveSeedling].parts[seedling.currentPart].sound;
    // if(!buttonSounds || buttonSounds.length)
    //     seedling.socket.emit('seedling start button-sound', null);
    // else {
    //     var buttonSounds = buttonSounds[Math.floor((Math.random() * buttonSounds.length-1) + 1)];
    //     seedling.socket.emit('seedling start button-sound', buttonSounds);
    // }
    // seedling.socket.on('seedling finished button-sound', function() {
    // // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

        // ===============================================================================
        // Increment current part of the story and reset the idle countdown
        seedling.currentPart = (seedling.currentPart+1) % seedling.totalStoryParts;
        if(idleCountdown) clearTimeout(idleCountdown);
        seconds = 120;
        countdown();

        // Set the variable to keep track of the last seedling that had its button pressed
        lastActiveSeedling = seedling.number;

    	// Begin lifx valid button press behavior
    	if(story[lastActiveSeedling].parts[seedling.currentPart].color.monument) {
    		var lifxHex = story[lastActiveSeedling].parts[seedling.currentPart].color.monument.hex;
    		var lifxBri = story[lastActiveSeedling].parts[seedling.currentPart].color.monument.bri;
    		lifx.validButtonPress(lifxHex, lifxBri ? lifxBri : 0.5);
    	} else if(story[lastActiveSeedling].parts[seedling.currentPart].color)
    		lifx.validButtonPress(story[lastActiveSeedling].parts[seedling.currentPart].color, 0.5);
    	else lifx.validButtonPress('red', 0);

        // Send the new height calculations to the frontend
        var result;
        if(uiSocket && lastActiveSeedling === seedling.number) {
            result = heightCalcGeneric(seedling.story.parts[seedling.currentPart]);
            io.sockets.emit('ui update part', {part: seedling.currentPart, percentages: result} );
        } else if(uiSocket && lastActiveSeedling !== seedling.number) {
            result = heightCalcGeneric(seedling.story.parts[seedling.currentPart]);
            io.sockets.emit('ui different story', {story: seedling.story, percentages: result} );
        } else console.log("Connection with server not made...")

        for(var i = 0; i < 3; i++){
          if(seedlings[i].online) {
            seedlings[i].socket.emit("buttonPressed", seedling.number, fadeCircleData, lightTrailData);
          }
        }
        if(beagleOnline) beagle.emit("buttonPressed", targetPercentagesArray, plrmax, targetColor);

        setTimeout(function(){
          console.log("--> updated seedling attributes");
        //   seedling.currentPart = (seedling.currentPart+1) % seedling.totalStoryParts;
          seedling.buttonPressed = false;
        }, Math.ceil(duration)*1000); // update seedling attributes after animation done
    // }); // end of socket listener
  }
}


function bigRedButton(seedling){
  var plrmax = 5000;
  if(beagleOnline){
    beagle.emit('getBeagleStats');
    beagle.emit('isRunning'); // check if seseme is running
    var targetPercentagesArray = heightCalcGeneric(seedling.story.parts[seedling.currentPart]);
    var maxDistance = 0;

    var timer1 = setInterval(function(){
      if(beagleStatsFlag){
        clearInterval(timer1);
        for(var i = 0; i < 4; i++){
          var temp = Math.round( Math.abs( targetPercentagesArray[i]*plrmax - beagleStats["m"+(i+1)] ) );
          if(temp > maxDistance) maxDistance = temp;
        }
        console.log("maxDistance: " + maxDistance);
        beagleStatsFlag = false;
        maxDistanceFlag = true; // done with setting maxDistance
      } //
    }, 20);

    var timer2 = setInterval(function(){
      if(updateFlag && maxDistanceFlag){
        clearInterval(timer2);
        maxDistanceFlag = false;
        if(!sesemeRunning){
          bigRedButtonHelper(seedling, maxDistance, targetPercentagesArray, plrmax, false);
        }
        else
          console.log("seseme currently running")
          bigRedButtonHelper(seedling, maxDistance, targetPercentagesArray, plrmax, true);
          //seedling.socket.emit("playType", "idler");
      }
    }, 20);
  }
  else{
    console.log("will run button helper");
    bigRedButtonHelper(seedling, 5000, null, plrmax, false);
  }
}


////////////////////////////////////////////////
//  SEEDLING
////////////////////////////////////////////////

seedlingIO[0].on('connection', function(seedSocket){
  seedlingConnected(seedSocket, 0);
});
seedlingIO[1].on('connection', function(seedSocket){
  seedlingConnected(seedSocket, 1);
});
seedlingIO[2].on('connection', function(seedSocket){
  seedlingConnected(seedSocket, 2);
});

////////////////////////////////////////////////
//  BEAGLE - Seseme Monument
////////////////////////////////////////////////

beagleIO.on('connection', function(beagleSocket){
  if(systemOnline()) {
        seedlingIO[0].emit('seedling start sync-sequence-1');
        // Listen for when to pass the next sync sequence to the next seedling
        seedlingIO[0].on('seedling finish sync-sequence-1', function() {
            console.log("Finished sync-sequence-1")
            seedlingIO[1].emit('seedling start sync-sequence-2');
        });
        seedlingIO[1].on('seedling finish sync-sequence-2', function() {
            console.log("Finished sync-sequence-2")
            seedlingIO[2].emit('seedling start sync-sequence-3');
        });
  }
  beagle = beagleSocket;
  console.log('[BEAGLE: CONNECTED]')
  beagleSocket.on('checkin', function(data){
      console.log('[BEAGLE: CHECKED IN]')
    console.log(data)
  })

  beagleSocket.on('checkSesemeRunning', function(data){
    console.log("checkSesemeRunning data: " + data);
    sesemeRunning = data;
    updateFlag = true; // finished isRunning check and change flag
  })

  beagleSocket.on('returnBeagleStats', function(data){
    console.log("returnBeagleStats data: " + JSON.stringify(data));
    beagleStats = data;
    beagleStatsFlag = true; // got beagle stats
  })

  beagleSocket.on('beagle 1 On', function(){
    beagleOnline = true;
    console.log('[BEAGLE: ONLINE]')
  });

  beagleSocket.on('disconnect', function(){
    beagleOnline = false;
    console.log('[BEAGLE: DISCONNECTED]')
  })

});
