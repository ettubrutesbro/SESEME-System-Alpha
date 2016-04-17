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

GLOBAL.part = 0; 
GLOBAL.story = 0;
GLOBAL.stories = stories;
GLOBAL.percentages = [Math.random(), Math.random(), Math.random(), Math.random()];

// MAIN index loader
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/stories', function (req, res) {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'webform', 'index.html'));
});

app.get('/stories-data', function (req, res) {
    console.log("Sending this to the client");
    console.log({
        part: GLOBAL.part,
        story: GLOBAL.story,
        stories: GLOBAL.stories,
        percentages: GLOBAL.percentages
    });
    res.json({
        part: GLOBAL.part,
        story: GLOBAL.story,
        stories: GLOBAL.stories,
        percentages: GLOBAL.percentages
    });
});

io.on('connection', function (socket) {
	socket.on('error', function (err) {
		console.log("Socket Error! "+err);
		error(err);
	});
});
