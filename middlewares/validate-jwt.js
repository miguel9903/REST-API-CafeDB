const jwt = require('jsonwebtoken');
const User = require('../models/user');

const validateJWT = async (req, res, next) => {

    const token = req.header('x-token');
    if(!token) {
        return res.status(401).json({
            message: "Not token provided"
        });
    }

    try {

        const payload = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const { uid } = payload;
        
        // Get authenticated user information
        const authUser = await User.findById(uid);

        // Check if user authenticated exist
        if(!authUser) {
            return res.status(404).json({
                message: "Invalid token - User does not exist"
            });
        }

        // Check if user authenticated is active
        if(!authUser.state) {
            return res.status(401).json({
                message: "Invalid token - User is inactive"
            });
        }

        req.authUser = authUser;
        next();

    } catch(err) {
        console.log(err);
        res.status(401).json({
            message: "Invalid token"
        });
    }

}

module.exports = {
    validateJWT
};