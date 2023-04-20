const mongoose = require('mongoose');
const { Schema } = mongoose;

const identificationSchema = new Schema({
  name: { type: String },
  scintific_name: {type: String},
  description: {type: String}
});

const Identification = mongoose.model('identification', identificationSchema);
module.exports = Identification;
