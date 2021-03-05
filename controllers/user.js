const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const { validateEmail } = require('../helpers/db-validators');

const controller = {

    getUsers:  async (req, res) => {

        try {

            const { limit = 5, start = 0 } = req.query;
            const query = { state: true };

            const [ total, users ] = await Promise.all([
                User.countDocuments(query),
                User.find(query)
                    .skip(Number(start))
                    .limit(Number(limit))
            ]);

            if(users.length == 0) {
                return res.status(404).json({
                    message: "Not users found"
                });
            }

            res.json({
                total,
                users
            });

        } catch(err) {
            res.status(500).json({
                message: "Could not get users",
                error: err
            });
        }

    },

    getUser: async (req, res) => {

        try {
            
            const { id } = req.params;
            const user = await User.findById(id);
            res.json(user);

        } catch(err) {
            res.status(500).json({
                message: "Could not get user",
                error: err
            });
        }

    },

    createUser: async (req, res) => {

        try {

            const { name, email, password, role } = req.body;
            const user = new User({ name, email, password, role });
    
            // Encrypt the password
            const salt = bcryptjs.genSaltSync();
            user.password = bcryptjs.hashSync(password, salt);
    
            // Save user in database
            await user.save();
            
            res.json({
                message: 'User saved',
                user
            });

        } catch(err) {
            res.status(500).json({
                message: "User could not be created",
                error: err
            });
        }

    },

    updateUser: async (req, res) => {

        try {

            const { id } = req.params;
            const { name, email, password, role } = req.body;

            const userData = { 
                    name, 
                    email, 
                    password
            };
            
            // Encrypt the password
            const salt = bcryptjs.genSaltSync();
            userData.password = bcryptjs.hashSync(password, salt);

            // If the user trying to update is the same user who is authenticated
            if(req.authUser.id == id) {
                if(req.authUser.email != email) {
                    const existEmail = await User.findOne({ email });    
                    if(existEmail) {
                        return res.status(400).json({
                            message: `The email ${ email } already registered`
                        });
                    }         
                }
            } else{

               const userParam = await User.findById(id);
               if(userParam.email != email) {
                    const existEmail = await User.findOne({ email });    
                    if(existEmail) {
                        return res.status(400).json({
                            message: `The email ${ email } already registered`
                        });
                    }         
               }

               if(req.authUser.role != "ADMIN_ROLE") {
                    return res.status(400).json({
                        message: "Unauthorized user. Only administrators can change the role of users"
                    });
                } else {
                    userData.role = role;
                }
            }

            const user = await User.findByIdAndUpdate(id, userData, { new: true });

            res.json({
                message: 'User updated',
                user
            });

        } catch(err) {
            res.status(500).json({
                message: "User could not be updated",
                error: err
            });
        } 

    },

    deleteUser: async (req, res) => {

        try {

            const { id } = req.params;

            if(req.authUser.id == id) {
                return res.status(400).json({
                    message: "A user cannot delete himself"
                });
            } else {
                const user = await User.findByIdAndUpdate(id, { state: false }, { new: true });                
                res.json({
                    message: 'User deleted',
                    user
                });
            }

        } catch(err) {
            res.status(500).json({
                message: "User could not be deleted",
                error: err
            });
        }

    }

};

module.exports = controller;