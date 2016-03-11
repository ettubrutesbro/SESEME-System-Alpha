function setup() {
  var five = require("johnny-five");
  var ports = [
    { id: "A", port: "/dev/ttyusb0" },
    { id: "B", port: "/dev/ttyusb1" }
  ];
  var boards = new five.Boards(ports);

  // Create 2 board instances with IDs "A" & "B"
  boards.on("ready", function() {

    // Both "A" and "B" are initialized
    // (connected and available for communication)

    // Access them by their ID:
    var led = new five.Led({
      pin: 13,
      board: this.byId("A")
    });

    var led1 = new five.Led.RGB({
      pins: {
        red: 3,
        green: 5,
        blue: 6
      }
      board: this.byId("A")
    });

    var led2 = new five.Led.RGB({
      pins: {
        red: 9,
        green: 10,
        blue: 11
      }
      board: this.byId("A")
    });

    var led3 = new five.Led.RGB({
      pins: {
        red: 3,
        green: 5,
        blue: 6
      }
      board: this.byId("B")
    });

    var led4 = new five.Led.RGB({
      pins: {
        red: 9,
        green: 10,
        blue: 11
      }
      board: this.byId("B")
    });

    console.log("Initialized led strips");
    /*

    // |this| is an array-like object containing references
    // to each initialized board.
    this.each(function(board) {
      if (board.id === "B") {
        // Initialize an Led instance on pin 13 of
        // each initialized board and strobe it.
        var led = new five.Led({
          pin: 13,
          board: board
        });

        led.blink();
      }
    });

    */
  });
}
