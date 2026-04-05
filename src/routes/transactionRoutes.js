const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const {
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction
} = require('../controllers/transactionController');

router.use(authenticate);

router.get('/', getTransactions);
router.get('/:id', getTransaction);
router.post('/', authorize('analyst', 'admin'), createTransaction);
router.put('/:id', authorize('admin'), updateTransaction);
router.delete('/:id', authorize('admin'), deleteTransaction);

module.exports = router;