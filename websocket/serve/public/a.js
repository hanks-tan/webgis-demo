
var ws

$('#join').click(function(){
  ws = new WebSocket('ws://localhost:3000')

  ws.onopen = function() {
    var nd = document.getElementById('status')
    nd.innerText = '已建立连接'
  }

  ws.onmessage = function(evt){
    var message = evt.data
    var input = document.getElementById('txt1')
    input.value = message
  }
  
  ws.onclose = function() {
    console.log('连接关闭')
  }
})


function sendMessage(){
  var txt = $('#message').val()
  ws.send(txt)
}



