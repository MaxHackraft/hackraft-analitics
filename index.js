var express = require('express');
var app = express();
var server = require('http').createServer(app);
var mongoose = require('./lib/mongoose');
var port = process.env.PORT || 3000;
var config = require('./config');

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

app.use(express.static(__dirname + '/public'));

//app.use('/', routes);

server.listen(config.get('port'), function(){
  console.log('Express server listening on port ' + config.get('port'));
});

var io = require('./socket')(server);
app.set('io', io);