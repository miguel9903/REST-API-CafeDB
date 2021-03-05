const { Router } = require('express');
const { check } = require('express-validator');

// Middlewares
const { validateFields, 
        validateJWT,
        hasAdminRole } = require('../middlewares');

// Helpers
const { existProductName,
        existProductId,
        existCategoryId,
        existUserId } = require('../helpers/db-validators');

const router = Router();
const productController = require('../controllers/product');

/**
 * Method: Get products
 * Type: Public route
 * Restrictions: None
 */
router.get('/', productController.getProducts);

 /**
 * Method: Get a single product
 * Type: Public route
 * Restrictions: None
 */
router.get('/:id', [
    check('id', 'Invalid id').isMongoId(),
    check('id').custom(id => existProductId(id)),
    validateFields
], productController.getProduct);

 /**
 * Method: Craete product
 * Type: Private route
 * Restrictions: Only accessible to authenticated users (who have a valid token) 
 * and have an ADMIN_ROLE role
 */
router.post('/', [
    validateJWT,
    hasAdminRole,
    check('name', 'Name is required').not().isEmpty(),
    check('price', 'Price is required').not().isEmpty(),
    check('category', 'Category is required').not().isEmpty(),
    check('category', 'Invalid category').isMongoId(),
    check('category').custom(id => existCategoryId(id)),
    validateFields
] , productController.createProduct);

 /**
 * Method: Update product
 * Type: Private route
 * Restrictions: Only accessible to authenticated users (who have a valid token) 
 * and have an ADMIN_ROLE role
 */
router.put('/:id', [
    validateJWT,
    hasAdminRole,
    check('id', 'Invalid id').isMongoId(),
    check('id').custom(id => existProductId(id)),
    check('name', 'Name is required').not().isEmpty(),
    check('price', 'Price is required').not().isEmpty(),
    check('category', 'Invalid category').isMongoId(),
    check('category').custom(id => existCategoryId(id)),
    validateFields
] ,productController.updateProduct);

 /**
 * Method: Delete product
 * Type: Private route
 * Restrictions: Only accessible to authenticated users (who have a valid token) 
 * and have an ADMIN_ROLE role
 */
router.delete('/:id' , [
    check('id', 'Invalid id').isMongoId(),
    check('id').custom(id => existProductId(id)),
    validateFields
] , productController.deleteProduct);

module.exports = router;