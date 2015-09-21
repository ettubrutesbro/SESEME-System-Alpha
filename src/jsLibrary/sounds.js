var Sound = require('node-mpg123');
var soundTypes = ["topical", "dumb", "no", "ready", "celebratory"];

var self = module.exports = {
	play: function(type){
		if(type == "idler"){

		}
		else if(type == "topical"){

		}
		else{

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
}
