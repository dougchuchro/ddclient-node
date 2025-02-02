require('dotenv').config();
const { checkPublicIP } = require('./ipChecker');
const { checkCurrentDNS, updateDNS } = require('./porkbunApi');
const { readCachedIP, updateCachedIP } = require('./cache');
const createLogger = require('./logger');
const logger = createLogger(); // Create a single shared logger

async function checkAndUpdateDNS() {
    try {
        const publicIP = await checkPublicIP(logger);
        logger.info(`Public IP: ${publicIP}`);

        const cachedIP = readCachedIP(logger);
        if (!cachedIP) {
            logger.info("No cached IP found. Saving the current public IP to the cache.");
            updateCachedIP(publicIP, logger);
            return;
        }

        if (publicIP !== cachedIP) {
            logger.info("Public IP has changed. Checking current DNS record...");

            const currentRecord = await checkCurrentDNS(process.env.SUBDOMAIN, process.env.DOMAIN, process.env.TYPE, logger);
            if (currentRecord.content !== publicIP) {
                logger.info("DNS record IP differs from public IP. Updating DNS...");
                await updateDNS(currentRecord, publicIP, logger);
                updateCachedIP(publicIP, logger);
            } else {
                logger.info("DNS record IP matches public IP. No update needed.");
            }
        } else {
            logger.info("Public IP matches cached IP. No DNS update necessary.");
        }
    } catch (error) {
        logger.error("Error in checkAndUpdateDNS:", error.message);
    }
}

function logEnvVariables() {
    Object.entries(process.env).forEach(([key, value]) => {
        // Mask sensitive keys
        if (key.includes('SECRET') || key.includes('KEY')) {
            value = '*****' + value.slice(-4); // Show only last 4 characters
        }
        logger.debug(`${key}: ${value}`);
    });
}
// Get interval from .env and set up the recurring check
logEnvVariables();

const intervalSeconds = parseInt(process.env.CHECK_INTERVAL_SECONDS, 10) * 1000;
if (isNaN(intervalSeconds) || intervalSeconds <= 0) {
    logger.error("Invalid CHECK_INTERVAL_SECONDS value in .env");
    process.exit(1);
}

logger.info(`Starting DNS update checks every ${intervalSeconds / 1000} seconds...`);
setInterval(checkAndUpdateDNS, intervalSeconds);
