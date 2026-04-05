const { getDb } = require('../config/database');

class Transaction {
  // Create a new transaction
  static async create(transactionData) {
    const db = getDb();
    const { amount, type, category, date, description, user_id } = transactionData;
    
    const result = await db.run(
      `INSERT INTO transactions (amount, type, category, date, description, user_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [amount, type, category, date, description || '', user_id]
    );
    
    return await this.findById(result.lastID);
  }

  // Find transaction by ID
  static async findById(id) {
    const db = getDb();
    return await db.get(
      `SELECT t.*, u.name as user_name 
       FROM transactions t
       JOIN users u ON t.user_id = u.id
       WHERE t.id = ?`,
      [id]
    );
  }

  // Update transaction
  static async update(id, updates) {
    const db = getDb();
    const allowedFields = ['amount', 'category', 'date', 'description'];
    const fields = [];
    const values = [];
    
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        fields.push(`${field} = ?`);
        values.push(updates[field]);
      }
    }
    
    if (fields.length === 0) return null;
    
    values.push(id);
    
    await db.run(
      `UPDATE transactions SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    
    return await this.findById(id);
  }

  // Delete transaction
  static async delete(id) {
    const db = getDb();
    const result = await db.run('DELETE FROM transactions WHERE id = ?', [id]);
    return result.changes > 0;
  }

  // List transactions with filters
  static async list(filters = {}) {
    const db = getDb();
    let query = `
      SELECT t.*, u.name as user_name
      FROM transactions t
      JOIN users u ON t.user_id = u.id
      WHERE 1=1
    `;
    const params = [];
    
    if (filters.type) {
      query += ' AND t.type = ?';
      params.push(filters.type);
    }
    
    if (filters.category) {
      query += ' AND t.category = ?';
      params.push(filters.category);
    }
    
    if (filters.startDate) {
      query += ' AND t.date >= ?';
      params.push(filters.startDate);
    }
    
    if (filters.endDate) {
      query += ' AND t.date <= ?';
      params.push(filters.endDate);
    }
    
    query += ' ORDER BY t.date DESC';
    
    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(parseInt(filters.limit));
    }
    
    return await db.all(query, params);
  }

  // Get dashboard summary
  static async getDashboardSummary(filters = {}) {
    const db = getDb();
    let dateFilter = '';
    const params = [];
    
    if (filters.startDate && filters.endDate) {
      dateFilter = 'AND date BETWEEN ? AND ?';
      params.push(filters.startDate, filters.endDate);
    }
    
    // Get totals
    const totals = await db.get(`
      SELECT 
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expense,
        COUNT(*) as total_transactions
      FROM transactions
      WHERE 1=1 ${dateFilter}
    `, params);
    
    // Get category breakdown
    const categories = await db.all(`
      SELECT 
        type,
        category,
        SUM(amount) as total,
        COUNT(*) as count
      FROM transactions
      WHERE 1=1 ${dateFilter}
      GROUP BY type, category
      ORDER BY total DESC
    `, params);
    
    // Get recent transactions
    const recent = await db.all(`
      SELECT 
        t.*,
        u.name as user_name
      FROM transactions t
      JOIN users u ON t.user_id = u.id
      WHERE 1=1 ${dateFilter}
      ORDER BY t.date DESC
      LIMIT 10
    `, params);
    
    return {
      summary: {
        total_income: totals.total_income || 0,
        total_expense: totals.total_expense || 0,
        net_balance: (totals.total_income || 0) - (totals.total_expense || 0),
        total_transactions: totals.total_transactions || 0
      },
      category_breakdown: categories,
      recent_activity: recent
    };
  }
}

module.exports = Transaction;