// models/user.js
const { Sequelize, DataTypes } = require('sequelize');
const jwt = require('jsonwebtoken');
const { sequelize } = require('../config/db');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  emailConfirmed: {
    type: DataTypes.INTEGER,
    defaultValue: 1,

  },
  emailConfirmationToken: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  isAdmin: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

User.beforeCreate(async (user) => {
  // Hash password before saving user
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  user.generateEmailConfirmationToken();
});

User.prototype.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};
User.prototype.updatePassword = async function (newPassword) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(newPassword, salt);
}
User.prototype.generateEmailConfirmationToken = async function () {
  const token = jwt.sign(
    {
      email: this.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  )
  this.emailConfirmationToken = token;
}

module.exports = User;
