const { Product } = require('../models');

const controller = {

    getProducts: async (req, res) => {

        try {

            const { start = 0, limit = 10 } = req.query;
            const query = { state: true };

            const [ total, products ] = await Promise.all([
                Product.countDocuments(query),
                Product.find(query)
                        .skip(parseInt(start))
                        .limit(parseInt(limit))
                        .populate('user', 'name')
                        .populate('category', 'name')
            ]);

            res.json({
                total,
                products
            });

        } catch(err) {
            res.status(500).json({
                message: "Could not get products",
                error: err
            });
        }

    },

    getProduct: async (req, res) => {

        try {

            const { id } = req.params;
            const product = await Product.findById(id)
                            .populate('user', 'name')
                            .populate('category', 'name');

            res.json(product);

        } catch(err) {
            res.status(500).json({
                message: "Could not get product",
                error: err
            });
        }

    },

    createProduct: async (req, res) => {

        try {

            const { name, price, category, description } = req.body;

            const productData = {
                name, 
                price, 
                user: req.authUser._id, 
                category,
                state: true,
                available: true
            };

            if(description) {
                productData.description = description;
            }

            const product = new Product(productData);
            await product.save();

            res.json({
                message: 'Product created',
                product
            });

        } catch(err) {
            res.status(500).json({
                message: "User could not be created",
                error: err
            });
        }

    },

    updateProduct: async (req, res) => {

        try {

            const { id } = req.params;
            const { name, price, category, description, available } = req.body;
    
            const productData = {
                name, 
                price, 
                user: req.authUser._id
            };
    
            if(category) {
                productData.category = category;
            }
    
            if(description){
                productData.description = description;
            }
    
            if(available){
                productData.available = available;
            }
    
            // Check if the name of the product to edit is the same as the one sent in the request
            const productParam = await Product.findById(id);
            if(productParam.name != name){
                const existProduct = await Product.findOne({ name });
                if(existProduct){
                    return res.status(400).json({
                        message: `The product ${ name } already registered`
                    });
                }
            }
    
            const product = await Product.findByIdAndUpdate(id, productData, { new: true });
    
            res.json({
                message: "Update Product",
                product
            });

        } catch(err) {
            res.status(500).json({
                message: "User could not be updated",
                error: err
            });
        }
     
    },

    deleteProduct: async (req, res) => {

        try {

            const { id } = req.params;
            const product = await Product.findByIdAndUpdate(id, { state: false, available: false }, { new: true });

            res.json({
                message: "Product deleted",
                product
            });

        } catch(err) {
            res.status(500).json({
                message: "User could not be deleted",
                error: err
            });
        }

    }

};

module.exports = controller;