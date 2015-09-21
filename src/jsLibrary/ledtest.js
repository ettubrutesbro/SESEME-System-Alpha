var five = require('johnny-five');
var light = null;

five.Board().on("ready", function() {

  // Initialize the RGB LED
/*
  var led = new five.Led.RGB({
    pins: {
      red: 6,
      green: 5,
      blue: 3
    }
  });
*/

  // RGB LED alternate constructor
  // This will normalize an array of pins in [r, g, b]
  // order to an object (like above) that's shaped like:
  // {
  //   red: r,
  //   green: g,
  //   blue: b
  // }
  //var led = new five.Led.RGB([3,5,6]);

  // Add led to REPL (optional)

  var light = new five.Led(11);
  //light.off();
  //light.brightness(0);
  
  console.log("light on");
  
  light.on();

  /*
  setTimeout(function(){
      console.log("light mid");
      light.brightness(128);
  }, 5000);
*/

  setTimeout(function(){
      console.log("light off");
      light.brightness(50);
      /*
      setTimeout(function(){
        light.brightness(0);
        light.off();
      }, 50000);
*/
  }, 10000);

  //light.brightness(128);
  //light.fade(0, 5000);
  
  //console.log("done");


  // Turn it on and set the initial color
  //led.on();
  //led.color("#FF0000");


});
