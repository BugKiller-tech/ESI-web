// config/db.js
const mongoose = require('mongoose');
require('dotenv').config();

const ProjectSettingModel = require('../models/ProjectSettingModel');
const User = require("../models/User");

const productsJson = require('../seeds/products.json');
const ProductsModel = require('../models/ProductsModel');

// MongoDB connection

function establishDbConnection() {
  return mongoose.connect(`mongodb://${process.env.DB_HOST}:27017/${process.env.DB_NAME}`, {
    user: process.env.DB_USER,
    pass: process.env.DB_PASSWORD,
    // authSource: 'admin', // Optional, depending on your MongoDB setup
  })
}

function createDefaultProjectSetting () {
  ProjectSettingModel.findOne({}).then((projectSetting) => {
    if (!projectSetting) {
      const defaultProjectSetting = new ProjectSettingModel({
        imageSetting: {
          thumbnailPercentage: 5,
          thumbWebPercentage: 25,
        },
        watermarkImage: '',
        tax: 10,
        flatShippingFee: 10,
      });
      defaultProjectSetting.save().then(() => {
        console.log('Default project setting created');
      });
    } else {
      console.log('Default project setting already exists');
    }
  });
}

async function createDefaultProducts () {
  console.log('Creating default products', productsJson.length);
  const curProducts = await ProductsModel.find({}).limit(1);
  if (curProducts.length === 0) {
    console.log('Creating default products');
    await ProductsModel.insertMany(productsJson);
  } else {
    console.log('Default products already exist');
  }
}

async function createDefaultAdminUser () {
  try {
    const users = await User.find({}).limit(1);
    if (users.length === 0) {
      const admin = new User({
        email: 'glen@gmail.com',
        password: 'adminadmin',
        emailConfirmed: 1,
        isAdmin: 1,
      })
      await admin.save();
      console.log('default admin user is created');
    }
  } catch (error) {
    console.log(error);
  }
}


async function createDefaultDbData() {
  await createDefaultProducts();
  await createDefaultAdminUser();
  createDefaultProjectSetting();
  

}

module.exports = {
  mongoose,
  establishDbConnection,
  createDefaultDbData,
};
