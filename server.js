require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./src/config/database');
const errorHandler = require('./src/middleware/errorHandler');

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const transactionRoutes = require('./src/routes/transactionRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Finance Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Start server
const startServer = async () => {
  try {
    await initializeDatabase();
    
    // Routes - CHECK IF EACH ROUTE FILE EXISTS AND EXPORTS CORRECTLY
    console.log('Checking routes...');
    console.log('Auth routes:', typeof authRoutes);
    console.log('Transaction routes:', typeof transactionRoutes);
    console.log('Dashboard routes:', typeof dashboardRoutes);
    
    // Only use routes if they exist
    if (authRoutes && typeof authRoutes === 'function') {
      app.use('/api/auth', authRoutes);
    } else {
      console.log('⚠️ Auth routes not loaded properly');
    }
    
    if (transactionRoutes && typeof transactionRoutes === 'function') {
      app.use('/api/transactions', transactionRoutes);
    } else {
      console.log('⚠️ Transaction routes not loaded properly');
    }
    
    if (dashboardRoutes && typeof dashboardRoutes === 'function') {
      app.use('/api/dashboard', dashboardRoutes);
    } else {
      console.log('⚠️ Dashboard routes not loaded properly');
    }
    
    // 404 handler
    app.use((req, res) => {
      res.status(404).json({ error: 'Route not found' });
    });
    
    // Error handler
    app.use(errorHandler);
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();