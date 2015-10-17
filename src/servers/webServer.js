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
var claptron = require(path.join("..", "xps", "slackbot.js"));
var check = require(path.join("..", "jsLibrary", "websockets.js"));

server.listen(8080);
console.log('listening on port 8080  !!!');

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

app.get('/check', function(req, res) {
    console.log("RECEIVED A GET REQUEST: ")
    console.log("Request token: ");
    console.log(JSON.stringify(req.query,null,2))

    if(req.query.token == process.env.SLACK_TOKEN) {
	    // Determine the slash command
	    switch(req.query.text) {
	        case "system":
	            check.reportSystemStatus();
	            break;
	        case "pi1":
	            break;
	        case "pi2":
	            break;
	        case "pi3":
	            break;
	        case "monument":
	            break;
            default:
                console.log("Incorrect slash command!");
	    }
    }

});
