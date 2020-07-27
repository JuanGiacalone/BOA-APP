//    !!requires!!
const express = require('express'),
    https = require('https');
var path = require('path');
//    !!requires!!

// Configuracion general
const puerto = 5501;
const app = express();
const server = https.createServer(app);

// config del socket
const io = require('socket.io').listen(server);

// contador global de usuarios
var numUsers = 0;


server.listen(puerto, () => {
  console.log('listening on *:5501');
        });

// ubicacion de los archivos - routing
app.use(express.static(path.join(__dirname, 'chat-node')));

    
    

    io.on('connection', (socket) => {

      var addedUser = false;
    console.log(socket.id);

    socket.on('add user', (username) => {
      if (addedUser)
      {
        socket.emit('login', {
          numUsers: numUsers
             });
        return;
      } 
      else
      {
        // guardamos el nombre de usuario en la variable de sesion del socket
        socket.username = username;
      
        console.log(socket.username);
        ++numUsers;
        socket.addedUser = true;
        socket.emit('login', {
        numUsers: numUsers
           });
        // broadcast a todos los nodos con el numero actual de usuarios y el nombre del nuevo usuario en linea
        socket.broadcast.emit('user joined', {
        username: socket.username,
        numUsers: numUsers
          });
      }
    });
    socket.on('new message', (msg) => {
      socket.broadcast.emit('new message', {
        username: socket.username,
        message: msg

      });
    });
  });


