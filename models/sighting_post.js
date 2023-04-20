const mongoose = require('mongoose');
const Identification = require('./identification.js');
const { Schema } = mongoose;

const sightingPostSchema = new Schema({
  image: { type: String },
  timestamp: { type: Date },
  location: {type: [Number]},
  description: {type: String},
  user_nickname: {type: String},
  identification_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Identification
  }
});

const SightingPost = mongoose.model('sighting_post',sightingPostSchema);
module.exports = SightingPost;
