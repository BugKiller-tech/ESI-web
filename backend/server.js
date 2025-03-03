// server.js
const express = require('express');
const { testDbConnection } = require('./config/db');
const authRoutes = require('./routes/auth');
require('dotenv').config();

const app = express();
app.use(express.json());  // Parse JSON requests

// Test DB connection
testDbConnection();

// Set up routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
