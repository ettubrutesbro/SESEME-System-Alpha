var Sound = require('node-mpg123');

var self = module.exports = {

	playRandomSound: function(soundObj, type, previousSounds){
		// Determine the sound type and its corresponding sound array and play the sound
		var randValue;
		for(;;) { // Keep replacing the random value until it is a desired value
			randValue = Math.floor((Math.random() * soundObj[type].length-1) + 1);
			for(var i = 0; i < previousSounds.length-1; i++)
				if(randValue === previousSounds[i].index) continue;
			break;
		}
		// Create the sound file that hasn't been played in a while
		var soundName = soundObj[type][randValue];
		var sound = new Sound('../../sounds/' + soundName + '.mp3');

		if(previousSounds.length === 4) previousSounds.shift();

		// ['1', '2', '3', '4']  <-- '4' would be the sound index to avoid most
		previousSounds.push({
			'soundName':soundName,
			'index':randValue,
			'type':type
		});
		sound.play();
	}
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
