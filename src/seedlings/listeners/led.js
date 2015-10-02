// Module to initialize all socket listeners related to the changing the LED

function emptyCallback(){};


function listeners(socket, obj, soundObj) {
    var path = require('path');
    var led = require(path.join(__dirname, '..', '..', 'jsLibrary', 'led.js'));
    var sounds = require(path.join(__dirname, '..', '..', 'jsLibrary', 'sounds.js'));
    var Timer = require(path.join(__dirname, '..', '..', 'jsLibrary', 'timer.js'));
    var music = null;

    var lightOnDuration = 12000;
    var fadeTime = 3; // default fade time
    var trailLength = 6; // default light trail length
    var trailTime = 1.5; // default light trail revolution time
    var trailRevs = 5; // default light trail revolution numbers
    var lightTimer = []; // global light timer for lights
    var timerLastUpdate = []; // ar to hold time when timer was last updated for each seedling
    var timerOccurrences = [];

    var breatheInterval = null;

    function lightsOnCallback(obj){
      timerLastUpdate[obj.seedlingNum] = Date.now();
      lightTimer[obj.seedlingNum] = new Timer.Timer(function() { // init timer with 5 seconds
        console.log('turning lights off, duration of timer in sec:', (Date.now() - timerLastUpdate[obj.seedlingNum]) / 1000);
        led.lightsOff(obj);
        timerLastUpdate[obj.seedlingNum] = null;
        console.log("timerOccurrences", timerOccurrences);
      }, lightOnDuration);
    }

    function addLightsDuration(obj){
      if(timerLastUpdate[obj.seedlingNum]){
        console.log("add to lightTimer value", lightOnDuration - (Date.now() - timerLastUpdate[obj.seedlingNum]));
        lightTimer[obj.seedlingNum].add(lightOnDuration - (Date.now() - timerLastUpdate[obj.seedlingNum])); //
        timerLastUpdate[obj.seedlingNum] = Date.now();
        timerOccurrences.push(Date.now());
      } // lights of seedling currently on so add to timer
      else{
        console.log("turn lights on for buttonPressed");
        timerLastUpdate[obj.seedlingNum] = Date.now();
        led.lightsOn(obj, lightsOnCallback);
        timerOccurrences.push(Date.now());
      } // turn on lights of seedlingNum
    }

    socket.on('seedling add lights duration', function(seedlingNum){
      if(seedlingNum === obj.seedlingNum){
        addLightsDuration(obj);
      }
    })

    socket.on('seedling initialize story', function(seedlingNum, targetColor){
      if(obj.seedlingNum === seedlingNum){
        led.turnRingOn(targetColor, obj);
      }
    }) // start at initial color

    socket.on('buttonPressed', function(seedlingNum, circleData, lightTrailData){
      console.log("buttonPressed", seedlingNum);

      led.lightOff(1, obj.buttonLight, null);

      if(seedlingNum === obj.seedlingNum && ){
        addLightsDuration(obj);

        if(obj.seedlingNum === lastActiveSeedling){
          led.fadeCircle(circleData.targetColor, circleData.duration, circleData.diodePct, obj, function(){
            console.log("in callback for fadeCircle");
            led.lightOn(1, obj.buttonLight, null);
            sounds.playRandomSound(soundObj, 'ready');
            socket.emit('seedling actionCircle done', seedlingNum);
          });
        } // fades in progression if last active seedling
        else{
          led.fillCircle(circleData.targetColor, circleData.duration, obj, function(){
            console.log("in callback for fillCircle");
            led.lightOn(1, obj.buttonLight, null);
            sounds.playRandomSound(soundObj, 'ready');
            socket.emit('seedling actionCircle done', seedlingNum);
          })
        }
      } // this seedling matches button press seedling

      else{
        led.lightTrail(lightTrailData.trailColor, lightTrailData.nodes, lightTrailData.time, lightTrailData.revolutions, obj, function(){
          console.log("in callback for lightTrail");
          led.lightOn(1, obj.buttonLight, null);
        });
      } // other seedlings animate light trail
    })

    // // ************************************************************************
    // // ********************CHECK IF THIS IS AIGHT******************************
    // // **********Specifically, check the light1/light2 params******************
    // // ************************************************************************
    // Socket listener to start breathing to represent idle mode
    // socket.on('seedling start breathing', function(intervalTime, seedlingNum) {
    //     if(intervalTime === 6) {        // breatheHI
    //         breatheInterval = led.breathe(intervalTime, obj.ringLight???, obj.buttonLight);
    //         breatheInterval.start;
    //         breatheInterval.sustain;
    //     } else if(intervalTime === 12) {  // breatheLO
    //         breatheInterval = led.breathe(intervalTime, obj.buttonLight, obj.urlLight);
    //         breatheInterval.start;
    //         breatheInterval.sustain;
    //     }
    // });
    //
    // // Socket listener to stop breathing to end the idle mode
    // socket.on('seedling stop breathing', function() {
    //     if(breatheInterval && breatheInterval.running) {
    //         clearInterval(breatheInterval.sustain);
    //         breatheInterval.running = false;
    //     }
    // });
    // // ************************************************************************
    // // ************************************************************************

    socket.on('error buttonPressed', function(seedlingNum, fadeCircleData, lightTrailData, active){
      console.log("error on button press, seseme still running")

      /* modify duration to reflect how long it has been running*/
      function activeCallback(){
        led.fadeCircle(fadeCircleData.targetColor, fadeCircleData.duration, fadeCircleData.diodePct, obj, function(){
          console.log("in callback for fadeCircle");
          led.lightOn(1, obj.buttonLight, null);
          sounds.playRandomSound(soundObj, 'ready');
        });
      }

      function inactiveCallback(){
        led.lightTrail(lightTrailData.trailColor, lightTrailData.nodes, lightTrailData.time, lightTrailData.revolutions, obj, function(){
          console.log("in callback for lightTrail");
          led.lightOn(1, obj.buttonLight, null);
        });
      }

      function lightOnCallback(light, color){
        setTimeout(function(light){
          led.lightOff(1, light, color);
        }, 10000)
      }

      var blinkColor = led.hexToObj("FFFFFF");
      /*
      if(active){
        if(seedlingNum == 0){
          var color = led.hexToObj("FFFFFF");
          led.lightOn(1, obj.urlLight, color);

          // maybe turn on hue iconLight?
        }
        else if(seedlingNum == 1){
          led.lightOn(1, obj.urlLight, null);
          led.lightOn(1, obj.lmLight. null);
          led.lightOn(1, obj.iconLight, null);
        }
        else if(seedlingNum == 2){
          led.lightOn(1, obj.iconLight, null);
        }

        led.blinking(blinkColor, 0.3, 0, obj, activeCallback);
      } // url, icon 12s
      else
        led.blinking(blinkColor, 0.3, 0, obj, inactiveCallback);

      sounds.playRandomSound(soundObj, 'no');
      // ring blinks, play sound "no"
      */

    })





    socket.on('ledColor', function(data){
      console.log("update color socket");
      var r = data.red;
      var g = data.green;
      var b = data.blue;
      led.updateColorRGB(r, g, b, obj);
    })

    socket.on('ledBrightness', function(data){
      console.log("update led brightness");
      var brightness = data.brightness;
      led.updateBrightness(brightness, obj);
    })

    socket.on('ledPercentage', function(data){
      console.log("update led percentage");
      var percentage = data.percentage;
      led.updatePercent(percentage, obj);
    })

    socket.on('nameOn', function(data){
      console.log("seseme.net on");
      if(data.hexVal == ""){
        data.hexVal = "FFFFFF";
      }
      if(data.time == null){
        data.time = fadeTime;
      }
      console.log("hexval: " + data.hexVal);
      //led.nameOn(data.hexVal, data.time, obj.urlLight);
      led.lightOn(data.time, obj.urlLight, data.hexVal);
    })

    socket.on('nameOff', function(data){
      console.log("seseme.net off");
      if(data.hexVal == ""){
        data.hexVal = "FFFFFF";
      }
      if(data == null)
        data = fadeTime;
      //led.nameOff(data, obj.urlLight);
      led.lightOff(data.time, obj.urlLight, data.hexVal);
    })

    socket.on('lightsOn', function(data){
      console.log("lights on");
      if(data == null)
        data = fadeTime;
      led.lightOn(data, obj.iconLight, null);
    })

    socket.on('lightsOff', function(data){
      console.log("lights off");
      if(data == null)
        data = fadeTime;
      led.lightOff(data, obj.iconlight, null);
    })

    socket.on('lightTrail', function(data){
      console.log("light trail");
      if(data.nodes == null)
        data.nodes = trailLength;
      if(data.time == null)
        data.time = trailTime;
      if(data.revolutions == null)
        data.revolutions = trailRevs;
      led.lightTrail(data.trailColor, data.nodes, data.time, data.revolutions, obj, emptyCallback);
    })

    socket.on('fadeCircle', function(data){
      console.log("fade from Top");
      if(data.fadeTime == null)
        data.fadeTime = 10;
      if(data.diodePct == null)
        data.diodePct = 100;
      var result = led.fadeCircle(data.targetColor, data.fadeTime, data.diodePct, obj, emptyCallback);
    })

    socket.on('blink', function(data){
      if(data.blinkDuration == null)
        data.blinkDuration = 0.3;
      led.blinking(data.blinkColor, data.blinkDuration, 0, obj, emptyCallback);
    })
}

exports.listeners = listeners;
