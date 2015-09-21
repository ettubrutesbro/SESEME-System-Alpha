// Module to initialize all socket listeners related to to sound and music
function listeners(socket, soundObj) {
    var Sound = require('node-mpg123');
    var sounds = require('../../jsLibrary/sounds.js');
    var music = null;
    var music1 = new Sound('../../../sounds/bubble.mp3');
    var music2 = new Sound('../../../sounds/waterDrop.mp3');
    var soundTypes = ["topical", "dumb", "no", "ready", "celebratory"];

    socket.on('playSound1', function(){
      console.log("play sound 1");
      music1.play();
    })

    socket.on('pauseSound1', function(){
      console.log("pause sound 1");
      music1.pause();
    })

    socket.on('playSound2', function(){
      console.log("play sound 2");
      music2.play();
    })

    socket.on('pauseSound2', function(){
      console.log("pause sound 2");
      music2.pause();
    })

    socket.on('playButton', function(data){
      console.log("play button");
      var itr;
      for(var itr = 0; itr < filesAr.length; itr++){
          if(filesAr[itr] == data){
              var string = "../../sounds/" + data;
              console.log(string);
              music = new Sound(string);
              music.play();
              music.on('complete', function () {
                  console.log('Done with playback!');
              });
              break;
          } // name matches
      }

      if(itr == filesAr.length){
          console.log("file not found");
      }

    })

    socket.on('pauseButton', function(data){
      console.log("pause button");
      music.pause();
    })

    socket.on('playType', function(data){
      var itr;
      for(itr = 0; itr < soundTypes.length; itr++){
        if(soundTypes[itr] == data)
          break;
      }
      if(itr == soundTypes.length){
        console.log("incorrect type");
      }
      else{
        music = sounds.playRandom(soundObj[data]); // pass in array of sounds
      }
    })

    socket.on('pauseType', function(data){
      if(music != null)
        music.pause();
    })
}

exports.listeners = listeners;
