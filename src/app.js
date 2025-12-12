import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';
import commonUtils from './common-utils/index.js';

dotenv.config(); // Load environment variables

const { logger, errorUtils, RequestResponseHandler, PostgreSQLConnection, auth } = commonUtils;
console.log("🚀 ~ auth:", auth)
const errorHandler = new errorUtils.ErrorHandler();
import { invoiceRoutes } from './routes/index.js';

/**
 * Represents a basic application setup for a web server.
 */
class MyApp {
    constructor() {
        this.app = express();
        this.setupDbConnection();
        this.setupMiddleware();
        this.setupRoutes();
    }

    /**
     * Set up the database connection.
     */
    setupDbConnection() {
        PostgreSQLConnection.connect()
            .then(() => {
                logger.info('Database connection established');
            })
            .catch((error) => {
                logger.error({}, 'Database connection failed', error);
            });
    }

    /**
     * Set up middleware for the application.
     */
    setupMiddleware() {
        this.app.use(express.json({ limit: '10kb' }));
        this.app.use(cookieParser());
        this.app.use(cors());
        this.app.use(RequestResponseHandler.createApiContext);
    }

    /**
     * Define the routes for the application.
     */
    setupRoutes() {
        this.app.get('/api/healthchecker', (req, res) => {
            res.send('Hello World');
        });
        invoiceRoutes(this.app);

        // userManagementRoutes(this.app);
    }

    /**
     * Start the web server.
     */
    startServer() {
        const port = process.env.PORT || 8000; // fallback port
        this.app.listen(port, () => {
            logger.info(`Server is running on port ${port}`);
        });
    }
}

const myApp = new MyApp();
myApp.startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason) => {
    logger.error({}, `Unhandled Rejection: ${reason.message}`, {
        err: reason,
        tags: [],
    });
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    logger.error({}, `Uncaught Exception: ${error.message}`, {
        err: error,
        tags: [],
    });
    if (!errorHandler.isTrustedError(error)) {
        process.exit(1);
    }
});
