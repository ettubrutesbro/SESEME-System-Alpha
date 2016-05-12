// For claptron to report stuff to slack channels
const request = require('request');
const moment = require('moment');
const print = require('../jsLibrary/print.js');
const ENABLE_DISCONNECT_REPORTING = false;

function reportDisconnect(ip, title) {
    const component = {
        ip: ip,
        status: '[OFFLINE]',
        color: '#f30020',
        emoji: ':trueunclephil:'
    };

    const body = {
        "channel"       : "#diagnostic",
        "username"      : "claptron",
        "text": `:robot_face: Uh oh... Something went wrong. :realpancakecat: `,
        "attachments"   : [{
            "title" :  `${title}`,
            "title_link"    : "http://www.seseme.net",
            "mrkdwn_in": ["text", "pretext", "fields"],
            "color"         : component.color,
            "fields"        : [
                { "value" :  `_${ip}_`, "short" : true },
                { "value" :  `*${component.status}*`, "short" : true }
            ]
        }]
    }

    const options = {
        // URI to send a message to the #diagnostic channel
        uri: 'https://hooks.slack.com/services/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',
        method: 'POST',
        body: JSON.stringify(body)
    };

    if(ENABLE_DISCONNECT_REPORTING) {
        // POST http request to report a component disconnect
        request(options, function(error, response, body) {
            if(error) print("Claptron Error: " + error);
        });
    }
}


function reportSystemCheck(systemStatus, pretext, query) {
    if(query.channel_name === 'directmessage') {
        return;
    }

    let attachments = [];

    const pi1 = {
        ip: 'pi@169.237.123.19:2000',
        status: systemStatus.pi1.toUpperCase(),
        color: (systemStatus.pi1 === 'online') ? '#00ff00' : '#f30020',
        emoji: (systemStatus.pi1 === 'online') ? ':tada:' : ':trueunclephil:'
    };
    const pi2 = {
        ip: 'pi@169.237.123.19:2001',
        status: systemStatus.pi2.toUpperCase(),
        color: (systemStatus.pi2 === 'online') ? '#00ff00' : '#f30020',
        emoji: (systemStatus.pi2 === 'online') ? ':tada:' : ':trueunclephil:'
    };
    const pi3 = {
        ip: 'pi@169.237.123.19:2002',
        status: systemStatus.pi3.toUpperCase(),
        color: (systemStatus.pi3 === 'online') ? '#00ff00' : '#f30020',
        emoji: (systemStatus.pi3 === 'online') ? ':tada:' : ':trueunclephil:'
    };
    const monument = {
        ip: 'pi@169.237.123.19:2003',
        status: systemStatus.monument.toUpperCase(),
        color: (systemStatus.monument === 'online') ? '#00ff00' : '#f30020',
        emoji: (systemStatus.monument === 'online') ? ':tada:' : ':trueunclephil:'
    };

    const pi1Attachment = {
        "title" :  `Seedling 1 Pi ${pi1.emoji}`,
        "title_link"    : "http://www.seseme.net",
        "mrkdwn_in": ["text", "pretext", "fields"],
        "color"         : pi1.color,
        "fields"        : [
            { "value" :  `_${pi1.ip}_`, "short" : true },
            { "value" :  `*[${pi1.status}]*`, "short" : true }
        ]
    };
    const pi2Attachment = {
        "title" :  `Seedling 2 Pi ${pi2.emoji}`,
        "title_link"    : "http://www.seseme.net",
        "mrkdwn_in": ["text", "pretext", "fields"],
        "color"         : pi2.color,
        "fields"        : [
            { "value" :  `_${pi2.ip}_`, "short" : true },
            { "value" :  `*[${pi2.status}]*`, "short" : true }
        ]
    };
    const pi3Attachment = {
        "title" :  `Seedling 3 Pi ${pi3.emoji}`,
        "title_link"    : "http://www.seseme.net",
        "mrkdwn_in": ["text", "pretext", "fields"],
        "color"         : pi3.color,
        "fields"        : [
            { "value" :  `_${pi3.ip}_`, "short" : true },
            { "value" :  `*[${pi3.status}]*`, "short" : true }
        ]
    };
    const monumentAttachment = {
        "title" :  `SESEME Monument Pi ${monument.emoji}`,
        "title_link"    : "http://www.seseme.net",
        "mrkdwn_in": ["text", "pretext", "fields"],
        "color"         : monument.color,
        "fields"        : [
            { "value" :  `_${monument.ip}_`, "short" : true },
            { "value" :  `*[${monument.status}]*`, "short" : true }
        ]
    };

    // Construct the final attachments
    if(query.text === 'monument') {
        attachments.push(monumentAttachment);
    } else if(query.text === 'pi1') {
        attachments.push(pi1Attachment);
    } else if(query.text === 'pi2') {
        attachments.push(pi2Attachment);
    } else if(query.text === 'pi3') {
        attachments.push(pi3Attachment);
    } else {
        attachments.push(pi1Attachment, pi2Attachment, pi3Attachment, monumentAttachment);
    }

    const options = {
        // URI to send a message to the #diagnostic channel
        uri: 'https://hooks.slack.com/services/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',
        method: 'POST',
        body: JSON.stringify({
            "channel"       : `#${query.channel_name}`,
            "username"      : "claptron",
            "text": `:robot_face: Claptron reporting in for a *system check*!`,
            "attachments"   : attachments
        })
    };

    request(options, function(error, response, body) {
        if(error) print("Claptron Error: " + error);
    });
}

exports.reportSystemCheck   = reportSystemCheck;
exports.reportDisconnect    = reportDisconnect;
