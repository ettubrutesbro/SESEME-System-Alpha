var sounds = require('./soundObj.js');
var stories = require('./stories.js');

console.log(JSON.stringify(sounds) + "\n")
console.log(JSON.stringify(sounds['dumb']))
console.log(sounds['dumb'].length)
console.log(JSON.stringify(stories["testStory"].parts[0].color.ui));
if(Object.keys(stories["testStory"].parts[0].color.ui).length > 0) console.log("here")
