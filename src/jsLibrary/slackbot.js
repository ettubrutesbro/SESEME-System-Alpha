// For claptron to report stuff to slack channels
var request = require('request');
var moment = require('moment');

function reportSysCheck(systemStatus, title, color) {
	var timestamp = moment().format("ddd, MMM Do YYYY, h:mm a");
	var options = {
		// URI to send a message to the #diagnostic channel
		uri: 'https://hooks.slack.com/services/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',
		method: 'POST',
		body: JSON.stringify({
			"channel"		: "#diagnostic",
			"username"		: "claptron",
		    "attachments": [{
	            "title"		: title,
	            "title_link": "seseme.net",

	            "fallback"	: "Claptron reporting in for a system check at "+timestamp+"!",
	            "pretext"	: "Claptron reporting in for a system check at "+timestamp+"!",

	            "color"		: color,
	            "fields"	: [
	                {
	                    "title": "System Part",
	                    "value":  "SESEME Monument \n"
								+ "Seedling 1 \n"
								+ "Seedling 2 \n"
								+ "Seedling 3",
	                    "short": true
	                },
	                {
	                    "title": "Status",
	                    "value":  "[" + systemStatus.monument +"]\n"
								+ "[" + systemStatus.pi1 + "]\n"
								+ "[" + systemStatus.pi2 + "]\n"
								+ "[" + systemStatus.pi3 + "]",
	                    "short": true
	                }
	            ] // end of fields
			}] // end of attachments
		}) // end of body
	};

	// PUT http request to update the hue color
	request(options, function(error, response, body) {
		if(error) console.log("Error: " + error);
		else console.log("Response: "+JSON.stringify(response,null,2));
	}); // end of request
}

exports.reportSysCheck = reportSysCheck;
