var path = require('path');
var print = require('./print.js');
var lifxState = {};
var readySeedlings = [];

////////////////////////////////////////////////
//	Create Objects Vars
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

var claptron = require(path.join(__dirname, '..', 'xps', 'slackbot.js'));

// System check function to send a report to the slack diagnostics channel
function reportSystemStatus() {
	// Check if the beagle is connected
    var systemStatus = {};
	var pretext;

	// Assume system is good right now
	var allGood = true;

    // Check the status of the beagle
	if(beagleOnline)
		systemStatus.monument = 'online';
	else {
		systemStatus.monument = 'offline';
		allGood = false;
	}

	// Check if all seedlings are connected
	for(var i = 0; i < 3; i++) {
		if(seedlings[i].online)
			systemStatus['pi'+(i+1)] = 'online';
		else {
			systemStatus['pi'+(i+1)] = 'offline';
			allGood = false;
		}
	}

	var slackColor = (allGood) ?	"#00ff00" : "#f30020";
	pretext = pretext || ((allGood) ? "it's lit" : "fuckin' garbage");
	claptron.reportSysCheck(systemStatus, pretext);
}

exports.reportSystemStatus = reportSystemStatus;

// Check if all the seedlings are ready
function seedlingsReady() {
	var isReady = true;
	for(var i = 0; i < 3; i++) {
		// Check if all seedlings are connected
		if(!seedlings[i].ready) isReady = false;
	}
	return isReady;
}

////////////////////////////////////////////////
//	Constants
////////////////////////////////////////////////

var stories = GLOBAL.stories;
var led = require(path.join(__dirname, 'led.js'));
var soundObj = require(path.join(__dirname, 'soundObj.js'));
var lifx = require(path.join(__dirname, 'lifx.js'));
var motorMoveSlope = 0.001532452;
var motorMoveConstant = 1.11223288003;
var socket = require('socket.io');

// Upon server startup, ensure the seedling hue is off
lifx.turnOff(1);

////////////////////////////////////////////////
//	BEAGLE Vars
////////////////////////////////////////////////
var beagleIO = new socket.listen(4000);
var beagle = null;
var stepperPositionAr = null;
var beagleOnline = false;
var sesemeRunning = false;
var updateFlag = false;
var maxDistanceFlag = false;
var beagleTime = -1;
var plrmax = 4800; // lazy without sockets
// this plrmax refers to steps (motors)

////////////////////////////////////////////////
//	SEEDLING Vars
////////////////////////////////////////////////
var lockButtonPress = false;
var seedlings = new Array(3); // 3 seedling objects
var totalStoryParts = new Array(3);
var seedlingIO = new Array(3);
var story = new Array(3);

story[0] = stories["environment"];
story[1] = stories["society"];
story[2] = stories["misc"];

for(var i = 0; i < 3; i++){
	seedlingIO[i] = new socket.listen(6000+i);
	totalStoryParts[i] = story[i].parts.length; // number of parts in a story
}

//var currentPart = 0; // set story Part currently on
var seedlingOnline = false;
var seedlingSocket = null;
var buttonPressed = false;
var readyState = false;
for(var i = 0; i < 3; i++){
	seedlings[i] = new seedlingObj(story[i], 0, totalStoryParts[i], seedlingOnline, seedlingSocket, buttonPressed, i, readyState);
}

////////////////////////////////////////////////
//	MONUMENT Pi Vars
////////////////////////////////////////////////
var monumentLightsIO = new socket.listen(7000);
var monumentLightsOnline = false;
var monument = null;

////////////////////////////////////////////////
// COUNTDOWN 'TIL IDLE STATE
////////////////////////////////////////////////
var seconds = 120; // Global seconds variable
var lastActiveSeedling = 0; // Global variable to store the seedling pressed last
var idleCountdown;

////////////////////////////////////////////////
// Initialize GLOBAL story variables
////////////////////////////////////////////////
GLOBAL.part = 0;
GLOBAL.story = 0;
GLOBAL.percentages = heightCalcGeneric(story[lastActiveSeedling].parts[seedlings[lastActiveSeedling].currentPart]);

// Globals related to representing the idle state
var startDesperation;
var breathing;
var desperate;
var idleDone;

// Function to ensure that the idle state
function stopIdleState() {
	if(breathing)			clearInterval(breathing);
	if(desperate)			clearInterval(desperate);
	if(startDesperation)	clearTimeout(startDesperation);
	if(idleDone)			clearTimeout(idleDone);
}

