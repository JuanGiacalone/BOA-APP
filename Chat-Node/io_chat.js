var express = require('express'),
    http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

app.get('/', (req, res) => {

    
    res.sendFile(__dirname + '/msg_app.html');
    
  });

  io.on('connection', (socket) => {
    console.log(socket.id);
    
    socket.on('chat message', (msg) => {
     
      io.emit('chat message', msg);
      
    });
  });

server.listen(5500, () => {
  console.log('listening on *:5500');
});