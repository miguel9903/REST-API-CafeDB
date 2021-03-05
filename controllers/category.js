const { Category } = require('../models');

const controller = {

    getCategories: async (req, res) => {
        
        try {

            const { start = 0, limit = 10 } = req.query;
            const query = { state: true };

            const [ total, categories ] = await Promise.all([
                Category.countDocuments(query),
                Category.find(query)
                        .skip(parseInt(start))
                        .limit(parseInt(limit))
                        .populate('user', 'name')
            ]);

            if(categories.length == 0) {
                return res.status(404).json({
                    message: "Not categories found"
                });
            }

            res.json({
                total,
                categories
            });

        } catch(err) {
            res.status(500).json({
                message: "Could not get categories",
                error: err
            });
        }

    },

    getCategory: async (req, res) => {

        try {

            const { id } = req.params;
            const category = await Category.findById(id)
                                          .populate('user', 'name');
            res.json(category);

        } catch(err) {
            res.status(500).json({
                message: "Could not get category",
                error: err
            });
        }

    },

    createCategory: async (req, res) => {

        try {

            const name = req.body.name.toUpperCase();

            // Generate data to save in DB
            const data = {
                name,
                user: req.authUser._id,
                state: true
            };

            const category = new Category(data);
            await category.save();

            res.status(201).json(category);

        } catch(err) {
            res.status(500).json({
                message: "Category could not be created",
                error: err
            });
        }

    },

    updateCategory: async (req, res) => {

        try {

            const { id } = req.params;
            const name = req.body.name.toUpperCase();

            const categoryData = {
                name,
                user: req.authUser._id
            };

            // Check if the name of the category to edit is the same as the one sent in the request
            const categoryParam = await Category.findById(id);
            if(categoryParam.name != name) {
                const existCategory = await Category.findOne({ name });
                if(existCategory) {
                    return res.status(400).json({
                        message: `The  category ${ name } already registered`
                    });
                }
            }
            
            const category = await Category.findByIdAndUpdate(id, categoryData, { new: true });

            res.json({
                message: "Category updated",
                category
            });

        } catch(err) {
            res.status(500).json({
                message: "Category could not be updated",
                error: err
            });
        }
        
    },

    deleteCategory: async (req, res) => {

        try {

            const { id } = req.params;
            const category = await Category.findByIdAndUpdate(id, { state: false }, { new: true });
            res.json({
                message: "Delete Category",
                category
            });

        } catch(err) {
            res.status(500).json({
                message: "Category could not be deleted",
                error: err
            });
        }

    }

};

module.exports = controller;