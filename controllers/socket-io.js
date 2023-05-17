
exports.init = function(io) {
  io.on('connection', socket => {
    console.log('New user connected');

    socket.on('message', (user,message) => {
      console.log(`Received message: ${user} ${message}`);
      io.emit('message', user, message);
    });
  });
}

