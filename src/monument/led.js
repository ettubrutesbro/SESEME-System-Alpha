var print = require('./print.js');

var self = module.exports = {
  percentage: 0,
  curFadePercent: 0,
  percentAr: null,
  color: null,
  lightPercentage: 0, // not sure if we can save fade state using fadeIn fadeOut
  decrementAmount: null,

  showStrip: function(stripColor, strip){
    var string = "rgb(" + stripColor.red + ", " + stripColor.green + ", " + stripColor.blue + ")";
    strip.color(string);
    strip.show();
  },

  reset: function(obj){
    this.percentage = 0;
    this.curFadePercent = 0;
    this.percentAr = null;
    this.color = null;
    this.lightPercentage = 0;

    var ledAr = obj.ledAr;
    var stripAr = obj.stripAr;
    var pixelNum = obj.pixelNum;
    var colorAr = obj.colorAr;

    for(var i = 0; i < strip.length; i++){
      strip[i].color("#000");
      strip[i].show();
    }
    this.lightsOff(obj);
  },

  colorObj: function(red, green, blue){
    this.red = red;
    this.green = green;
    this.blue = blue;
  },

  hexToObj: function(color){
    if(!color) color = "FFFFFF";
    var split = color.split("");
    var i = split[0] == "#" ? 1 : 0 // shift to right if first char is "#"
    var rStr = split[0+i] + split[1+i];
    var gStr = split[2+i] + split[3+i];
    var bStr = split[4+i] + split[5+i];
    var colorObj = new this.colorObj(parseInt(rStr, 16), parseInt(gStr, 16), parseInt(bStr, 16));
    return colorObj;
  }, // given color in hex return colorObj


  lightsOn: function(obj){
    var ledAr = obj.ledAr;
    var stripAr = obj.stripAr;
    var pixelNum = obj.pixelNum;
    var colorAr = obj.colorAr;
    for(var i = 0; i < ledAr.length; i++){
      this.lightOn(obj.ledAr[i], colorAr[i]); 
    }
  }, // turn lights on 

  lightsOff: function(obj){
    var ledAr = obj.ledAr;
    var stripAr = obj.stripAr;
    var pixelNum = obj.pixelNum;
    var colorAr = obj.colorAr;
    for(var i = 0; i < ledAr.length; i++){
      this.lightOff(obj.ledAr[i], "000000"); 
    }
  }, // turn lights off excluding button light


  lightOn: function(obj, color){
    var light = obj;
    light.color(color);
    light.on();
  },

  lightOff: function(obj, color){
    var light = obj;
    light.color(color);
    light.off();
  },

  lightsUpdate: function(obj, color){
    print("lightsUpdate");
    var light = obj.ledAr[0]; // choose which light that needs to glow
    light.color(color);
    light.on();
  }

  lightsIdle: function(obj){
    print("lightsIdle");
    var led = obj.ledAr; 
    var strip = obj.stripAr;
  }
}
