# Turia Mini Billing Backend - Project Structure

## Overview
This is a Node.js/Express backend application for a mini billing system with authentication, customer management, and invoice management features.

## Directory Structure

```
turia-mini-billing-backend/
│
├── .env.example                    # Environment variables template
├── .env.test                       # Test environment variables
├── .eslintrc                       # ESLint configuration
├── .gitignore                      # Git ignore rules
├── .sequelizerc                    # Sequelize CLI configuration
├── jest.config.js                  # Jest test configuration
├── package.json                    # Project dependencies and scripts
├── package-lock.json               # Locked dependency versions
├── README.md                       # Project documentation
├── PROJECT_STRUCTURE.md            # This file - project structure documentation
├── testRunner.sh                   # Test execution script
│
├── src/                            # Source code directory
│   ├── app.js                      # Application initialization
│   ├── server.js                   # Server entry point
│   │
│   ├── common-utils/               # Shared utilities and helpers
│   │   ├── index.js                # Common utilities export
│   │   ├── config.js               # Application configuration
│   │   ├── constants.js            # Application constants
│   │   ├── errorHandler.js         # Global error handler
│   │   ├── helpers.js              # Helper functions
│   │   ├── logger.js               # Winston logger setup
│   │   │
│   │   ├── databases/              # Database related code
│   │   │   └── postgres/           # PostgreSQL database
│   │   │       ├── config.js       # Database configuration
│   │   │       ├── connection.js   # Database connection setup
│   │   │       ├── index.js        # Database exports
│   │   │       │
│   │   │       ├── migrations/     # Database migrations
│   │   │       │   ├── 20251213071253-create-users.js
│   │   │       │   ├── 20251213105723-create-invoices.js
│   │   │       │   └── 20251213105728-create-invoice-items.js
│   │   │       │
│   │   │       ├── models/         # Sequelize models
│   │   │       │   ├── index.js    # Models index/registry
│   │   │       │   ├── user.model.js
│   │   │       │   ├── invoice.model.js
│   │   │       │   └── invoice-item.model.js
│   │   │       │
│   │   │       ├── repo/           # Repository layer (data access)
│   │   │       │   ├── user.repository.js
│   │   │       │   ├── invoice.repository.js
│   │   │       │   └── invoice-item.repository.js
│   │   │       │
│   │   │       └── seeders/        # Database seeders
│   │   │           └── 20251213072155-seed-admin-user.js
│   │   │
│   │   └── middlewares/            # Express middlewares
│   │       ├── auth.middleware.js  # Authentication middleware
│   │       └── req-res-handler.js  # Request/Response handler
│   │
│   ├── controllers/                # Request handlers (controllers)
│   │   ├── auth.controller.js     # Authentication controller
│   │   ├── customer.controller.js # Customer management controller
│   │   └── invoice.controller.js  # Invoice management controller
│   │
│   ├── routes/                     # API route definitions
│   │   ├── index.js                # Route aggregator
│   │   ├── auth.routes.js          # Authentication routes
│   │   ├── customer.routes.js      # Customer routes
│   │   └── invoice.routes.js       # Invoice routes
│   │
│   ├── services/                   # Business logic layer
│   │   ├── errorMessages.js        # Error message definitions
│   │   │
│   │   ├── auth-services/          # Authentication services
│   │   │   ├── auth.service.js     # Auth business logic
│   │   │   ├── auth.helper.js      # Auth helper functions
│   │   │   └── auth.validation.js  # Auth input validation
│   │   │
│   │   ├── customer-services/      # Customer services
│   │   │   ├── customer.service.js # Customer business logic
│   │   │   └── customer.validation.js # Customer validation
│   │   │
│   │   └── invoice-services/       # Invoice services
│   │       ├── invoice-service.js  # Invoice business logic
│   │       └── invoice.validation.js # Invoice validation
│   │
│   ├── cron/                       # Scheduled tasks
│   │   ├── index.js                # Cron jobs aggregator
│   │   └── invoiceOverdue.cron.js  # Invoice overdue checker
│   │
│   └── tests/                      # Test files
│       ├── datadriven.test.js      # Main test suite (data-driven)
│       │
│       ├── data/                   # Test data
│       │   └── testScenarios.json  # Test scenarios configuration
│       │
│       └── runner/                 # Test utilities
│           └── testRunner.js       # Test runner class
│
└── Mini Billing - Complete APIs.postman_collection.json  # Postman collection
```

## Architecture Overview

### Layer Structure
1. **Routes Layer** (`src/routes/`) - API endpoint definitions
2. **Controller Layer** (`src/controllers/`) - Request/response handling
3. **Service Layer** (`src/services/`) - Business logic and validation
4. **Repository Layer** (`src/common-utils/databases/postgres/repo/`) - Data access
5. **Model Layer** (`src/common-utils/databases/postgres/models/`) - Database models

### Key Components

#### Authentication
- JWT-based authentication
- Role-based access control (Admin/User)
- Password hashing with bcrypt

#### Database
- PostgreSQL with Sequelize ORM
- Migrations for schema management
- Seeders for initial data

#### Testing
- Jest testing framework
- Data-driven test approach
- Test scenarios defined in JSON
- Automated test runner script

#### Logging
- Winston logger with daily rotate file
- Structured logging

#### Scheduled Tasks
- Cron jobs for automated tasks (e.g., invoice overdue checking)

## File Descriptions

### Configuration Files
- **package.json**: Project metadata, dependencies, and npm scripts
- **jest.config.js**: Jest test configuration for ES modules
- **.sequelizerc**: Sequelize CLI configuration for migrations/seeders
- **.eslintrc**: ESLint rules and configuration

### Entry Points
- **src/server.js**: Application server entry point
- **src/app.js**: Application initialization and setup

### Database
- **Migrations**: Database schema versioning
- **Models**: Sequelize ORM models
- **Repositories**: Data access layer abstraction
- **Seeders**: Initial data population

### API Structure
- **Routes**: Define API endpoints and HTTP methods
- **Controllers**: Handle HTTP requests and responses
- **Services**: Implement business logic
- **Validation**: Input validation using Joi

### Testing
- **testScenarios.json**: Data-driven test scenarios
- **testRunner.js**: Test execution engine
- **datadriven.test.js**: Main test suite

## Environment Variables

Required environment variables (see `.env.example`):
- Database connection settings
- JWT secret keys
- Server port
- Node environment (development/test/production)

## Scripts

See `package.json` for available npm scripts:
- `npm run dev` - Development server
- `npm run start` - Production server
- `npm run test` - Run tests
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database
