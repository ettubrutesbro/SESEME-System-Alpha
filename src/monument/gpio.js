// Module to set up the gpio
function setup(socket) {
  var gpio = require('rpi-gpio');

  gpio.setup(7, gpio.DIR_IN, function(){
    console.log('setup :)');
    setInterval(readInput, 150);
  });

  var coolDown = Date.now();

  function readInput() {
    gpio.read(7, function(err, value) {
      if (err) throw err;
      //console.log(value)
      if(value == false){
        if(coolDown < (Date.now() - 1000)){
          console.log('\nRESET BUTTON PRESSED');
          coolDown = Date.now();
          socket.emit('seseme reset button'); // big red button was pressed
        }
      }
    });
  }
}

exports.setup = setup;
