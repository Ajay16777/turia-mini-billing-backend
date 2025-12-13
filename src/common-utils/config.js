import dotenv from 'dotenv';
import { parseCSV, parseNumber } from './helpers.js';

dotenv.config();

/* ------------------------- GENERAL CONFIG ------------------------ */
const generalConfig = {
    NODE_ENV: process.env.NODE_ENV || 'local',
    TZ: process.env.TZ || 'Etc/GMT',
    ORIGIN: process.env.ORIGIN || 'localhost',
    PORT: parseNumber(process.env.PORT, 8000),
    TAGS: parseCSV(process.env.TAGS),
};

/* -------------------------- LOGGING CONFIG ----------------------- */
const loggingConfig = {
    EXPORT_LOGS_TO_LOGGLY: process.env.EXPORT_LOGS_TO_LOGGLY === 'true',
    LOGGLY_TOKEN: process.env.LOGGLY_TOKEN || '',
    LOGGLY_SUBDOMAIN: process.env.LOGGLY_SUBDOMAIN || '',
    LOGGLY_TAGS: parseCSV(process.env.LOGGLY_TAGS),
    LOGGLY_LEVEL: process.env.LOGGLY_LEVEL || 'info',

    EXPORT_LOGS_TO_FILE: process.env.EXPORT_LOGS_TO_FILE === 'true',
    LOGGLY_LOG_FILE_PATH: process.env.LOGGLY_LOG_FILE_PATH || '',

    EXPORT_LOGS_TO_CONSOLE: process.env.EXPORT_LOGS_TO_CONSOLE !== 'false',

    LOGGER_PACKAGE: 'winston-wrappers',
};

/* --------------------------- SENTRY CONFIG ------------------------ */
const sentryConfig = {
    SENTRY_DSN: process.env.SENTRY_DSN || '',
};

/* ------------------------ POSTGRES CONFIG ------------------------- */
const postgreSQLConfig = {
    POSTGRES_HOST: process.env.POSTGRES_HOST || '127.0.0.1',
    POSTGRES_PORT: parseNumber(process.env.POSTGRES_PORT, 6500),
    POSTGRES_USER: process.env.POSTGRES_USER || 'admin',
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD || 'password123',
    POSTGRES_DB: process.env.POSTGRES_DB || 'node_typeorm',
    RETRY_INTERVAL: parseNumber(process.env.RETRY_INTERVAL, 5000),
    MAX_RETRIES: parseNumber(process.env.MAX_RETRIES, 5),
};

/* ------------------------- ADDITIONAL CONFIG ------------------------ */
const additionalConfig = {};

/* --------------------------- TOKEN CONFIG --------------------------- */
const tokenConfig = {
    JWT_SECRET: process.env.JWT_SECRET || 'JWT_SECRET',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
};

/* ----------------------------- EXPORTS ----------------------------- */
export {
    generalConfig,
    loggingConfig,
    sentryConfig,
    postgreSQLConfig,
    additionalConfig,
    tokenConfig,
};