// Function to start the lifx idle behavior
function idleBehavior(lifx) {
	// TEMP: Have active seedling turn off its light ring on idle
	// May want to add some breathe feature for lastActiveSeedling's lights

    // TODO: Thomas fix this later pls
	// if(seedlings[lastActiveSeedling].online)
	// 	seedlings[lastActiveSeedling].socket.emit('seedling turn off lights', lastActiveSeedling);

	// Start breathing (no maintenance needed to clear it)
	print("LIFX: Started Breathing");
	breathing = setInterval(function() {
		lifx.breathe();
	}, 2000);

	// Set a timeout to start desperation after a minute of breathing
	startDesperation = setTimeout(function() {
		if(breathing) clearInterval(breathing);
		// Start desperation immediately after breathing ends
		var states = getStates();
		lifx.desperation(states);

		// Set the interval of cycles through the story part colors
		desperate = setInterval(function() {
			lifx.desperation(states)
		}, states.length * 5000);
	}, 120000);
}

setInterval(function() {
    lifx.updateLight({ power: 'off' });
}, 900000);

function countdown() {
	if (seconds < 1) {
		print("[SESEME NOW IN IDLE MODE]!");
		lockButtonPress = false; // temp fix of clearing variable if idle (wait 2 min)
		// Begin the lifx idle state behavior
		idleBehavior(lifx);

		// Set a 4 minute timeout to turn off the bulb after the idle behavior
		idleDone = setTimeout(function() {
			stopIdleState();
			lifx.fadeOff(5).then(print("LIFX: Fading Off"));
		}, 240000);

		// Broadcast to all clients that state is now idle
		for(var i = 0; i < 3; i++) {
			// Check if the seedlings are connected first to emit to them
			if(seedlings[i].socket) {
			  seedlings[i].socket.emit('seedling idle behavior', seedlings[i].number);
/*
				// For the seedling that was active last, set the interval to 6s
				if(lastActiveSeedling === i)	// Set interval for 12s for the others
					seedlings[i].socket.emit('seedling start breathing', 6, seedlings[i].number);
				else seedlings[i].socket.emit('seedling start breathing', 12, seedlings[i].number);
*/
			}
		}
		if(monumentLightsOnline) monument.emit('monumentLights idle behavior');
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

/////////////////////////////////////////////////////////////
// Upon server startup, ensure the monumnet is set to the current story's color
var lifxInitProps = { 'power' : 'on' };
var activeSeedlingPart = seedlings[lastActiveSeedling].currentPart;
if(story[lastActiveSeedling].parts[activeSeedlingPart].color.monument) {

	lifxInitProps.color = story[lastActiveSeedling]
		.parts[activeSeedlingPart].color.monument.hex;

	lifxInitProps.brightness = 1 * story[lastActiveSeedling]
		.parts[activeSeedlingPart].color.monument.bri;
}
else if(story[lastActiveSeedling].parts[activeSeedlingPart].color) {

	lifxInitProps.color = story[lastActiveSeedling]
		.parts[activeSeedlingPart].color;

	lifxInitProps.brightness = 0.5;
}
else {
	lifxInitProps.color = 'red',
	lifxInitProps.brightness = 0;
}
print("Starting LIFX Light: "+JSON.stringify(lifxInitProps,null,2));
lifx.updateLight(lifxInitProps);

////////////////////////////////////////////////
//	web
////////////////////////////////////////////////
var io = new socket.listen(5000);
var webbyOnline = 0;
var webby = null;
var uiSocket = null;
var lastSeedlingPlayed = 0;
var previousSounds = {};
initPreviousSounds();

function initPreviousSounds() {
	previousSounds.topical = [];
	previousSounds.dumb = [];
	previousSounds.no = [];
	previousSounds.ready = [];
	previousSounds.celebratory = [];

	for(var i = 0; i < 4; i++) {
		previousSounds.topical.push({
			'soundname': null,
			'index': null,
			'type': null,
		});
		previousSounds.dumb.push({
			'soundname': null,
			'index': null,
			'type': null,
		});
		previousSounds.no.push({
			'soundname': null,
			'index': null,
			'type': null,
		});
		previousSounds.ready.push({
			'soundname': null,
			'index': null,
			'type': null,
		});
		previousSounds.celebratory.push({
			'soundname': null,
			'index': null,
			'type': null,
		});
	}
}

function randomSoundWeight(obj, type, socket){
	var randValue;
	for(;;) { // Keep replacing the random value until it is a desired value
		randValue = Math.floor((Math.random() * obj[type].length-1) + 1);
		if((randValue === previousSounds[type][0].index) ||
			 (randValue === previousSounds[type][1].index) ||
			 (randValue === previousSounds[type][2].index) ||
			 (randValue === previousSounds[type][3].index)) continue;
		else break;
	}
	// ['1', '2', '3', '4']	<-- '4' would be the sound index to avoid most
	if(previousSounds[type].length === 4) previousSounds[type].shift();
	previousSounds[type].push({
		'soundName':obj[type][randValue],
		'index':randValue,
		'type':type
	});
	print("Sending '"+obj[type][randValue]+"' To The Seedling");
	socket.emit('seedling play sound', obj[type][randValue]);
}

io.on('connection', function (socket) {
	webbyOnline = 1;
	webby = socket;
	print(socket.request.connection.remoteAddress + ' Connected!');

	socket.on('error', function (err) {
		print("Socket Error! "+err);
		error(err);
	});

	// ==============================================================================
	// Seedling communication related to sounds
	var seedlingToPlay = Math.floor(Math.random() * 3);
	if(seedlingToPlay === lastSeedlingPlayed)
			seedlingToPlay = (seedlingToPlay + 1) % 3;
	// Check if the seedlings are connected first to emit to them
	if(seedlings[seedlingToPlay].socket) {
		print("Playing Random Sound From Seedling "+seedlingToPlay);
		randomSoundWeight(soundObj, 'dumb', seedlings[seedlingToPlay].socket);

		lastSeedlingPlayed = seedlingToPlay;
	} else {
		print("Error Playing Login Sound: Seedling " + seedlingToPlay + " is Disconnected.");
		lastSeedlingPlayed = seedlingToPlay;
	}

	socket.on('xps update previous-sounds', function(updatedSounds) {
		previousSounds = updatedSounds;
	});

	// ==============================================================================
	// Front-end communication
	uiSocket = socket;

	setInterval(function() {
		socket.emit('interval', 'connection test');
	}, 5000);

	socket.on('emit to all', function(data) {
		io.sockets.emit('receive something', data);
	});

	socket.on('sim lifx', function(data, stripColor) {
		lifx.validButtonPress(data.hex, data.bri);
		lifxState.color = data.hex; lifxState.brightness = 0.5 * data.bri;
		var color = led.hexToObj(stripColor)
		seedlings[0].socket.emit('test color', color);
	});

	socket.on('sim breathe', function(data) {
		print("Simulating Breathe");
		lifx.breathe();
	});

	socket.on('sim desperation', function(data) {
		print("Simulating Desperation");
		var states = getStates();
		lifx.desperation(states);

		if(desperate) clearInterval(desperate);
		desperate = setInterval(function() {
			lifx.desperation(states)
		}, states.length * 5000);
	});

	socket.on('check lockButtonPress', function(){
		print("check lockButtonPress ===" + lockButtonPress);
	});

	socket.on('check buttonPress', function(seedlingNum){
		print("check seedlings[" + seedlingNum + "].buttonPressed ===" + seedlings[seedlingNum].buttonPressed);
	});

	// Front-end simulation of a button press
	socket.on('sim button', function(seedlingNum) {
		if(lockButtonPress === true){
			print("lockButtonPress: true");
			for(var i = 0; i < seedlings.length; i++){
				if(seedlings[i].buttonPressed === true){
					print("seedlings[" + i + "].buttonPressed === true");
				}
			}
			print('[SEEDLING ' + (seedlingNum+1) + ': INVALID BUTTON PRESS]')
			randomSoundWeight(soundObj, 'no', seedling.socket);
			seedling.socket.emit('seedling add lights duration', lastActiveSeedling);
			return;
		} // lock doesn't allow

		lockButtonPress = true;

		var seedling = seedlings[seedlingNum];
		/*
		var error = false;
		for(var i = 0; i < seedlings.length; i++){
			if(seedlings[i].buttonPressed === true){
				print("error is true", i)
				error = true;
				break;
			} // invalid button press
		}
		*/

		checkSesemeRunning(function(data){
			print("In checkSesemeRunning Callback");
			//if(!error && !data){
			if(!data){
					// If system is in idle mode, clear the lifx breathe/desperation intervals
				stopIdleState();
				print('[SEEDLING ' + (seedlingNum+1) + ': VALID BUTTON PRESS]')
				for(var i = 0; i < 3; i++){
					if(seedlings[i].online)
						seedlings[i].buttonPressed = true;
				}
				//seedling.buttonPressed = true;
				bigRedButtonHelper(seedling);
			}
			else{
				print('[SEEDLING ' + (seedlingNum+1) + ': INVALID BUTTON PRESS]')
				randomSoundWeight(soundObj, 'no', seedling.socket);
				seedling.socket.emit('seedling add lights duration', lastActiveSeedling);
			} // currently in animation
		}); // end of checkSesemeRunning
	});

	socket.on('reset position', function(){
		stepperPositionAr = [0, 0, 0, 0];
	});

	socket.on('request status', function(seedlingNum) {
		socket.emit('status report', {
			'lastActiveSeedling: ':lastActiveSeedling,
			'currentPart: ':seedlings[lastActiveSeedling].currentPart
		});
	});

	// Update the seconds in the web page
	setInterval(function(){
		socket.emit('updateTime', seconds);
	}, 1000);

	socket.on('webMoveMotor', function(data){
		print('Motor:' + data.motor + '	Steps:' + data.steps + '	Direction:' + data.dir)
		if(beagleOnline){
			print('[MONUMENT ONLINE]')
			beagle.emit('webMoveMotor', data);
		}
	})

});

io.on('disconnect', function() {
	print("[CLIENT DISCONNECTED]");
;});


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

function circleObj(previousColor, targetColor, duration, diodePct){
	this.previousColor = previousColor;
	this.targetColor = targetColor;
	this.duration = duration;
	this.diodePct = diodePct;
}

function getRingColor(seedling, currentPart){
	var ringColor = seedling.story.parts[currentPart].color.ring;
	var monumentHexColor = seedling.story.parts[currentPart].color.monument.hex;
	var uiColor = seedling.story.parts[currentPart].color.ui;
	var targetColor;
	if(ringColor) targetColor = led.hexToObj(ringColor);
	else if(monumentHexColor) targetColor = led.hexToObj(monumentHexColor);
	else targetColor = led.hexToObj(uiColor); // if no uiColor, defaults to "#FFFFFF"
	return targetColor;
}

function checkSesemeRunning(callback){
	print("In checkSesemeRunning()");
	if(beagleOnline){
		beagle.emit('isRunning'); // check if seseme is running

		var timer = setInterval(function(){
			if(updateFlag){
				clearInterval(timer);
				if(!sesemeRunning){
					print("SESEME Not Running");
					callback(false);
					return;
				}
				else {
					print("SESEME Currently Running");
					callback(true);
					return;
				}
			}
		}, 20);
	}
	else{
		print("SESEME Not Running (Monument Off)");
		callback(false);
		return;
	}
}

function seedlingConnected(seedSocket, seedlingNum){
	var seedling = seedlings[seedlingNum];
	print('[SEEDLING ' + (seedlingNum+1) + ': CONNECTED]')
	seedling.socket = seedSocket;

	seedling.socket.on('checkin', function(data){
		print('[SEEDLING ' + (seedlingNum+1) + ': CHECKED IN]')
		print(data)
	});

	seedling.socket.on('bigRedButton', function(){
		if(lockButtonPress === true){
			print("lockButtonPress: true");
			print('[SEEDLING ' + (seedlingNum+1) + ': INVALID BUTTON PRESS]')
			randomSoundWeight(soundObj, 'no', seedling.socket);
			seedling.socket.emit('seedling add lights duration', lastActiveSeedling);
			return;
		} // lock doesn't allow

		lockButtonPress = true;

		checkSesemeRunning(function(data){
			print("In checkSesemeRunning Callback");
			//if(!error && !data){
			if(!data){
					// If system is in idle mode, clear the lifx breathe/desperation intervals
				stopIdleState();
				print('[SEEDLING ' + (seedlingNum+1) + ': VALID BUTTON PRESS]')
				for(var i = 0; i < 3; i++){
					if(seedlings[i].online)
						seedlings[i].buttonPressed = true;
				}
				//seedling.buttonPressed = true;
				bigRedButtonHelper(seedling);
			}
			else{
				print('[SEEDLING ' + (seedlingNum+1) + ': INVALID BUTTON PRESS]')
				randomSoundWeight(soundObj, 'no', seedling.socket);
				seedling.socket.emit('seedling add lights duration', lastActiveSeedling);
			} // currently in animation
		}); // end of checkSesemeRunning
	});

	seedling.socket.on('seedling ' + (seedlingNum+1) + ' On', function(){
		seedling.online = true;
		seedling.currentPart = 0;
		print('[SEEDLING ' + (seedlingNum+1) + ': ONLINE]')
		if(seedling.ready){
			var targetColor = getRingColor(seedling, seedling.currentPart); // seedling.currentPart should be 0;
			print("Initialize Seedling Story");
			seedling.socket.emit('seedling initialize story', lastActiveSeedling, targetColor); // initialize first seedling and turn on buttons on first connect
		}
	});

	seedling.socket.on('seedling finished inits', function(num) {
		print("Seedling Finished Initializing Socket");
		seedlings[num].ready = true;
		var targetColor = getRingColor(seedling, seedling.currentPart); // seedling.currentPart should be 0;
		print("Initializing Seedling Story");
		seedling.socket.emit('seedling initialize story', lastActiveSeedling, targetColor); // initialize first seedling and turn on buttons on first connect
		if(seedlingsReady()) {

			// Sync sequence listeners
			seedlings[0].socket.once('seedling finish sync-sequence-1', function() {
					print("Finished sync-sequence-1")
					seedlings[1].socket.emit('seedling start sync-sequence-2');
			});
			seedlings[1].socket.once('seedling finish sync-sequence-2', function() {
					print("Finished sync-sequence-2")
					seedlings[2].socket.emit('seedling start sync-sequence-3');
			});

			print("Starting Sync Sequence");
			seedling.socket.emit('seedling start sync-sequence-1');
		}
	});

	seedling.socket.on('seedling actionCircle done', function(seedlingNum){
		//var allSeedlingsDone = true;
    /*
		print("Action Circle Done: " + seedling.number);
		seedling.buttonPressed = false;
		print("seedlings[" + seedling.number + "].buttonPressed === false");
		if(seedling.number === seedlingNum){
			// seedling.buttonPressed = false;
			randomSoundWeight(soundObj, 'ready', seedling.socket);
		}
    */

/*
		for(var i = 0; i < 3; i++){
			if(seedlings[i].buttonPressed === true){
				allSeedlingsDone = false;
				break;
			}
		} // allSeedlingsDone remains true only if all buttonPressed vars are false
		if(allSeedlingsDone){
			print("Unlock buttonPress");
			lockButtonPress = false;
		} // unlock to allow button press
    */
	})

	seedling.socket.on('disconnect', function(){
		seedling.online = false;
		seedling.ready = false;
		print('[SEEDLING ' + (seedlingNum+1) + ': DISCONNECTED]')

		// Report to the diagnostics channel that the seedling went down
		var slackTitle = 'Seedling (.3'+(seedling.number+2)+') Disconnected!';
		claptron.reportDisconnect(slackTitle);
	});
}

function bigRedButtonHelper(seedling){
	var trailColor = led.hexToObj("FFFFFF");
	var targetColor, diodePct;
	var targetPercentages = [];
	var maxDistance = 0;

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	print("- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -");
	print(" Previous Story: "+lastActiveSeedling);
	print(" Previous Story's Part: "+seedlings[lastActiveSeedling].currentPart);
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	if(seedling.number === lastActiveSeedling){
		print("Incrementing Story Part");

		// Get previous part color for fadeCircle function
		previousColor = getRingColor(seedling, seedling.currentPart);


		// Increment current part of the same story
		seedling.currentPart = (seedling.currentPart + 1) % seedling.totalStoryParts;
		diodePct = seedling.currentPart === 0 ? 100: seedling.currentPart / seedling.totalStoryParts * 100;

		// Calculate the result of the
		// print("Emitting 'ui update part' to the front-end");
		// targetPercentages = heightCalcGeneric(seedling.story.parts[seedling.currentPart]);
		// io.sockets.emit('ui update part', {part: seedling.currentPart, percentages: targetPercentages} );
		//
		// // Setting variables for fading the led circle
	}
	// Update the story to the new one
	else{
		// Set previous color as #000000 since fading from nothing
		previousColor = led.hexToObj("000000");

		seedling.currentPart = 0;
		print("Changing to Different Story")
		diodePct = 0;

		// // Call the frontend to update to a different story
		// targetPercentages = heightCalcGeneric(seedling.story.parts[seedling.currentPart]);
		// print("Emitting 'ui different story' to the front-end");
		// io.sockets.emit('ui different story', {story: seedling.story, percentages: targetPercentages} );
	}

	// Reset the countdown to idle state
	if(idleCountdown){
		clearTimeout(idleCountdown);
	}
	seconds = 120;
	countdown();

    // Update globals and send new values to the frontend
	print("Emitting Story To The Frontend")
	targetPercentages = heightCalcGeneric(seedling.story.parts[seedling.currentPart]);
    io.sockets.emit('ui update', {
        part: seedling.currentPart,
        story: seedling.number,
        percentages: targetPercentages
    });
    GLOBAL.part = seedling.currentPart;
    GLOBAL.story = seedling.number;
    GLOBAL.percentages = targetPercentages;

	targetColor = getRingColor(seedling, seedling.currentPart);

	// Reset all other seedlings' story parts to zero
	for(var i = 0; i < 3; i++) {
		if(seedling.number !== i)
				seedlings[i].currentPart = 0;
	}

	// Calculate the max distance of monument movement for duration calculation
	if(stepperPositionAr != null){
	  for(var i = 0; i < 4; i++){
	    var temp = Math.round( Math.abs( targetPercentages[i]*plrmax - stepperPositionAr[i] ) );
		  if(temp > maxDistance) maxDistance = temp;
	  }
  }
	else{
		maxDistance = plrmax;
	}
	print("Monument Max Distance: " + maxDistance);
	var duration = maxDistance <= 60 ? 0 : Math.ceil(maxDistance * motorMoveSlope + motorMoveConstant); // simple motion get time(sec) rounded up
	print("Monument Expected Duration:" + duration);
	circleData = new circleObj(previousColor, targetColor, duration, diodePct);

	if(seedling.currentPart === 0 && diodePct === 100){
		duration += 3;
	} // go back to first part of same story (fade then fill) so add 3 sec to duration of lightTrail

  var revolutions = Math.ceil(duration/1.5); // timePerRev set to 2 for revolutions calc
	var timePerRev = duration / Math.ceil(duration/1.5);
	var lightTrailData = new lightTrailObj(trailColor, 6, timePerRev, revolutions);


	// Set the variable to keep track of the last seedling that had its button pressed
	lastActiveSeedling = seedling.number;

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	print("- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -");
	print(" New Story: "+lastActiveSeedling);
	print(" New Story's Part: "+seedlings[lastActiveSeedling].currentPart);
	print("- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -");
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	// Play the new story's sound
	var buttonSounds = story[lastActiveSeedling].parts[seedling.currentPart].sound;
	if(!buttonSounds.length)
		seedling.socket.emit('seedling play button-sound', null);
	else {
		var buttonSound = buttonSounds[Math.floor(Math.random() * buttonSounds.length)]
		seedling.socket.emit('seedling play button-sound', buttonSound);
	}

	// Begin lifx valid button press behavior
	if(story[lastActiveSeedling].parts[seedling.currentPart].color.monument) {
		var lifxHex = story[lastActiveSeedling].parts[seedling.currentPart].color.monument.hex;
		var lifxBri = story[lastActiveSeedling].parts[seedling.currentPart].color.monument.bri;
		lifx.validButtonPress(lifxHex, lifxBri ? lifxBri : 0.5);
	} else if(story[lastActiveSeedling].parts[seedling.currentPart].color)
		lifx.validButtonPress(story[lastActiveSeedling].parts[seedling.currentPart].color, 0.5);
	else lifx.validButtonPress('red', 0);

	for(var i = 0; i < 3; i++){
		if(seedlings[i].online) {
			seedlings[i].socket.emit("buttonPressed", seedling.number, circleData, lightTrailData);
		}
	}

	if(beagleOnline) beagle.emit("seseme move motors", targetPercentages, plrmax);
  setTimeout(function(){
    if(lockButtonPress){
      lockButtonPress = false;
      randomSoundWeight(soundObj, 'ready', seedlings[lastActiveSeedling].socket);
    }
  }, 10000);
  // Add color to send for light update
	if(monumentLightsOnline) monumentLights.emit("monumentLights update", targetColor);
}

////////////////////////////////////////////////
//	SEEDLING
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
//	BEAGLE - Seseme Monument
////////////////////////////////////////////////

beagleIO.on('connection', function(beagleSocket){
	beagle = beagleSocket;
	print('[BEAGLE: CONNECTED]')
	beagleSocket.on('checkin', function(data){
		print('[BEAGLE: CHECKED IN]')
		print(data)
    beagleSocket.emit("seseme send plrmax", plrmax);
	})

	beagleSocket.on('seseme finished setup', function(){
		print("seseme finished setup socket");
		print("stepperPositionAr After Setup: " + stepperPositionAr);
		var seedling = seedlings[lastActiveSeedling]; // set seedling to last active seedling (initialized as 0)
		var targetPercentages = heightCalcGeneric(seedling.story.parts[seedling.currentPart]);
		if(stepperPositionAr) beagle.emit("seseme update position values", stepperPositionAr) // beagle went down so update stepper obj in beagleSockets
		else beagle.emit("seseme move motors", targetPercentages, plrmax); // initialize pillars for first time
	})

	beagleSocket.on('seseme finished moving', function(obj){
		print("Seseme Finished Moving Socket");
		stepperPositionAr = obj; // update stepperPositionAr after moving
		print("Finished Moving stepperPositionAr: " + stepperPositionAr);
    setTimeout(function(){
      lockButtonPress = false;
  		randomSoundWeight(soundObj, 'ready', seedlings[lastActiveSeedling].socket);
    }, 2000);
	})

  // Socket call received when pillars have been moved down and button pressed
  // Tell monument pi the pillars are at the bottom and move the motors
	beagleSocket.on('seseme reset button', function(){
		print("Seseme Reset Button");
		beagle.emit("seseme update position values", [0,0,0,0]);
		var seedling = seedlings[lastActiveSeedling]; // set seedling to last active seedling (initialized as 0)
		var targetPercentages = heightCalcGeneric(seedling.story.parts[seedling.currentPart]);
		print("Seseme move motors");
		beagle.emit("seseme move motors", targetPercentages, plrmax); // initialize pillars for first time

/*
		stepperPositionAr = [0,0,0,0]; // update stepperPositionAr to bottom
    beagle.emit("seseme update position values", stepperPositionAr); // update position values on beagle
*/
	}) // update position arrays on server and monument pi to be [0,0,0,0]

	beagleSocket.on('checkSesemeRunning', function(data){
		print("checkSesemeRunning data: " + data);
		sesemeRunning = data;
		updateFlag = true; // finished isRunning check and change flag
	})

	beagleSocket.on('beagle 1 On', function(beagleAr){
		beagleOnline = true;
		print('[BEAGLE: ONLINE]')
		print("Array In XPS: " + stepperPositionAr);
		print("Array In Monument: " + beagleAr)
		if(beagleAr && !stepperPositionAr){
			print("XPS Down, Beagle Up");
			stepperPositionAr = beagleAr;
		} // xps went down but beagle has info
	});

	beagleSocket.on('disconnect', function(){
		beagleOnline = false;
		print('[BEAGLE: DISCONNECTED]')

		// Report to the diagnostics channel that the monument went down
		var slackTitle = 'Monument (.210) Disconnected!';
		claptron.reportDisconnect(slackTitle);
	})

});


////////////////////////////////////////////////
//	Monument Lights Pi
////////////////////////////////////////////////

monumentLightsIO.on('connection', function(monumentSocket){
  monument = monumentSocket;
  monumentSocket.on('checkin', function(){
    print('Monument Lights Pi checkin');
  });  

  monumentSocket.on('monumentLights 1 On', function(){
    monumentLightsOnline = true;
    print('Monument Lights Pi Online');
    //monumentSocket.emit('monument lights on');
  });  

	monumentSocket.on('disconnect', function(){
		monumentLightsOnline = false;
		print('[MONUMENT LIGHTS: DISCONNECTED]')

		// Report to the diagnostics channel that the monument went down
		var slackTitle = 'Monument (.31) Disconnected!';
		claptron.reportDisconnect(slackTitle);
	})

	monumentSocket.on('monumentLights finished inits', function() {
		print("Monument Lights Finished Initializing Socket");
		var seedling = seedlings[lastActiveSeedling];
		var targetColor = getRingColor(seedling, seedling.currentPart);
		print("Initializing Monument Lights to Illuminate Corner");
		monumentSocket.emit('monumentLights update', targetColor); // turn on corner light

	});

});

