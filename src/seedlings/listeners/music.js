// Module to initialize all socket listeners related to to sound and music
function listeners(socket, soundObj) {
    var Sound = require('node-mpg123');
    var sounds = require('../../jsLibrary/sounds.js');
    var music = null;
    var music1 = new Sound('../../../sounds/bubble.mp3');
    var music2 = new Sound('../../../sounds/waterDrop.mp3');
    var soundTypes = ["topical", "dumb", "no", "ready", "celebratory"];
    var previousSounds = [];

    // Listener to play a specific sound given a sound name
    socket.on('seedling play sound', function(soundName) {
        console.log("Played sound '"+soundName+"'");
        var sound = new Sound('../../sounds/'+soundName+'.mp3');
        sound.play();
    });

    // Listener to play a random sound given a sound type
    socket.on('seedling play random-sound', function(type) {
        console.log("Playing random sound of type " + type);
        sounds.playRandomSound(soundObj, type);
    });

    // Listeners to play a chime sequence upon syncing
    socket.on('seedling start sync-sequence-1', function() {
        console.log("Playing sync-sequence-1");
        var chime = new Sound('../../sounds/chime5.mp3');
        chime.play();
    	chime.on('complete', function() {
            socket.emit('seedling finish sync-sequence-1');
        });
    });

    socket.on('seedling start sync-sequence-2', function() {
        console.log("Playing sync-sequence-2");
        var chime = new Sound('../../sounds/chime1.mp3');
        chime.play();
    	chime.on('complete', function() {
            socket.emit('seedling finish sync-sequence-2');
        });
    });

    socket.on('seedling start sync-sequence-3', function() {
        console.log("Playing sync-sequence-2");
        var chime = new Sound('../../sounds/chime4.mp3');
        chime.play();
    });
}

exports.listeners = listeners;
