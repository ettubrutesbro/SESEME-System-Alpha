var Sound = require('node-mpg123');
var path = require('path');
var soundObj = require(path.join(__dirname, 'soundObj.js'));

var self = module.exports = {

	playRandomSound: function(type, randValue){
		// Create the sound file that hasn't been played in a while
		var soundName = soundObj[type][randValue];
		var sound = new Sound('../../sounds/' + soundName + '.mp3');
		sound.play();

		console.log('Playing sound: '+soundName);
	},

	playRandomType: function(type){
		// Generate random value here; don't need to update array
		var randValue = Math.floor(Math.random() * soundObj[type].length);
		var sound = new Sound('../../sounds/' + soundName + '.mp3');
	  sound.play()

		console.log('Playing sound: '+soundName);
	},

	/*
	playRandomSound: function(soundObj, type, previousSounds){
		// Determine the sound type and its corresponding sound array and play the sound
		var randValue;
		for(;;) { // Keep replacing the random value until it is a desired value
			randValue = Math.floor((Math.random() * soundObj[type].length-1) + 1);
			for(var i = 0; i < previousSounds.length-1; i++)
				if(randValue === previousSounds[i].index) continue;
			break;
		}
		// ['1', '2', '3', '4']  <-- '4' would be the sound index to avoid most
		if(previousSounds.length === 4) previousSounds.shift();
		previousSounds.push({
			'soundName':soundName,
			'index':randValue,
			'type':type
		});

		// Create the sound file that hasn't been played in a while
		var soundName = soundObj[type][randValue];
		var sound = new Sound('../../sounds/' + soundName + '.mp3');
		sound.play();

		console.log('Playing sound: '+soundName);
	}

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

	playRandom: function(array){
		var num = Math.floor(Math.random() * array.length);
		var string = "../../sounds/" + array[num];
		console.log("num: " + num);
	    console.log(string);
	    var music = new Sound(string);
	    music.play();
	    return music;
	},


	*/
}
