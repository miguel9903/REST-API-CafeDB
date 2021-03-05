const { Router } = require('express');
const { check } = require('express-validator');

// Middlewares
const { validateJWT, validateFields } = require('../middlewares');

// Helpers
const { validateCollections } = require('../helpers/db-validators');
const { validateFile } = require('../helpers/validate-file');

const router = Router();
const uploadController = require('../controllers/upload');

/**
 * Method: Get image
 * Type: Public route
 * Restrictions: None
 */
router.get('/:collection/:id', [
    check('id', 'Invalid id').isMongoId(),
    check('collection').custom(c => validateCollections(c, ['users', 'products'])),
    validateFields
] , uploadController.showImage);

/**
 * Method: Upload File
 * Type: Private route
 * Restrictions: Only accessible to authenticated users (who have a valid token)
 */
router.post('/', [ 
    validateJWT,
    validateFile
], uploadController.uploadFile);

/**
 * Method: Update user/product image
 * Type: Private route
 * Restrictions: Only accessible to authenticated users (who have a valid token)
 */
router.put('/:collection/:id', [
    validateJWT,
    validateFile,
    check('id', 'Invalid id').isMongoId(),
    check('collection').custom(c => validateCollections(c, ['users', 'products'])),
    validateFields
] ,uploadController.updateImageCloudinary);
//] ,uploadController.updateImage);

module.exports = router;