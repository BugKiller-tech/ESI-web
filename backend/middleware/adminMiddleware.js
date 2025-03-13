// middleware/authMiddleware.js
const  Joi = require('joi');

const bodyValidatorMiddleware = (schema) => (req, res, next) => {
    try {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            })
        }
        next();
    } catch (error) {
        return res.status(400).json({
            message: 'Invalid request body'
        })
    } 
};

module.exports = bodyValidatorMiddleware;
