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

var claptron = require(path.join(__dirname, 'slackbot.js'));

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

    var slackColor = (allGood) ?  "#00ff00" : "#f30020";
    pretext = pretext || ((allGood) ? "it's lit" : "fuckin' garbage");
    claptron.reportSysCheck(systemStatus, pretext);
}

// Check if all the seedlings are ready
function seedlingsReady() {
    var isReady = true;
    for(var i = 0; i < 3; i++) {
        // Check if all seedlings are connected
        if(!seedlings[i].ready)
            isReady = false;
    }
    return isReady;
}

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

// Upon server startup, ensure the seedling hue is off
lifx.turnOff(1);

////////////////////////////////////////////////
//  BEAGLE Vars
////////////////////////////////////////////////
var beagleIO = new socket.listen(4000);
var beagle = null;
var stepperPositionAr = null;
var beagleOnline = false;
var sesemeRunning = false;
var updateFlag = false;
var beagleStatsFlag = false;
var maxDistanceFlag = false;
var beagleStats = null;
var beagleTime = -1;
var plrmax = 5000; // lazy without sockets
// this plrmax refers to steps (motors)

////////////////////////////////////////////////
//  SEEDLING Vars
////////////////////////////////////////////////
var seedlings = new Array(3); // 3 seedling objects
var totalStoryParts = new Array(3);
var seedlingIO = new Array(3);
var story = new Array(3);

story[0] = stories["environment"];
story[1] = stories["society"];
story[2] = stories["anomalous"];

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
// COUNTDOWN 'TIL IDLE STATE
////////////////////////////////////////////////
var seconds = 120; // Global seconds variable
var lastActiveSeedling = 0; // Global variable to store the seedling pressed last
var idleCountdown;

// Globals related to representing the idle state
var startDesperation;
var breathing;
var desperate;
var idleDone;

// Function to ensure that the idle state
function stopIdleState() {
  if(breathing)      clearInterval(breathing);
  if(desperate)      clearInterval(desperate);
  if(startDesperation)  clearTimeout(startDesperation);
  if(idleDone)      clearTimeout(idleDone);
}

