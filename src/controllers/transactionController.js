const Transaction = require('../models/Transaction');

const createTransaction = async (req, res) => {
  try {
    const { amount, type, category, date, description } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' });
    }
    
    if (!type || !['income', 'expense'].includes(type)) {
      return res.status(400).json({ error: 'Type must be "income" or "expense"' });
    }
    
    if (!category) {
      return res.status(400).json({ error: 'Category is required' });
    }
    
    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }
    
    const transaction = await Transaction.create({
      amount: parseFloat(amount),
      type,
      category,
      date,
      description: description || '',
      user_id: req.user.id
    });
    
    res.status(201).json({ message: 'Transaction created successfully', transaction });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getTransactions = async (req, res) => {
  try {
    const filters = {
      type: req.query.type,
      category: req.query.category,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      limit: req.query.limit
    };
    
    Object.keys(filters).forEach(key => 
      filters[key] === undefined && delete filters[key]
    );
    
    const transactions = await Transaction.list(filters);
    res.json({ transactions, count: transactions.length, filters });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json({ transaction });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.update(req.params.id, req.body);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json({ message: 'Transaction updated successfully', transaction });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const deleted = await Transaction.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction
};