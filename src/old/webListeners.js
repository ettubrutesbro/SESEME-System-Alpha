function webListener(socket) {
    socket.on('checkin', function(data){
      console.log('###  webClient checkin')
      console.log(data)
    })

    socket.on('webMoveMotor', function(data){
      console.log('motor:' + data.motor + '  steps:' + data.steps + '  direction:' + data.dir)
      if(beagleOnline){
        console.log('beagle ONLINE')
        beagle.emit('webMoveMotor', data);
      }
    })

    socket.on('testCycle', function(){
      console.log('*** testCycle');
      //seseme.testCycle(1);
    })

    socket.on('updateFrequency', function(data){
      console.log('update acceleration: ' + data)
      if(beagleOnline)  beagle.emit('updateFrequency', data);
    })

    socket.on('updateRPM', function(data){
      console.log('update rpm: ' + data)
      if(beagleOnline)  beagle.emit('updateRPM', data);
    })

    socket.on('resetPosition', function(motorName){
      console.log('reset position for: ' + motorName);
      if(beagleOnline)  beagle.emit('resetPosition', motorName);
    })

    socket.on('loopPillars', function(){
      console.log('LOOPING seseme');
      if(beagleOnline)  beagle.emit('loopPillars');
    })

    socket.on('setHSL', function(data){
      console.log(data)
      hue.setHSL(data)
    })

    socket.on('ledColor', function(data){
      console.log(data)
      if(seedlings[0].online)  seedlings[0].socket.emit('ledColor', data);
    })

    socket.on('ledBrightness', function(data){
      console.log(data)
      if(seedlings[0].online)  seedlings[0].socket.emit('ledBrightness', data);
    })

    socket.on('ledPercentage', function(data){
      console.log(data)
      if(seedlings[0].online)  seedlings[0].socket.emit('ledPercentage', data);
    })

    socket.on('lightsOn', function(data){
      console.log("lights on")
      hue.turnOn()
      if(seedlings[0].online) seedlings[0].socket.emit('lightsOn');
    })

    socket.on('lightsOff', function(data){
      console.log("lights off")
      hue.turnOff()
      if(seedlings[0].online) seedlings[0].socket.emit('lightsOff', data);
    })

    socket.on('partyOn', function(){
      hue.partyOn()
    })

    socket.on('partyOff', function(){
      hue.partyOff()
    })

    socket.on('lightTrail', function(data){
      if(seedlings[0].online) seedlings[0].socket.emit('lightTrail', data);
    })

    socket.on('fadeCircle', function(data){
      if(seedlings[0].online) seedlings[0].socket.emit('fadeCircle', data);
    })

    socket.on('blink', function(data){
      if(seedlings[0].online) seedlings[0].socket.emit('blink', data);
    })

    socket.on('moveMotorJack', function(data){
      var motorName = data.name
      var newPosition = parseInt(data.position)
      console.log(motorName + '  position:' + newPosition)
      if(beagleOnline)  beagle.emit('moveMotorJack', data);
    })

    socket.on('whereWeAt', function(){

    })

    socket.on('moveInUnison', function(data){
      if(beagleOnline)  beagle.emit('moveInUnison', data);
    })

    socket.on('moveInSimpleSequence', function(data){
      if(beagleOnline)  beagle.emit('moveInSimpleSequence', data);
    })

    socket.on('nameOn', function(data){
      if(seedlings[0].online)  seedlings[0].socket.emit('nameOn', data);
    })

    socket.on('nameOff', function(data){
      if(seedlings[0].online)  seedlings[0].socket.emit('nameOff', data);
    })
}

exports.webListener = webListener;
