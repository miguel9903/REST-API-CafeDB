const { Router } = require('express');
const { check } = require('express-validator');

// Middlewares
const { validateFields, 
        validateJWT,
        hasAdminRole } = require('../middlewares');

// Helpers
const { existCategoryName,
        existCategoryId } = require('../helpers/db-validators');

const router = Router();
const categoryController = require('../controllers/category');

/**
 * Method: Get Categories
 * Type: Public route
 * Restrictions: None
 */
router.get('/', categoryController.getCategories);

/**
 * Method: Get a single category
 * Type: Public route
 * Restrictions: None
 */
router.get('/:id', [
    check('id', 'Invalid id').isMongoId(),
    check('id').custom(id => existCategoryId(id)),
    validateFields
],categoryController.getCategory);

/**
 * Method: Create category
 * Type: Private route
 * Restrictions: Only accessible to authenticated users (who have a valid token) 
 */
router.post('/', [
    validateJWT,
    check('name', 'Name is required').not().isEmpty(),
    check('name').custom(name => existCategoryName(name)),
    validateFields
], categoryController.createCategory);

/**
 * Method: Update category
 * Type: Private route
 * Restrictions: Only accessible to authenticated users (who have a valid token) 
 * and have an ADMIN_ROLE role 
 */
router.put('/:id', [
    validateJWT,
    check('id', 'Invalid id').isMongoId(),
    check('id').custom(id => existCategoryId(id)),
    check('name', 'Name is required').not().isEmpty(),
    validateFields
], categoryController.updateCategory);

/**
 * Method: Delete category
 * Type: Private route
 * Restrictions: Only accessible to authenticated users (who have a valid token) 
 * and have an ADMIN_ROLE role
 */
router.delete('/:id', [
    validateJWT,
    hasAdminRole,
    check('id', 'Invalid id').isMongoId(),
    check('id').custom(id => existCategoryId(id)),
    validateFields
] , categoryController.deleteCategory);

module.exports = router;