const mongoose = require('mongoose');
// eslint-disable-next-line import/extensions
const Identification = require('./identification.js');

const { Schema } = mongoose;

const sightingPostSchema = new Schema({
  image: { type: String },
  timestamp: { type: Date },
  description: { type: String },
  user_nickname: { type: String },
});

const SightingPost = mongoose.model('sighting_post', sightingPostSchema);
module.exports = SightingPost;
