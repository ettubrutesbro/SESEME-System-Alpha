/*
 * hue.js
 */

// Private
var hue = require("node-hue-api");

var displayBridges = function(bridge) {
    console.log("Hue Bridges Found: " + JSON.stringify(bridge));
};

// --------------------------
// Using a promise
hue.nupnpSearch().then(displayBridges).done();

// --------------------------
// Using a callback
hue.nupnpSearch(function(err, result) {
    if (err) throw err;
    displayBridges(result);
});

var HueApi = hue.HueApi;
var lightState = hue.lightState;
var state = lightState.create();
var partyCounter = 0;
var host =  "10.0.1.205";
var username ="newdeveloper";
var api = new HueApi(host, username);
var lightSwitch = false;

function displayStatus(status){
    console.log(JSON.stringify(status.state.hue, null, 2));
};

function displayResult(result){
    console.log(result);
}

function displayError(err){
    console.error(err);
}


// Public
var self = module.exports = {


  RGBtoHSL: function(targetColor){
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
  },

  // TURN ON THE BULB
  //
  turnOn: function(){
      //api.setLightState(1,state.on()).then(displayResult).fail(displayError).done();
      //api.setLightState(2,state.on()).then(displayResult).fail(displayError).done();
      //api.setLightState(3,state.on()).then(displayResult).fail(displayError).done();
      api.setLightState(1, {"on": true}, function(err, result) {
          if (err) throw err;
          displayResult(result);
      });
      api.setLightState(2, {"on": true}, function(err, result) {
          if (err) throw err;
          displayResult(result);
      });
      api.setLightState(3, {"on": true}, function(err, result) {
          if (err) throw err;
          displayResult(result);
      });
  },

  turnOff: function(){
    api.setLightState(1, {"on": false}, function(err, result) {
        if (err) throw err;
        displayResult(result);
    });
    api.setLightState(2, {"on": false}, function(err, result) {
        if (err) throw err;
        displayResult(result);
    });
    api.setLightState(3, {"on": false}, function(err, result) {
        if (err) throw err;
        displayResult(result);
    });
  },

  partyOn: function(){
    console.log('  -- starting party mode!');
    api.setLightState(1, lightState.create().on().effect('colorloop')).then(displayResult).fail(displayError).done();
    api.setLightState(2, lightState.create().on().effect('colorloop')).then(displayResult).fail(displayError).done();
    api.setLightState(3, lightState.create().on().effect('colorloop')).then(displayResult).fail(displayError).done();
  },

  partyOff: function(){
    console.log('  -- stoping party mode!');
    api.setLightState(1, lightState.create().on().effect('none')).then(displayResult).fail(displayError).done();
    api.setLightState(2, lightState.create().on().effect('none')).then(displayResult).fail(displayError).done();
    api.setLightState(3, lightState.create().on().effect('none')).then(displayResult).fail(displayError).done();
  },

  setHSL: function(data){
    console.log('set hue:  ' + data.hue)
    console.log('set sat:  ' + data.sat)
    console.log('set bri:  ' + data.bri)
    api.setLightState(1, lightState.create().hsl(data.hue, data.sat, data.bri)).then(displayResult).fail(displayError).done();
    api.setLightState(2, lightState.create().hsl(data.hue, data.sat, data.bri)).then(displayResult).fail(displayError).done();
    api.setLightState(3, lightState.create().hsl(data.hue, data.sat, data.bri)).then(displayResult).fail(displayError).done();
  }
};
