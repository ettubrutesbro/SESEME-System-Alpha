var moment = require('moment');
function print(message) {
	return function(message) { 
        console.log(moment().format('〈MM/DD | h:mm:ss a 〉') + message) 
    };
}

exports.print = print;
