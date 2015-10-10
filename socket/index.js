module.exports = function(io) {
  var clients = {};
  var actions = {};
  var containers = {};

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

      socket.clientId = client.cookieId;
      clients[client.cookieId] = client;
      actions[client.cookieId] = [];
      containers[client.cookieId] = [];

      ++clientsCounter;
      addedClient = true;
    });

    socket.on('cursor', function (data) {
      var length = actions[socket.clientId].length;

      if(actions[socket.clientId][length - 1])
        data.speed = Math.abs(
          (actions[socket.clientId][length - 1].x - +data.x) / 
          (actions[socket.clientId][length - 1].stamp - +data.stamp)
        );

      actions[socket.clientId].push(data);
      console.log(data);

      if(containers[socket.clientId][data.target]) {
        containers[socket.clientId][data.target] = containers[socket.clientId][data.target] + 1;
      } else {
        containers[socket.clientId][data.target] = 1;
      }
    });

    socket.on('click', function (data) {
      // user click
    });

    socket.on('disconnect', function (err) {
      if(actions[socket.clientId]) {
        var length = actions[socket.clientId].length;
        var firstAction = actions[socket.clientId][0];
        var lastAction = actions[socket.clientId][length - 1];
      }
      
      delete clients[socket.clientId];
      delete actions[socket.clientId];
      delete containers[socket.clientId];
      delete socket.clientId;
      --clientsCounter;
      console.log('disconnected')
    });
  });

  return io;
};