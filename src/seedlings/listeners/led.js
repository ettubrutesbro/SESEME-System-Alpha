// Module to initialize all socket listeners related to the changing the LED

function emptyCallback(){};

function listeners(socket, obj, soundObj) {
    var path = require('path');
    var print = require(path.join(__dirname, '..', '..', 'jsLibrary', 'print.js'));
    var led = require(path.join(__dirname, '..', '..', 'jsLibrary', 'led.js'));
    var Timer = require(path.join(__dirname, '..', '..', 'jsLibrary', 'timer.js'));
    var music = null;

    var lightOnDuration = 12000;
    var fadeTime = 3; // default fade time
    var trailLength = 6; // default light trail length
    var trailTime = 1.5; // default light trail revolution time
    var trailRevs = 5; // default light trail revolution numbers
    var lightTimer = []; // global light timer for lights
    var timerLastUpdate = []; // ar to hold time when timer was last updated for each seedling
    var totalTimeOn = 0;
    var breatheInterval = null;

    function lightsOnCallback(obj){
      timerLastUpdate[obj.seedlingNum] = Date.now();
      lightTimer[obj.seedlingNum] = new Timer.Timer(function() { // init timer with 5 seconds
        print("turning lights off, totalTimeOn in sec: " + totalTimeOn / 1000);
        led.lightsOff(obj);
        timerLastUpdate[obj.seedlingNum] = null;
        totalTimeOn = 0;
      }, lightOnDuration);
    }

    function addLightsDuration(obj){
      print("in function addLightsDuration, seedling number " + obj.seedlingNum);
      if(timerLastUpdate[obj.seedlingNum]){
        var addValue = Date.now() - timerLastUpdate[obj.seedlingNum];
        print("add to lightTimer value " + addValue / 1000);
        totalTimeOn += addValue;
        lightTimer[obj.seedlingNum].add(Date.now() - timerLastUpdate[obj.seedlingNum]); //
        timerLastUpdate[obj.seedlingNum] = Date.now();
      } // lights of seedling currently on so add to timer
      else{
        print("turn lights on for buttonPressed");
        timerLastUpdate[obj.seedlingNum] = Date.now();
        led.lightsOn(obj, lightsOnCallback);
        totalTimeOn = lightOnDuration;
      } // turn on lights of seedlingNum
    }

    socket.on('test color', function(stripColor){
      led.showStrip(stripColor, obj.strip);
    })


    socket.on('seedling turn off lights', function(seedlingNum){
      print("seedling turn off lights socket " + seedlingNum);
      if(seedlingNum === obj.seedlingNum){
        print("message sent to correct seedling for lights to turn off; extra check");
        led.turnRingOff(obj);
      }
    })

    socket.on('seedling add lights duration', function(seedlingNum){
      print("seedling add lights duration socket " + seedlingNum);
      if(seedlingNum === obj.seedlingNum){
        addLightsDuration(obj);
      }
    })

    socket.on('seedling initialize story', function(seedlingNum, targetColor){
      print("in seedling initialize story socket " + obj.seedlingNum);
      if(obj.seedlingNum === seedlingNum){
        print("turn on ring " + obj.seedlingNum)
        led.turnRingOn(targetColor, obj);
      } // seedlings[0] has ring lit since set as lastActiveSeedling for default
      print("turn on buttonLight");
      led.lightOn(1, obj.buttonLight, null); // button of all seedlings lit
    }) // start at initial color

    socket.on('buttonPressed', function(seedlingNum, circleData, lightTrailData){
      print("buttonPressed " + seedlingNum);
      print("circleData.duration " + circleData.duration)
      if(circleData.duration === 0){
        print("duration is 0 so no action");
        socket.emit('seedling actionCircle done', seedlingNum);
        return;
      } // shouldn't do anything, just emit back to xps

      print("Turn obj.buttonLight Off");
      led.lightOff(1, obj.buttonLight, null);

    var prevTime = Date.now();
    print("Check For Fade/Fill or LightTrail");
      if(seedlingNum === obj.seedlingNum){
        print("Turn On Lights");
        addLightsDuration(obj);
        print("circleData.diodePct " + circleData.diodePct);
        if(circleData.diodePct !== 0){
          print("seedling buttonPressed socket; should be fadeCircle");
          led.fadeCircle(circleData.previousColor, circleData.targetColor, circleData.duration, circleData.diodePct, obj, function(){
            print("duration of fadeCircle " + (Date.now() - prevTime)/1000);
            print("in callback for fadeCircle");
            led.lightOn(1, obj.buttonLight, null);
            socket.emit('seedling actionCircle done', seedlingNum);
          });
        } // fades in progression if last active seedling
        else{
          print("seedling buttonPressed socket; should be fillCircle");
          led.fillCircle(circleData.previousColor, circleData.targetColor, circleData.duration, obj, function(){
            print("duration of fillCircle " + (Date.now() - prevTime)/1000);
            print("in callback for fillCircle");
            led.lightOn(1, obj.buttonLight, null);
            socket.emit('seedling actionCircle done', seedlingNum);
          })
        }
      } // this seedling fills from empty since not last activeSeedling

      else{
        print("Do Light Trail");
        led.lightTrail(lightTrailData.trailColor, lightTrailData.nodes, lightTrailData.time, lightTrailData.revolutions, obj, function(){
          print("duration of lightTrail " + (Date.now() - prevTime)/1000);
          print("in callback for lightTrail");
          led.lightOn(1, obj.buttonLight, null);
          socket.emit('seedling actionCircle done', seedlingNum);
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

    socket.on('seedling idle behavior', function(seedlingNum){
      print("seedling idle behavior");
      led.lightIdle(seedlingNum, obj);
    })

    socket.on('ledColor', function(data){
      print("update color socket");
      var r = data.red;
      var g = data.green;
      var b = data.blue;
      led.updateColorRGB(r, g, b, obj);
    })

    socket.on('ledBrightness', function(data){
      print("update led brightness");
      var brightness = data.brightness;
      led.updateBrightness(brightness, obj);
    })

    socket.on('ledPercentage', function(data){
      print("update led percentage");
      var percentage = data.percentage;
      led.updatePercent(percentage, obj);
    })

    socket.on('nameOn', function(data){
      print("seseme.net on");
      if(data.hexVal == ""){
        data.hexVal = "FFFFFF";
      }
      if(data.time == null){
        data.time = fadeTime;
      }
      print("hexval: " + data.hexVal);
      //led.nameOn(data.hexVal, data.time, obj.urlLight);
      led.lightOn(data.time, obj.urlLight, data.hexVal);
    })

    socket.on('nameOff', function(data){
      print("seseme.net off");
      if(data.hexVal == ""){
        data.hexVal = "FFFFFF";
      }
      if(data == null)
        data = fadeTime;
      //led.nameOff(data, obj.urlLight);
      led.lightOff(data.time, obj.urlLight, data.hexVal);
    })

    socket.on('lightsOn', function(data){
      print("lights on");
      if(data == null)
        data = fadeTime;
      led.lightOn(data, obj.iconLight, null);
    })

    socket.on('lightsOff', function(data){
      print("lights off");
      if(data == null)
        data = fadeTime;
      led.lightOff(data, obj.iconlight, null);
    })

    socket.on('lightTrail', function(data){
      print("light trail");
      if(data.nodes == null)
        data.nodes = trailLength;
      if(data.time == null)
        data.time = trailTime;
      if(data.revolutions == null)
        data.revolutions = trailRevs;
      led.lightTrail(data.trailColor, data.nodes, data.time, data.revolutions, obj, emptyCallback);
    })

    socket.on('fadeCircle', function(data){
      print("fade from Top");
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
