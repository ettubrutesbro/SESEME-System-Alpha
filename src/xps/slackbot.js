// For claptron to report stuff to slack channels
const request = require('request');
const moment = require('moment');
const print = require('../jsLibrary/print.js');
const pinger = require('../xps/ping.js');

function reportConnection(title) {
    var timestamp = moment().format("h:mm a* on ddd, M/D");
    var options = {
        // URI to send a message to the #slack-test channel
        uri: 'https://hooks.slack.com/services/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',
        method: 'POST',
        body: JSON.stringify({
            "channel"       : "#slack-test",
            "username"      : "claptron",
            "attachments"   : [
                {
                    "title"         : ":cubimal_chick: "+title+" :cubimal_chick:",
                    "title_link"    : "http://www.seseme.net",
                    "fallback"      : "*["+timestamp+"] Claptron reporting in: "
                                      + "_hella WET",
                    "pretext"       : "*["+timestamp+"] Claptron reporting in: " 
                                      + "_hella WET",
                    "color"         : "green",
                    "mrkdwn_in"     : ["text", "pretext"]
                }
            ] // end of attachments
        }) // end of body
    };

    // // PUT http request to update the hue color
    // request(options, function(error, response, body) {
    //     if(error) print("Claptron Error: " + error);
    // }); // end of request
}

function reportDisconnect(title) {
    var timestamp = moment().format("h:mm a* on ddd, M/D");
    var options = {
        // URI to send a message to the #slack-test channel
        uri: 'https://hooks.slack.com/services/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',
        method: 'POST',
        body: JSON.stringify({
            "channel"       : "#slack-test",
            "username"      : "claptron",
            "attachments"   : [
                {
                    "title"         : ":hurtrealbad: "+title+" :hurtrealbad:",
                    "title_link"    : "http://www.seseme.net",
                    "fallback"      : "*["+timestamp+"] Claptron reporting in: "
                                      + "_fuckin garbage_",
                    "pretext"       : "*["+timestamp+"] Claptron reporting in: " 
                                      + "_fuckin garbage_",
                    "color"         : "#f30020",
                    "mrkdwn_in": ["text", "pretext"]
                }
            ] // end of attachments
        }) // end of body
    };

    // // PUT http request to update the hue color
    // request(options, function(error, response, body) {
    //     if(error) print("Claptron Error: " + error);
    // }); // end of request
}

function reportSysCheck(systemStatus, pretext) {
    var timestamp = moment().format("h:mm a* on ddd, M/D");
    var monumentColor = (systemStatus.monument === 'online') ? '#00ff00' : '#f30020';
    var pi1Color = (systemStatus.pi1 === 'online') ? '#00ff00' : '#f30020';
    var pi2Color = (systemStatus.pi2 === 'online') ? '#00ff00' : '#f30020';
    var pi3Color = (systemStatus.pi3 === 'online') ? '#00ff00' : '#f30020';
    var options = {
        // URI to send a message to the #slack-test channel
        uri: 'https://hooks.slack.com/services/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',
        method: 'POST',
        body: JSON.stringify({
            "channel"       : "#slack-test",
            "username"      : "claptron",
            "attachments"   : [
                {
                    "title"         : "Periodic System Check",
                    "title_link": "http://www.seseme.net",
                    "fallback"      : "*["+timestamp+"] Claptron reporting in: _"
                                      + pretext+"_!",
                    "pretext"       : "*["+timestamp+"] Claptron reporting in: _"
                                      + pretext + "_!",
                    "color"         : "#47515b",
                    "mrkdwn_in": ["text", "pretext"],
                },
                {
                    "color"         : monumentColor,
                    "fields"        : [
                        {
                            "value" :  "SESEME Monument",
                            "short" : true
                        },
                        {
                            "value" :  "[" + systemStatus.monument +"]",
                            "short" : true
                        }
                    ] // end of fields
                },
                {
                    "color"         : pi1Color,
                    "fields"        : [
                        {
                            "value" : "Seedling 1",
                            "short" : true
                        },
                        {
                            "value" :  "[" + systemStatus.pi1 + "]",
                            "short" : true
                        }
                    ] // end of fields
                },
                {
                    "color"         : pi2Color,
                    "fields"        : [
                        {
                            "value" : "Seedling 2",
                            "short" : true
                        },
                        {
                            "value" :  "[" + systemStatus.pi2 + "]",
                            "short" : true
                        }
                    ] // end of fields
                },
                {
                    "color"         : pi3Color,
                    "fields"        : [
                        {
                            "value" : "Seedling 3",
                            "short" : true
                        },
                        {
                            "value" :  "[" + systemStatus.pi3 + "]",
                            "short" : true
                        }
                    ] // end of fields
                }
            ] // end of attachments
        }) // end of body
    };

    // // PUT http request to update the hue color
    // request(options, function(error, response, body) {
    //     if(error) print("Claptron Error: " + error);
    // }); // end of request
}

