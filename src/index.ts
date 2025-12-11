import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import * as dotenv from 'dotenv'; // Use dotenv for environment variables
import commonUtils from './modules/common-utils';
import { userManagementRoutes } from './modules/user/router';

dotenv.config(); // Load environment variables

const { logger, errorUtils, RequestResponseHandler, PostgreSQLConnection } = commonUtils;
const errorHandler = new errorUtils.ErrorHandler();

/**
 * Represents a basic application setup for a web server.
 */
class MyApp {
    private app: express.Application;

    constructor() {
        this.app = express();
        this.setupDbConnection();
        this.setupMiddleware();
        this.setupRoutes();
    }

    /**
     * Set up the database connection.
     */
    private setupDbConnection() {
        PostgreSQLConnection.connect().then(() => {
            logger.info('Database connection established');
        }).catch((error: any) => {
            logger.error({}, 'Database connection failed', error);
        });
    }

    /**
     * Set up middleware for the application.
     */
    private setupMiddleware() {
        this.app.use(express.json({ limit: '10kb' }));
        this.app.use(cookieParser());
        this.app.use(cors());
        this.app.use(RequestResponseHandler.createApiContext);
    }

    /**
     * Define the routes for the application.
     */
    private setupRoutes() {
        this.app.get('/api/healthchecker', (req, res) => {
            res.send('Hello World');
        });
        userManagementRoutes(this.app);
    }

    /**
     * Start the web server.
     */
    public startServer() {
        const port = process.env.PORT; // Use environment variable for the port
        this.app.listen(port, () => {
            logger.info(`Server is Running on Port ${port}`);
        });
    }
}

const myApp = new MyApp();
myApp.startServer();

// Handle unhandled rejections
process.on('unhandledRejection', (reas̵on: Error) => {
    logger.error({}, `Unhandled Rejection: ${reas̵on.message}`, {
        err: reas̵on,
        tags: [],
    });
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
    logger.error({}, `Uncaught Exception: ${error.message}`, {
        err: error,
        tags: [],
    });
    if (!errorHandler.isTrustedError(error)) {
        process.exit(1);
    }
});