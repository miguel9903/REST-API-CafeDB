const { Router } = require('express');
const { check } = require('express-validator');

const router = Router();
const searchController = require('../controllers/search');

/**
 * Method: Search
 * Type: Public route
 * Restrictions: None
 */
router.get('/:collection/:term', searchController.search);

module.exports = router;