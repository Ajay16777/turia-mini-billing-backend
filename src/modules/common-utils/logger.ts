import logger, { format } from 'winston';
import { loggingConfig, generalConfig } from './config';
import path from 'path';
import fs from 'fs';
import DailyRotateFile from 'winston-daily-rotate-file';

const { LOGGLY_LOG_FILE_PATH, EXPORT_LOGS_TO_CONSOLE, EXPORT_LOGS_TO_FILE } = loggingConfig;
const DEFAULT_TAGS = generalConfig.TAGS;

if (EXPORT_LOGS_TO_FILE) {
	let dir = LOGGLY_LOG_FILE_PATH;

	if (!dir) dir = path.resolve('logs');

	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
	}

	/**
   * Configure Winston logger to log errors to a daily rotating file.
   */
	logger.configure({
		level: 'error',
		transports: [
			new DailyRotateFile({
				level: 'error',
				filename: `${dir}/error-%DATE%.log`, // You can customize the filename
				datePattern: 'YYYY-MM-DD',
				zippedArchive: true,
				handleExceptions: true,
				maxFiles: '30d', // Rotate logs every 30 days
				format: format.combine(format.errors({ stack: true }), format.timestamp(), format.json()),
			}),
		],
	});
}

if (EXPORT_LOGS_TO_CONSOLE) {
	logger.add(new logger.transports.Console({
		level: 'silly',
		format: logger.format.combine(
			format.errors({ stack: true }),
			logger.format.colorize({
				all: true,
			})
		),
	}));
}

/**
 * Logs an error message along with request details and error object.
 * @param {unknown} reqDetails - Details about the request.
 * @param {string} message - The error message.
 * @param {unknown} errorObj - The error object.
 */
const error = (reqDetails: unknown, message: string, errorObj: unknown) => {
	logger.error({ reqDetails, message, errorObj, tags: [...DEFAULT_TAGS] });
};

/**
 * Logs an informational message.
 * @param {unknown} message - The informational message.
 * @param {string[]} tags - An array of tags.
 * @param {Object} params - Additional parameters.
 */
const info = (message: unknown, tags: string[] = [], params = {}) => {
	logger.info({ message, tags: [...DEFAULT_TAGS, ...tags], params });
};

export { error, info };
