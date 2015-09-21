// *********************************************************************
//     WEB SERVER HOSTING /web dir
// *********************************************************************

// Socket on port 5000
// Server on port 8000
var sockets = require('../jsLibrary/beagleSockets.js')
var express = require('express');
var app = express();
var server = require('http').Server(app);

server.listen(8000);
console.log('listening on port 8000  !!!')


//-----------------------------
// JACK :)
//
app.use('/static', express.static(__dirname + '/web'));
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/web/index.html');
});


//-----------------------------
// HERE IS JUSTINS MASTER STUFF
//
/*
app.use('/static', express.static(__dirname + '/master'));

app.get('/master', function (req, res) {
  res.sendFile(__dirname + '/master/index.html');
});
*/
