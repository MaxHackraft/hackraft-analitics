// спросить про пушинг данных
var http = require('http');
module.exports = function(io) {
  var clients = {},
      actions = {},
      containers = {},
      changes = [],
      clientsCounter = 0,
      numCPUs = require('os').cpus().length;

  io.on('connection', function (socket) {
    var addedClient = false;
    // todo hight load

    var clearStack = function() {
      delete clients[socket.clientId];
      delete actions[socket.clientId];
      delete containers[socket.clientId];
    };

    /*var sendStack = function(action, data) {
      var body = '';
      var request = http.request({
        host: 'localhost:8080/uxdeal-api',
        port: '80',
        path: '/' + action,
        method: 'POST',
        headers: {
          // 
        }
      }, function(response) {
      response.on('data', function (chunk) {
        body += chunk;
      });

      response.on('end',function() {
        console.log(body);
      });

      request.write(postdata);
      request.end();
    };*/

    socket.on('start', function (client) {
      if(!client) {
        socket.broadcast.emit('newClient', {
          // 
        });
      }

      socket.clientId = client.cookieId;
      clients[client.cookieId] = client;
      actions[client.cookieId] = [];
      containers[client.cookieId] = [];

      ++clientsCounter;
      addedClient = true;
      var startAction = {};
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
      } else {
        startAction = data;
      }

      actions[socket.clientId].push(data);

      if(containers[socket.clientId][data.target]) {
        containers[socket.clientId][data.target] = containers[socket.clientId][data.target] + 1;
      } else {
        containers[socket.clientId][data.target] = 1;
      }
    });

    socket.on('finish', function(data) {
      var xA = xO = startAction.x,
          yO = startAction.y,
          xB = data.x,
          yB = yA = data.y,
          length = 0;
      
      var OB = Math.sqrt(Math.pow(xB - xO, 2) + Math.pow(yB - yO, 2));
      //var OA = Math.sqrt(Math.pow(yO - yA, 2));

      var optimalLength = OB;// - Math.pow(OA, 2);

      for (var i = actions[socket.clientId].length - 1; i >= 0; i--) {
        if(actions[socket.clientId][i + 1]) {
          var lineLength = Math.sqrt(Math.pow(actions[socket.clientId][i].x - actions[socket.clientId][i + 1].x, 2) 
            + Math.pow(actions[socket.clientId][i].y - actions[socket.clientId][i + 1].y, 2));
          length += lineLength;
        }   
      };

      socket.emit('result', length/optimalLength);
      console.log(length);
      console.log(OB);
    })


    socket.on('disconnect', function (err) {
      if(actions[socket.clientId]) {
        var length = actions[socket.clientId].length;
        var lastAction = actions[socket.clientId][length - 1];
      }
      
      clearStack();

      delete socket.clientId;
      --clientsCounter;
    });
  });

  return io;
};