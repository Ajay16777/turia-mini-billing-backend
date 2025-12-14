# Turia Mini Billing Backend

A Node.js/Express backend application for managing billing operations with authentication, customer management, and invoice processing.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Default Credentials](#default-credentials)
- [Scripts](#scripts)
- [Environment Variables](#environment-variables)

## Prerequisites

- **Node.js**: Version 24 LTS or higher
- **PostgreSQL**: Installed and running
- **npm**: Package manager (comes with Node.js)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd turia-mini-billing-backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

## Database Setup

1. Create PostgreSQL databases:
```sql
CREATE DATABASE turia_db;
CREATE DATABASE turia_test_db;  -- For testing
```

2. Run database migrations:
```bash
npm run db:migrate
```

3. Seed the database with initial data:
```bash
npm run db:seed
```

This will create default admin and user accounts (see [Default Credentials](#default-credentials)).

## Running the Application

### Development Mode
```bash
npm run dev
```

The server will start with nodemon for automatic reloading on file changes.

### Production Mode
```bash
npm run build
npm start
```

## Testing

### Running Tests

The project uses Jest for testing with a data-driven approach. Test scenarios are defined in `src/tests/data/testScenarios.json`.

#### Quick Test Run
```bash
chmod +x testRunner.sh
./testRunner.sh
```

This script will:
1. Load test environment variables from `.env.test`
2. Run database migrations
3. Seed test database
4. Execute all test suites
5. Clean up test database

#### Alternative Test Commands

Run all tests:
```bash
npm run test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Run tests with coverage:
```bash
npm run test:coverage
```

Run tests with verbose output:
```bash
npm run test:verbose
```

Run specific test suites:
```bash
npm run test:auth        # Authentication tests only
npm run test:customers   # Customer tests only
npm run test:invoices    # Invoice tests only
```

### Test Structure

Tests are organized into three main categories:

#### 1. Authentication Tests
- ✅ Admin login with valid credentials
- ✅ User login with valid credentials
- ❌ Login with invalid password
- ❌ Login with missing required fields

#### 2. Customer Tests
- ✅ Create customer with valid data
- ❌ Create customer with duplicate email
- ❌ Create customer with invalid email format
- ✅ Fetch all customers (admin only)
- ✅ Fetch customer profile (authenticated user)
- ❌ Fetch profile without authentication

#### 3. Invoice Tests
- ✅ Create invoice with valid data (admin only)
- ❌ Create invoice without authentication
- ❌ Create invoice with non-existent customer
- ❌ Create invoice with empty items array
- ✅ Get invoices with filters
- ✅ Update invoice status (admin only)
- ❌ Update invoice status without admin privileges
- ❌ Update invoice with invalid status value

### Test Configuration

- **Test Framework**: Jest
- **Test Environment**: Node.js
- **Test Files**: `src/tests/**/*.test.js`
- **Test Data**: `src/tests/data/testScenarios.json`
- **Test Runner**: `src/tests/runner/testRunner.js`

### Test Scenarios

Test scenarios are defined in JSON format in `src/tests/data/testScenarios.json`. Each scenario includes:
- Description
- Prerequisites (steps to run before)
- Endpoint and HTTP method
- Request body/headers
- Expected response (status code, shape, data)
- Context variables to save for subsequent tests

## Project Structure

For detailed project structure, see [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md).

```
turia-mini-billing-backend/
├── src/
│   ├── app.js                 # Application initialization
│   ├── server.js              # Server entry point
│   ├── controllers/           # Request handlers
│   ├── routes/                # API routes
│   ├── services/              # Business logic
│   ├── common-utils/          # Shared utilities
│   ├── cron/                  # Scheduled tasks
│   └── tests/                 # Test files
├── package.json
├── jest.config.js
└── testRunner.sh
```

## API Endpoints

### Authentication
- `POST /v0/auth/login` - User/Admin login

### Customers
- `POST /v0/customers` - Create customer (admin only)
- `GET /v0/customers` - Get all customers (admin only)
- `GET /v0/customers/profile` - Get authenticated user profile

### Invoices
- `POST /v0/invoices/create` - Create invoice (admin only)
- `POST /v0/invoices/get` - Get invoices with filters
- `POST /v0/invoices/update` - Update invoice status (admin only)

### Health Check
- `GET /api/healthchecker` - Health check endpoint

## Default Credentials

After running database seeders, the following accounts are available:

### Admin Account
- **Email**: `admin@example.com`
- **Password**: `password123`
- **Role**: `admin`

### User Account
- **Email**: `user@example.com`
- **Password**: `password123`
- **Role**: `user`

⚠️ **Important**: Change these credentials in production!

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with nodemon |
| `npm start` | Start production server |
| `npm run build` | Build the application |
| `npm run lint` | Run ESLint |
| `npm run test` | Run all tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run test:verbose` | Run tests with verbose output |
| `npm run test:auth` | Run authentication tests only |
| `npm run test:customers` | Run customer tests only |
| `npm run test:invoices` | Run invoice tests only |
| `npm run db:migrate` | Run database migrations |
| `npm run db:migrate:undo` | Undo last migration |
| `npm run db:migrate:undo:all` | Undo all migrations |
| `npm run db:seed` | Run all seeders |
| `npm run db:seed:undo` | Undo all seeders |

## Environment Variables

Required environment variables (configure in `.env`):

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=turia_db
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h

# Server
PORT=3000
NODE_ENV=development

# Test Database (for .env.test)
TEST_DB_NAME=turia_test_db
```

See `.env.example` for the complete template.

## Features

- ✅ JWT-based authentication
- ✅ Role-based access control (Admin/User)
- ✅ Customer management
- ✅ Invoice creation and management
- ✅ GST calculation
- ✅ Invoice status tracking
- ✅ Automated invoice overdue checking (cron job)
- ✅ Comprehensive test coverage
- ✅ Data-driven testing approach
- ✅ Request validation
- ✅ Error handling
- ✅ Structured logging

## Technology Stack

- **Runtime**: Node.js 24 LTS
- **Framework**: Express.js 5.x
- **Database**: PostgreSQL
- **ORM**: Sequelize 6.x
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Joi
- **Testing**: Jest, Supertest
- **Logging**: Winston
- **Task Scheduling**: node-cron

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add/update tests
5. Ensure all tests pass
6. Submit a pull request

## License

ISC

## Support

For issues and questions, please open an issue on GitHub.
