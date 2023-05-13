/**
 * This code defines a Mongoose schema for the sighting post data and creates a model named SightingPost based on this schema.
 * The schema includes fields for image, timestamp, description, and user nickname.
 * This model is exported to be used in other parts of the application for interacting with the MongoDB database.
 * */
const mongoose = require('mongoose');
// eslint-disable-next-line import/extensions
const Identification = require('./identification.js');

const { Schema } = mongoose;

const sightingPostSchema = new Schema({
  image: { type: String },
  timestamp: { type: Date },
  description: { type: String },
  user_nickname: { type: String },
  identification: { type: Identification.schema },
});

const SightingPost = mongoose.model('sighting_post', sightingPostSchema);
module.exports = SightingPost;
