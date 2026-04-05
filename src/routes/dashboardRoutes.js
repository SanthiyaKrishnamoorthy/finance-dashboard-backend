const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { getDashboard, getCategories } = require('../controllers/dashboardController');

router.use(authenticate);
router.get('/', getDashboard);
router.get('/categories', getCategories);

module.exports = router;