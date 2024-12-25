const logger = require('../src/logger');
const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, 'logs', 'ddclient-node.log');

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
