// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');

const { establishDbConnection } = require('./config/db');
require('dotenv').config();

const app = express();
app.use(express.json());  // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse application/x-www-form-urlencoded

const publicPath = path.join(__dirname, 'public');
// Check if the 'public' folder exists, and create it if not
if (!fs.existsSync(publicPath)) {
    fs.mkdirSync(publicPath, { recursive: true });
    console.log('Public folder created!');
}
// Serve static files from the 'public' folder
app.use(express.static(publicPath));

const imageUploadPath = path.join(__dirname, 'uploads/images');
// Check if the 'public' folder exists, and create it if not
if (!fs.existsSync(imageUploadPath)) {
    fs.mkdirSync(imageUploadPath, { recursive: true });
    console.log('image upload folder created!');
}



// const corsOptions = {
// }
app.use(cors()); // cors resolve

// Use Morgan middleware with 'dev' preset
app.use(morgan('dev'));

// Test DB connection
establishDbConnection();

// Set up routes
app.use('/', require('./routes/index'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