// Function to start the lifx idle behavior
function idleBehavior(lifx) {

  // Start breathing (no maintenance needed to clear it)
  console.log("Lifx: Started breathing");
  breathing = setInterval(function() {
    lifx.breathe();
  }, 2000);

  // Set a timeout to start desperation after a minute of breathing
  startDesperation = setTimeout(function() {
    if(breathing) clearInterval(breathing);
    // Start desperation immediately after breathing ends
    console.log("Lifx: Started desperation");
    var states = getStates();
    lifx.desperation(states);

    // Set the interval of cycles through the story part colors
    desperate = setInterval(function() {
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
    idleDone = setTimeout(function() {
      stopIdleState();
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
console.log("STARTING LIFX LIGHT: "+JSON.stringify(lifxInitProps,null,2));
lifx.updateLight(lifxInitProps);

////////////////////////////////////////////////
//  web
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
  // ['1', '2', '3', '4']  <-- '4' would be the sound index to avoid most
  if(previousSounds[type].length === 4) previousSounds[type].shift();
  previousSounds[type].push({
    'soundName':obj[type][randValue],
    'index':randValue,
    'type':type
  });
  console.log("Sending '"+obj[type][randValue]+"' to the seedling");
  socket.emit('seedling play sound', obj[type][randValue]);
}

io.on('connection', function (socket) {
  webbyOnline = 1;
  webby = socket;
  console.log(socket.request.connection.remoteAddress + ' connected to web socket.io');

  socket.on('error', function (err) {
    console.log("Socket error! "+err);
    error(err);
  });

  // ================================================================================
  // Seedling communication related to sounds
  var seedlingToPlay = Math.floor(Math.random() * 3);
  if(seedlingToPlay === lastSeedlingPlayed)
      seedlingToPlay = (seedlingToPlay + 1) % 3;
  // Check if the seedlings are connected first to emit to them
  if(seedlings[seedlingToPlay].socket) {
      console.log("Playing random sound from seedling "+seedlingToPlay);
      randomSoundWeight(soundObj, 'dumb', seedlings[seedlingToPlay].socket);

      lastSeedlingPlayed = seedlingToPlay;
  } else {
      console.log("Error playing login sound: Seedling " + seedlingToPlay + " is disconnected.");
      lastSeedlingPlayed = seedlingToPlay;
  }

  socket.on('xps update previous-sounds', function(updatedSounds) {
    previousSounds = updatedSounds;
  });

  // ================================================================================
  // Front-end communication
  uiSocket = socket;

  setInterval(function() {
      socket.emit('interval', 'connection test');
  }, 5000);

  socket.on('emit to all', function(data) {
    io.sockets.emit('receive something', data);
  });

  socket.on('ui request story', function() {
      console.log("Frontend requested story: sending current story data now")
    // Have the frontend acquire the story data
    io.sockets.emit('ui acquire story', {
      story: story[lastActiveSeedling],
      part: seedlings[lastActiveSeedling].currentPart,
      percentages: heightCalcGeneric(story[lastActiveSeedling].parts[seedlings[lastActiveSeedling].currentPart])
    });
  });

  socket.on('sim lifx', function(data, stripColor) {
    lifx.validButtonPress(data.hex, data.bri);
    lifxState.color = data.hex; lifxState.brightness = 0.5 * data.bri;
    var color = led.hexToObj(stripColor)
    console.log("print strip obj", JSON.stringify(color));
    seedlings[0].socket.emit('test color', color);
  });

  socket.on('sim breathe', function(data) {
    console.log("Simulating breathe");
    lifx.breathe();
  });

  socket.on('sim desperation', function(data) {
    console.log("Simulating desperation");
    var states = getStates();
    lifx.desperation(states);

    if(desperate) clearInterval(desperate);
    desperate = setInterval(function() {
      lifx.desperation(states)
    }, states.length * 5000);
  });

  // Front-end simulation of a button press
  socket.on('sim button', function(seedlingNum) {
      if(!seedlings[seedlingNum].buttonPressed && seedlings[seedlingNum].online){
          console.log("Sim button pressed")
          seedlings[seedlingNum].buttonPressed = true;
          bigRedButton(seedlings[seedlingNum]);
      } else {
          console.log('Wrong');
      }
  });

  socket.on('sim button2', function(seedlingNum) {
      if(!seedlings[seedlingNum].buttonPressed){
          console.log("Sim button2 pressed");
          var result = heightCalcGeneric(seedlings[seedlingNum].story.parts[seedlings[seedlingNum].currentPart]);
          socket.emit('ui update part', {part: seedlings[seedlingNum].currentPart, percentages: result} );
      } else { console.log('Wrong'); }
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
    console.log('motor:' + data.motor + '  steps:' + data.steps + '  direction:' + data.dir)
    if(beagleOnline){
      console.log('beagle ONLINE')
      beagle.emit('webMoveMotor', data);
    }
  })

  socket.on('setHSL', function(data){
    console.log(data)
    hue.setHSL(data)
  })

});

io.on('disconnect', function() {
  console.log("CLIENT DISCONNECTED ##################################")
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

function checkSesemeRunning(seedling, callback){
  console.log("checkSesemeRunning()");
  if(beagleOnline){
    beagle.emit('getBeagleStats');
    beagle.emit('isRunning'); // check if seseme is running

    var timer = setInterval(function(){
      if(beagleStatsFlag && updateFlag){
        clearInterval(timer);
        if(!sesemeRunning){
          console.log("SESEME not running");
          callback(false);
          return;
        }
        else {
          console.log("SESEME currently running");
          callback(true);
          return;
          //seedling.socket.emit("playType", "idler");
        }
      }
    }, 20);
  }
  else{
    console.log("SESEME not running because beagle off");
    callback(false);
    return;
  }
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
    var error = false;
    for(var i = 0; i < seedlings.length; i++){
      if(seedlings[i].buttonPressed === true){
        console.log("error is true", i)
        error = true;
        break;
      } // invalid button press
    }

    checkSesemeRunning(seedling, function(data){
      console.log("@@@@@@@@@@@@@@@@@@ in checkSesemeRunning callback @@@@@@@@@@@@@@@@@@");
      if(!error && !data){
          // If system is in idle mode, clear the lifx breathe/desperation intervals
        stopIdleState();
        console.log('[SEEDLING ' + (seedlingNum+1) + ': VALID BUTTON PRESS]')
        seedling.buttonPressed = true;
        bigRedButtonHelper(seedling);
      }
      else{
        console.log('[SEEDLING ' + (seedlingNum+1) + ': INVALID BUTTON PRESS]')
        randomSoundWeight(soundObj, 'no', seedling.socket);
        seedling.socket.emit('seedling add lights duration', lastActiveSeedling);
      } // currently in animation
    }); // end of checkSesemeRunning
  });

  seedling.socket.on('seedling ' + (seedlingNum+1) + ' On', function(){
    seedling.online = true;
    seedling.currentPart = 0;
    console.log('[SEEDLING ' + (seedlingNum+1) + ': ONLINE]')
    if(seedling.ready){
      var targetColor = getRingColor(seedling, seedling.currentPart); // seedling.currentPart should be 0;
      console.log("Initialize seedling story");
      seedling.socket.emit('seedling initialize story', lastActiveSeedling, targetColor); // initialize first seedling and turn on buttons on first connect
    }
  });

  seedling.socket.on('seedling finished inits', function(num) {
    console.log("seedling finished inits socket");
    seedlings[num].ready = true;
    var targetColor = getRingColor(seedling, seedling.currentPart); // seedling.currentPart should be 0;
    console.log("Initialize seedling story");
    seedling.socket.emit('seedling initialize story', lastActiveSeedling, targetColor); // initialize first seedling and turn on buttons on first connect
    if(seedlingsReady()) {

      // Sync sequence listeners
      seedlings[0].socket.once('seedling finish sync-sequence-1', function() {
          console.log("Finished sync-sequence-1")
          seedlings[1].socket.emit('seedling start sync-sequence-2');
      });
      seedlings[1].socket.once('seedling finish sync-sequence-2', function() {
          console.log("Finished sync-sequence-2")
          seedlings[2].socket.emit('seedling start sync-sequence-3');
      });

      console.log("Starting sync sequence");
      seedling.socket.emit('seedling start sync-sequence-1');
    }
  });

  seedling.socket.on('seedling actionCircle done', function(seedlingNum){
    if(seedling.number === seedlingNum){
      console.log("set buttonPressed false", seedling.number);
      seedling.buttonPressed = false;
      randomSoundWeight(soundObj, 'ready', seedling.socket);
    }
  })

  seedling.socket.on('disconnect', function(){
    seedling.online = false;
    seedling.ready = false;
    console.log('[SEEDLING ' + (seedlingNum+1) + ': DISCONNECTED]')

    // Report to the diagnostics channel that the seedling went down
    var slackTitle = 'Seedling (.3'+(seedling.number+2)+') Disconnected!';
    claptron.reportDisconnect(slackTitle);
  })
}

function bigRedButtonHelper(seedling){
  var trailColor = led.hexToObj("FFFFFF");
  var targetColor, diodePct;
  var targetPercentages = [];
  var maxDistance = 0;

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -");
  console.log(" Previous Story: "+lastActiveSeedling);
  console.log(" Previous Story's Part: "+seedlings[lastActiveSeedling].currentPart);
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  if(seedling.number === lastActiveSeedling){
    console.log("Incrementing the part of the same story");

    // Get previous part color for fadeCircle function
    previousColor = getRingColor(seedling, seedling.currentPart);


    // Increment current part of the same story
    seedling.currentPart = (seedling.currentPart + 1) % seedling.totalStoryParts;

    // Calculate the result of the
    console.log("Emitting 'ui update part' to the front-end");
    targetPercentages = heightCalcGeneric(seedling.story.parts[seedling.currentPart]);
    io.sockets.emit('ui update part', {part: seedling.currentPart, percentages: targetPercentages} );

    // Setting variables for fading the led circle
    diodePct = seedling.currentPart === 0 ? 100: seedling.currentPart / seedling.totalStoryParts * 100;
  }
  // Update the story to the new one
  else{
    // Set previous color as #000000 since fading from nothing
    previousColor = led.hexToObj("000000");

    seedling.currentPart = 0;
    console.log("should change to different story: current part should be 0:", seedling.currentPart)
    diodePct = 0;

    // Call the frontend to update to a different story
    targetPercentages = heightCalcGeneric(seedling.story.parts[seedling.currentPart]);
    console.log("Emitting 'ui different story' to the front-end");
    io.sockets.emit('ui different story', {story: seedling.story, percentages: targetPercentages} );
  }

  targetColor = getRingColor(seedling, seedling.currentPart);

  // Reset all other seedlings' story parts to zero
  for(var i = 0; i < 3; i++) {
    if(seedling.number !== i)
        seedlings[i].currentPart = 0;
  }

  // Calculate the max distance of
  for(var i = 0; i < 4; i++){
    var temp = Math.round( Math.abs( targetPercentages[i]*plrmax - beagleStats["m"+(i+1)] ) );
    console.log("TEMP: " + i + " " + temp);
    console.log(targetPercentages[i]*plrmax);
    console.log(beagleStats["m"+(i+1)]);
    if(temp > maxDistance) maxDistance = temp;
  }
  console.log("MAXDISTANCE:", maxDistance);
  var duration = maxDistance <= 60 ? 0 : Math.ceil(maxDistance * motorMoveSlope + motorMoveConstant); // simple motion get time(sec) rounded up
  //var duration = maxDistance <= 60 ? 0 : Math.ceil(maxDistance / plrmax * 10 + 0.6); // simple motion get time(sec) rounded up
  console.log("DURATION:", duration);
  var circleData;
  if(seedling.currentPart === 0) circleData = new circleObj(previousColor, targetColor, duration, diodePct); // will run fill circle so subtract 3 sec from fade to compensate for fill
  else circleData = new circleObj(previousColor, targetColor, duration, diodePct);

  if(seedling.currentPart === 0){
    duration += 3;
  } // will run fill circle so add 3 sec to duration of lightTrail and timeout

  var timePerRev = 2;
  var lightTrailData = new lightTrailObj(trailColor, 6, timePerRev, Math.ceil(duration/timePerRev));

  // Reset the countdown to idle state
  if(idleCountdown) clearTimeout(idleCountdown);
  seconds = 120;
  countdown();

  // Set the variable to keep track of the last seedling that had its button pressed
  lastActiveSeedling = seedling.number;

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -");
  console.log(" New Story: "+lastActiveSeedling);
  console.log(" New Story's Part: "+seedlings[lastActiveSeedling].currentPart);
  console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -");
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
  beagle = beagleSocket;
  console.log('[BEAGLE: CONNECTED]')
  beagleSocket.on('checkin', function(data){
    console.log('[BEAGLE: CHECKED IN]')
    console.log(data)
  })

  beagleSocket.on('seseme finished setup', function(){
    console.log("seseme finished setup socket");
    console.log("stepperPositionAr after setup", stepperPositionAr);
    var seedling = seedlings[lastActiveSeedling]; // set seedling to last active seedling (initialized as 0)
    var targetPercentages = heightCalcGeneric(seedling.story.parts[seedling.currentPart]);
    if(stepperPositionAr) beagle.emit("seseme update position values", stepperPositionAr) // beagle went down so update stepper obj in beagleSockets
    else beagle.emit("seseme move motors", targetPercentages, plrmax); // initialize pillars for first time
  })

  beagleSocket.on('seseme finished moving', function(obj){
    console.log("seseme finished moving socket");
    stepperPositionAr = obj; // update stepperPositionAr after moving
    console.log("finished moving stepperPositionAr", stepperPositionAr);
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

  beagleSocket.on('beagle 1 On', function(beagleAr){
    beagleOnline = true;
    console.log('[BEAGLE: ONLINE]')
    console.log("array in xps", stepperPositionAr);
    console.log("array in beagle", beagleAr)
    if(beagleAr && !stepperPositionAr){
      console.log("xps went down, get info from beagle since up")
      stepperPositionAr = beagleAr;
      console.log("new array in xps", stepperPositionAr)
    } // xps went down but beagle has info
  });

  beagleSocket.on('disconnect', function(){
    beagleOnline = false;
    console.log('[BEAGLE: DISCONNECTED]')

    // Report to the diagnostics channel that the monument went down
    var slackTitle = 'Monument (.210) Disconnected!';
    claptron.reportDisconnect(slackTitle);
  })

});
