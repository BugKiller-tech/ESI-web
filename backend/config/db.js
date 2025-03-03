// config/db.js
const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection

function establishDbConnection () {
  mongoose.connect(`mongodb://${process.env.DB_HOST}:27017/${process.env.DB_NAME}`, {
    user: process.env.DB_USER,
    pass: process.env.DB_PASSWORD,
    // authSource: 'admin', // Optional, depending on your MongoDB setup
  }).then(() => {
    console.log('Connected to MongoDB');
  }).catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });
}

module.exports = { mongoose, establishDbConnection };
