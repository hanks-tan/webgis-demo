var socket;
var map = new VideoMap({})

$(document).ready(function(){
  socket = io();

  socket.on('message',function(message){
    map.setPosition(message.videoParams)
  })

  socket.emit('message', '客户端请求获取数据');

})

