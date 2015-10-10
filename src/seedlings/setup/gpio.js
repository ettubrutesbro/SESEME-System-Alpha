// Module to set up the gpio
function setup(socket) {
    var gpio = require('rpi-gpio');

    gpio.setup(8, gpio.DIR_OUT);
    gpio.setup(7, gpio.DIR_IN);
    gpio.setup(10, gpio.DIR_IN, function(){
      console.log('setup :)');
      setInterval( readInput, 150);
    });

    var coolDown = Date.now();

    function readInput() {
      gpio.read(10, function(err, value) {
      	if (err) throw err;
        if(value == 0){
          //music1.play();
      	  //socket.emit('bigRedButton')
          socket.emit('secretButton')
      	  gpio.write(8, 1);
        }
      	else {
      	  gpio.write(8, 0);
      	}
      });

      gpio.read(7, function(err, value) {
      	if (err) throw err;
        //console.log(value)
      	if(value == false){
            if(coolDown < (Date.now() - 1000)){
              console.log('\nBUTTON PRESSED');
              coolDown = Date.now();
              socket.emit('bigRedButton'); // big red button was pressed
            }
      	}
      })
    }
}

exports.setup = setup;
