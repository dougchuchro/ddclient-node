const createLogger = require('../src/logger');
const logger = createLogger("./logs/testIpChecker.log"); // Create a single shared logger
const { checkPublicIP } = require('../src/ipChecker');

async function testCheckPublicIP() {
    try {
        const publicIP = await checkPublicIP(logger);
        logger.info('Test Passed: Your public IP is:' + publicIP);
    } catch (error) {
        logger.error('Test Failed:' + error.message);
    }
}

// Run the test
testCheckPublicIP();
