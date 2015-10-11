var express = require('express');
var app = express();
var server = require('http').createServer(app);
//var mongoose = require('./lib/mongoose');
var port = process.env.PORT || 3000;
var config = require('./config');
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

   Object.keys(cluster.workers).forEach(function(id) {
    console.log('running with id : ' + cluster.workers[id].process.pid);
  });

  cluster.on('exit', function(worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died');
  });
} else {
  server.listen(port, function () {
    console.log('Server listening at port %d', port);
  });

  app.use(express.static(__dirname + '/public'));
  
  app.set('io', io);
}
var io = require('socket.io')(server);
io = require('./socket')(io);


//app.use('/', routes);


