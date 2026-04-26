const express = require('express');
const router = express.Router();
const recoveryController = require('../controllers/recoveryController');

router.post('/forgot-password', recoveryController.forgotPassword);
router.get('/verify-token/:token', recoveryController.verifyToken);
router.post('/reset-password/:token', recoveryController.resetPassword);

module.exports = router;
