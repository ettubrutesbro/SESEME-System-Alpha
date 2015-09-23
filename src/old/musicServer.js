
// *******************  MUSIC STUFF **************
//
var Sound = require('node-mpg123');
var music1 = new Sound('./sounds/orf.mp3');
var music2 = new Sound('./sounds/waterDrop.mp3');


function toggleTimer(){
	if(timerOn){
		timerOn = false
	}
	else{
		timerOn = true;
	}
}

console.log('----CONNECTING ON PORT 3000----   IP:10.0.1.111')
var IP = 'http://10.0.1.111:4000';
var socket = require('socket.io-client')(IP);
var timerOn = false;




socket.on('connect', function(){
  socket.emit('musicServer Login');
  console.log('connected to beagke socket.io : ' + IP)

  socket.on('play1', function(){
			console.log('play song 1 ' + !timerOn)
  		if(!timerOn){
				console.log('ACTUALLY PLAYING SONG 1')
				toggleTimer();
	  		music1.play();
	  		setTimeout(toggleTimer, 30000)
			}
})

  socket.on('play2', function(){
  	console.log('play song 2')

  	if(!toggleTimer){
  		music2.play()
  	}

  })
});
