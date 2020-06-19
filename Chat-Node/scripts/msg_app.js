$(function () {
    var url = '192.168.1.107:5500';
    var socket = io.connect(url, { transports: ['websocket']});
    $('form').submit(function(e){
      e.preventDefault(); // prevents page reloading
      socket.emit('chat message', $('#m').val());
      $('#m').val('');
      return false;
    });
    socket.on('chat message', function(msg){
      $ ('#messages').append($('<li>').text(msg));
    });
  });