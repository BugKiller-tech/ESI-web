const express = require('express');
const Joi = require('joi');
const {
    getCategories,
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/productsController');

const bodyValidatorMiddleware = require('../middleware/bodyValidatorMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');



const router = express.Router();

router.get('/categories', getCategories);




router.get('/get/:productId', getProduct);
router.post('/get', getProducts);

router.post('/create', bodyValidatorMiddleware(Joi.object({
    name: Joi.string().required(),
    category: Joi.string().required(),
    price: Joi.number().min(0.001).required(),
    description: Joi.string().allow(''),
    isDigitalProduct: Joi.boolean().required(),
})), createProduct)

router.post('/update/:productId', bodyValidatorMiddleware(Joi.object({
    name: Joi.string().required(),
    category: Joi.string().required(),
    price: Joi.number().min(0.001).required(),
    description: Joi.string().allow(''),
    isDigitalProduct: Joi.boolean().required(),
    isDeleted: Joi.number().optional(),
})), updateProduct)

router.post('/delete', bodyValidatorMiddleware(Joi.object({
    _id: Joi.string().required(),
})), deleteProduct);



module.exports = router;
