var express = require('express');
var app = require('express')();
var serve = require('http').Server(app);
var io = require('socket.io')(serve);
var users = []
var deviceList = initDevice()

app.use(express.static('./public', {
  maxAge: '0',
  etag: true
}));

app.get('/', function(req,res){
  res.sendFile(__dirname + '/index.html')
})

app.get('/video_map', function(req,res){
  var id = req.query.id
  console.log(id)
  res.sendFile(__dirname + '/public/page/video_map.html')
})

io.on('connection', function(socket){
  console.log('新用户接入');
  socket.on('disconnect', function(){
    console.log(`用户${socket.id}断开`)
  })
  socket.on('message', function(message){
    console.log(`${socket.id}:${message}`)
    main(message,socket)
  })
})

serve.listen(5000, function(){
  console.log('listening on 5000....')
})

var main = function(message,socket){
  try {
    // obj = {
    //   header: 'webuser' / 'video',
    //   videoID: '0096'
    // }
    let obj = JSON.parse(message)
    if(obj.head === 'webuser'){
      users.push({
        id: socket.id,
        videoID: obj.videoID
      })
      var videoParams = getVideoParams(obj.videoID)
      socket.emit('message', videoParams)
    }else{
      var targetUsers = users.filter(user => {
        return user.videoID = obj.videoID
      })
  
      if(targetUsers.length > 0) {
        targetUsers.forEach(user => {
            io.to(user.id).emit('message', obj)
        })
      }

      // 存储每个设备状态

    }
  } catch (error) {
    console.log(error)
  }

}

function getVideoParams(deviceID) {
  var device = deviceList.find(device => {
    return device.id = deviceID
  })
  return device
}

function initDevice(){
  var deviceArray = []
  for(let i = 0; i < 100; i++) {
    var device = {
      id: i,
      height: Math.random() * 50,
      hAngle: 20,
      vAngle: 30
    }
    deviceArray.push(device)
  }
  return deviceArray
}