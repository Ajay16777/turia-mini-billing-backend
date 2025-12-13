import dotenv from 'dotenv';
dotenv.config();

const parseNumber = (value, defaultValue) => {
	const num = parseInt(value, 10);
	const res = Number.isNaN(num) ? defaultValue : num;
	return res;
};

const dbConfig = {
	development: {
		username: process.env.POSTGRES_USER || 'admin',
		password: process.env.POSTGRES_PASSWORD || 'password123',
		database: process.env.POSTGRES_DB || 'node_typeorm',
		host: process.env.POSTGRES_HOST || '127.0.0.1',
		port: parseNumber(process.env.POSTGRES_PORT, 6500),
		dialect: 'postgres'
	},

	production: {
		username: process.env.POSTGRES_USER || 'admin',
		password: process.env.POSTGRES_PASSWORD || 'password123',
		database: process.env.POSTGRES_DB || 'node_typeorm',
		host: process.env.POSTGRES_HOST || '127.0.0.1',
		port: parseNumber(process.env.POSTGRES_PORT, 6500),
		dialect: 'postgres'
	}
};

export default dbConfig;
