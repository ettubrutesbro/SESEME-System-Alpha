//***************************************************
// ******************* SOCKET.IO SHIT **************
//
var num = 4;
console.log('----CONNECTING ON PORT 600' + num + '----   IP:169.237.123.19:600' + num)

// log into XPS server in the office
var IP = 'http://169.237.123.19:600' + num;
var socket = require('socket.io-client')(IP);
var path = require('path');
var obj = null;
var led = require(path.join(__dirname, '..', 'jsLibrary', 'led.js'));

socket.emit('checkin', 'SEEDLING' + (num+1));

// Init the board as well as the led socket listeners
var initBoard = require(path.join(__dirname, '..', 'monument', 'board.js'));
/*
initBoard.setup(socket, num, function(data){
	obj = data;
});
*/

// Init GPIO setup and socket emits
//var initGPIO = require(path.join(__dirname, 'setup', 'gpio.js'));
//initGPIO.setup(socket);

socket.on('connect', function() {
  console.log('seedling ' + (num+1) + ' On', socket.connected);
  socket.emit('seedling ' + (num+1) + ' On');
});

socket.on('disconnect', function() {
  console.log('seedling ' + (num+1) + ' Off', socket.disconnected);
  //if(obj) led.reset(obj);
});
