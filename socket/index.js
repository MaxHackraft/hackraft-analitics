// спросить про пушинг данных
module.exports = function(io) {
  var clients = {},
      actions = {},
      containers = {},
      changes = [],
      clientsCounter = 0;

  io.on('connection', function (socket) {
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

    socket.on('change', function (data) {
      var length = actions[socket.clientId].length;

      if(actions[socket.clientId][length - 1]) {
        data.type == 'move' ? data.speed = {
          x: Math.abs( 
            (actions[socket.clientId][length - 1].x - +data.x) /
            (actions[socket.clientId][length - 1].stamp - +data.stamp)
          ),
          y: Math.abs(
            (actions[socket.clientId][length - 1].y - +data.y) /
            (actions[socket.clientId][length - 1].stamp - +data.stamp)
          ),
        } : {
          // parse params
        }

        if(data.target !== actions[socket.clientId][length - 1].target) 
          changes.push({
            target: data.target,
            type: data.type
          });
      }

      actions[socket.clientId].push(data);

      if(containers[socket.clientId][data.target]) {
        containers[socket.clientId][data.target] = containers[socket.clientId][data.target] + 1;
      } else {
        containers[socket.clientId][data.target] = 1;
      }
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
      console.log(changes);
    });
  });

  return io;
};