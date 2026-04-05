const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Finance Data Processing API',
      version: '1.0.0',
      description: `Backend API for Finance Dashboard System with Role-Based Access Control.

**Features:**
- User registration & authentication (JWT)
- Role-based access (Viewer, Analyst, Admin)
- Transaction CRUD operations
- Dashboard analytics & summaries
- Filtering & pagination

**Roles & Permissions:**
- **Viewer**: Can only view transactions and dashboard
- **Analyst**: Viewer permissions + can create transactions
- **Admin**: Full CRUD operations + user management`,
      contact: {
        name: 'Santhiya K',
        email: 'sandkrish3511@gmail.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token from login response'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            email: { type: 'string', example: 'user@example.com' },
            name: { type: 'string', example: 'John Doe' },
            role: { type: 'string', enum: ['viewer', 'analyst', 'admin'], example: 'viewer' },
            status: { type: 'string', enum: ['active', 'inactive'], example: 'active' },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        Transaction: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            amount: { type: 'number', example: 5000.00 },
            type: { type: 'string', enum: ['income', 'expense'], example: 'income' },
            category: { type: 'string', example: 'Salary' },
            date: { type: 'string', format: 'date', example: '2024-04-05' },
            description: { type: 'string', example: 'Monthly salary' },
            user_id: { type: 'integer', example: 1 },
            user_name: { type: 'string', example: 'Admin User' }
          }
        },
        DashboardSummary: {
          type: 'object',
          properties: {
            summary: {
              type: 'object',
              properties: {
                total_income: { type: 'number', example: 15000 },
                total_expense: { type: 'number', example: 5000 },
                net_balance: { type: 'number', example: 10000 },
                total_transactions: { type: 'integer', example: 25 }
              }
            },
            category_breakdown: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  type: { type: 'string' },
                  category: { type: 'string' },
                  total: { type: 'number' },
                  count: { type: 'integer' }
                }
              }
            },
            recent_activity: {
              type: 'array',
              items: { $ref: '#/components/schemas/Transaction' }
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Error message here' }
          }
        }
      }
    },
    tags: [
      { name: 'Authentication', description: 'User registration & login' },
      { name: 'Transactions', description: 'Transaction CRUD operations' },
      { name: 'Dashboard', description: 'Analytics and summaries' },
      { name: 'Users', description: 'User management (Admin only)' }
    ]
  },
  apis: ['./src/routes/*.js']
};

module.exports = swaggerJsdoc(options);