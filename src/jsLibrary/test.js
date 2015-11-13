var sounds = require('./soundObj.js');
var stories = require('./stories.js');

console.log(JSON.stringify(sounds) + "\n")
console.log(JSON.stringify(sounds['dumb']))
console.log(sounds['dumb'].length)

var print = require('./print.js');
print("test print number: %d", 3);
