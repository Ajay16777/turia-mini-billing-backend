import { Sequelize } from 'sequelize';
import { postgreSQLConfig } from '../../config.js';
import * as logger from '../../logger.js';

const {
	POSTGRES_DB,
	POSTGRES_USER,
	POSTGRES_PASSWORD,
	POSTGRES_HOST,
	POSTGRES_PORT,
	MAX_RETRIES,
	RETRY_INTERVAL
} = postgreSQLConfig;

const tags = ['postgres_connection'];

const sequelize = new Sequelize(POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, {
	host: POSTGRES_HOST,
	port: POSTGRES_PORT,
	dialect: 'postgres',
	logging: false,
	pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
	define: { freezeTableName: true, timestamps: false }, // timestamps handled in model
});

const connect = async () => {
	let retries = 0;
	while (retries < (MAX_RETRIES || 5)) {
		try {
			await sequelize.authenticate();
			logger.info('✅ Connected to PostgreSQL successfully', tags);
			return sequelize;
		} catch (error) {
			retries++;
			logger.error({}, `PostgreSQL connection failed (Attempt ${retries}). ${error.message}`, { tags });

			if (retries < (MAX_RETRIES || 5)) {
				logger.info(`Retrying in ${RETRY_INTERVAL || 2000} ms...`, tags);
				await new Promise(res => setTimeout(res, RETRY_INTERVAL || 2000));
			} else {
				logger.error({}, 'Max retries reached. Cannot connect to PostgreSQL.', { tags });
				throw error;
			}
		}
	}
};

export { sequelize, connect };
export default sequelize;
