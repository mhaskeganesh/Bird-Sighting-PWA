const SightingPost = require('../models/sighting_post');

/**
 * This function initializes the socket.io server.
 *
 * @param io
 */
exports.init = function (io) {
  io.on('connection', (socket) => {
    // Join a room
    socket.on('create or join', (room, pageID) => {
      socket.join(room);
      socket.broadcast.emit('joined', room, pageID);
    });

    // Send message to particular room
    socket.on('message', async (pageID, user, message) => {
      socket.to(pageID).emit('message', pageID, user, message);

      // Store chat in database
      const sightingPost = await SightingPost.findById(pageID);
      await SightingPost.findByIdAndUpdate(pageID, {
        ...sightingPost._doc,
        chat: [
          ...sightingPost.chat,
          {
            user,
            message,
          },
        ],
      })
        .exec();
    });

    socket.on('disconnect', () => {
      console.log(socket.id);
    });
  });
};
