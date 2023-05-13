/**
 * Mongoose schema for a chat document, which includes a comment, an identification ID (which is a reference to an Identification document),
 * and a sighting post ID (which is a reference to a SightingPost document).
 * The schema is exported as a variable named chatSchema.
 * */
const mongoose = require('mongoose');
const Identification = require('./identification');
const SightingPost = require('./sighting_post');

const { Schema } = mongoose;

const chatSchema = new Schema({
  comment: { type: String },
  identification_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Identification,
  },
  sighting_post_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: SightingPost,
  },
});

const Chat = mongoose.model('chat', chatSchema);
module.exports = chatSchema;
