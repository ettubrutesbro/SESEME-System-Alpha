var ping = require("net-ping");
var session = ping.createSession();
var claptron = require('./slackbot.js');

function pingCallback(error, target, pi) {
    var title;
    if(error) {
        title = ":goberserk: " + pi + " (" + target + ") is DOWN :goberserk:";
        claptron.reportPing(title, error.toString());
    } else {
        title = ":metal: " + pi + " (" + target + ") is UP :metal:";
        claptron.reportPing(title, null);
    }
}

function pingPi1() { 
    session.pingHost("10.0.1.32", function(error, target) {
        pingCallback(error, target, "Seedling 1"); 
    });
}

function pingPi2() { 
    session.pingHost("10.0.1.33", function(error, target) {
        pingCallback(error, target, "Seedling 2"); 
    });
}

function pingPi3() { 
    session.pingHost("10.0.1.34", function(error, target) {
        pingCallback(error, target, "Seedling 3"); 
    });
}

function pingMonument() { 
    session.pingHost("10.0.1.6", function(error, target) {
        pingCallback(error, target, "Monument"); 
    });
}

exports.pingPi1 = pingPi1;
exports.pingPi2 = pingPi2;
exports.pingPi3 = pingPi3;
exports.pingMonument = pingMonument;
