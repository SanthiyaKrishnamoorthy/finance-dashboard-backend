const bcrypt = require('bcryptjs');
const { getDb, initializeDatabase } = require('../config/database');

async function seedDatabase() {
  try {
    // Initialize database connection
    await initializeDatabase();
    const db = getDb();
    
    console.log('🌱 Starting database seeding...');
    
    // Check if admin user exists
    const adminExists = await db.get('SELECT id FROM users WHERE email = ?', ['admin@example.com']);
    
    if (!adminExists) {
      console.log('📝 Creating default admin user...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await db.run(
        `INSERT INTO users (email, password, name, role, status) 
         VALUES (?, ?, ?, ?, ?)`,
        ['admin@example.com', hashedPassword, 'Admin User', 'admin', 'active']
      );
      
      console.log('✅ Default admin created:');
      console.log('   Email: admin@example.com');
      console.log('   Password: admin123');
    } else {
      console.log('ℹ️ Admin user already exists');
    }
    
    // Check if we have any transactions
    const transactionCount = await db.get('SELECT COUNT(*) as count FROM transactions');
    
    if (transactionCount.count === 0) {
      console.log('📊 Adding sample transactions...');
      
      // Get admin user ID
      const admin = await db.get('SELECT id FROM users WHERE email = ?', ['admin@example.com']);
      
      if (admin) {
        const sampleTransactions = [
          {
            amount: 5000.00,
            type: 'income',
            category: 'Salary',
            date: '2024-04-01',
            description: 'Monthly salary - April',
            user_id: admin.id
          },
          {
            amount: 1500.00,
            type: 'expense',
            category: 'Rent',
            date: '2024-04-01',
            description: 'Monthly rent payment',
            user_id: admin.id
          },
          {
            amount: 200.00,
            type: 'expense',
            category: 'Food',
            date: '2024-04-02',
            description: 'Groceries shopping',
            user_id: admin.id
          },
          {
            amount: 100.00,
            type: 'expense',
            category: 'Transport',
            date: '2024-04-03',
            description: 'Monthly bus pass',
            user_id: admin.id
          },
          {
            amount: 300.00,
            type: 'income',
            category: 'Freelance',
            date: '2024-04-05',
            description: 'Website development project',
            user_id: admin.id
          },
          {
            amount: 75.00,
            type: 'expense',
            category: 'Entertainment',
            date: '2024-04-06',
            description: 'Netflix subscription',
            user_id: admin.id
          },
          {
            amount: 1200.00,
            type: 'income',
            category: 'Bonus',
            date: '2024-04-10',
            description: 'Performance bonus',
            user_id: admin.id
          },
          {
            amount: 50.00,
            type: 'expense',
            category: 'Utilities',
            date: '2024-04-12',
            description: 'Electricity bill',
            user_id: admin.id
          },
          {
            amount: 30.00,
            type: 'expense',
            category: 'Food',
            date: '2024-04-14',
            description: 'Restaurant dinner',
            user_id: admin.id
          },
          {
            amount: 2500.00,
            type: 'income',
            category: 'Salary',
            date: '2024-03-01',
            description: 'Monthly salary - March',
            user_id: admin.id
          }
        ];
        
        for (const transaction of sampleTransactions) {
          await db.run(
            `INSERT INTO transactions (amount, type, category, date, description, user_id)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [transaction.amount, transaction.type, transaction.category, 
             transaction.date, transaction.description, transaction.user_id]
          );
        }
        
        console.log(`✅ Added ${sampleTransactions.length} sample transactions`);
      }
    } else {
      console.log(`ℹ️ ${transactionCount.count} transactions already exist`);
    }
    
    // Create a sample viewer user for testing
    const viewerExists = await db.get('SELECT id FROM users WHERE email = ?', ['viewer@example.com']);
    
    if (!viewerExists) {
      console.log('📝 Creating sample viewer user...');
      const hashedPassword = await bcrypt.hash('viewer123', 10);
      
      await db.run(
        `INSERT INTO users (email, password, name, role, status) 
         VALUES (?, ?, ?, ?, ?)`,
        ['viewer@example.com', hashedPassword, 'Viewer User', 'viewer', 'active']
      );
      
      console.log('✅ Sample viewer created:');
      console.log('   Email: viewer@example.com');
      console.log('   Password: viewer123');
    }
    
    // Create a sample analyst user for testing
    const analystExists = await db.get('SELECT id FROM users WHERE email = ?', ['analyst@example.com']);
    
    if (!analystExists) {
      console.log('📝 Creating sample analyst user...');
      const hashedPassword = await bcrypt.hash('analyst123', 10);
      
      await db.run(
        `INSERT INTO users (email, password, name, role, status) 
         VALUES (?, ?, ?, ?, ?)`,
        ['analyst@example.com', hashedPassword, 'Analyst User', 'analyst', 'active']
      );
      
      console.log('✅ Sample analyst created:');
      console.log('   Email: analyst@example.com');
      console.log('   Password: analyst123');
    }
    
    console.log('🎉 Database seeding completed successfully!');
    
    // Display summary
    const userCount = await db.get('SELECT COUNT(*) as count FROM users');
    const transCount = await db.get('SELECT COUNT(*) as count FROM transactions');
    
    console.log('\n📊 Database Summary:');
    console.log(`   - Users: ${userCount.count}`);
    console.log(`   - Transactions: ${transCount.count}`);
    console.log('\n🔐 Test Credentials:');
    console.log('   Admin:   admin@example.com / admin123');
    console.log('   Analyst: analyst@example.com / analyst123');
    console.log('   Viewer:  viewer@example.com / viewer123');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    throw error;
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedDatabase().catch(console.error);
}

module.exports = seedDatabase;