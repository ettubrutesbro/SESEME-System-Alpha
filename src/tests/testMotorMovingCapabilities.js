// create motor var
var motor = require('../jsLibrary/pwmMotor.js')('motor1');

// set pins
motor.setPins('P9_15','P9_16');

// move motor using one speed

motor.moveMotorAtOneSetFrequency(0,400)

setTimeout(function(){
	motor.moveMotor(1,400, function(){
		console.log('we completed the second test')
	})
}, 3000)


