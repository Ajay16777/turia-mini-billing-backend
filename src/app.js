import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';
import commonUtils from './common-utils/index.js';
import { authRoutes } from './routes/index.js';

dotenv.config(); // Load environment variables

const {
    logger,
    errorUtils,
    RequestResponseHandler,
    PostgreSQLConnection,
} = commonUtils;

const errorHandler = new errorUtils.ErrorHandler();

class MyApp {
    constructor() {
        this.app = express();
        this.setupMiddleware();
        this.setupRoutes();
        this.setupErrorHandling();
    }

    /**
     * Async initializer to wait for DB connection
     */
    async init() {
        await this.setupDbConnection();
        return this;
    }

    /**
     * Set up the database connection
     */
    async setupDbConnection() {
        try {
            await PostgreSQLConnection.connect();
            logger.info('Database connection established');
        } catch (error) {
            logger.error({}, 'Database connection failed', {
                err: error,
                tags: ['db'],
            });
            process.exit(1);
        }
    }

    /**
     * Set up middleware
     */
    setupMiddleware() {
        this.app.use(express.json({ limit: '10kb' }));
        this.app.use(cookieParser());
        this.app.use(cors());
        this.app.use(RequestResponseHandler.createApiContext);
    }

    /**
     * Set up routes
     */
    setupRoutes() {
        this.app.get('/api/healthchecker', (req, res) => {
            res.status(200).send('OK');
        });
        authRoutes(this.app);
        // invoiceRoutes(this.app);
        // userManagementRoutes(this.app);
    }

    /**
     * Centralized error handling middleware
     */
    setupErrorHandling() {
        this.app.use((err, req, res, next) => {
            errorHandler.handleError(err, req, res);
        });
    }

    /**
     * Start server
     */
    startServer() {
        const port = process.env.PORT || 8000;
        this.app.listen(port, () => {
            logger.info(`Server is running on port ${port}`);
        });
    }
}

// Bootstrapping
(async () => {
    const myApp = new MyApp();
    await myApp.init(); // wait for DB connection
    myApp.startServer();
})();

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason) => {
    logger.error({}, 'Unhandled Rejection', {
        err: reason,
        tags: ['process'],
    });
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    logger.error({}, 'Uncaught Exception', {
        err: error,
        tags: ['process'],
    });

    if (!errorHandler.isTrustedError(error)) {
        process.exit(1);
    }
});
