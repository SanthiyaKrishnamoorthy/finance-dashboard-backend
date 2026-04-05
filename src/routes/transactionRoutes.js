const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { createTransaction, getTransactions, deleteTransaction } = require('../controllers/transactionController');

// All routes require authentication
router.use(authenticate);

// GET /api/transactions - List all transactions
router.get('/', getTransactions);

// POST /api/transactions - Create transaction (Analyst/Admin only)
router.post('/', authorize('analyst', 'admin'), createTransaction);

// DELETE /api/transactions/:id - Delete transaction (Admin only)
router.delete('/:id', authorize('admin'), deleteTransaction);

module.exports = router;