function Timer(callback, time) {
    this.setTimeout(callback, time);
}

Timer.prototype.setTimeout = function(callback, time) {
    var self = this;
    if(this.timer) {
        clearTimeout(this.timer);
    }
    this.finished = false;
    this.callback = callback;
    this.time = time;
    this.timer = setTimeout(function() {
         self.finished = true;
        callback();
    }, time);
    this.start = Date.now();
}

Timer.prototype.add = function(time) {
   if(!this.finished) {
       // add time to time left
       time = this.time - (Date.now() - this.start) + time;
       this.setTimeout(this.callback, time);
   }
}

exports.Timer = Timer;
