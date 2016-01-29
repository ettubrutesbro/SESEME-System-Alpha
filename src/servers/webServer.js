// *********************************************************************
//     WEB SERVER HOSTING /web dir
// *********************************************************************

// Socket on port 5000
// Server on port 8000

var print = require('../jsLibrary/print.js');
var sockets = require('../jsLibrary/websockets.js')
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var moment = require('moment');
var path = require('path');

// Slack slash commands
var claptron = require(path.join("..", "xps", "slackbot.js"));
var check = require(path.join("..", "jsLibrary", "websockets.js"));
var pinger = require(path.join("..", "xps", "ping.js"));

server.listen(8080);
print('listening on port 8080  !!!');

// app.use('/static', express.static(__dirname + '/web'));
app.use('/frontend', express.static(path.join(__dirname, '..', 'frontend')));
app.use('/assets', express.static(path.join(__dirname, '..', 'frontend/assets')));
app.use('/bower_components', express.static(__dirname + '/web/bower_components'));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

app.get('/stories', function (req, res) {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'webform', 'index.html'));
});

app.get('/control-center', function (req, res) {
    res.sendFile(__dirname + '/web/index.html');
});

app.get('/master', function (req, res) {
    res.sendFile(__dirname + '/master/index.html');
});

// Check slash command
app.get('/check', function(req, res) {
    print("- - - - - - - - - - - - - - - - - - - - - - ");
    print("RECEIVED A GET REQUEST: ")
    print("Request token: ");
    print(JSON.stringify(req.query,null,2))

    if(req.query.token == process.env.SLACK_CHECK_TOKEN) {
        print("Slack token verified!");
	    // Determine the slash command
	    switch(req.query.text) {
	        case "system":
                print("Checking system...");
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
                print("Incorrect slash command!");
	    }
    } else {
        print("Incorrect slack token!");
        print("Given slack token: "+req.query.token);
        print("Correct slack token: "+process.env.SLACK_CHECK_TOKEN);
    }

});

// Ping slash command
app.get('/ping', function(req, res) {
    if(req.query.token == process.env.SLACK_PING_TOKEN) {
        // Determine the slash command
	    switch(req.query.text) {
	        case "system":
                print("Pinging system...");
	            break;
	        case "pi1":
                print("Pinging pi1...");
                pinger.pingPi1();
	            break;
	        case "pi2":
                print("Pinging pi2...");
                pinger.pingPi2();
	            break;
	        case "pi3":
                print("Pinging pi3...");
                pinger.pingPi3();
	            break;
	        case "monument":
                print("Pinging monument...");
                pinger.pingMonument();
	            break;
            default:
                print("Incorrect slash command!");
	    }
    } else {
        print("Incorrect slack token!");
        print("Given slack token: "+req.query.token);
        print("Correct slack token: "+process.env.SLACK_PING_TOKEN);
    }
});
