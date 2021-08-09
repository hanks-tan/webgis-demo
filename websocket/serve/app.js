var WebSocketServer = require('ws').Server;
wss = new WebSocketServer({port: 3000});
userJoinList = []
wss.on('connection', function(ws){
  console.log('服务-客户已连接');
  ws.on('message', function(message){
    console.log('客户端发来消息：' + message);
    main(message)
  })
})

var main = function(obj) {
  // 一个用户可能发起多给视频连接，user对象不仅要记录用户名，还要记录用户连接的视频ID
  if(obj.header === 'webuser') {
    var userJoin = userJoinList.filter(user => {
      return user.name === obj.name
    })

    if(userJoin){

    }else {
      user.push({
        name: obj.name,
        videoID: obj.videoID
      })
      var videoParams = getVideoParams(obj.id)
      ws.sent(videoParams)
    }
  }else{  // 处理视频终端发过来的消息，消息包含视频终端ID，动作
    var users = userJoinList.filter(user => {
      return user.videoID = obj.videoID
    })
    if(users) {
      ws.sent
    }
  }
}

var getVideoParams = function(id) {
  return {
    height: 50,
    vAngle: 36,
    uAngle: 60
  }
}