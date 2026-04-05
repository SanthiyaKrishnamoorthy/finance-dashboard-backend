const { getDb } = require('../config/database');
const Transaction = require('../models/Transaction');

const getDashboard = async (req, res) => {
  try {
    const filters = {
      startDate: req.query.startDate,
      endDate: req.query.endDate
    };
    
    const dashboardData = await Transaction.getDashboardSummary(filters);
    res.json(dashboardData);
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: error.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const db = getDb();
    const categories = await db.all(`
      SELECT DISTINCT category FROM transactions ORDER BY category
    `);
    res.json({ categories: categories.map(c => c.category), count: categories.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getDashboard, getCategories };