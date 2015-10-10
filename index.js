var express = require('express');
var app = express();
var server = require('http').createServer(app);
//var mongoose = require('./lib/mongoose');
var port = process.env.PORT || 3000;
var config = require('./config');

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

app.use(express.static(__dirname + '/public'));
var io = require('socket.io')(server);
io = require('./socket')(io);
app.set('io', io);

//app.use('/', routes);


