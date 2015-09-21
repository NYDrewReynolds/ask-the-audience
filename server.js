const http = require('http');
const express = require('express');
const app = express();
const socketIO = require('socket.io');

app.use(express.static('public'));

app.get('/', function (request, response){
  response.sendFile(__dirname + '/public/index.html');
});

var port = process.env.PORT || 3000;
var server = http.createServer(app);

server.listen(port, function () {
  console.log('Listening on port:', port);
});

const io = socketIO(server);
module.exports = server;
