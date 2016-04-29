function setup(socket, callback){
  var five = require("johnny-five");
  var path = require("path");
  var pixel = require(path.join(__dirname, '..', '..', 'node_modules', 'node-pixel', 'lib', 'pixel.js'));
  var print = require(path.join(__dirname, '..', 'jsLibrary', 'print.js'));
  var ports = [
    { id: "A", port: "/dev/ttyUSB0", timeout: 20 },
    { id: "B", port: "/dev/ttyUSB1", timeout: 20 },
    { id: "C", port: "/dev/ttyUSB2", timeout: 20 }
  ];
  var boards = new five.Boards(ports);
  var led = new Array(4); // store 4 dumb strip leds into this array
  var color = new Array(4); // store colors for dumb strip in initialization array
  var pixelNum = 30; // number of pixels in strip
  var strip = null; // number of pixels in strip
  var obj = null;

  function Board(ledAr, stripAr, pixelNum, colorAr){
    this.ledAr = ledAr;
    this.stripAr = stripAr;
    this.pixelNum = pixelNum;
    this.colorAr = colorAr;
  }

  // Create 2 board instances with IDs "A" & "B"
  boards.on("ready", function() {

    // Both "A" and "B" are initialized
    // (connected and available for communication)

    // Access them by their ID:

    // |this| is an array-like object containing references
    // to each initialized board.

    this.each(function(board) {
      if(board.id === "A"){
        led[0] = new five.Led.RGB({
          pins: {
            red: 3,
            green: 5,
            blue: 6
          },
          board: board
        });

        led[1] = new five.Led.RGB({
          pins: {
            red: 11,
            green: 10,
            blue: 9
          },
          board: board
        });
      }

      else if(board.id === "B"){
        led[2] = new five.Led.RGB({
          pins: {
            red: 6,
            green: 5,
            blue: 3
          },
          board: board
        });

        led[3] = new five.Led.RGB({
          pins: {
            red: 9,
            green: 10,
            blue: 11 
          },
          board: board
        });
      }

      else if(board.id === "C"){
        strip = new pixel.Strip({
          board: this,
          controller: "FIRMATA", // for Johnny Five with just Arduino
          strips: [ {pin: 3, length: pixelNum}, {pin: 9, length: pixelNum}, {pin: 11, length: pixelNum}, {pin: 5, length: pixelNum}, ],
        });

        strip.on("ready", function(){
          print("Strip initialized");
        });

      }

      // init color array to strings representing hex colors
      color[0] = "FF0000";
      color[1] = "00FF00";
      color[2] = "0000FF";
      color[3] = "FFFFFF";

      obj = new Board(led, strip, pixelNum, color);

      // Init listeners for monument strips
      var initLED = require(path.join(__dirname, 'ledListeners.js'));
      initLED.listeners(socket, obj);

      socket.emit("monumentLights finished inits");

      callback(obj);
    });

  });
}

exports.setup = setup;
