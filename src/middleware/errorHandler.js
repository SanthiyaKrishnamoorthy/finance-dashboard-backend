const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  
  // Handle specific error types
  if (err.message.includes('SQLITE_CONSTRAINT')) {
    return res.status(400).json({ 
      error: 'Database constraint violation',
      details: err.message
    });
  }
  
  // Default error response
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

module.exports = errorHandler;
