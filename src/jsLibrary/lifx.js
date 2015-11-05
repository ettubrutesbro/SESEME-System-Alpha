// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// [ NOTES ON LIFX BEHAVIOR ]
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// [ New story ]
//        --> Use hardcoded hex value to change color
//
// [ Valid Button Press ]
//        --> Change to current part, will have hardcoded lifx value
//            When you change colors, start at 0.75 and ramp down to 0.6 (12 seconds)
//
// [ Invalid Button Press ]
//        --> Flash (1 down 2 down)
//
// [ Idle Tier 1 Breathe ]
//        --> random duration (go to 0.075 brightness and back to 0.5)
//
// [ Idle Tier 2 Breathe ]
//        --> after 4 minutes of breathing, turn it off
//
// [ Login ]
//        --> During    idle 1: (ignore),
//                    idle 2: (Blink from off to 0.35, chill for 3 seconds, turn off)
//                            ^lowest priority (don't let it interrupt)
//                    active: Same thing as new part
//                            (go to bright 0.75, ramp down to 0.6 for 3 seconds)
//
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// 
var authentication = process.env.LIFX_TOKEN;
var id = process.env.MONUMENT_LIFX_ID;
var id2 = process.env.SEEDLING_LIFX_ID;

var request = require('request');
var options = {
    uri: 'https://api.lifx.com/v1beta1/lights/' + id + '/state',
    method: 'PUT',
    headers: {
        'Authorization': 'Bearer ' + authentication,
        'Content-Type': 'application/JSON'
    }
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Function to call upon a valid button press
function validButtonPress(color, factor) {
    // Check for the sake of the precious lifx
    if(factor > 1) {
        print("Lifx Error: Brightness factor greater than 1");
        return;
    }

    // Hardcoded properties for a behavior specific to a valid button press
    var properties = {
        'brightness': 1 * factor,
        'color'        : color,
        'power'        : 'on',
        'duration'    : 2
    };

    // Promise to update the light, then ramp down
    updateLight(properties);
    if(!factor)
        setTimeout(function() {rampDown(factor, 1.25)}, 12000);
}

// Function to update the light with custom properties that could take:
// [ power / color / brightness / duration ]
function updateLight(properties) {
    print("Lifx: Updating light color now");

    // Configurations and custom headers to send to the API
    options.uri = 'https://api.lifx.com/v1beta1/lights/' + id + '/state';
    options.method = 'PUT';
    options.body = JSON.stringify(properties);

    // PUT http request to update the hue color
    request(options, function(error, response, body) {
        if(error) print("Lifx Error: " + error);
    }); // end of request
}

// Function to ramp down the brightness with a duration
function rampDown(factor, duration) {
    print("Lifx: Ramping down now");

    // Configurations and custom headers to send to the API
    options.uri = 'https://api.lifx.com/v1beta1/lights/' + id + '/state';
    options.method = 'PUT';
    options.body = JSON.stringify({
        'brightness': 0.5 * factor,
        'duration': duration
    });

    // PUT http request to ramp down
    request(options, function(error, response, body) {
        if(error) print("Lifx Error: " + error);
    }); // end of request
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Idle State: Breathe
function breathe() {
    // Configurations and custom headers to send to the API
    options.uri = 'https://api.lifx.com/v1beta1/lights/' + id + '/toggle';
    options.method = 'POST';
    options.body = JSON.stringify({
        'duration'        : 1
    });

    // PUT http request to fade on
    request(options, function(error, response, body) {
        if(error) print('Lifx Error: '+error);
    }); // end of request
}

function fadeOn(duration) {
    return new Promise(function(resolve, reject) {
        // Configurations and custom headers to send to the API
        options.uri = 'https://api.lifx.com/v1beta1/lights/' + id + '/state';
        options.method = 'PUT';
        options.body = JSON.stringify({
            'power'            : 'on',
            'brightness'    : 0.85,
            'duration'        : duration,
        });

        // PUT http request to fade on
        request(options, function(error, response, body) {
            if(error) reject(error);
            else if(response.statusCode == 200 || response.statusCode == 201)
                resolve();
        }); // end of request
    }); // end of promise
}

function fadeOff(duration) {
    return new Promise(function(resolve, reject) {
        // Configurations and custom headers to send to the API
        options.uri = 'https://api.lifx.com/v1beta1/lights/' + id + '/state';
        options.method = 'PUT';
        options.body = JSON.stringify({
            'power'        : 'off',
            'duration'    : duration
        });

        // PUT http request to fade off
        request(options, function(error, response, body) {
            if(error) reject(error);
            else if(response.statusCode == 200 || response.statusCode == 201)
                resolve();
        }); // end of request
    }); // end of promise
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Idle State: Desperation
function desperation(states) {
    options.uri = 'https://api.lifx.com/v1beta1/lights/'+id+'/cycle';
    options.method = 'POST';
    options.body = JSON.stringify({
        'states'    : states,
        'defaults'    : {
            'power'        : 'on',
            'duration'    : 5 * states.length
        }
    });

    // PUT http request to set a cycle of states representing each part in the story
    request(options, function(error, response, body) {
        if(error) print('Lifx Error: '+error)
    }); // end of request

}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Seedling hue functions (merge with fadeOn/Off later?)
function turnOn(duration, color) {
    // Configurations and custom headers to send to the API
    options.uri = 'https://api.lifx.com/v1beta1/lights/' + id2 + '/state';
    options.method = 'PUT';
    options.body = JSON.stringify({
        'power'            : 'on',
        'brightness'    : 0.8,
        'color'            : color,
        'duration'        : duration,
    });

    // PUT http request to fade on
    request(options, function(error, response, body) {
        if(error) print('Lifx Seedling Hue Error: '+error);
    }); // end of request
}

function turnOff(duration) {
    // Configurations and custom headers to send to the API
    options.uri = 'https://api.lifx.com/v1beta1/lights/' + id2 + '/state';
    options.method = 'PUT';
    options.body = JSON.stringify({
        'power'        : 'off',
        'duration'    : duration
    });

    // PUT http request to fade off
    request(options, function(error, response, body) {
        if(error) print('Lifx Seedling Hue Error: '+error);
    }); // end of request
}


exports.breathe = breathe;
exports.fadeOff = fadeOff;
exports.turnOn = turnOn;
exports.turnOff = turnOff;
exports.updateLight = updateLight;
exports.desperation = desperation;
exports.validButtonPress = validButtonPress;
