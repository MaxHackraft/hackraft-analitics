$(function() {
  var socket = io();
  // user cookies data
  socket.emit('start', {
    cookieId: 'id'
  });

  $('#active-area').mousemove(function(e) {
    console.log(e.target.id)
    socket.emit('cursor', {
      x: e.pageX,
      y: e.pageY,
      stamp: e.timeStamp,
      target: e.target.id || e.target.localName
    });
  });

  /*$(document).click(function(event) {
    socket.emit('click', {
      id: $(this).prop('id'),
      // other props from settings
    })
  });*/

  $('#stop').click(function() {
    socket.emit('disconnect');
  });

});