function reportPing(title, error) {
    var title;
    var message = error || "hella WET";
    var color = error ? "red" : "green";
    var timestamp = moment().format("h:mm a* on ddd, M/D");
    var options = {
        // URI to send a message to the #slack-test channel
        uri: 'https://hooks.slack.com/services/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',
        method: 'POST',
        body: JSON.stringify({
            "channel"       : "#slack-test",
            "username"      : "claptron",
            "attachments"   : [
                {
                    "title"         : title, 
                    "title_link"    : "http://www.seseme.net",
                    "fallback"      : "*["+timestamp+"] Claptron reporting in: "
                                      + message,
                    "pretext"       : "*["+timestamp+"] Claptron reporting in: " 
                                      + message,
                    "color"         : color,
                    "mrkdwn_in": ["text", "pretext"]
                }
            ] // end of attachments
        }) // end of body
    };

    // // PUT http request to update the hue color
    // request(options, function(error, response, body) {
    //     if(error) print("Claptron Error: " + error);
    // }); // end of request
}

function checkCommand(req, res) {
    console.log('Received a slack command to check the system');
    if(req.query.token === process.env.SLACK_CHECK_TOKEN) {
        console.log('Slack check token verified');
        switch(req.query.text) {
            case 'system':
                console.log('Checking SESEME system...');
	        case "pi1":
                console.log('Checking Seedling 1...');
	            break;
	        case "pi2":
                console.log('Checking Seedling 2...');
	            break;
	        case "pi3":
                console.log('Checking Seedling 3...');
	            break;
	        case "monument":
                console.log('Checking Monument...');
	            break;
            default:
                console.log('Incorrect slash comand!');
        }
    } else {
        console.log('Incorrect slack token!');
        console.log("Given slack token: "+req.query.token);
        console.log("Correct slack token: "+process.env.SLACK_CHECK_TOKEN);
    }
}

function pingCommand(req, res) {
    if(req.query.token == process.env.SLACK_PING_TOKEN) {
	    switch(req.query.text) {
	        case "system":
                console.log("Pinging system...");
	            break;
	        case "pi1":
                console.log("Pinging pi1...");
                pinger.pingPi1();
	            break;
	        case "pi2":
                console.log("Pinging pi2...");
                pinger.pingPi2();
	            break;
	        case "pi3":
                console.log("Pinging pi3...");
                pinger.pingPi3();
	            break;
	        case "monument":
                console.log("Pinging monument...");
                pinger.pingMonument();
	            break;
            default:
                console.log("Incorrect slash command!");
	    }
    } else {
        console.log("Incorrect slack token!");
        console.log("Given slack token: "+req.query.token);
        console.log("Correct slack token: "+process.env.SLACK_PING_TOKEN);
    }
}

exports.reportPing          = reportPing;
exports.reportSysCheck      = reportSysCheck;
exports.reportDisconnect    = reportDisconnect;
exports.reportConnection    = reportConnection;
