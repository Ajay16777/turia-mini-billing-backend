import dotenv from 'dotenv';

dotenv.config();

interface GeneralConfig {
  NODE_ENV: string;
  TZ: string;
  ORIGIN: string;
  PORT: number;
  TAGS: string[];
}

interface LoggingConfig {
  EXPORT_LOGS_TO_LOGGLY: boolean;
  LOGGLY_TOKEN: string;
  LOGGLY_SUBDOMAIN: string;
  LOGGLY_TAGS: string[];
  LOGGLY_LEVEL: string;
  EXPORT_LOGS_TO_FILE: boolean;
  LOGGLY_LOG_FILE_PATH: string;
  EXPORT_LOGS_TO_CONSOLE: boolean;
  LOGGER_PACKAGE: string;
}

interface SentryConfig {
  SENTRY_DSN: string;
}
interface PostgreSQLConfig {
	POSTGRES_HOST: string;
	POSTGRES_PORT: number;
	POSTGRES_USER: string;
	POSTGRES_PASSWORD: string;
	POSTGRES_DB: string;
	RETRY_INTERVAL: number;
	MAX_RETRES: number
}

interface AdditionalConfig {
}

interface TokenConfig {
	SIGNIN_TOKEN_SECRET: string,
	LOGIN_TOKEN_SECRET: string,
}
interface MongoDbConfig {
	readonly MONGO_DB_NAME: string;
	readonly MONGO_HOST: string;
	readonly MONGO_PORT: number;
	readonly MONGO_USER?: string;
	readonly MONGO_PASSWORD?: string;
	readonly MONGO_MIN_POOL_SIZE?: number;
	readonly MONGO_MAX_POOL_SIZE?: number;
}

interface AwsConfig {
	readonly AWS_ACCESS_KEY: string;
	readonly AWS_SECRET_KEY: string;
	readonly AWS_REGION: string;
	readonly AWS_S3_BUCKET: string;
}

interface RedisConnectionConst {
	readonly REDIS_HOST: string;
	readonly REDIS_PORT: number;
	readonly REDIS_PASSWORD: string;
	readonly REDIS_USERNAME: string;
	readonly REDIS_DB: number;
}

export const generalConfig: GeneralConfig = {
	NODE_ENV: process.env.NODE_ENV ?? 'local',
	TZ: process.env.TZ ?? 'Etc/GMT',
	ORIGIN: process.env.ORIGIN ?? 'localhost',
	PORT: parseInt(process.env.PORT ?? '8000', 10),
	TAGS: (process.env.TAGS ?? '').split(',').map(tag => tag.trim()),
};

export const loggingConfig: LoggingConfig = {
	EXPORT_LOGS_TO_LOGGLY: process.env.EXPORT_LOGS_TO_LOGGLY === 'true',
	LOGGLY_TOKEN: process.env.LOGGLY_TOKEN ?? '',
	LOGGLY_SUBDOMAIN: process.env.LOGGLY_SUBDOMAIN ?? '',
	LOGGLY_TAGS: (process.env.LOGGLY_TAGS ?? '').split(',').map(tag => tag.trim()),
	LOGGLY_LEVEL: process.env.LOGGLY_LEVEL ?? 'info',
	EXPORT_LOGS_TO_FILE: process.env.EXPORT_LOGS_TO_FILE === 'true',
	LOGGLY_LOG_FILE_PATH: process.env.LOGGLY_LOG_FILE_PATH ?? '',
	EXPORT_LOGS_TO_CONSOLE: process.env.EXPORT_LOGS_TO_CONSOLE !== 'false',
	LOGGER_PACKAGE: 'winston-wrappers',
};

export const sentryConfig: SentryConfig = {
	SENTRY_DSN: process.env.SENTRY_DSN ?? '',
};

export const postgreSQLConfig: PostgreSQLConfig = {
	POSTGRES_HOST: process.env.POSTGRES_HOST ?? '127.0.0.1',
	POSTGRES_PORT: parseInt(process.env.POSTGRES_PORT ?? '6500', 10),
	POSTGRES_USER: process.env.POSTGRES_USER ?? 'admin',
	POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD ?? 'password123',
	POSTGRES_DB: process.env.POSTGRES_DB ?? 'node_typeorm',
	RETRY_INTERVAL: parseInt(process.env.RETRY_INTERVAL ?? '5000', 10),
	MAX_RETRES: parseInt(process.env.MAX_RETRES ?? '5', 10),
};

export const mongoDbConfig: MongoDbConfig = {
	MONGO_DB_NAME: process.env.MONGO_DB_NAME || 'test',
	MONGO_HOST: process.env.MONGO_HOST || 'localhost',
	MONGO_PORT: parseInt(process.env.MONGO_PORT || '27017', 10),
	MONGO_USER: process.env.MONGO_USER,
	MONGO_PASSWORD: process.env.MONGO_PASSWORD,
	MONGO_MIN_POOL_SIZE: parseInt(process.env.MONGO_MIN_POOL_SIZE || '5', 10),
	MONGO_MAX_POOL_SIZE: parseInt(process.env.MONGO_MAX_POOL_SIZE || '10', 10),
};

export const additionalConfig: AdditionalConfig = {
};

export const tokenConfig: TokenConfig = {
	SIGNIN_TOKEN_SECRET: process.env.SIGNIN_TOKEN_SECRET || 'SIGNIN_TOKEN_SECRET',
	LOGIN_TOKEN_SECRET: process.env.LOGIN_TOKEN_SECRET || 'LOGIN_TOKEN_SECRET',
};

export const awsConfig: AwsConfig = {
	AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY || 'AWS_ACCESS_KEY',
	AWS_SECRET_KEY: process.env.AWS_SECRET_KEY || 'AWS_SECRET_KEY',
	AWS_REGION: process.env.AWS_REGION || 'AWS_REGION',
	AWS_S3_BUCKET: process.env.AWS_S3_BUCKET || 'AWS_S3_BUCKET',
};

export const redisCred: RedisConnectionConst = {
	REDIS_HOST: process.env.REDIS_HOST || '',
	REDIS_PORT: parseInt(process.env.REDIS_PORT || '6379', 10),
	REDIS_PASSWORD: process.env.REDIS_PASSWORD || '',
	REDIS_USERNAME: process.env.REDIS_USERNAME || '',
	REDIS_DB: parseInt(process.env.REDIS_DB || '0', 10),
};
