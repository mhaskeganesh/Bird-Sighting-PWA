const SightingPost = require('../models/sighting_post');

exports.init = function (io) {
  io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('create or join', (room, pageID) => {
      console.log('Room Created', room, 'User ID', pageID);
      socket.join(room);
      socket.broadcast.emit('joined', room, pageID);
    });

    socket.on('message', async (pageID, user, message) => {
      console.log(`Received message: ${pageID} ${user} ${message}`);
      io.to(pageID).emit('message', pageID, user, message);

      // Set up chat in database
      const sightingPost = await SightingPost.findById(pageID);

      console.log(sightingPost.chat);

      const res = await SightingPost.findByIdAndUpdate(pageID, {
        ...sightingPost._doc,
        chat: [
          ...sightingPost.chat,
          {
            user,
            message,
          },
        ],
      }).exec();

      console.log(res);
    });

    socket.on('disconnect', () => {
      console.log(socket.id);
    });
  });
};
