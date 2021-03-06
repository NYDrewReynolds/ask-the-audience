const http = require('http');
const express = require('express');
const app = express();
const socketIO = require('socket.io');
const _ = require('lodash');

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
var votes = {};

io.on('connection', function (socket) {
  console.log('A user has connected. Current number of users:', io.engine.clientsCount);
  io.sockets.emit('usersConnected', io.engine.clientsCount);

  socket.emit("statusMessage", "You've connected wooo!")

  socket.on('disconnect', function () {
    console.log('A user has disconnected.', io.engine.clientsCount);
    delete votes[socket.id];
    console.log(votes);
    io.sockets.emit('userConnection', io.engine.clientsCount);
  });

  socket.on('message', function (channel, message) {
    if (channel === 'voteCast') {
      votes[socket.id] = message;
      io.sockets.emit("voteCount", countVotes(votes));
    }
  });
});

function countVotes(votes) {
  var voteCount = {
    A: 0,
    B: 0,
    C: 0,
    D: 0
  };
  for (socketId in votes) {
    voteCount[votes[socketId]]++
  }
  return voteCount;
}

module.exports = server;
