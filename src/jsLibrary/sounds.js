var Sound = require('node-mpg123');

var self = module.exports = {

	playRandomSound: function(soundObj, type){
		// Determine the sound type and its corresponding sound array and play the sound
		var randValue = Math.floor((Math.random() * soundObj[type].length-1) + 1);
		var soundName = soundObj[type][randValue];
		var sound = new Sound('../../sounds/' + soundName + '.mp3');
		sound.play();
	},
/*
	playRandom: function(array){
		var num = Math.floor(Math.random() * array.length);
		var string = "../../sounds/" + array[num];
		console.log("num: " + num);
	    console.log(string);
	    var music = new Sound(string);
	    music.play();
	    return music;
	},

	playRandomType: function(type, soundObj){
		var itr;
      	for(itr = 0; itr < soundTypes.length; itr++){
	       	if(soundTypes[itr] == type)
	       		break;
	    }
     	if(itr == soundTypes.length){
        	console.log("incorrect type");
      	}
      	else{
        	music = this.playRandom(soundObj[type]); // pass in array of sounds
      	}
	},
	*/
}
