



socket.emit('get')
socket.on('data',function(current){
  data = current.story.parts[current.part]
  story = {title: current.story.title, id: current.story.id, parts: current.story.parts.length}
  part = current.part
  // FILL!
})


function init(){

}


socket.on('cycle',function(new){

  for(var i = 0; i<4; i++){
    var valueChanged = new.pointValues[i] === data.pointValues[i] ? false: true
    var nameChanged =
    var captionChanged
  }



})
