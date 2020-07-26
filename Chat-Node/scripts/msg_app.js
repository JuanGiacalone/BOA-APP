$(function () {
 
    // se obtiene de la variable usuario de la ruta 
    window.$_GET = new URLSearchParams(location.search);
    var username = $_GET.get('nombre');
    console.log(username);
    // direccion del servidor de node.js 
    var url = 'https://boa-appapi.ddns.net:5501';
    //conexion del socket
    var socket = io.connect(url, { transports: ['websocket']});
    // agregamos el usuario al socket servidor
    socket.emit('add user',username);

  //variables del dom

    // ul de mensajes
    var $messages = $('.messages');

    //ventana de la web
    var $window = $(window);

    //input de texto
    var $inputMsg = $('#m');

    //boton enviar msj
    var $sendButton = document.getElementById("sendButton");

    //msg-body-chats
    var $msgBodychats = document.getElementsByClassName("msg-body-chats");

    //sanitizante de texto
    const cleanInput = (input) => {
      return $('<div/>').text(input).html();
        }

    const addMessageElement = (el, options) => {
      var $el = $(el);
      
          // Setup default options
      if (!options) {
            options = {}; }
      
          if (options.prepend) {
            $messages.prepend($el);
          } else {
            $messages.append($el);
          }
          $messages[0].scrollTop = $messages[0].scrollHeight;
          
        }

  const log = (message, options) => {
          var $el = $('<li>').addClass('log').text(message);
          addMessageElement($el, options);
        }
    
  const addParticipantsMessage = (data) => {
   
      var message = '';
      if (data.numUsers === 1) {
        message += "Hay 1 conectado...";
      } else {
        message += "Hay " + data.numUsers + " conectados...";
      }
      log(message);
    }

    const addWelcomeMessage = () => {

      var message  = '';
      message += "Bienvenido a Boa-Chat-App, "+username;
      log(message);
    }



    // Whenever the server emits 'login', log the login message
    socket.on('login', (data) => {
    connected = true;
    addWelcomeMessage();
    addParticipantsMessage(data);
    
    });
  
    
   

    // enviar mensaje
    const sendMessage = () => {
    event.preventDefault();
    var message = $inputMsg.val();

    // limpieza del mensaje
    message = cleanInput(message);

    // si existe un mensaje y una conexion...
    if (message && connected) {   
      $inputMsg.val('');
      addChatMessage({
        username: username,
        message: message
      });
      // emit para el servidor, con el parametro mensaje
      socket.emit('new message', message);
    }
  }
  
     // agrega el mensaje a la ui.
    const addChatMessage = (data, options) => {
  
      var $usernameDiv = $('<span class="username"/>')
      
        .text(data.username)

        .css('color', 'red');

      var $messageBodyDiv = $('<span class="messageBody">')

        .text(data.message);

      var $messageDiv = $('<li class="message"/>')

        .data('username', data.username)

        .append($usernameDiv, $messageBodyDiv);
      
      addMessageElement($messageDiv, options);
      $msgBodychats[0].scrollTop = $msgBodychats[0].scrollHeight;
    }
    // Cuando se recibe un nuevo mensaje se agrega...
    socket.on('new message', (data) => {
      addChatMessage(data);
    });

     // Cuando se recibe usuario se unió, mostrar nombre en el chat
    socket.on('user joined', (data) => {
      if(data.username!=username)
        // si se une otro usuario
        log(data.username + ' se unió');
      else
        // ó se une este usuario
        log('Te has unido al chat!')
      });


    // agrego evento al boton enviar
    $sendButton.addEventListener("click",function(event){event.preventDefault(); sendMessage(); });


    //agrego evento a la tecla enter y autofocus al input
    $window.keydown(event => {
   
    // Foco automatico al inputMsg
    if (!(event.ctrlKey || event.metaKey || event.altKey)) {
      $inputMsg.focus();
    }
    // Evento en tecla enter de enviar
    if (event.which === 13) {
      event.preventDefault();
        sendMessage();
    }
  });
  
    
});
