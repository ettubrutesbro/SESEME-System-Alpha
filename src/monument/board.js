function setup(socket, callback){
  var five = require("johnny-five");
  var ports = [
    { id: "A", port: "/dev/ttyusb0" },
    { id: "B", port: "/dev/ttyusb1" }
    { id: "C", port: "/dev/ttyusb2" }
  ];
  var boards = new five.Boards(ports);
  var led = new Array(4); // store 4 dumb strip leds into this array
  var strip = new Array(4); // store 4 smart strip leds into this array
  var color = new Array(4); // store colors for dumb strip in initialization array
  var pixelNum = 30; // number of pixels in strip
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
        var led[0] = new five.Led.RGB([6,5,3]);
        var led[1] = new five.Led.RGB([11,10,9]);
      }

      else if(board.id === "B"){
        var led[2] = new five.Led.RGB([6,5,3]);
        var led[3] = new five.Led.RGB([11,10,9]);
      }

      else if(board.id === "C"){

        strip[0] = new pixel.Strip({
          data: 3,
          length: pixelNum,
          board: this,
          controller: "FIRMATA" // for Johnny Five with just Arduino
        }); 

        strip[1] = new pixel.Strip({
          data: 5,
          length: pixelNum,
          board: this,
          controller: "FIRMATA" // for Johnny Five with just Arduino
        }); 

        strip[2] = new pixel.Strip({
          data: 6,
          length: pixelNum,
          board: this,
          controller: "FIRMATA" // for Johnny Five with just Arduino
        }); 

        strip[3] = new pixel.Strip({
          data: 9,
          length: pixelNum,
          board: this,
          controller: "FIRMATA" // for Johnny Five with just Arduino
        }); 

        // check if strips are all initialized
        for(var i = 0; i < strip.length; i++){
          strip[i].on("ready", function() {
            console.log("Strip " + (i+1) + " initialized");
          }); 
        }

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

      callback(obj);
    });

  });
}

exports.setup = setup;
