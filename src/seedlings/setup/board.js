// Module to set up the board
function setup(socket, seedlingNum, callback) {
    var five = require("johnny-five");
    var pixel = require("node-pixel");
    var path = require('path');
    var fs = require('fs');

    var opts = {};
    opts.port = process.argv[2] || "";

    var board = new five.Board(opts);
    var strip = null;
    var soundObj = null;
    var filesAr = null;
    var pixelNum = null;
    var firstDiode = null;
    var buttonLight = null;
    var iconLight = null;
    var urlLight = null;
    var lmLight = null;
    var obj = null;

    function Board(seedlingNum, strip, pixelNum, firstDiode, buttonLight, urlLight, iconLight, lmLight){
        this.seedlingNum = seedlingNum;
        this.strip = strip;
        this.pixelNum = pixelNum;
        this.firstDiode = firstDiode;
        this.buttonLight = buttonLight;
        this.urlLight = urlLight;
        this.iconLight = iconLight;
        this.lmLight = lmLight;
    }

    function SoundsObj(topical, dumb, no, ready, celebratory){
        this.topical = topical;
        this.dumb = dumb;
        this.no = no;
        this.ready = ready;
        this.celebratory = celebratory;
    }

    board.on("ready", function() {

        console.log("Board ready, lets add light");

        /***       Different for seedlings      ***/
        if(seedlingNum == 0){
            pixelNum = 29;
            firstDiode = 2;

            buttonLight = new five.Led(10);
            urlLight = new five.Led.RGB([3, 5, 9]);
        }

        else if(seedlingNum == 1){
            pixelNum = 25;
            firstDiode = 3;

            iconLight = new five.Led(11);
            buttonLight = new five.Led(10);
            urlLight = new five.Led(9);
            lmLight = new five.Led(5);

        }

        else if(seedlingNum == 2){
            pixelNum = 26;
            firstDiode = 4;
            buttonLight = new five.Led(3);
            iconLight = new five.Led(5);
        }

        /***       Same for all seedlings      ***/
        strip = new pixel.Strip({
            data: 6,
            length: pixelNum,
            board: this,
            controller: "FIRMATA" // for Johnny Five with just Arduino
        });
        strip.on("ready", function() {
            console.log("Strip initialized");
        });

        obj = new Board(seedlingNum, strip, pixelNum, firstDiode, buttonLight, urlLight, iconLight, lmLight);

        fs.readdir(path.join(__dirname, '..', '..', '..', 'sounds'), function(err, files){
            if(err) throw err;
            console.log("read directory")
            filesAr = files;
        }); // call from seedlings folder in directory

        // Init LED socket listeners
        var initLED = require(path.join(__dirname, '..', 'listeners', 'led.js'));
        initLED.listeners(socket, obj, soundObj);

        // Init music socket listeners
        var initMusic = require(path.join(__dirname, '..', 'listeners', '/music.js'));
        initMusic.listeners(socket, soundObj);

        socket.emit('seedling finished inits', seedlingNum);
        callback(obj);
    });
}

exports.setup = setup;
