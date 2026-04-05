const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { getDashboard, getCategories } = require('../controllers/dashboardController');

router.use(authenticate);

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Get dashboard summary
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Dashboard analytics
 */
router.get('/', getDashboard);

/**
 * @swagger
 * /dashboard/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get('/categories', getCategories);

module.exports = router;