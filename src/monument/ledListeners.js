// Module to initialize all socket listeners related to the monument LEDs
// obj contains ledAr, stripAr, and pixelNum

function emptyCallback(){};

function listeners(socket, obj) {
  var path = require('path');
  var print = require(path.join(__dirname, '..', 'jsLibrary', 'print.js'));
  var led = require(path.join(__dirname, 'led.js'));

  socket.on('monumentLights on', function(){
    led.lightsOn(obj);
  });

  socket.on('monumentLights off', function(){
    led.lightsOff(obj);
  });

  socket.on('monumentLights update', function(targetColor){
    print("monumentLights update");
    var red = (targetColor.red).toString(16);
    var green = (targetColor.green).toString(16);
    var blue = (targetColor.blue).toString(16);
    var colorString = red + green + blue;
    console.log(colorString);
    led.lightsUpdate(obj, colorString);
  });

  socket.on('monumentLights idle behavior', function(){
    led.lightsIdle(obj);
  });

}

exports.listeners = listeners;
