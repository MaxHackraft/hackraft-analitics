module.exports = function(io) {
  var clients = {};
  var actions = {};
  var containers = {};

  var clientsCounter = 0;

  io.on('connection', function (socket) {
    console.log('start')
    var addedClient = false;

    socket.on('start', function (client) {
      /*if(!client) {
        // create client
        socket.broadcast.emit('newClient', {
          // push data
        });
      }*/

      socket.clientId = client.cookieId;
      clients[client.cookieId] = client;
      actions[client.cookieId] = [];
      containers[client.cookieId] = [];

      ++clientsCounter;
      addedClient = true;
    });

    socket.on('cursor', function (data) {
      actions[socket.clientId].push(data);

      if(containers[socket.clientId][data.target]) {
        containers[socket.clientId][data.target] = containers[socket.clientId][data.target] + 1;
      } else {
        containers[socket.clientId][data.target] = 1;
      }

      console.log(containers[socket.clientId]);
    });

    socket.on('click', function (data) {
      // user click
    });

    socket.on('disconnect', function (err) {
      console.log(socket.clientId)
      if (addedClient) {
        delete clients[socket.clientId];
        delete actions[socket.clientId];
        delete containers[socket.clientId];
        delete socket.clientId;
        --clientsCounter;
      }
      console.log('disconnected')
    });
  });

  return io;
};