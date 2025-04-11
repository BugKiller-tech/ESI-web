// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const constants = require('./config/constants');

const {
    establishDbConnection,
    createDefaultDbData,
} = require('./config/db');
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

const pathsToBeCreated = [
    constants.originImagePath,
    constants.timestampJsonPath,
    constants.thumbwebPath,
    constants.thumbnailPath,
    constants.watermarkPath,
]
for (const folderPath of pathsToBeCreated) {
    const pathToCreate = path.join(__dirname, folderPath);
    if (!fs.existsSync(pathToCreate)) {
        fs.mkdirSync(pathToCreate, { recursive: true });
        console.log(`path "${ pathToCreate }" folder created!`);
    }
}



// const corsOptions = {
// }
app.use(cors()); // cors resolve

// Use Morgan middleware with 'dev' preset
app.use(morgan('dev'));

// Set up routes
app.use('/', require('./routes/index'));

// Make available to access public path with public folder
app.use('/public', (req, res) => {
    console.log('testing', req.path);
    // res.redirect(req.path);
    return res.sendFile(path.join(__dirname, 'public', req.path));
})

// Test DB connection
establishDbConnection()
.then(() => {
    console.log('Connected to MongoDB');
    createDefaultDbData();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
});

