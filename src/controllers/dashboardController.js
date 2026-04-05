const { getDb } = require('../config/database');

const getDashboard = async (req, res) => {
  try {
    const db = getDb();
    
    // Get totals
    const totals = await db.get(`
      SELECT 
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expense,
        COUNT(*) as total_transactions
      FROM transactions
    `);
    
    // Get category breakdown
    const categories = await db.all(`
      SELECT 
        type, 
        category, 
        SUM(amount) as total,
        COUNT(*) as count
      FROM transactions
      GROUP BY type, category
      ORDER BY total DESC
    `);
    
    // Get recent transactions
    const recent = await db.all(`
      SELECT 
        t.*, 
        u.name as user_name
      FROM transactions t
      JOIN users u ON t.user_id = u.id
      ORDER BY t.date DESC 
      LIMIT 10
    `);
    
    res.json({
      summary: {
        total_income: totals.total_income || 0,
        total_expense: totals.total_expense || 0,
        net_balance: (totals.total_income || 0) - (totals.total_expense || 0),
        total_transactions: totals.total_transactions || 0
      },
      category_breakdown: categories,
      recent_activity: recent
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getDashboard };