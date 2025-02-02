const fs = require('fs');
const path = require('path');
const logger = require('./logger');

// Define cache directory and file path
const cacheDir = path.join(__dirname, '..', 'cache');
const cacheFile = path.join(cacheDir, 'ip_cache.json');

// Ensure the cache directory exists
if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
}

// Reads the cached IP address from the file, returns null if the file doesn’t exist
function readCachedIP() {
    try {
        if (fs.existsSync(cacheFile)) {
            const data = fs.readFileSync(cacheFile, 'utf-8');
            const cache = JSON.parse(data);
            return cache.lastKnownIP;
        } else {
            console.log("Cache file does not exist. No cached IP to read.");
            logger.info("Cache file does not exist. No cached IP to read.");
            return null;
        }
    } catch (error) {
        console.error("Error reading IP cache:", error.message);
        logger.error("Error reading IP cache:", error.message);
    }
    console.log("No cache file found; this is expected on first run.");
    logger.info("No cache file found; this is expected on first run.");
    return null;
}

// Writes the current IP to the cache file
function updateCachedIP(ip) {
    try {
        const cacheData = { lastKnownIP: ip };
        fs.writeFileSync(cacheFile, JSON.stringify(cacheData));
        console.log("Updated IP cache with new IP:", ip);
        logger.info("Updated IP cache with new IP:", ip);
    } catch (error) {
        console.error("Error updating IP cache:", error.message);
        logger.error("Error updating IP cache:", error.message);
    }
}

// Export the functions to be used in other modules
module.exports = {
    readCachedIP,
    updateCachedIP
};