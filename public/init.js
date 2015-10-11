$(function() {
  var socket = io();
  var timer;
  // user cookies data
  socket.emit('start', {
    cookieId: 'id'
  });

  $('#active-area').mousemove(function(e) {
    timer = Date.now();
    socket.emit('change', {
      x: e.pageX,
      y: e.pageY,
      stamp: e.timeStamp,
      target: e.target.id || e.target.localName,
      type: 'move;'
    });
  });

  $('#active-area > #finish-container').hover(function(e) {
    socket.emit('finish', {
      x: e.pageX,
      y: e.pageY,
      stamp: Date.now() - timer,
    });
  }, function() {
    //
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

  socket.on('result', function(data) {
    result = data < 0.5 ? 'low' : 'higth';
    $('#result').html('Result:' + data + ',' + result);
  });

});
