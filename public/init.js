$(function() {
  var socket = io();
  // user cookies data
  socket.emit('start', {
    cookieId: 'id'
  });

  $('#active-area').mousemove(function(e) {
    console.log(e.target.id)
    socket.emit('change', {
      x: e.pageX,
      y: e.pageY,
      stamp: e.timeStamp,
      target: e.target.id || e.target.localName,
      type: 'click;'
    });
  });

  $(document).click(function(e) {
    console.log(e);
    socket.emit('change', {
      id: $(this).prop('id'),
      x: e.pageX,
      y: e.pageY,
      stamp: e.timeStamp,
      type: 'click',
      params: {
        button: e.button,
        tagname: e.tagName
      }
      // other props from settings
    })
  });

});
