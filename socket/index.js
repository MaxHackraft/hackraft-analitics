module.exports = function(io) {
  var clients = {};
  var clientsCounter = 0;

  io.on('connection', function (socket) {
    console.log('start')
    var addedClient = false;

    socket.on('start', function (client) {
      if(!client) {
        // create client
        socket.broadcast.emit('newClient', {
          // push data
        });
      }

      socket.client = client;
      socket.client.actions = [];
      socket.client.containers = [];

      clients[client.cookieId] = client;
      ++clientsCounter;
      addedClient = true;
    });

    socket.on('cursor', function (data) {
      //socket.client.actions.push(data);

      if(socket.client.containers[data.target]) {
        socket.client.containers[data.target] = socket.client.containers[data.target] + 1;
      } else {
        socket.client.containers[data.target] = 1;
      }

      console.log(socket.client.containers);
    });

    socket.on('click', function (data) {
      // user click
    });

    /*socket.on('disconnect', function (err) {
      if (addedClient) {
        delete clients[socket.client];
        delete socket.client;
        --clientsCounter;
      }

      console.log('disconnected')
    });*/
  });

  ///return io;
};