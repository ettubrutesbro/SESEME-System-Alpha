// *********************************************************************
//     WEB SERVER HOSTING /web dir
// *********************************************************************

// Socket on port 5000
// Server on port 8000

var sockets = require('../jsLibrary/websockets.js')
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');

var hue = require("node-hue-api");

var displayBridges = function(bridge) {
    console.log("Hue Bridges Found: " + JSON.stringify(bridge));
};

hue.locateBridges().then(displayBridges).done();

var hostname = "10.0.1.205",
    newUserName = "newdeveloper",
    userDescription = "device description goes here";

hue.registerUser(hostname, newUserName, userDescription)
    .then(displayResultFunction)
    .fail(displayErrorFunction)
    .done();

server.listen(8080);
console.log('listening on port 8080  !!!')

// app.use('/static', express.static(__dirname + '/web'));
app.use('/frontend', express.static(path.join(__dirname, '..', 'frontend')));
app.use('/assets', express.static(path.join(__dirname, '..', 'frontend/assets')));
app.use('/bower_components', express.static(__dirname + '/web/bower_components'));

console.log("static: "+path.join(__dirname, '..', 'frontend'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

app.get('/control-center', function (req, res) {
  res.sendFile(__dirname + '/web/index.html');
});

app.get('/master', function (req, res) {
  res.sendFile(__dirname + '/master/index.html');
});
