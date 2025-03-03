// controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.create({ email, password });
    res.status(201).send({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(500).send('Error registering user');
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).send('Invalid credentials');

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).send('Invalid credentials');

    const token = jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    res.json({ message: 'Login successful', token });
  } catch (e) {
    return res.status(400).json({ message: 'Failed to login' })
  }
};

module.exports = { register, login };
