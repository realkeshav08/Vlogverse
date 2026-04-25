const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/statsController');

// Public endpoint for the login page
router.get('/', getStats);

module.exports = router;
