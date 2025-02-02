const { createLogger, transports, format } = require('winston');
const path = require('path');
const fs = require('fs');

const env = process.env.NODE_ENV || 'development';
const DEFAULT_LOG_FILE = process.env.LOGFILE || './logs/logger.log'; // Set the default here

/**
 * Creates a logger instance with a configurable log file location.
 * @param {string} logFilePath - Path to the log file (default: process.env.LOGFILE or "./logs/logger.log")
 * @returns {object} Winston logger instance
 */
function createCustomLogger(logFilePath = DEFAULT_LOG_FILE) {
    const logDir = path.dirname(logFilePath);

    // Ensure log directory exists
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }

    const logger = createLogger({
        level: env === 'production' ? 'warn' : 'debug',
        format: format.combine(
            format.timestamp(),
            format.json()
        ),
        transports: [
            new transports.File({ filename: logFilePath })
        ]
    });

    if (env !== 'production') {
        logger.add(new transports.Console({
            format: format.combine(
                format.colorize(),
                format.simple()
            )
        }));
    }

    return logger;
}

module.exports = createCustomLogger;
