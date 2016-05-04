// *********************************************************************
//     WEB SERVER HOSTING /web dir
// *********************************************************************
// Socket on port 5000
// Server on port 8000
'use strict'

const path = require('path');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

// Retrieve all stories from the database
const mongo = require(path.join("..", "xps", "stories.js"));
mongo.connect().then(db => {
    const p1 = mongo.retrieveAllStories(db, 'environment');
    const p2 = mongo.retrieveAllStories(db, 'society');
    const p3 = mongo.retrieveAllStories(db, 'misc');
    Promise.all([p1, p2, p3]).then(result => {
        console.log('Completed all promises!');
        const stories = {
            environment: mongo.construct(result[0]),
            society: mongo.construct(result[1]),
            misc: mongo.construct(result[2])
        };
        global.stories = stories;
        initServer();
    }).catch(reason => {
        throw reason;
    });
})

function initServer() {
    var sockets = require(path.join("..", "jsLibrary", "websockets.js"));
    var claptron = require(path.join("..", "xps", "slackbot.js"));

    server.listen(8080);
    console.log('Started server! Listening on port 8080')

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

    app.get('/stories-data', function (req, res) {
        console.log('- - - - - - - - - - - - - - - - - -');
        console.log('Sending stories data to the client');
        const data = {
            part: global.part,
            story: global.story,
            stories: global.stories,
            percentages: global.percentages
        };
        console.log(`global.part: ${global.part}`);
        console.log(`global.story: ${global.story}`);
        console.log(`global.percentages: ${global.percentages}`);
        console.log('- - - - - - - - - - - - - - - - - -');
        res.json(data);
    });

    app.get('/master', function (req, res) {
        res.sendFile(__dirname + '/master/index.html');
    });

    app.get('/check', function(req, res) {
        console.log('Received a slack command to check the system');
        if(req.query.token === process.env.SLACK_CHECK_TOKEN) {
            console.log('Slack check token verified');
            sockets.checkSystem(req.query.text);
        } else {
            console.log('Incorrect slack token!');
            console.log("Given slack token: "+req.query.token);
            console.log("Correct slack token: "+process.env.SLACK_CHECK_TOKEN);
            console.log("Provided query text: "+req.query.text);
        }
    });

    // app.get('/ping', claptron.pingCommand);
}
