// For claptron to report stuff to slack channels
var request = require('request');
var moment = require('moment');
var print = require('../jsLibrary/print.js');

function reportConnection(title) {
    var timestamp = moment().format("h:mm a* on ddd, M/D");
    var options = {
        // URI to send a message to the #diagnostic channel
        uri: 'https://hooks.slack.com/services/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',
        method: 'POST',
        body: JSON.stringify({
            "channel"       : "#diagnostic",
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

    // PUT http request to update the hue color
    request(options, function(error, response, body) {
        if(error) print("Claptron Error: " + error);
    }); // end of request
}

function reportDisconnect(title) {
    var timestamp = moment().format("h:mm a* on ddd, M/D");
    var options = {
        // URI to send a message to the #diagnostic channel
        uri: 'https://hooks.slack.com/services/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',
        method: 'POST',
        body: JSON.stringify({
            "channel"       : "#diagnostic",
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

    // PUT http request to update the hue color
    request(options, function(error, response, body) {
        if(error) print("Claptron Error: " + error);
    }); // end of request
}

function reportSysCheck(systemStatus, pretext) {
    var timestamp = moment().format("h:mm a* on ddd, M/D");
    var monumentColor = (systemStatus.monument === 'online') ? '#00ff00' : '#f30020';
    var pi1Color = (systemStatus.pi1 === 'online') ? '#00ff00' : '#f30020';
    var pi2Color = (systemStatus.pi2 === 'online') ? '#00ff00' : '#f30020';
    var pi3Color = (systemStatus.pi3 === 'online') ? '#00ff00' : '#f30020';
    var options = {
        // URI to send a message to the #diagnostic channel
        uri: 'https://hooks.slack.com/services/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',
        method: 'POST',
        body: JSON.stringify({
            "channel"       : "#diagnostic",
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

    // PUT http request to update the hue color
    request(options, function(error, response, body) {
        if(error) print("Claptron Error: " + error);
    }); // end of request
}

function reportPing(title, error) {
    var title;
    var message = error || "hella WET";
    var color = error ? "red" : "green";
    var timestamp = moment().format("h:mm a* on ddd, M/D");
    var options = {
        // URI to send a message to the #diagnostic channel
        uri: 'https://hooks.slack.com/services/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',
        method: 'POST',
        body: JSON.stringify({
            "channel"       : "#diagnostic",
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

    // PUT http request to update the hue color
    request(options, function(error, response, body) {
        if(error) print("Claptron Error: " + error);
    }); // end of request
}

exports.reportPing          = reportPing;
exports.reportSysCheck      = reportSysCheck;
exports.reportDisconnect    = reportDisconnect;
exports.reportConnection    = reportConnection;
