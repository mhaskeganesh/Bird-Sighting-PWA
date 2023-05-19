/**
 * This code defines a Mongoose schema for the sighting post data and creates a model named SightingPost based on this schema.
 * The schema includes fields for image, timestamp, description, and user nickname.
 * This model is exported to be used in other parts of the application for interacting with the MongoDB database.
 * */
const mongoose = require('mongoose');
// eslint-disable-next-line import/extensions

const { Schema } = mongoose;

const sightingPostSchema = new Schema({
  image: String,
  timestamp: String,
  description: String,
  user_nickname: { type: String, required: true },

  location: {
    latitude: String,
    longitude: String,
  },

  identification: {
    name: String,
    dbpedia_uri: String,
    abstract: String,
  },

  chat: [
    {
      user: String,
      message: String,
    },
  ],
});

const SightingPost = mongoose.model('sighting_post', sightingPostSchema);
module.exports = SightingPost;
