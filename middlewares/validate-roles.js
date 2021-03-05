const User = require('../models/user');

const hasAdminRole = async (req, res, next) => {

    if(!req.authUser) {
        return res.status(500).json({
            message: "You want to verify the role without validating the token first"
        })
    }

    const { role, name } = req.authUser;
 
    if(role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            message: `Unauthorized user. ${ name } is not an adminnistrator`
        })
    }
    next();

}

const hasAuthorizedRole = (...roles) => {
    return (req, res, next) => {

        if(!req.authUser) {
            return res.status(500).json({
                message: "You want to verify the role without validating the token first"
            })
        }
    
        const { role } = req.authUser;

        if(!roles.includes(role)) {
            return res.status(401).json({
                message: `Unauthorized user. The user must have one of the following roles: ${ roles }`
            })
        }

        next();
    }
}

module.exports = { 
    hasAdminRole,
    hasAuthorizedRole 
};