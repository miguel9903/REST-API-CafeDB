const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary');
const { User, Product } = require('../models');
const { uploadFile } = require('../helpers/upload-file');
cloudinary.config(process.env.CLOUDINARY_URL);

const controller = {

    uploadFile: async (req, res) => {
      
        try {

            //const fileName = await uploadFile(req.files, ['txt'], 'text');
            const fileName = await uploadFile(req.files);
            res.json({
                fileName
            });

        } catch(err) {
            res.status(400).json({
                message: err
            });
        }

    },

    updateImage: async (req, res) => {

        try {

            const { collection, id } = req.params;
            let model;
    
            switch(collection) {
                case 'users':
                    model = await User.findById(id);
                    if(!model) {
                        return res.status(400).json({
                           message: `No user was found with id: ${ id }` 
                        });
                    }
                    break;
                case 'products':
                    model = await Product.findById(id);
                    if(!model) {
                        return res.status(400).json({
                           message: `No product was found with id: ${ id }` 
                        });
                    }
                    break;
                default:
                    res.json({ message: "Invalid collection" });
            }
    
            // Delete previous files (If the image exists in the collection)
            if(model.image){
                const filePath = path.join(__dirname, '../uploads', collection, model.image);
                if(fs.existsSync(filePath)){
                    fs.unlinkSync(filePath);
                }
            }

            const fileName = await uploadFile(req.files, collection);
            model.image = fileName;
    
            await model.save();

            if(collection == 'users') {
                res.json({
                    message: 'Image updated',
                    user: model
                });
            } else {
                res.json({
                    message: 'Image updated',
                    product: model
                });
            }

        } catch(err) {
            res.status(500).json({
                message: "Error updating image",
                error: err
            });
        }

    },

    updateImageCloudinary: async (req, res) => {

        try {

            const { collection, id } = req.params;
            let model;

            switch(collection) {
                case 'users':
                    model = await User.findById(id);
                    if(!model) {
                        return res.status(400).json({
                           message: `No user was found with id: ${ id }` 
                        });
                    }
                    break;
                case 'products':
                    model = await Product.findById(id);
                    if(!model) {
                        return res.status(400).json({
                           message: `No product was found with id: ${ id }` 
                        });
                    }
                    break;
                default:
                    res.json({ message: "Invalid collection" });
            }

            if(model.image) {
                const imageSplit = model.image.split('/');
                const public_id = imageSplit[imageSplit.length-1].split('.')[0];
                cloudinary.uploader.destroy(public_id);
            }

            const { tempFilePath } = req.files.file;
            const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
            
            model.image = secure_url;
            model.save();

            if(collection == 'users') {
                res.json({
                    message: 'Image updated',
                    user: model
                });
            } else {
                res.json({
                    message: 'Image updated',
                    product: model
                });
            }

        } catch(err) {
            res.status(500).json({
                message: "Error updating image",
                error: err
            });
        }

    },

    showImage: async (req, res) => {

        try {

            const { collection, id } = req.params;
            let model;

            switch(collection) {
                case 'users':
                    model = await User.findById(id);
                    if(!model) {
                        return res.status(400).json({
                           message: `No user was found with id: ${ id }` 
                        });
                    }
                    break;
                case 'products':
                    model = await Product.findById(id);
                    if(!model) {
                        return res.status(400).json({
                           message: `No product was found with id: ${ id }` 
                        });
                    }
                    break;
                default:
                    res.json({ message: "Invalid collection" });
            }

            if(model.image){
                const filePath = path.join(__dirname, '../uploads', collection, model.image);
                if(fs.existsSync(filePath)){
                    return res.sendFile(filePath);
                }
            }

            const filePath = path.join(__dirname, '../assets/img/no-image.jpg');
            res.sendFile(filePath);
            
        } catch(err) {
            res.status(500).json({
                message: "Image could not be displayed",
                error: err
            });
        }

    }

};

module.exports = controller;