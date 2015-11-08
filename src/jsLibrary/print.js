var moment = require('moment');
var colors = require('colors');
var print = function(message) {
    console.log('['.bold + moment().format('MM/DD').bold.gray+ '|' 
                + moment().format('h:mm:ss a').gray + '] '.bold + message);
}

module.exports = print;
