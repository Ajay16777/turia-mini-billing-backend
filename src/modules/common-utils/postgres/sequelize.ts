'use strict';

import { Sequelize } from 'sequelize';
import { postgreSQLConfig } from "../config";
import * as logger from '../logger';
import { generalConfig } from '../config';

const tags = ['postgres_connection'];
const { NODE_ENV } = generalConfig;
const { POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_HOST, POSTGRES_PORT, MAX_RETRES, RETRY_INTERVAL } = postgreSQLConfig;
/**
 * This class manages the PostgreSQL database connection.
 */
class PostgresConnection {
    private maxRetries: number;
    private retryDelay: number;
    private sequelize: Sequelize | null;
    private retryCount: number;

    constructor() {
        this.maxRetries = MAX_RETRES;
        this.retryDelay = RETRY_INTERVAL;
        this.sequelize = null;
        this.retryCount = 0;
    }

    /**
     * Establishes the connection to PostgreSQL with retry logic.
     * @returns Promise<Sequelize>
     */
    async connect(): Promise<Sequelize> {
        if (this.sequelize) {
            return this.sequelize;
        }

        while (this.retryCount < this.maxRetries) {
            try {
                this.sequelize = new Sequelize(
                    POSTGRES_DB,
                    POSTGRES_USER,
                    POSTGRES_PASSWORD,
                    {
                        host: POSTGRES_HOST,
                        port: POSTGRES_PORT,
                        dialect: 'postgres',
                        logging: false,
                        pool: {
                            max: 10,
                            min: 0,
                            acquire: 30000,
                            idle: 10000
                        },
                        define: {
                            freezeTableName: true,
                            timestamps: true
                        }
                    }
                );

                await this.sequelize.authenticate();
                logger.info('Connected to PostgreSQL successfully.', tags);

                return this.sequelize;
            } catch (error: any) {
                this.retryCount++;

                logger.error({}, `Connection error. Attempt ${this.retryCount} of ${this.maxRetries}. Error: ${error.message}`, error);

                if (this.retryCount < this.maxRetries) {
                    logger.info(`Retrying in ${this.retryDelay / 1000} seconds...`, tags);

                    await new Promise(resolve =>
                        setTimeout(resolve, this.retryDelay)
                    );
                } else {
                    logger.error({}, `Max retries (${this.maxRetries}) reached. Unable to connect to PostgreSQL.`, error);
                    throw error;
                }
            }
        }

        throw new Error('Unexpected flow in connect() logic');
    }

    /**
     * Returns the current Sequelize instance.
     */
    getSequelizeInstance(): Sequelize | null {
        if (!this.sequelize) {
            console.log('Sequelize connection is not established yet...');
            return null;
        }
        return this.sequelize;
    }
}

// Singleton instance
const PostgreSQLConnection = new PostgresConnection();
export default PostgreSQLConnection;
