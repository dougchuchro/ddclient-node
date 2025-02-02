require('dotenv').config(); // Load .env variables into process.env
const createLogger = require('../src/logger'); // Import the logger factory function
const fs = require('fs');
const path = require('path');

const logFile = path.join('logs', 'testLogger.log');
const logger = createLogger(logFile); // Instantiate the logger with a specific file

function testLogger() {
    try {
        // Remove existing log file if it exists
        if (fs.existsSync(logFile)) {
            fs.unlinkSync(logFile);
            console.log('Old log file removed for clean test.');
        }

        // Test various log levels
        logger.info('This is an info message.');
        logger.warn('This is a warning message.');
        logger.error('This is an error message.');
        logger.debug('This is a debug message.');

        // Log all environment variables (sorted alphabetically by key)
        logger.info('Logging all environment variables (sorted):');
        Object.entries(process.env)
            .sort(([keyA], [keyB]) => keyA.localeCompare(keyB)) // Sort keys alphabetically
            .forEach(([key, value]) => {
                logger.info(`${key}: ${value}`);
            });

        // Wait briefly to ensure logs are written to the file
        setTimeout(() => {
            // Check if the log file was created
            if (fs.existsSync(logFile)) {
                console.log('Log file created successfully.');
                const logContent = fs.readFileSync(logFile, 'utf-8');
                console.log('Log File Content:\n', logContent);
            } else {
                console.error('Log file was not created.');
            }
        }, 1000);
    } catch (error) {
        console.error('Error during logger test:', error.message);
    }
}

testLogger();
