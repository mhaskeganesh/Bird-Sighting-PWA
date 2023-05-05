/**
 * This function connects the application to the MongoDB database
 * using the Mongoose library. It takes in the database URL and options
 * as arguments and attempts to establish a connection. If the connection
 * is successful, it logs a success message to the console. If the connection
 * fails, it logs an error message to the console.
 * @param {string} DATABASE_URL - The URL of the MongoDB database
 * @param {Object} DB_OPTIONS - The options to use when connecting to the database
 * @returns {void}
 * */
const mongoose = require('mongoose');

const connectToDatabase = async (DATABASE_URL, DB_OPTIONS) => {
  try {
    await mongoose.connect(DATABASE_URL, DB_OPTIONS);
    console.log('Database connection successful...');
  } catch (error) {
    console.log(`Database connection failed: ${error.message}`);
  }
};

module.exports = connectToDatabase;
