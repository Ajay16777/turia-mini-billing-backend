import dotenv from 'dotenv';

// IMPORTANT: load .env.test when running tests
dotenv.config({
	path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

const parseNumber = (value, defaultValue) => {
	const num = parseInt(value, 10);
	return Number.isNaN(num) ? defaultValue : num;
};

const baseConfig = {
	username: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	database: process.env.POSTGRES_DB,
	host: process.env.POSTGRES_HOST,
	port: parseNumber(process.env.POSTGRES_PORT, 5432),
	dialect: 'postgres'
};

export default {
	development: {
		...baseConfig
	},

	test: {
		...baseConfig,
		logging: false
	},

	production: {
		...baseConfig,
		logging: false
	}
};
