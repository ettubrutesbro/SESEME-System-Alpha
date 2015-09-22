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

server.listen(8888);
console.log('listening on port 8888  !!!')

console.log("__dirname: "+__dirname);

app.use('/static', express.static(__dirname + '/web'));
app.use('/bower_components', express.static(__dirname + '/web/bower_components'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/web/index.html');
});

app.get('/control-center', function (req, res) {
  res.sendFile(__dirname + '/web/index.html');
});

app.get('/master', function (req, res) {
  res.sendFile(__dirname + '/master/index.html');
});
