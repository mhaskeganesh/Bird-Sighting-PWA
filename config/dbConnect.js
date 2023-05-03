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
