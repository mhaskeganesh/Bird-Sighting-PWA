/**
 * Mongoose schema for an identification object, which has a name, scientific name, and description field.
 * It creates a Mongoose model based on the schema and exports it for use in other modules.
 * */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const identificationSchema = new Schema({
  name: { type: String },
  scientific_name: { type: String },
  description: { type: String },
});

const Identification = mongoose.model('identification', identificationSchema);
module.exports = Identification;
