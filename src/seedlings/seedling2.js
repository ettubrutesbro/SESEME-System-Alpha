//***************************************************
// ******************* SOCKET.IO SHIT **************
//
var seedlingNum = 1;
console.log('----CONNECTING ON PORT 600' + seedlingNum + '----   IP:169.237.123.19:600' + seedlingNum)

// log into XPS server in the office
var IP = 'http://169.237.123.19:600' + seedlingNum;
var socket = require('socket.io-client')(IP);
var obj = null;
var led = require("../jsLibrary/led.js")

socket.emit('checkin', 'SEEDLING' + (seedlingNum+1))

// Init the board as well as the led socket listeners
var initBoard = require('./setup/board.js');
initBoard.setup(socket, seedlingNum, function(data){
	obj = data;
});

// Init GPIO setup and socket emits
var initGPIO = require('./setup/gpio.js');
initGPIO.setup(socket);

socket.on('connect', function() {
  console.log('seedling ' + (seedlingNum+1) + ' On', socket.connected);
  socket.emit('seedling ' + (seedlingNum+1) + ' On');
});

socket.on('disconnect', function() {
  console.log('seedling ' + (seedlingNum+1) + ' Off', socket.disconnected);
  if(obj) led.reset(obj);
});