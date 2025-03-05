// controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Joi = require('joi');
require('dotenv').config();

const signup = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(8).required()
        })
        const { error } = schema.validate(req.body);
        if (error) {
            console.log('joi error came', error);
            return res.status(400).json({
                message: error.details[0].message
            })
        }

        const existingUser = await User.findOne({ email: email.trim() })
        if (existingUser) {
            return res.status(400).json({
                'message': 'This email is already taken'
            })
        }

        const user = await new User({
            email: email.trim(),
            password
        })
        const registeredUser = await user.save();
        console.log(user);
        res.status(201).send({ message: 'User registered successfully', user });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: 'Error registering user'
        });
    }
};

const signin = async (req, res) => {
    const { email, password } = req.body;

    try {

        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(8).required()
        })
        const { error } = schema.validate(req.body);
        if (error) {
            console.log('joi error came', error);
            return res.status(400).json({
                message: error.details[0].message
            })
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({
            message: 'Invalid credentials'
        });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({
            message: 'Password is incorrect'
        });

        const token = jwt.sign({
            _id: user._id,
            email: user.email,
            isAdmin: user.isAdmin,
            // username: user.username,
        },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION }
        );

        const test = user.toAuthJson();
        console.log('testsetsetsetsetset',test);

        return res.json({
            message: 'Login successful',
            user: user.toAuthJson(),
            token
        });
    } catch (e) {
        console.log(e);
        return res.status(400).json({ message: 'Failed to login' })
    }
};

module.exports = { signup, signin };
