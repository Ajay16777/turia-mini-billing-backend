import { postgreSQLConfig as config } from '../../config.js';

const {
	POSTGRES_DB,
	POSTGRES_USER,
	POSTGRES_PASSWORD,
	POSTGRES_HOST,
	POSTGRES_PORT,
	MAX_RETRES,
	RETRY_INTERVAL
} = config;

const dbConfig = {
	development: {
		username: POSTGRES_USER,
		password: POSTGRES_PASSWORD,
		database: POSTGRES_DB,
		host: POSTGRES_HOST,
		port: POSTGRES_PORT,
		dialect: 'postgres'
	},

	production: {
		username: POSTGRES_USER,
		password: POSTGRES_PASSWORD,
		database: POSTGRES_DB,
		host: POSTGRES_HOST,
		port: POSTGRES_PORT,
		dialect: 'postgres'
	}
};

export default dbConfig;
