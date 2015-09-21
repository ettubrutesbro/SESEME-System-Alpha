var express = require('express');
var app = express();
var server = require('http').Server(app);

server.listen(8080);

// SERVE UP STATIC FILES FROM the /web folder
app.use('/', express.static(__dirname + '/'));
// MAIN index loader
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
