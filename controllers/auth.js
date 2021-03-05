const User = require('../models/user');
const bcryptjs = require('bcryptjs');

// Helpers
const { generateJWT } = require('../helpers/generate-jwt');

const controller = {

    login: async (req, res) => {

        try {

            const { email, password } = req.body;

            // Check if email exist
            const user = await User.findOne({ email });
            if(!user) {
                return res.status(400).json({
                    message: "Invalid email or password - Email does not exist"
                });
            }

             // Check if user is active
            if(!user.state) {
                return res.status(400).json({
                    message: "Invalid email or password - User is inactive"
                });
            }

            // Check the password     
            const validPassword = bcryptjs.compareSync(password, user.password);
            if(!validPassword) {
                return res.status(400).json({
                    message: "Invalid email or password - Incorrect password"
                });
            }
            
            // Generate JWT
            const token = await generateJWT(user._id);

            res.json({ 
                user,
                token
            });


        } catch(err) {
            res.status(500).json({
                message: "Login error",
                error: err
            });
        }

    }

};

module.exports = controller;