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
            environment: mongo.construct(result[0]) || result[0][0],
            society: mongo.construct(result[1]) || result[1][0],
            misc: mongo.construct(result[2]) || result[2][0],
        };
        GLOBAL.stories = stories;
        initServer();
    }).catch(reason => {
        throw reason;
    });
})

function initServer() {
    var sockets = require(path.join("..", "jsLibrary", "websockets.js"));

    // Slack slash commands
    var claptron = require(path.join("..", "xps", "slackbot.js"));
    var pinger = require(path.join("..", "xps", "ping.js"));

    server.listen(8080);
    console.log('Listening on port 8080')

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
            part: GLOBAL.part,
            story: GLOBAL.story,
            stories: GLOBAL.stories,
            percentages: GLOBAL.percentages
        };
        console.log(`GLOBAL.part: ${GLOBAL.part}`);
        console.log(`GLOBAL.story: ${GLOBAL.story}`);
        console.log(`GLOBAL.percentages: ${GLOBAL.percentages}`);
        console.log('- - - - - - - - - - - - - - - - - -');
        res.json(data);
    });

    app.get('/master', function (req, res) {
        res.sendFile(__dirname + '/master/index.html');
    });
}
