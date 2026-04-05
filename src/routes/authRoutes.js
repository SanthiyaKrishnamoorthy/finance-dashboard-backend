const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { register, login, getProfile } = require('../controllers/authController');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', authenticate, getProfile);

module.exports = router;