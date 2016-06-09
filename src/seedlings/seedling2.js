//***************************************************
// ******************* SOCKET.IO SHIT **************
//
var seedlingNum = 1;
console.log('----CONNECTING ON PORT 600' + seedlingNum + '----   IP:seseme.net:600' + seedlingNum)

// log into XPS server in the office
var IP = 'http://seseme.net:600' + seedlingNum;
var socket = require('socket.io-client')(IP);
var path = require('path');
var obj = null;
var led = require(path.join(__dirname, '..', 'jsLibrary', 'led.js'));

socket.emit('checkin', 'SEEDLING' + (seedlingNum+1));

// Init the board as well as the led socket listeners
var initBoard = require(path.join(__dirname, 'setup', 'board.js'));
initBoard.setup(socket, seedlingNum, function(data){
	obj = data;
});

// Init GPIO setup and socket emits
var initGPIO = require(path.join(__dirname, 'setup', 'gpio.js'));
initGPIO.setup(socket);

socket.on('connect', function() {
  console.log('seedling ' + (seedlingNum+1) + ' On', socket.connected);
  socket.emit('seedling ' + (seedlingNum+1) + ' On');
});

socket.on('disconnect', function() {
  console.log('seedling ' + (seedlingNum+1) + ' Off', socket.disconnected);
  if(obj) led.reset(obj);
});
