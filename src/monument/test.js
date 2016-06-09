// Module to set up the gpio
var gpio = require('rpi-gpio');
var pinNumber = 10;

gpio.setup(pinNumber, gpio.DIR_IN, function(){
  console.log('setup :)');
  setInterval(readInput, 100);
});


var coolDown = Date.now();

function readInput() {
  gpio.read(pinNumber, function(err, value) {
    if (err) throw err;
    console.log(value)
    if(value == false){
      if(coolDown < (Date.now() - 1000)){
        console.log('\nRESET BUTTON PRESSED');
        coolDown = Date.now();
      }
    }
  });
}

