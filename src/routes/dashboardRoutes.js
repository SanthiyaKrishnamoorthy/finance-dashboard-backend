const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { getDashboard } = require('../controllers/dashboardController');

// All dashboard routes require authentication
router.use(authenticate);

// GET /api/dashboard - Get dashboard summary
router.get('/', getDashboard);

module.exports = router;