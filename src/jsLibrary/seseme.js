var five = require('johnny-five');
var print = require('./print.js');

//---------------------------------------//
//    Module export
var self = module.exports = {
    rpm: 215,
    accel:1700,
    isRunning: false,
    maxPosition: 4800,// motor runing at full stepping (1200*4),
    buffer: 60,
    creepCounter: 0,
    creepRate: 200,

    setup: function(socket, callback){

        var board = new five.Board();
        var stepper = {};

        var MAXHEIGHT = 5000; // macro for max height of pillar
        var OPEN = 1; // macro for relay

        pinData ={
            m1: {},
            m2: {},
            m3: {},
            m4: {},
        }

        // Lays out all the pin numbers (clockwise)

        pinData.m4.dir = 2
        pinData.m4.step = 3
        pinData.m4.enable = 4
        pinData.m4.halSensor = 22

        pinData.m3.dir = 5
        pinData.m3.step = 6
        pinData.m3.enable = 7
        pinData.m3.halSensor = 24

        pinData.m2.dir = 8
        pinData.m2.step = 9
        pinData.m2.enable = 10
        pinData.m2.halSensor = 26

        pinData.m1.dir = 11
        pinData.m1.step = 12
        pinData.m1.enable = 13
        pinData.m1.halSensor = 28

        board.on("ready", function() {


        // Stepper motor creation
            stepper.m1 = {position:0, isRunning:false};
            stepper.m1.motor = new five.Stepper({
                type: five.Stepper.TYPE.DRIVER,
                stepsPerRev: 200,
                pins: {
                    step: pinData.m1.step,
                    dir: pinData.m1.dir
                }
            });

            stepper.m2 = {position:0, isRunning:false};
            stepper.m2.motor = new five.Stepper({
                type: five.Stepper.TYPE.DRIVER,
                stepsPerRev: 200,
                pins: {
                    step: pinData.m2.step,
                    dir: pinData.m2.dir
                }
            });

            stepper.m3 = {position:0, isRunning:false};
            stepper.m3.motor = new five.Stepper({
                type: five.Stepper.TYPE.DRIVER,
                stepsPerRev: 200,
                pins: {
                    step: pinData.m3.step,
                    dir: pinData.m3.dir
                }
            });

            stepper.m4 = {position:0, isRunning:false};
            stepper.m4.motor = new five.Stepper({
                type: five.Stepper.TYPE.DRIVER,
                stepsPerRev: 200,
                pins: {
                    step: pinData.m4.step,
                    dir: pinData.m4.dir
                }
            });

            // Stepper motor creation
            stepper.m1.enableMotor = new five.Relay(pinData.m1.enable);
            stepper.m2.enableMotor = new five.Relay(pinData.m2.enable);
            stepper.m3.enableMotor = new five.Relay(pinData.m3.enable);
            stepper.m4.enableMotor = new five.Relay(pinData.m4.enable);

            // Stepper motor hall sensor
            stepper.m1.halSensor = new five.Switch(pinData.m1.halSensor);
            stepper.m2.halSensor = new five.Switch(pinData.m2.halSensor);
            stepper.m3.halSensor = new five.Switch(pinData.m3.halSensor);
            stepper.m4.halSensor = new five.Switch(pinData.m4.halSensor);


            stepper.m1.halSensor.on("close", function() {
                stepper.m1.enable.close();
                if(stepper.m1.motor.direction == five.Stepper.DIRECTION.CW){
                    stepper.m1.position = MAXHEIGHT;
                } // motorDirection is up
                else{
                    stepper.m1.position = 0;
                } // motorDirection is down
            });

            stepper.m2.halSensor.on("open", function() {


            });
            stepper.m2.halSensor.on("close", function() {
                stepper.m2.enable.close();
                if(stepper.m2.motor.direction == five.Stepper.DIRECTION.CW){
                    stepper.m2.position = MAXHEIGHT;
                } // motorDirection is up
                else{
                    stepper.m2.position = 0;
                } // motorDirection is down
            });

            stepper.m3.halSensor.on("open", function() {


            });
            stepper.m3.halSensor.on("close", function() {
                stepper.m3.enable.close();
                if(stepper.m3.motor.direction == five.Stepper.DIRECTION.CW){
                    stepper.m3.position = MAXHEIGHT;
                } // motorDirection is up
                else{
                    stepper.m3.position = 0;
                } // motorDirection is down
            });

            stepper.m4.halSensor.on("open", function() {


            });
            stepper.m4.halSensor.on("close", function() {
                stepper.m4.enable.close();
                if(stepper.m4.motor.direction == five.Stepper.DIRECTION.CW){
                    stepper.m4.position = MAXHEIGHT;
                } // motorDirection is up
                else{
                    stepper.m4.position = 0;
                } // motorDirection is down
            });


            print('**--------BOARD IS READY!!!')
            print(JSON.stringify(stepper["m1"].isRunning));

            callback(stepper);

        });

    },

    isRunning: function(stepper){
        if(!stepper.m1.isRunning && !stepper.m2.isRunning && !stepper.m3.isRunning && !stepper.m4.isRunning){
                return false;
        }
        else
                return true;
    },

    getStats: function(stepper){
    print("getStats function");
    return {m1: stepper.m1.position,
        m2: stepper.m2.position,
        m3: stepper.m3.position,
        m4: stepper.m4.position}
    },

    reset: function(stepper, motorName){
        stepper[motorName].position=0;
    },

    setPlrmax: function(plrmax){
        this.maxPosition = plrmax;
    },

    testCycle: function(stepper, state){
        var that = this;
        var adjust = 1;
        if(!state) adjust = -1;
        this.moveMotorCallback(stepper, 'm1', (1000*adjust), 1, function(){
            print('at the top!');
            if(!state) that.testCycle(0);
        })
    },

    positionToPercent: function(stepper, motorName){
        return stepper[motorName].position/this.maxPosition;
    },

    percentToPosition: function(stepper, percent){
        return (percent*this.maxPosition)
    },

    moveToPercent: function(stepper, motorName, newPercent){
	    var newPosition = percentToPosition(newPercent);
	    print('percent = ' + newPercent)
	    print('position = ' + newPosition)
	    this.moveToPosition(stepper, newPosition);
    },

    moveToPosition: function(stepper, motorName, newPosition){
	    newPosition = (newPosition/100)*this.maxPosition;

	    // move up
	    if(newPosition > stepper[motorName].position){
	        newPosition = (Math.abs(newPosition - stepper[motorName].position));
	        print('$$$motor:' +motorName + '    $$$$steps:' + newPosition + '     $$$DIR:1')
	        this.moveMotor(stepper, motorName, newPosition, 1)
	    }
	    // else move down
	    else{
	        newPosition = (Math.abs(newPosition - stepper[motorName].position));
	        print('$$$motor:' +motorName + '    $$$$steps:' + newPosition +    '     $$$DIR:0')
	        this.moveMotor(stepper, motorName, Math.abs(newPosition), 0)
	    }
    },

    moveToPositionCallback: function(stepper, motorName, newPosition, callback){
	    newPosition = (newPosition/100)*this.maxPosition;

	    // move up
	    if(newPosition > stepper[motorName].position){
	        // print(' -- UP');
	        newPosition = (Math.abs(newPosition - stepper[motorName].position));
	        print('$$$motor:' +motorName + '    $$$$steps:' + newPosition + '     $$$DIR:1')
	        this.moveMotor(stepper, motorName, newPosition, 1)
	    }
	    // else move down
	    else{
	        print(' -- DOWN');
	        newPosition = (Math.abs(newPosition - stepper[motorName].position));
	        print('$$$motor:' +motorName + '    $$$$steps:' + newPosition +    '     $$$DIR:0')
	        this.moveMotor(stepper, motorName, Math.abs(newPosition), 0)
	    }
	    callback();
    },

    //    --------------------------------
    //    Move the pillar move very slowly
    //
    moveMotorCreep: function(stepper, motorName, steps, dir){

	    var that = this;

	    print('hi')
	    print('moving creep steps ========= ' + that.creepRate)

	    if(this.creepCounter < steps/this.creepRate){
	        this.creepCounter += 1;
	        print('yoyo')
	        this.moveMotorCallback(stepper, motorName, this.creepRate, dir, function(){
	            print('yoyo **********************')
	            that.moveMotorCreep(stepper, motorName, steps, dir)
	        });
	    }
	    else{
	        this.moveMotor(stepper, motorName, (steps-(this.creepCounter*this.creepRate)))
	    }
    },

    moveMotor: function(stepper, motorName, steps, dir){
	    print('motorName -- ' + motorName )
	    if(!stepper[motorName].isRunning){
	        var that = this;
	        stepper[motorName].enableMotor.on(); // enable motor to move
	        if(dir == 0){
	            // motor down
	            if(stepper[motorName].position - steps < this.buffer){
	                steps = stepper[motorName].position - this.buffer
	                print('adjusted steps')
	            }
	            if(stepper[motorName].position > this.buffer){         // as long as the pillar is not above the limit than move
	                // MOVE
	                stepper[motorName].isRunning = true;
	                print('             --- MOVING ** ' + motorName)
	                var beforeTime = Date.now();
	                stepper[motorName].motor.rpm(this.rpm).ccw().accel(this.accel).decel(this.accel).step(steps, function(){
	                    print("Time to move: " + (Date.now() - beforeTime) / 1000 + " seconds\nSteps: " + steps);
	                    print(' -- done moving ---    Motor: '+ motorName +'    steps:' + steps + '    dir: ' + dir )
	                    stepper[motorName].isRunning = false;
	                    stepper[motorName].position -= steps
	                    print('    position: ' + stepper[motorName].position)
	                });
	            }
	        }

	        else if(dir == 1){
	            // motor up
	            if(stepper[motorName].position+steps > this.maxPosition - this.buffer){
	                steps = (this.maxPosition - this.buffer) - stepper[motorName].position
	                print('adjusted steps')
	            }

	            if(stepper[motorName].position < this.maxPosition){
	                // MOVE
	                stepper[motorName].isRunning = true;
	                print('MOVING ** ' + motorName)
	                var beforeTime = Date.now();
	                stepper[motorName].motor.rpm(this.rpm).cw().accel(this.accel).decel(this.accel).step(steps, function(){
	                    print("Time to move: " + (Date.now() - beforeTime) / 1000 + " seconds\nSteps: " + steps);
	                    print('DONE Moving!!!!!-    Motor: '+ motorName +'    steps:' + steps + '    dir: ' + dir )
	                    stepper[motorName].isRunning = false;
	                    stepper[motorName].position += steps;
	                    stepper[motorName].enableMotor.off(); // power down motor to stop
	                    print('position: ' + stepper[motorName].position)
	                });
	            }
	        }
	    }
	    else print('already running')
    },


    moveMotorCallback: function(stepper, motorName, steps, dir, callback){
	    print('motorName -- ' + motorName )
	    if(!stepper[motorName].isRunning){
	        var that = this;
	        stepper[motorName].enableMotor.on(); // enable motor to move
	        if(dir == 0){
	            // motor down
	            if(stepper[motorName].position - steps < this.buffer){
	                steps = stepper[motorName].position - this.buffer
	                print('adjusted steps')
	            }
	            if(stepper[motorName].position > this.buffer){         // as long as the pillar is not above the limit than move
	                // MOVE
	                stepper[motorName].isRunning = true;
	                print('             --- MOVING ** ' + motorName)
	                var beforeTime = Date.now();
	                stepper[motorName].motor.rpm(this.rpm).ccw().accel(this.accel).decel(this.accel).step(steps, function(){
	                    print("Time to move: " + (Date.now() - beforeTime) / 1000 + " seconds\nSteps: " + steps);
	                    print(' -- done moving ---    Motor: '+ motorName +'    steps:' + steps + '    dir: ' + dir )
	                    stepper[motorName].isRunning = false;
	                    stepper[motorName].position -= steps;
	                    stepper[motorName].enableMotor.off(); // power down motor to stop
	                    print('    position: ' + stepper[motorName].position);
	                    callback(stepper);
	                });
	            }
	        }

	        else if(dir == 1){
	            // motor up
	            if(stepper[motorName].position+steps > this.maxPosition - this.buffer){
	                steps = (this.maxPosition - this.buffer) - stepper[motorName].position
	                print('adjusted steps')
	            }

	            if(stepper[motorName].position < this.maxPosition){
	                // MOVE
	                stepper[motorName].isRunning = true;
	                print('MOVING ** ' + motorName)
	                var beforeTime = Date.now();
	                stepper[motorName].motor.rpm(this.rpm).cw().accel(this.accel).decel(this.accel).step(steps, function(){
	                    print("Time to move: " + (Date.now() - beforeTime) / 1000 + " seconds\nSteps: " + steps);
	                    print('DONE Moving!!!!!-    Motor: '+ motorName +'    steps:' + steps + '    dir: ' + dir )
	                    stepper[motorName].isRunning = false;
	                    stepper[motorName].position += steps;
	                    stepper[motorName].enableMotor.off(); // power down motor to stop
	                    print('position: ' + stepper[motorName].position)
	                    callback(stepper);
	                });
	            }
	        }
	    }
	    else print('already running')
    },


    moveMotorOldCallback: function(stepper, motorName, steps, dir, data, callback){

	    if(!stepper[motorName].isRunning){
	        var that = this;
	        if(dir == 0){
	            // motor down
	            if(stepper[motorName].position - steps < this.buffer){
	                steps = stepper[motorName].position - this.buffer
	                print('adjusted steps')
	            }
	            if(stepper[motorName].position > this.buffer){         // as long as the pillar is not above the limit than move
	                // MOVE
	                stepper[motorName].isRunning = true;
	                print('MOVING ** ' + motorName)
	                stepper[motorName].motor.rpm(this.rpm).ccw().accel(this.accel).decel(this.accel).step(steps, function(){
	                    print('DONE Moving!!!!!-    Motor: '+ motorName +'    steps:' + steps + '    dir: ' + dir )
	                    stepper[motorName].isRunning = false;
	                    stepper[motorName].position -= steps
	                    print('position: ' + stepper[motorName].position)
	                    callback(data);
	                });
	            }
	        }

	        else if(dir == 1){
	            // motor up
	            if(stepper[motorName].position+steps > this.maxPosition - this.buffer){
	                steps = (this.maxPosition - this.buffer) - stepper[motorName].position
	                print('adjusted steps')
	            }

	            if(stepper[motorName].position < this.maxPosition){
	                // MOVE
	                stepper[motorName].isRunning = true;
	                print('MOVING ** ' + motorName)
	                stepper[motorName].motor.rpm(this.rpm).cw().accel(this.accel).decel(this.accel).step(steps, function(){
	                    print('DONE Moving!!!!!-    Motor: '+ motorName +'    steps:' + steps + '    dir: ' + dir )

	                    stepper[motorName].isRunning = false;
	                    stepper[motorName].position += steps

	                    print('position: ' + stepper[motorName].position)
	                    callback();
	                });
	            }
	        }
	    }
	    else print('already running')
    },

}
