const { Router } = require('express');
const { check } = require('express-validator');

// Middlewares
const { validateFields, 
        validateJWT,  
        hasAdminRole,
        hasAuthorizedRole } = require('../middlewares');

// Helpers
const { existUserRole, 
        existUserEmail, 
        existUserId } = require('../helpers/db-validators');

const router = Router();
const userController = require('../controllers/user');

/**
 * Method: Get all users
 * Type: Public route
 * Restrictions: None
 */
router.get('/', userController.getUsers);

/**
 * Method: Get a single users
 * Type: Public route
 * Restrictions: None
 */
router.get('/:id', [
    check('id', 'Invalid id').isMongoId(),
    check('id').custom(id => existUserId(id)),
    validateFields
], userController.getUser);

/**
 * Method: Create user
 * Type: Private route
 * Restrictions: Only accessible to authenticated users (who have a valid token)
 */
router.post('/', [
    validateJWT,
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Invalid email').isEmail(),
    check('email').custom(email => existUserEmail(email)),
    check('password', 'The password must be at least 6 characters').isLength({ min: 6 }),
    check('role').custom(role => existUserRole(role)),
    validateFields
], userController.createUser);

/**
 * Method: Update user
 * Type: Private route
 * Restrictions: Only accessible to authenticated users (who have a valid token)
 */
router.put('/:id', [
    validateJWT,
    check('id', 'Invalid id').isMongoId(),
    check('id').custom(id => existUserId(id)),
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Invalid email').isEmail(),
    check('password', 'The password must be at least 6 characters').isLength({ min: 6 }),
    check('role', 'Role is required').not().isEmpty(),
    check('role').custom(role => existUserRole(role)),
    validateFields
], userController.updateUser);

/**
 * Method: Delete user
 * Type: Private route
 * Restrictions: Only accessible to authenticated users (who have a valid token) 
 * and have an ADMIN_ROLE role 
 */
router.delete('/:id', [
    validateJWT,
    hasAdminRole,
    check('id', 'Invalid id').isMongoId(),
    check('id').custom(id => existUserId(id)),
    validateFields
] , userController.deleteUser);

module.exports = router;