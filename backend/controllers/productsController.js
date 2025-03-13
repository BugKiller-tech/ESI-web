const ProductsModel = require('../models/ProductsModel');

const getCategories = async (req, res) => {
    try {
        const categories = await ProductsModel.distinct('category');
        return res.json({
            categories: categories
        });
    } catch (error) {
        return res.status(400).json({
            'message': 'Failed to fetch categories'
        })
    }
}

const getProducts = async (req, res) => {
    try {
        const page = req.body.page || 1;
        const limit = req.body.limit || 10;
        const search = req.body.search || '';

        const response = await ProductsModel.paginate(
            {
                isDeleted: 0,
                $or: [
                    { "name": { "$regex": search, "$options": "i" } },
                    { "category": { "$regex": search, "$options": "i" } },
                ]
            },
            {
                page: page,
                limit: limit,
            }
        );
        console.log('testingtessting', response);

        // const products = await ProductsModel.find({
        //     isDeleted: 0,
        //     $or: [
        //         { "name": { "$regex": search, "$options": "i" } },
        //         { "category": { "$regex": search, "$options": "i" } },
        //     ]
        // });
        return res.json({
            products: response.docs,
            totalCount: response.totalDocs,
        })

    } catch (error) {
        return res.status(400).json({
            'message': 'Failed to get products'
        })
    }
}

const getProduct = async (req, res) => {
    try {
        const _id = req.params.productId;
        if (!_id) {
            return res.status(400).json({
                message: 'Product id is required',
            })
        }
        const product = await ProductsModel
            .findOne({
                _id: _id,
                isDeleted: 0
            });
        if (!product) {
            return res.status(400).json({
                message: 'Can not find product'
            })
        }
        return res.json({
            product: product
        })
    } catch (error) {
        return res.status(400).json({
            message: 'Failed to get product'
        })
    }
}

const createProduct = async (req, res) => {
    try {
        const newProduct = new ProductsModel({
            name: req.body.name,
            category: req.body.category,
            price: req.body.price,
            description: req.body.description,
            isDigitalProduct: req.body.isDigitalProduct
        });
        await newProduct.save();
        return res.json({
            'message': 'Successfully created',
        })
    } catch (error) {
        console.log('Error on creating or updating product', error);
        return res.status(400).json({
            'message': 'Failed to create or update product'
        })
    }
}

const updateProduct = async (req, res) => {
    try {
        const prod = await ProductsModel.findById(req.params.productId);
        if (!prod) {
            return res.status(400).json({
                message: 'Can not find product'
            })
        }
        prod.name = req.body.name;
        prod.category = req.body.category;
        prod.price = req.body.price;
        prod.description = req.body.description;
        prod.isDigitalProduct = req.body.isDigitalProduct;
        await prod.save();
        return res.json({
            message: 'Successfully updated'
        })

    } catch (error) {
        console.log('Error on updating product', error);
        return res.status(400).json({
            'message': 'Failed to update product'
        })
    }
}

const deleteProduct = async (req, res) => {
    try {
        const _id = req.body._id;
        const prod = await ProductsModel.findById(_id);
        if (!prod) {
            return res.status(400).json({
                message: 'Can not find product'
            })
        }
        prod.isDeleted = 1;
        await prod.save();
        return res.json({
            message: 'Successfully deleted'
        })


    } catch (error) {
        console.log('Error on deleting product', error);
        return res.status(400).json({
            'message': 'Failed to delete product'
        })
    }
}

module.exports = {
    getCategories,
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
}
