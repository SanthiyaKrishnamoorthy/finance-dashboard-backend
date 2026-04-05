# 💰 Finance Data Processing and Access Control Backend

[![Node.js Version](https://img.shields.io/badge/node-18%2B-green)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/express-4.18-blue)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/sqlite-5.1-blue)](https://sqlite.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## 📋 Assignment Overview

This is a complete backend system for a finance dashboard with role-based access control. Built as part of a Backend Developer Intern assignment to demonstrate API design, data modeling, business logic, and access control implementation.

### 🎯 Key Features

- ✅ **User & Role Management** - Create users with roles (Viewer, Analyst, Admin)
- ✅ **JWT Authentication** - Secure token-based authentication
- ✅ **Role-Based Access Control** - Middleware-based permission checking
- ✅ **Financial Records CRUD** - Complete transaction management
- ✅ **Dashboard Analytics** - Real-time financial summaries and trends
- ✅ **Advanced Filtering** - Filter by date, category, type
- ✅ **Interactive API Docs** - Swagger/OpenAPI documentation
- ✅ **Postman Collection** - Ready-to-use API testing collection

### 👥 Role Permissions Matrix

| Action | Viewer | Analyst | Admin |
|--------|--------|---------|-------|
| View transactions | ✅ | ✅ | ✅ |
| View dashboard | ✅ | ✅ | ✅ |
| Create transactions | ❌ | ✅ | ✅ |
| Update transactions | ❌ | ❌ | ✅ |
| Delete transactions | ❌ | ❌ | ✅ |
| Manage users | ❌ | ❌ | ✅ |

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/finance-backend.git
cd finance-backend