//------------------------------
//   SOCKET HANDLER  -- Webpage
//------------------------------
var seseme = require('./seseme.js');
var hue = require('./hue.js')
var moment = require('moment')


function getIP(){
  var os=require('os');
  var ifaces=os.networkInterfaces();
  for (var dev in ifaces) {
    var alias=0;
    var data = [];
    ifaces[dev].forEach(function(details){
      if (details.family=='IPv4') {
        data.push((dev+(alias?':'+alias:''),details.address));
        ++alias;
      }
    });
    console.log(data)
    socket.emit('checkin', data)
  }
}

function getHSL(hue, saturation, brightness){
  this.hue = hue;
  this.sat = saturation;
  this.bri = brightness;
}

/*
function RGBtoHSL(targetColor){
  var hue, saturation, brightness;
  var rPrime = targetColor.red / 255;
  var gPrime = targetColor.green / 255;
  var bPrime = targetColor.blue / 255;
  var cMax = Math.max(rPrime, gPrime, bPrime);
  var cMin = Math.min(rPrime, gPrime, bPrime);
  var delta = cMax - cMin;

  if(delta == 0) hue = 0;
  else if(cMax == rPrime) hue = 60 * ( ( (gPrime - bPrime) / delta ) % 6 );
  else if(cMax == gPrime) hue = 60 * ( ( (bPrime - rPrime) / delta ) + 2 );
  else hue = 60 * ( ( (rPrime - gPrime) / delta ) + 4 ); // cMax = bPrime

  brightness = (cMax + cMin) / 2;

  saturation = delta == 0 ? 0 : delta / ( 1 - Math.abs( 2*brightness - 1 ) )

  var data = new getHSL(hue, saturation*100, brightness*100);

  return data;
}
*/


console.log('----CONNECTING ON PORT 4000----   IP:169.237.123.19:4000')

var IP = 'http://169.237.123.19:4000';
var socket = require('socket.io-client')(IP);

getIP();

socket.emit('checkin', ' * DATA')

socket.on('connect', function() {
  console.log('beagle 1 On', socket.connected);
  socket.emit("beagle 1 On");
});

socket.on('disconnect', function() {
  console.log('beagle 1 Off', socket.disconnected);
});

socket.on('buttonPressed', function(targetPercentagesArray, plrmax, targetColor) {
  console.log('buttonPressed, move seseme');

  /* move seseme motors*/
  console.log(targetPercentagesArray);
  var beagleStats = seseme.getStats();
  console.log(JSON.stringify(beagleStats));
  for(var i = 0; i < 4; i++){
    var steps = Math.round( targetPercentagesArray[i]*plrmax - beagleStats["m"+(i+1)] );
    var dir = steps > 0 ? 1 : 0; // dir=1 move up; dir=0 move down
    console.log("steps: " + steps);
    //seseme.moveMotor("m"+i, Math.abs(steps), dir);
  }

  /* set hue bulb color */
  var data = hue.RGBtoHSL(targetColor);
  console.log("hue values: " + JSON.stringify(data));
  hue.setHSL(data)
});


socket.on('moveMotor', function(targetStats){
  console.log(JSON.stringify(targetStats));
  var beagleStats = seseme.getStats();
  console.log(JSON.stringify(beagleStats));
  for(var i = 1; i <= 4; i++){
    var steps = targetStats["m"+i] - beagleStats["m"+i]
    var dir = steps > 0 ? 1 : 0; // dir=1 move up; dir=0 move down
    console.log("steps: " + steps);
    //seseme.moveMotor("m"+i, Math.abs(steps), dir);
  }
})

socket.on('webMoveMotor', function(data){
  console.log('motor:' + data.motor + '  steps:' + data.steps + '  direction:' + data.dir)
  seseme.moveMotor(data.motor, data.steps, data.dir)
})

socket.on('updateFrequency', function(data){
  console.log('update acceleration: ' + data)
  seseme.accel = data;
})

socket.on('updateRPM', function(data){
  console.log('update rpm: ' + data)
  seseme.rpm = data;
})

socket.on('resetPosition', function(motorName){
  console.log('reset position for: ' + motorName);
  seseme.reset(motorName);
})

socket.on('getBeagleStats', function(){
  console.log('-------------')
  console.log('BEAGLE STATS');
  socket.emit('returnBeagleStats', seseme.getStats());
})

function loopPillars(){
  console.log('loopPillars ')
  seseme.moveMotor('m1', seseme.maxPosition, 0)
  seseme.moveMotor('m2', seseme.maxPosition, 0)
  seseme.moveMotor('m3', seseme.maxPosition, 0)
  seseme.moveMotor('m4', seseme.maxPosition, 0)
}

socket.on('loopPillars', function(){
  console.log('LOOPING seseme');
  seseme.moveMotorCallback('m1',seseme.maxPosition, 1, loopPillars);
  seseme.moveMotorCallback('m2',seseme.maxPosition, 1, loopPillars);
  seseme.moveMotorCallback('m3',seseme.maxPosition, 1, loopPillars);
  seseme.moveMotorCallback('m4',seseme.maxPosition, 1, loopPillars);
})

socket.on('setHue', function(targetColor){
  var data = hue.RGBtoHSL(targetColor);
  console.log("hue values: " + JSON.stringify(data));
  hue.setHSL(data)
})

socket.on('setHSL', function(data){
  console.log(data)
  hue.setHSL(data)
})

socket.on('lightsOn', function(){
  console.log("hue on")
  hue.turnOn()
})

socket.on('lightsOff', function(){
  console.log("hue off")
  hue.turnOff()
})

socket.on('partyOn', function(){
  hue.partyOn()
})

socket.on('partyOff', function(){
  hue.partyOff()
})

socket.on('moveMotorJack', function(data){
  console.log('************************************************')
  var motorName = data.name
  var newPosition = parseInt(data.position)
  console.log(motorName + '  position:' + newPosition)
  seseme.moveToPosition(motorName, newPosition)
  //seseme.moveToPercent(motorName, newPosition)
})

//
//Move pillars all at the same time
//
socket.on('moveInUnison', function(data){

  seseme.moveToPosition('m1', data.m1)
  seseme.moveToPosition('m2', data.m2)
  seseme.moveToPosition('m3', data.m3)
  seseme.moveToPosition('m4', data.m4)

})

//
//Move pillars one after another in a certain order
//
socket.on('moveInSimpleSequence', function(data){

  console.log('STARTING MOVE ' + data.order[0]);
  seseme.moveToPositionCallback(data.order[0], data[data.order[0]], data, function(data){
    console.log('STARTING MOVE ' + data.order[1]);
    seseme.moveToPositionCallback(data.order[1], data[data.order[1]], data, function(data){
      console.log('STARTING MOVE ' + data.order[2]);
      seseme.moveToPositionCallback(data.order[2], data[data.order[2]], data, function(data){
        console.log('STARTING MOVE ' + data.order[3]);
        seseme.moveToPosition(data.order[3], data[data.order[3]])
      })
    })
  })
})

socket.on('isRunning', function(){
  console.log("check if running")
  var flag = seseme.isRunning();
  socket.emit('checkSesemeRunning', flag);
})
