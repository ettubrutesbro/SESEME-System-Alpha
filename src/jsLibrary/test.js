var sounds = require('./soundObj.js');
var stories = require('./stories.js');

console.log(JSON.stringify(sounds) + "\n")
console.log(JSON.stringify(sounds['dumb']))
console.log(sounds['dumb'].length)
console.log(JSON.stringify(stories["testStory"].parts[0].color.ring));
