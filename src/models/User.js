const { getDb } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  // Create a new user
  static async create(userData) {
    const db = getDb();
    const { email, password, name, role = 'viewer', status = 'active' } = userData;
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    try {
      const result = await db.run(
        `INSERT INTO users (email, password, name, role, status) 
         VALUES (?, ?, ?, ?, ?)`,
        [email, hashedPassword, name, role, status]
      );
      
      return {
        id: result.lastID,
        email,
        name,
        role,
        status
      };
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        throw new Error('Email already exists');
      }
      throw error;
    }
  }

  // Find user by email (for login)
  static async findByEmail(email) {
    const db = getDb();
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    return user;
  }

  // Find user by ID
  static async findById(id) {
    const db = getDb();
    const user = await db.get(
      'SELECT id, email, name, role, status, created_at FROM users WHERE id = ?',
      [id]
    );
    return user;
  }

  // Update user
  static async update(id, updates) {
    const db = getDb();
    const allowedFields = ['name', 'role', 'status'];
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
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    
    return await this.findById(id);
  }

  // List all users
  static async list(filters = {}) {
    const db = getDb();
    let query = 'SELECT id, email, name, role, status, created_at FROM users WHERE 1=1';
    const params = [];
    
    if (filters.role) {
      query += ' AND role = ?';
      params.push(filters.role);
    }
    
    if (filters.status) {
      query += ' AND status = ?';
      params.push(filters.status);
    }
    
    query += ' ORDER BY created_at DESC';
    
    return await db.all(query, params);
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;