jQuery(document).ready(function($) {

  var socket = io();

  // user cookies data
  socket.emit('start', {
    cookieId: 'id'
  });

  $(document).mousemove(function(e) {
    socket.emit('cursor', {
      x: e.pageX,
      y: e.pageY,
      stamp: e.timeStamp
    });
  });

  $(document).click(function(event) {
    socket.emit('click', {
      id: $(this).prop('id'),
      // other props from settings
    })
  });

});
