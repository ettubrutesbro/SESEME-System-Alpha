var path = require('path');
var express = require('express');
var app = express();
var server = require('http').Server(app);

server.listen(8080);

// SERVE UP STATIC FILES FROM the /web folder
app.use('/', express.static(__dirname + '/'));
app.use('/frontend', express.static(path.join(__dirname, '..', 'frontend')));
app.use('/assets', express.static(path.join(__dirname, '..', 'frontend/assets')));
app.use('/bower_components', express.static(__dirname + '/web/bower_components'));

var socket = require('socket.io');
var io = new socket.listen(5000);
var stories = require(path.join(__dirname, 'scripts', 'stories.js'));

// MAIN index loader
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
	socket.on('error', function (err) {
		print("Socket Error! "+err);
		error(err);
	});

	socket.on('ui request story', function() {
		print("Frontend Requested Story: Sending Current Story Data");
		// Have the frontend acquire the story data
		io.sockets.emit('ui acquire story', {
			story: 2,
			part: 0,
			percentages: [0.8771929824561404, 1, 0.3508771929824562, 0.6491228070175438],
            stories: stories
		});
	});
});
