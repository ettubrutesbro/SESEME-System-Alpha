//------------------------------
//   SOCKET HANDLER  -- Webpage
//------------------------------
//var seseme = require('./seseme.js');

var path = require('path');
var hue = require('./hue.js');
var moment = require('moment');
//var stepper;


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

function moveCallback(stepper){
  socket.emit('seseme finished moving', stepper);
})

console.log('----CONNECTING ON PORT 4000----   IP:169.237.123.19:4000')

var IP = 'http://169.237.123.19:4000';
var socket = require('socket.io-client')(IP);

getIP();

socket.emit('checkin', ' * DATA')

var seseme = require(path.join(__dirname, 'seseme.js'));
seseme.setup(socket, function(stepper){
  //stepper = obj;
  socket.emit('seseme finished setup', stepper); // pass stepper obj to live in xps
});

socket.on('connect', function() {
  console.log('beagle 1 On', socket.connected);
  socket.emit("beagle 1 On");
});

socket.on('disconnect', function() {
  console.log('beagle 1 Off', socket.disconnected);
});

socket.on('buttonPressed', function(targetPercentagesArray, plrmax, stepper) {
  console.log('buttonPressed, move seseme');

  /* move seseme motors*/
  console.log(targetPercentagesArray);
  var beagleStats = seseme.getStats(stepper);
  console.log(JSON.stringify(beagleStats));
  for(var i = 0; i < 4; i++){
    var steps = Math.round( targetPercentagesArray[i]*plrmax - beagleStats["m"+(i+1)] );
    var dir = steps > 0 ? 1 : 0; // dir=1 move up; dir=0 move down
    console.log("steps: " + steps);
    //seseme.moveMotor(stepper, "m"+(i+1), Math.abs(steps), dir);
    seseme.moveMotorCallback(stepper, "m"+(i+1), Math.abs(steps), dir, moveCallback);
  }
});


socket.on('moveMotor', function(targetStats, stepper){
  console.log(JSON.stringify(targetStats));
  var beagleStats = seseme.getStats(stepper);
  console.log(JSON.stringify(beagleStats));
  for(var i = 1; i <= 4; i++){
    var steps = targetStats["m"+i] - beagleStats["m"+i]
    var dir = steps > 0 ? 1 : 0; // dir=1 move up; dir=0 move down
    console.log("steps: " + steps);
    //seseme.moveMotor(stepper, "m"+i, Math.abs(steps), dir);
  }
})

socket.on('webMoveMotor', function(data, stepper){
  console.log('motor:' + data.motor + '  steps:' + data.steps + '  direction:' + data.dir)
  seseme.moveMotorCallback(stepper, data.motor, data.steps, data.dir, moveCallback);
})

socket.on('updateFrequency', function(data){
  console.log('update acceleration: ' + data)
  seseme.accel = data;
})

socket.on('updateRPM', function(data){
  console.log('update rpm: ' + data)
  seseme.rpm = data;
})

socket.on('resetPosition', function(motorName, stepper){
  console.log('reset position for: ' + motorName);
  seseme.reset(stepper, motorName);
})

socket.on('getBeagleStats', function(stepper){
  console.log('-------------')
  console.log('BEAGLE STATS');
  socket.emit('returnBeagleStats', seseme.getStats(stepper));
})

function loopPillars(stepper){
  console.log('loopPillars ')
  seseme.moveMotor(stepper, 'm1', seseme.maxPosition, 0)
  seseme.moveMotor(stepper, 'm2', seseme.maxPosition, 0)
  seseme.moveMotor(stepper, 'm3', seseme.maxPosition, 0)
  seseme.moveMotor(stepper, 'm4', seseme.maxPosition, 0)
}

socket.on('loopPillars', function(stepper){
  console.log('LOOPING seseme');
  seseme.moveMotorOldCallback(stepper, 'm1',seseme.maxPosition, 1, loopPillars);
  seseme.moveMotorOldCallback(stepper, 'm2',seseme.maxPosition, 1, loopPillars);
  seseme.moveMotorOldCallback(stepper, 'm3',seseme.maxPosition, 1, loopPillars);
  seseme.moveMotorOldCallback(stepper, 'm4',seseme.maxPosition, 1, loopPillars);
})

socket.on('moveMotorJack', function(data, stepper){
  console.log('************************************************')
  var motorName = data.name
  var newPosition = parseInt(data.position)
  console.log(motorName + '  position:' + newPosition)
  seseme.moveToPosition(stepper, motorName, newPosition)
  //seseme.moveToPercent(stepper, motorName, newPosition)
})

//
//Move pillars all at the same time
//
socket.on('moveInUnison', function(data, stepper){

  seseme.moveToPosition(stepper, 'm1', data.m1)
  seseme.moveToPosition(stepper, 'm2', data.m2)
  seseme.moveToPosition(stepper, 'm3', data.m3)
  seseme.moveToPosition(stepper, 'm4', data.m4)

})

//
//Move pillars one after another in a certain order
//
socket.on('moveInSimpleSequence', function(data, stepper){

  console.log('STARTING MOVE ' + data.order[0]);
  seseme.moveToPositionCallback(stepper, data.order[0], data[data.order[0]], data, function(data){
    console.log('STARTING MOVE ' + data.order[1]);
    seseme.moveToPositionCallback(stepper, data.order[1], data[data.order[1]], data, function(data){
      console.log('STARTING MOVE ' + data.order[2]);
      seseme.moveToPositionCallback(stepper, data.order[2], data[data.order[2]], data, function(data){
        console.log('STARTING MOVE ' + data.order[3]);
        seseme.moveToPosition(stepper, data.order[3], data[data.order[3]])
      })
    })
  })
})

socket.on('isRunning', function(stepper){
  console.log("check if running")
  var flag = seseme.isRunning(stepper);
  socket.emit('checkSesemeRunning', flag);
})
