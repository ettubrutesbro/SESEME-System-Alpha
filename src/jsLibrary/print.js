var moment = require('moment');
var print = function(message) {
    console.log(moment().format('〈MM/DD | h:mm:ss a 〉') + message) 
}

module.exports = print;
