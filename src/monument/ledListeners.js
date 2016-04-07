// Module to initialize all socket listeners related to the monument LEDs
// obj contains ledAr, stripAr, and pixelNum

function emptyCallback(){};

function listeners(socket, obj) {
  var path = require('path');
  var print = require(path.join(__dirname, '..', 'jsLibrary', 'print.js'));
  var led = require(path.join(__dirname, 'led.js'));

  socket.on('monument lights on', function(){
    led.lightsOn(obj);
  });

  socket.on('monument lights off', function(){
    led.lightsOff(obj);
  });

  socket.on('monument lights update', function(targetColor){
    print("monument lights update");
    var red = (targetColor.red).toString(16);
    var green = (targetColor.green).toString(16);
    var blue = (targetColor.blue).toString(16);
    var colorString = red + green + blue;
    console.log(colorString);
    led.lightsUpdate(obj, colorString);
  });

}

exports.listeners = listeners;
