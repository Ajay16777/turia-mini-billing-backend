import { Sequelize } from 'sequelize';
import { postgreSQLConfig } from '../../config.js';
import * as logger from '../../logger.js';

const tags = ['postgres_connection'];

const {
	POSTGRES_DB,
	POSTGRES_USER,
	POSTGRES_PASSWORD,
	POSTGRES_HOST,
	POSTGRES_PORT,
	MAX_RETRES,
	RETRY_INTERVAL
} = postgreSQLConfig;

class PostgresConnection {
	constructor() {
		this.maxRetries = MAX_RETRES || 5;
		this.retryDelay = RETRY_INTERVAL || 2000;
		this.sequelize = null;
		this.retryCount = 0;
	}

	/**
	 * Establish the connection with retry logic.
	 */
	async connect() {
		if (this.sequelize) return this.sequelize;

		while (this.retryCount < this.maxRetries) {
			try {
				this.sequelize = new Sequelize(POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, {
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
				});

				await this.sequelize.authenticate();
				logger.info('Connected to PostgreSQL successfully.', tags);

				return this.sequelize;

			} catch (error) {
				this.retryCount++;

				logger.error(
					{},
					`PostgreSQL connection failed (Attempt ${this.retryCount}/${this.maxRetries}). Error: ${error.message}`
				);

				if (this.retryCount < this.maxRetries) {
					const delaySec = this.retryDelay / 1000;
					logger.info(`Retrying in ${delaySec} seconds...`, tags);
					await new Promise(res => setTimeout(res, this.retryDelay));
				} else {
					logger.error({}, `Max retries reached. Unable to connect to PostgreSQL.`);
					throw error;
				}
			}
		}

		throw new Error('Unexpected flow in connect() logic');
	}

	/**
	 * Return Sequelize instance.
	 */
	getSequelizeInstance() {
		if (!this.sequelize) {
			console.log('Sequelize connection is not established yet...');
			return null;
		}
		return this.sequelize;
	}
}

// Export an instance using ES module syntax
const postgresConnection = new PostgresConnection();
export default postgresConnection;
