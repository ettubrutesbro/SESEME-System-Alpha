var animationTimer;
var hue = require('./hue.js');
var seedlingHue = require('./lifx.js');

var self = module.exports = {
    r: 0,
    g: 0,
    b: 0,
    percentage: 0,
    curFadePercent: 0,
    percentAr: null,
    color: null,
    animationDuration: 0,
    lightPercentage: 0, // not sure if we can save fade state using fadeIn fadeOut

    reset: function(obj){
        this.r = 0;
        this.g = 0;
        this.b = 0;
        this.percentage = 0;
        this.curFadePercent = 0;
        this.percentAr = null;
        this.color = null;
        this.animationDuration = 0;
        this.lightPercentage = 0;

        obj.strip.color("#000");
        obj.strip.show();
    },

    colorObj: function(red, green, blue){
        this.red = red;
        this.green = green;
        this.blue = blue;
    },

    hexToObj: function(color){
        if(!color) color = "FFFFFF";
        console.log(color);
        console.log(typeof color);
        var split = color.split("");
        var i = split[0] == "#" ? 1 : 0 // shift to right if first char is "#"
        var rStr = split[0+i] + split[1+i];
        var gStr = split[2+i] + split[3+i];
        var bStr = split[4+i] + split[5+i];
        var colorObj = new this.colorObj(parseInt(rStr, 16), parseInt(gStr, 16), parseInt(bStr, 16));
        return colorObj;
      }, // given color in hex return colorObj

    updateLED: function(obj){
        console.log("updateLED function");
        console.log("r: %d; g: %d; b: %d; percentage: %d", this.r, this.g, this.b, this.percentage);

        var strip = obj.strip;
        var pixelNum = obj.pixelNum;
        var firstDiode = obj.firstDiode;

        var r = this.r;
        var g = this.g;
        var b = this.b;
        var brightness = 100;
        var percentage = this.percentage;

        strip.color("#000"); // blanks it out
        console.log("r: " + (r*brightness)/100);
        console.log("g: " + (g*brightness)/100);
        console.log("b: " + (b*brightness)/100);
        var string = "rgb(" + Math.round((r*brightness)/100) + ", " + Math.round((g*brightness)/100) + ", " + Math.round((b*brightness)/100) + ")";
        console.log(string);
        for (var i = firstDiode; i < (pixelNum*percentage)/100; i++) {
            var p = strip.pixel(i);
            p.color(string);
        }
        strip.show();
    },

    updateLEDGradient: function(obj){
        console.log("updateLEDGradient function");
        console.log("r: %d; g: %d; b: %d; percentage: %d", this.r, this.g, this.b, this.percentage);

        var maxBrightness = 100;

        var strip = obj.strip;
        var pixelNum = obj.pixelNum;
        var firstDiode = obj.firstDiode;
        var r = this.r * maxBrightness / 255;
        var g = this.g * maxBrightness / 255;
        var b = this.b * maxBrightness / 255;
        var brightness = 100;
        var percentage = this.percentage;

        strip.color("#000"); // blanks it out
        var diodesLit = Math.round((pixelNum*percentage)/100) - firstDiode;
        var decrement = 100/(diodesLit);
        console.log(decrement);
        console.log(diodesLit);
        var ratio = Math.pow((10/maxBrightness), (1/(diodesLit)));
        console.log(ratio);
        for (var i = firstDiode; i < diodesLit+1; i++) {
            //brightness = 100 - i*decrement;
            brightness = maxBrightness * Math.pow(ratio, i-firstDiode);
            console.log(brightness);
            var p = strip.pixel(i);
            var string = "rgb(" + Math.round((r*brightness)/100) + ", " + Math.round((g*brightness)/100) + ", " + Math.round((b*brightness)/100) + ")";
            console.log(string);
            p.color(string);
        }
        strip.show();
    },


    updateColor: function(color, obj){ // sets to max brightness
        var strip = obj.strip;
        var p = strip.pixel(0);
        p.color(color);
        this.r = (p.color().r);
        this.g = (p.color().g);
        this.b = (p.color().b);
        console.log("updateColor\nr: %d, g: %d, b: %d", this.r, this.g, this.b);
        this.updateLED(obj);
    },

    updateColorRGB: function(red, green, blue, obj){ // sets to max brightness
        this.r = red;
        this.g = green;
        this.b = blue;
        console.log("updateColorRGB\nr: %d, g: %d, b: %d", this.r, this.g, this.b);
        this.updateLED(obj);
    },

    updatePercent: function(percent, obj){ // updates percent of light strip lit
        this.percentage = percent;
        console.log("percentage: %d", this.percentage);
        this.updateLED(obj);
    },

    turnRingOn: function(color, obj){
        var strip = obj.strip;
        var pixelNum = obj.pixelNum;
        var firstDiode = obj.firstDiode;
        var litPixelNum = pixelNum - firstDiode;
        var string = "rgb(" + color.red + ", " + color.green + ", " + color.blue + ")";
        for(var i = 0; i < litPixelNum; i++){
            strip.pixel(i+firstDiode).color(string);
        }
    },

    lightTrail: function(trailColor, nodes, time, revolutions, obj, callback){ // time = time for each rev
        console.log("in lightTrail function");
        var that = this;
        var strip = obj.strip;
        var pixelNum = obj.pixelNum;
        var firstDiode = obj.firstDiode;
        var litPixelNum = pixelNum - firstDiode;

        var color = new this.colorObj(trailColor.red, trailColor.green, trailColor.blue);

        var baseBrightness = 20/255;
        //var decrement = maxBrightness/nodes;

        var ratio = Math.pow(baseBrightness, (1/(nodes))); // ratio for exponential decrement function

        var brightnessAr = new Array(nodes);
        var count = firstDiode;
        var intervalTime = time * 1000 / litPixelNum;
        var revs = 0; // counter for number of revolutions

        for(var i = 0; i < nodes; i++){
            brightnessAr[i] = Math.pow(ratio, nodes-i-1); // exponential decrement
        } // create array of brightness values for trail

        var percent = 0;
        var counter = 0;
        var totalCounter = (revolutions * litPixelNum) - (nodes-1);
        var transitionSteps = Math.round(totalCounter / 4); // transition for quarter duration
        var delta = 1 / transitionSteps; // change in percent

        //var timer = setInterval(function(){
        animationTimer = setInterval(function(){

            if(counter < transitionSteps){
                percent += delta;
            } // fadeIn brightness
            else if(counter >= (totalCounter - transitionSteps)){
                percent -= delta;
            } // fadeOut brightness
            if(percent < 0.00005) percent = 0;
            var baseColor = "rgb(" + Math.round(color.red*baseBrightness*percent) + ", " + Math.round(color.green*baseBrightness*percent) + ", " + Math.round(color.blue*baseBrightness*percent) + ")";

            strip.color(baseColor); // sets background color for all leds
            var pixelIndex = count % pixelNum; // set lead pixel location
            for(var i = 0; i < nodes; i++){
                var p = strip.pixel(pixelIndex);
                var string = "rgb(" + Math.round(color.red*brightnessAr[i]*percent) + ", " + Math.round(color.green*brightnessAr[i]*percent) + ", " + Math.round(color.blue*brightnessAr[i]*percent) + ")";
                p.color(string);
                pixelIndex = (pixelIndex + 1) % pixelNum;
                if(pixelIndex == 0)
                    pixelIndex = firstDiode; // move start pixel to pixel 2 on circle
            }
            strip.show();

            if((count + nodes) == pixelNum && (revs + 1) == revolutions){
                console.log("done revolutions");
                clearInterval(animationTimer);
                callback();
            }

            counter++;
            count = (count + 1) % pixelNum; // advance lead pixel
            if(count == 0){
                count = firstDiode; // move start pixel to pixel 2 on circle
                revs++;
            }
        }, intervalTime);
    },

    fadeCircle: function(targetColor, totalDuration, diodePct, obj, callback){
        console.log("in fadeCircle function");
        var that = this; // for callback
        var strip = obj.strip;
        var pixelNum = obj.pixelNum;
        var firstDiode = obj.firstDiode;
        var duration = totalDuration - this.animationDuration

        var startPercent = this.curFadePercent;
        if(startPercent >= diodePct){
            console.log("error invalid stop percent too low");
            return -1;
        }

        var currentColor = startPercent == 0 && this.color == null ? new this.colorObj(0, 0, 0) : new this.colorObj(this.color.red, this.color.green, this.color.blue);

        var litPixelNum = pixelNum - firstDiode;
        var bigSteps = Math.ceil(litPixelNum/2);
        var percentAr = new Array(bigSteps);
        var colorString = new Array(bigSteps);
        var pixel = new Array(litPixelNum);
        var factor = 2; // hard coded value for progression
        var intervalTime = 70; // arbitrary small ms time that works
        var smallSteps = Math.floor(duration * 1000 / (intervalTime * bigSteps * ( (diodePct - startPercent) / 100 ) )); // number of smallSteps to fade one diode

        for(var i = 0; i < litPixelNum; i++){
            pixel[i] = strip.pixel(i+firstDiode);
        } // initialize pixel array

        if(this.percentAr == null){
            for(var i = 0; i < percentAr.length; i++){
                percentAr[i] = 100;
            } // initialize percent array to 100's
        } // create initial percent array
        else{
            percentAr = this.percentAr;
        } // copy existing percentAr

        for(var i = 0; i < litPixelNum / 2; i++){
            colorString[i] = "rgb(" + Math.round((currentColor.red*percentAr[i])/100) + ", " + Math.round((currentColor.green*percentAr[i])/100) + ", " + Math.round((currentColor.blue*percentAr[i])/100) + ")";
            pixel[i].color(colorString[i]);
            pixel[(litPixelNum-1)-i].color(colorString[i]);
        } // set starting color

        for(var i = 0; i < firstDiode; i++){
            strip.pixel(i).color("#000");
        } // inside diodes initialized to 0

        var count = 1;
        var index;
        for(var i = 0; i < percentAr.length; i++){
            if(percentAr[i] != 0){
                index = i;
                break;
            }
        } // set starting index

        var decrementAmount = percentAr[index]/smallSteps;
        var finalSteps = diodePct == 100 ? smallSteps * (bigSteps - index) : Math.round(smallSteps * bigSteps * ( diodePct - startPercent ) / 100);
        if(diodePct != 100)
            var diffColor = new this.colorObj( (targetColor.red - currentColor.red), (targetColor.green - currentColor.green), (targetColor.blue - currentColor.blue) );
        else{
            var difference = 100 - startPercent;
            var percent = difference / (100 + difference);
            var diffColor = new this.colorObj( (targetColor.red - currentColor.red)*percent, (targetColor.green - currentColor.green)*percent, (targetColor.blue - currentColor.blue)*percent );
        }
        var deltaColor = new this.colorObj( (diffColor.red / finalSteps), (diffColor.green / finalSteps), (diffColor.blue / finalSteps) );

        strip.show(); // update led strip display

        //var timer = setInterval(function(){
        animationTimer = setInterval(function(){

            currentColor.red += deltaColor.red;
            currentColor.green += deltaColor.green;
            currentColor.blue += deltaColor.blue;

            for(var i = index; i < litPixelNum / 2; i++){
                var temp = percentAr[i] - ( decrementAmount / Math.pow(factor, i-index) );
                if(temp < 0.05)
                    temp = 0;
                percentAr[i] = temp;
                colorString[i] = "rgb(" + Math.round((currentColor.red*percentAr[i])/100) + ", " + Math.round((currentColor.green*percentAr[i])/100) + ", " + Math.round((currentColor.blue*percentAr[i])/100) + ")";
                pixel[i].color(colorString[i]);
                pixel[(litPixelNum-1)-i].color(colorString[i]);
            } // update brightness and create colorStrings

            strip.show(); // update led strip display

            this.curFadePercent = startPercent + (count / finalSteps) * 100; // save current percent in case of interrupt
            this.percentAr = percentAr;
            this.color = currentColor;


            if(percentAr[index] <= 0){
                //console.log("count: " + count);
                index++; // move leading diode
                decrementAmount = percentAr[index] / smallSteps; // update decrementAmount
            } // diode has gone to 0

            if(index == bigSteps){
                console.log("clear interval\n");
                // reset object attributes
                that.curFadePercent = 0;
                that.color = currentColor;
                that.percentAr = percentAr;
                clearInterval(animationTimer);
                that.fillCircle(targetColor, 3, obj, callback);
            } // done fading and call callback to fill

            else if(count == finalSteps){
                console.log("at stop percent");
                that.curFadePercent = diodePct;
                that.color = currentColor;
                that.percentAr = percentAr;
                this.animationDuration = 0;
                clearInterval(animationTimer);
                callback();
            }
            count++;
            this.animationDuration += intervalTime;
        }, intervalTime);

    },

    fillCircle: function(targetColor, duration, obj, callback){
        console.log("in fillCircle function");
        var that = this;
        var strip = obj.strip;
        var pixelNum = obj.pixelNum;
        var firstDiode = obj.firstDiode;
        var litPixelNum = pixelNum - firstDiode;
        var bigSteps = Math.ceil(litPixelNum/2);

        var currentColor = this.color == null ? new this.colorObj(0, 0, 0) : this.color;

        strip.color("#000"); // initialize led strip
        strip.show();

        var percentAr = new Array(litPixelNum);
        var colorString = new Array(bigSteps);
        var pixel = new Array(litPixelNum);
        var index = 13; // index of leading diode to brighten
        var factor = 2; // hard coded value for progression
        var intervalTime = 100; // original 55
        var smallSteps = Math.floor(duration * 1000 / (intervalTime * bigSteps)); // number of smallSteps to fade one diode
        var incrementAmount = 100 / smallSteps;

        var diffColor = new this.colorObj( (targetColor.red - currentColor.red), (targetColor.green - currentColor.green), (targetColor.blue - currentColor.blue) );
        var deltaColor = new this.colorObj( (diffColor.red / (smallSteps*bigSteps)), (diffColor.green / (smallSteps*bigSteps)), (diffColor.blue / (smallSteps*bigSteps)) );

        for(var i = 0; i < litPixelNum; i++){
            pixel[i] = strip.pixel(i + firstDiode);
        } // initialize pixel array

        for(var i = 0; i < percentAr.length-1; i++){
            percentAr[i] = 0;
        } // initialize percent array

        //var timer = setInterval(function(){
        animationTimer = setInterval(function(){
            currentColor.red += deltaColor.red;
            currentColor.green += deltaColor.green;
            currentColor.blue += deltaColor.blue;

            for(var i = index; i >= 0; i--){
                var temp = percentAr[i] + ( incrementAmount / Math.pow(factor, index-i) );
                if(temp > 100)
                    temp = 100;
                percentAr[i] = temp;
            } // update brightness

            for(var i = 0; i < litPixelNum / 2; i++){
                colorString[i] = "rgb(" + Math.round((currentColor.red*percentAr[i])/100) + ", " + Math.round((currentColor.green*percentAr[i])/100) + ", " + Math.round((currentColor.blue*percentAr[i])/100) + ")";
                pixel[i].color(colorString[i]);
                pixel[(litPixelNum-1)-i].color(colorString[i]);
            } // update colors


            strip.show(); // update led strip display

            if(percentAr[index] >= 100){
                index--; // move leading diode
                incrementAmount = (100-percentAr[index] ) / smallSteps;
            } // diode has gone to 100 brightness

            if(index < 0){
                console.log("clear interval");
                that.color = currentColor;
                that.percentAr = percentAr;
                clearInterval(animationTimer);
                callback();
                //that.blinking(blinkColor, blinkDuration, index, obj);
            }
        }, intervalTime);

    },

    blinking: function(blinkColor, blinkDuration, startIndex, obj, callback){
        clearInterval(animationTimer);

        var strip = obj.strip;
        var pixelNum = obj.pixelNum;
        var firstDiode = obj.firstDiode;

        var originalColor;
        if(this.color == null){
            originalColor = new this.colorObj(0, 0, 0);
        }
        else{
            originalColor = new this.colorObj(this.color.red, this.color.green, this.color.blue);
        }
        var percentAr = this.percentAr;

        console.log("in blink function");
        var litPixelNum = pixelNum - firstDiode;

        if(percentAr == null){
            percentAr = new Array(Math.ceil(litPixelNum/2));
            for (var i = 0; i < litPixelNum/2; i++)
                percentAr[i] = 0;
        }

        var time = blinkDuration;
        var intervalTime = time * 1000 / 4;
        var pixel = new Array(litPixelNum);
        for(var i = 0; i < pixelNum - firstDiode; i++){
            pixel[i] = strip.pixel(i + firstDiode);
        } // initialize pixel array
        var count = 1;
        var timer = setInterval(function(){
            if(count % 2 == 1){
                var colorString = "rgb(" + blinkColor.red + ", " + blinkColor.green + ", " + blinkColor.blue + ")";
                strip.color("#000");
                for(var i = startIndex; i < litPixelNum / 2; i++){
                    pixel[i].color(colorString);
                    pixel[(litPixelNum-1)-i].color(colorString);;
                }
            }
            else{
                for(var i = 0; i < litPixelNum / 2; i++){
                    var colorString = "rgb(" + Math.round((originalColor.red*percentAr[i])/100) + ", " + Math.round((originalColor.green*percentAr[i])/100) + ", " + Math.round((originalColor.blue*percentAr[i])/100) + ")";
                    pixel[i].color(colorString);
                    pixel[(litPixelNum-1)-i].color(colorString);;
                }
            }
            strip.show();

            if(count == 4){
                clearInterval(timer);
                callback();
            }

            count++;

        }, intervalTime)
    },

/*

    nameOn: function(hexColor, time, obj){
        var name = obj;

        var percentage = 0;
        var intervalTime = time * 10;
        name.on();
        name.intensity(percentage);
        name.color(hexColor);
        var timer = setInterval(function(){
            percentage += 1;
            name.intensity(percentage);
            if(percentage == 100){
                clearInterval(timer);
            }
        }, intervalTime);
    },

    nameOff: function(time, obj){
        var name = obj;

        var percentage = 100;
        var intervalTime = time * 10;
        name.intensity(percentage);
        var timer = setInterval(function(){
            percentage -= 1;
            name.intensity(percentage);
            if(percentage == 0){
                name.off();
                name.color("000000");
                clearInterval(timer);
            }
        }, intervalTime);

    },
    */

    lightsOn: function(obj, callback){
        if(obj.seedlingNum === 0){
            // turn on hue
            console.log("turn lights on for seedling1");
            seedlingHue.turnOn(1, 'white');
            this.lightOn(1, obj.urlLight, "FFFFFF")
        } // seedling 1
        else if(obj.seedlingNum === 1){
            console.log("turn lights on for seedling2");
            this.lightOn(1, obj.iconLight, null);
            this.lightOn(1, obj.urlLight, null);
            this.lightOn(1, obj.lmLight, null);
        } // seedling 2
        else if(obj.seedlingNum === 2){
            console.log("turn lights on for seedling3");
            this.lightOn(1, obj.iconLight, null);
        }
        callback(obj);
    }, // turn lights on excluding button light

    lightsOff: function(obj){
        if(obj.seedlingNum === 0){
            console.log("turn lights off for seedling1");
            seedlingHue.turnOn(1, 'white');
            this.lightOff(1, obj.urlLight, "FFFFFF")
        }
        else if(obj.seedlingNum === 1){
            console.log("turn lights off for seedling2");
            this.lightOff(1, obj.iconLight, null);
            this.lightOff(1, obj.urlLight, null);
            this.lightOff(1, obj.lmLight, null);
        }
        else if(obj.seedlingNum === 2){
            console.log("turn lights off for seedling3");
            this.lightOff(1, obj.iconLight, null);
        }

    }, // turn lights off excluding button light


    lightOn: function(time, obj, color){
        var light = obj;
        var timer = null;
        if(color == null){
            light.fadeIn(time*1000); // not as good as fadeOut
        } // halogen or led light bulb
        else{
            light.color(color);
            light.on();
            //var this.lightPercentage = 0;
            /*
            var intervalTime = time * 1000 / (100-this.lightPercentage);
            light.intensity(this.lightPercentage);
            light.color(color);
            light.on();
            timer = setInterval(function(){
                this.lightPercentage += 1;
                light.intensity(this.lightPercentage);
                if(this.lightPercentage == 100){
                    clearInterval(timer);
                }
            }, intervalTime);
            */
        } // rgb led strip
    },

    lightOff: function(time, obj, color){
        var light = obj;
        var timer = null;
        if(color == null){
            light.fadeOut(time*1000);
        } // halogen or led light bulb
        else{
            //var this.lightPercentage = 100;
            light.color("000000");
            light.off();
            /*
            var intervalTime = time * 1000 / (this.lightPercentage);
            light.intensity(this.lightPercentage);
            timer = setInterval(function(){
                this.lightPercentage -= 1;
                light.intensity(this.lightPercentage);
                if(this.lightPercentage == 0){
                    light.off();
                    light.color("000000");
                    clearInterval(timer);
                }
            }, intervalTime);
            */
        } // rgb led strip
    },

    // Breathe function that returns an interval object
    // - - - - -Instantiation Usage- - - - - - - - - - -
    // var interval = led.breathe(...);
    // interval.start;      <-- start function
    // interval.sustain;    <-- actual interval
    // - - - - -Cancellation Usage- - - - - - - - - - -
    // socket.on('stop breathing', function() {
    //   clearInterval(interval.sustain);
    //   interval.running = false;
    // })
    breathe: function(intervalTime, light1, light2) {
        var key = true;
        var currentLight;

        // Function to hold the ramp up and down logic
        var start = function(interval) {
            // Alternate the lights by the key
            if(key) currentLight = light1;
            else currentLight = light2;

            // Light on the first second
            this.lightOn(1, currentLight);

            // Light off the third second
            setTimeout(function() {
                this.lightOff(1, currentLight);
            }, 3000);

            // Alternate the key after every interval
            setTimeout(function() {
                key = !key;
            }, interval);
        }
        // For frequency HI, update ring and button
        //   - duration 3s, interval 6s
        // For frequency LO, update button and url
        //   - duration 3s, interval 12s
        var breatheInterval = {
            'start' : start(intervalTime),
            'sustain' : setInterval(start, intervalTime),
            'running' : true
        };
        return breatheInterval;
    }
}


        /*

        lightOn: function(time, obj){
            var light = obj;
            light.fadeIn(time*1000);
            console.log("lights are on");
        },

        lightOff: function(time, obj){
            var light = obj;
            light.fadeOut(time*1000);
            console.log("lights are off");
        },


        light.brightness(0);
        light.brightness(1);
        var i = 0;
        var count = 0;
        setTimeout(function(){
            var timer = setInterval(function() {
                i = Math.pow(1.01, count);
                count++;
                console.log(i);
                if(i > 255)
                    i = 255;
                light.brightness(Math.round(i));
                if(i == 255){
                    console.log("clear timer" + count);
                    clearInterval(timer);
                }
            }, 4);
            //light.fadeIn(6000);
        }, 1800);
        */
