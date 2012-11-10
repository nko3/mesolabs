var connect = require('connect');
var port = process.env.PORT || 3000;

var app = connect()
  .use(connect.static('public'))
  .listen(port);

var io = require('socket.io').listen(app);
var id = 0;

io.sockets.on('connection', function(socket) {
  id++;
  console.log("connected: " + id);
  socket.emit('create', id);
  socket.broadcast.emit('new player', id);

  socket.on('location', function(location) {
    socket.volatile.broadcast.emit('location', location);
  });

  socket.on('disconnect', function() {
    socket.broadcast.emit('delete', id);
    console.log("disconnected: " + id);
  });
});