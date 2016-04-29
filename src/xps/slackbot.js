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


function reportSystemCheck(systemStatus, pretext) {

    const pi1 = {
        color: (systemStatus.pi1 === 'online') ? '#00ff00' : '#f30020',
        emoji: (systemStatus.pi1 === 'online') ? ':tada:' : ':trueunclephil:'
    };
    const pi2 = {
        color: (systemStatus.pi2 === 'online') ? '#00ff00' : '#f30020',
        emoji: (systemStatus.pi2 === 'online') ? ':tada:' : ':trueunclephil:'
    };
    const pi3 = {
        color: (systemStatus.pi3 === 'online') ? '#00ff00' : '#f30020',
        emoji: (systemStatus.pi3 === 'online') ? ':tada:' : ':trueunclephil:'
    };
    const monument = {
        color: (systemStatus.monument === 'online') ? '#00ff00' : '#f30020',
        emoji: (systemStatus.monument === 'online') ? ':tada:' : ':trueunclephil:'
    };

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
                    "title_link"    : "http://www.seseme.net",
                    "fallback"      : `Claptron reporting in: _${pretext}_!`,
                    "pretext"      : `Claptron reporting in: _${pretext}_!`,
                    "color"         : "#47515b",
                    "mrkdwn_in": ["text", "pretext"],
                },
                {
                    "color"         : monument.color,
                    "fields"        : [ 
                        { "value" :  "SESEME Monument", "short" : true },
                        { "value" :  `[${systemStatus.monument}]`, "short" : true },
                        { "value" :  monument.emoji, "short" : true }
                    ]
                },
                {
                    "color"         : pi1.color,
                    "fields"        : [
                        { "value" : "Seedling 1", "short" : true },
                        { "value" :  `[${systemStatus.pi1}]`, "short" : true },
                        { "value" :  pi1.emoji, "short" : true }
                    ]
                },
                {
                    "color"         : pi2.color,
                    "fields"        : [
                        { "value" : "Seedling 2", "short" : true },
                        { "value" :  `[${systemStatus.pi2}]`, "short" : true },
                        { "value" :  pi2.emoji, "short" : true }
                    ]
                },
                {
                    "color"         : pi3.color,
                    "fields"        : [
                        { "value" : "Seedling 3", "short" : true },
                        { "value" :  `[${systemStatus.pi3}]`, "short" : true },
                        { "value" :  pi3.emoji, "short" : true }
                    ]
                }
            ] // end of attachments
        }) // end of body
    };

    request(options, function(error, response, body) {
        if(error) print("Claptron Error: " + error);
    });
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

exports.reportPing          = reportPing;
exports.reportSystemCheck   = reportSystemCheck;
exports.reportDisconnect    = reportDisconnect;
exports.reportConnection    = reportConnection;
