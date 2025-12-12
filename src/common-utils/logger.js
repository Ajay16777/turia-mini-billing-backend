import winston from 'winston';
import path from 'path';
import fs from 'fs';
import DailyRotateFile from 'winston-daily-rotate-file';
import { loggingConfig, generalConfig } from './config.js';

const { format } = winston;
const {
	LOGGLY_LOG_FILE_PATH,
	EXPORT_LOGS_TO_CONSOLE = true,
	EXPORT_LOGS_TO_FILE = true,
} = loggingConfig;

const DEFAULT_TAGS = generalConfig.TAGS || [];

/**
 * Resolve log directory
 */
let logsDir = LOGGLY_LOG_FILE_PATH || path.resolve('logs');

if (EXPORT_LOGS_TO_FILE) {
	if (!fs.existsSync(logsDir)) {
		fs.mkdirSync(logsDir, { recursive: true });
	}
}

const transports = [];

/**
 * File transport → daily rotation
 */
if (EXPORT_LOGS_TO_FILE) {
	transports.push(
		new DailyRotateFile({
			level: 'error',
			filename: `${logsDir}/error-%DATE%.log`,
			datePattern: 'YYYY-MM-DD',
			zippedArchive: true,
			handleExceptions: true,
			maxFiles: '30d',
			format: format.combine(
				format.timestamp(),
				format.errors({ stack: true }),
				format.json()
			),
		})
	);
}

/**
 * Console transport → colored + stack traces
 */
if (EXPORT_LOGS_TO_CONSOLE) {
	transports.push(
		new winston.transports.Console({
			level: 'debug',
			handleExceptions: true,
			format: format.combine(
				format.colorize({ all: true }),
				format.errors({ stack: true }),
				format.printf(({ level, message, timestamp, stack, ...meta }) => {
					return `[${level}] ${message} ${stack ? `\nStack: ${stack}` : ''
						}\n${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
				})
			),
		})
	);
}

/**
 * Create Winston logger
 */
const logger = winston.createLogger({
	level: 'info',
	transports,
	exitOnError: false,
});

/**
 * Log error with context
 */
const error = (reqDetails, message, errorObj = {}) => {
	logger.error({
		message,
		error: errorObj,
		reqDetails,
		tags: [...DEFAULT_TAGS],
	});
};

/**
 * Log info with tags & params
 */
const info = (message, tags = [], params = {}) => {
	logger.info({
		message,
		tags: [...DEFAULT_TAGS, ...tags],
		params,
	});
};

export { error, info };
