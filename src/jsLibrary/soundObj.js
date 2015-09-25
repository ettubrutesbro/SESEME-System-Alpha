function SoundsObj(topical, dumb, no, ready, celebratory){
    this.topical = topical;
    this.dumb = dumb;
    this.no = no;
    this.ready = ready;
    this.celebratory = celebratory;
}

/* prototype to fill in arrays of sounds */
var topical = ['cash','police','vroom','water1','water2','horhorhor'];
var dumb = ['baa','horse','quak1','quak2','meow1','meow2','moo1','moo2','moo3','moo4','moo5'];
var no = ['error1','error2','error3','no1','no2','no3','no4'];
var ready = ['chime1','chime2','chime3','chime4','chime5','ready1','ready2','ready3','ready4'];
var celebratory = ['sad','roar'];

//var soundObj = new SoundsObj(topical, dumb, no, ready, celebratory); // create soundObj full of all arrays

exports.soundObj = {
  'topical' : topical,
  'dumb' : dumb,
  'no' : no,
  'ready' : ready,
  'celebratory' : celebratory,

};
