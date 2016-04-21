//***************************************************
// ******************* SOCKET.IO SHIT **************
//
console.log('----CONNECTING ON PORT 7000 ----   IP:169.237.123.19:7000');

// log into XPS server in the office
var IP = 'http://169.237.123.19:7000';
var socket = require('socket.io-client')(IP);
var path = require('path');
var obj = null;
var led = require(path.join(__dirname, '..', 'monument', 'led.js'));

socket.emit('checkin');

// Init the board as well as the led socket listeners
var initBoard = require(path.join(__dirname, '..', 'monument', 'board.js'));
initBoard.setup(socket, function(data){
	obj = data;
});

socket.on('connect', function() {
  console.log('monumentLights On', socket.connected);
  socket.emit('monumentLights 1 On');
});

socket.on('disconnect', function() {
  console.log('seedling ' + (num+1) + ' Off', socket.disconnected);
  //if(obj) led.reset(obj);
});
