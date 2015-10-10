var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

app.use(express.static(__dirname + '/public'));

var clients = {};
var clientsCounter = 0;

io.on('connection', function (socket) {
  var addedClient = false;

  socket.on('start', function (client) {
    if(!client) {
      // create client
      socket.broadcast.emit('newClient', {
        // push data
      });
    }
    socket.client = client;
    clients[client.cookieId] = client;
    ++clientsCounter;
    addedClient = true;

    socket.broadcast.emit('started', {
      // on start
    });
  });

  socket.on('cursor', function (data) {
    console.log(data)
  });

  socket.on('click', function (data) {
    // user click
  });

  socket.on('disconnect', function () {
    if (addedClient) {
      delete clients[socket.client];
      --clientsCounter;
    }
  });
});
