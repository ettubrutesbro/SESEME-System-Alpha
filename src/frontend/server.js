var path = require('path');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var story = 0;
var part = 0;

console.log('Serving @ localhost:8080');
server.listen(8080);

// SERVE UP STATIC FILES FROM the /web folder
app.use('/', express.static(__dirname + '/'));
app.use('/frontend', express.static(path.join(__dirname, '..', 'frontend')));
app.use('/assets', express.static(path.join(__dirname, '..', 'frontend/assets')));
app.use('/bower_components', express.static(__dirname + '/web/bower_components'));

var socket = require('socket.io');
var io = new socket.listen(5000);
const mongo = require('../xps/stories.js');

const result = [
    [
        require("../xps/init/cool_schools.json"),
        require("../xps/init/energy_use_intensity.json"),
        require("../xps/init/ucd_building_annual_energy_costs.json"),
    ],
    [
        require("../xps/init/wage_inequity.json"),
        require("../xps/init/mass_incarceration.json"),
    ],
    [
        require("../xps/init/cost_of_education.json"),
    ]
];

const stories = {
    environment: mongo.construct(result[0]) ||
        (() => {throw new Error("Invalid story config: [env]")})(),
    society: mongo.construct(result[1]) ||
        (() => {throw new Error("Invalid story config: [soc]")})(),
    misc: mongo.construct(result[2]) ||
        (() => {throw new Error("Invalid story config: [misc]")})()
};

global.part = 0; 
global.story = 0;
global.stories = stories;
global.percentages = [Math.random(), Math.random(), Math.random(), Math.random()];

// MAIN index loader
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/stories', function (req, res) {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'webform', 'index.html'));
});

app.get('/stories-data', function (req, res) {
    console.log("Sending this to the client");
    res.json({
        part: global.part,
        story: global.story,
        stories: global.stories,
        percentages: global.percentages
    });
});

io.on('connection', function (socket) {
	socket.on('error', function (err) {
		console.log("Socket Error! "+err);
		error(err);
	});
});
