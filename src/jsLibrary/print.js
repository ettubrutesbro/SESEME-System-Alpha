var moment = require('moment');
var print = function(message) {
    console.log('[' + moment().format('MM/DD') + '|' 
                + moment().format('h:mm:ss a') + '] ' + message);
}

module.exports = print;
