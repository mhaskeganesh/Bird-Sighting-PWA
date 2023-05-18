exports.init = function (io) {
  io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('create or join', (room, pageID) => {
      console.log('Room Created', room, 'User ID', pageID);
      socket.join(room);
      socket.broadcast.emit('joined', room, pageID);
    });

    socket.on('message', (pageID, user, message) => {
      console.log(`Received message: ${pageID} ${user} ${message}`);
      io.to(pageID).emit('message', pageID, user, message);
    });

    socket.on('disconnect', () => {
      console.log(socket.id);
    });
  });
};
