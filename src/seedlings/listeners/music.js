// Module to initialize all socket listeners related to to sound and music
function listeners(socket, soundObj) {
    var Sound = require('node-mpg123');
    var path = require('path');
    var music = null;
    var soundTypes = ["topical", "dumb", "no", "ready", "celebratory"];

    // Listener to play a specific sound given a sound name
    socket.on('seedling play sound', function(soundName) {
        console.log("Played sound '"+soundName+"'");
        var soundPath = path.join(__dirname, '..', '..', '..', 'sounds', soundName+'.mp3');
        var sound = new Sound(soundPath);
        sound.play();
    });

    // Listener to play a specific button sound given a sound name
    socket.on('seedling play button-sound', function(soundName) {
        if(!soundName) {
            console.log('No button-sound!');
            return;
        }
        console.log("Played sound '"+soundName+"'");
        var soundPath = path.join(__dirname, '..', '..', '..', 'sounds', soundName+'.mp3');
        var sound = new Sound(soundPath);
        sound.play();
    });

    // Listeners to play a chime sequence upon syncing
    socket.on('seedling start sync-sequence-1', function() {
        console.log("Playing sync-sequence-1");
        var soundPath = path.join(__dirname, '..', '..', '..', 'sounds', 'chime5.mp3');
        var chime5 = new Sound(soundPath);
        chime5.play();
    	// chime5.on('complete', function() {
        //     console.log('completed sequence-1');
        //     socket.emit('seedling finish sync-sequence-1');
        // });
        setTimeout(function() {
            console.log('completed sequence-1');
            socket.emit('seedling finish sync-sequence-1');
        }, 1000);
    });

    socket.on('seedling start sync-sequence-2', function() {
        console.log("Playing sync-sequence-2");
        var soundPath = path.join(__dirname, '..', '..', '..', 'sounds', 'chime1.mp3');
        var chime1 = new Sound(soundPath);
        chime1.play();
    	// chime1.on('complete', function() {
        //     console.log('completed sequence-2');
        //     socket.emit('seedling finish sync-sequence-2');
        // });
        setTimeout(function() {
            console.log('completed sequence-2');
            socket.emit('seedling finish sync-sequence-2');
        }, 1000);

    });

    socket.on('seedling start sync-sequence-3', function() {
        console.log("Playing sync-sequence-3");
        var soundPath = path.join(__dirname, '..', '..', '..', 'sounds', 'chime4.mp3');
        var chime4 = new Sound(soundPath);
        chime4.play();
    });
}

exports.listeners = listeners;
