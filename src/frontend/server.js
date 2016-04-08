var path = require('path');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var story = 0;
var part = 0;

server.listen(8080);

// SERVE UP STATIC FILES FROM the /web folder
app.use('/', express.static(__dirname + '/'));
app.use('/frontend', express.static(path.join(__dirname, '..', 'frontend')));
app.use('/assets', express.static(path.join(__dirname, '..', 'frontend/assets')));
app.use('/bower_components', express.static(__dirname + '/web/bower_components'));

var socket = require('socket.io');
var io = new socket.listen(5000);
var stories = require(path.join(__dirname, '..', 'jsLibrary', 'stories.json'));

// MAIN index loader
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/stories', function (req, res) {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'webform', 'index.html'));
});

io.on('connection', function (socket) {
	socket.on('error', function (err) {
		console.log("Socket Error! "+err);
		error(err);
	});

	socket.on('ui request story', function() {
		console.log("Frontend Requested Story: Sending Current Story Data");
        io.sockets.emit('ui acquire story', {
            story: story,
            part: part,
            percentages: [Math.random(), Math.random(), Math.random(), Math.random()],
            stories: stories
        });
	});
});
