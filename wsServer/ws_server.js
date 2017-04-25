// ----------------------------------------------------------
// This is a simple ws echo server
// prints and sends back received message
// from whomever
const util = require('util');

// Modifiable Variables
var _port = process.argv[2];

// starts the server
var _io = require('socket.io').listen(_port);
_io.set('transports', ['websocket']);
console.log("Server up and running on port " + _port);

// upon succesfull connection to the server
_io.sockets.on('connection', function (socket) {
  // console.log("Socket " + socket.id + " connected.");
  // console.log("Concurent conns: " + _io.engine.clientsCount);
  
  // NOTE ALEX: that's a message back to the single client which
  // created this socket
  socket.emit('msg', {msg:socket.id + ': Welcome to holmusk challenge!'});
  // socket.emit('msg', {msg:socket.id + ': This server (port: '
  //  + _port + ' currently host ' + _io.engine.clientsCount + ' users.'});

  // NOTE ALEX: test load platform wide
  // socket.broadcast.emit('msg', {msg:'We have a new challenger.'});

  // upon reception of a msg, print nick and msg
  socket.on('msg', function (data) { console.log(socket.id 
    + ' message: ' + data.msg); });

  socket.on('disconnect', function () {
    // console.log("Socket " + socket.id + " disconnected.");
    // console.log("Concurent conns: " + _io.engine.clientsCount);
  });

});

var elapsed_seconds = 0;
setInterval(function () {
    console.info(elapsed_seconds++ + ' Server on port ' + _port + ', Number of open sockets: ' + _io.engine.clientsCount) 
}, 1000);

process.on('uncaughtException', function(err) {
    console.info(util.inspect(err, {colors: true}));
});
