// Module to set up the board
function setup(socket, seedlingNum, callback) {
    var five = require("johnny-five");
    var pixel = require("node-pixel");
    var fs = require('fs');

    var opts = {};
    opts.port = process.argv[2] || "";

    var board = new five.Board(opts);
    var strip = null;
    var soundObj = null;
    var filesAr = null;
    var pixelNum = null;
    var firstDiode = null;
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

            urlLight = new five.Led.RGB({
              pins: {
                red: 3,
                green: 5,
                blue: 9
              }
            }); // led strip used to light up seseme.net logo
        }

        else if(seedlingNum == 1){
            pixelNum = 26;
            firstDiode = 4;

            iconLight = new five.Led(11);
            urlLight = new five.Led(9);
            lmLight = new five.Led(5);

        }

        else if(seedlingNum == 2){
            pixelNum = 26;
            firstDiode = 4;
            iconLight = new five.Led(11);
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
            //obj = new Board(board, strip, pixelNum, name, light, button);
        });
        var buttonLight = new five.Led(10); // button light up


        obj = new Board(seedlingNum, strip, pixelNum, firstDiode, buttonLight, urlLight, iconLight, lmLight);

        fs.readdir("../../sounds", function(err, files){
            if(err) throw err;
            console.log("read directory")
            filesAr = files;
        }); // call from seedlings folder in directory

        /* prototype to fill in arrays of sounds */
        var topical = ['cash','police','vroom','water1','water2','horhorhor'];
        var dumb = ['baa','horse','quak1','quak2','meow1','meow2','moo1','moo2','moo3','moo4','moo5'];
        var no = ['error1','error2','error3','no1','no2','no3','no4'];
        var ready = ['chime1','chime2','chime3','chime4','ready1','ready2','ready3','ready4'];
        var celebratory = ['sad','roar'];
        soundObj = new SoundsObj(topical, dumb, no, ready, celebratory);

        // Init LED socket listeners
        var initLED = require('../listeners/led.js');
        initLED.listeners(socket, obj, soundObj);

        // Init music socket listeners
        var initMusic = require('../listeners/music.js');
        initMusic.listeners(socket, soundObj);

        callback(obj);
    });
}

exports.setup = setup;
