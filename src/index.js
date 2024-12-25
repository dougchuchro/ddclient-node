require('dotenv').config();
const { checkPublicIP } = require('./ipChecker');
const { checkCurrentDNS, updateDNS } = require('./porkbunApi');
const { readCachedIP, updateCachedIP } = require('./cache');

async function checkAndUpdateDNS() {
    try {
        const publicIP = await checkPublicIP();
        console.log(`[${new Date().toISOString()}] Public IP: ${publicIP}`);

        // Read the last known IP from the cache
        const cachedIP = readCachedIP();

        // If no cached IP is found, write the current public IP to the cache immediately
        if (!cachedIP) {
            console.log("No cached IP found. Saving the current public IP to the cache.");
            updateCachedIP(publicIP);
            return; // Exit as there's no need to update DNS if this is the first run
        }

        // Only proceed with DNS check if the public IP differs from the cached IP
        if (publicIP !== cachedIP) {
            console.log("Public IP has changed. Checking current DNS record...");

            const currentRecord = await checkCurrentDNS(process.env.SUBDOMAIN, process.env.DOMAIN, process.env.TYPE);
            if (currentRecord.content !== publicIP) {
                console.log("DNS record IP differs from public IP. Updating DNS...");
                await updateDNS(currentRecord, publicIP);
                updateCachedIP(publicIP); // Update the cache with the new IP
            } else {
                console.log("DNS record IP matches public IP. No update needed.");
            }
        } else {
            console.log("Public IP matches cached IP. No DNS update necessary.");
        }
    } catch (error) {
        console.error("Error in DNS check and update process:", error.message);
    }
}


// Get interval from .env and set up the recurring check
const intervalSeconds = parseInt(process.env.CHECK_INTERVAL_SECONDS, 10) * 1000;
if (isNaN(intervalSeconds) || intervalSeconds <= 0) {
    console.error("Invalid CHECK_INTERVAL_SECONDS value in .env");
    process.exit(1);
}

console.log(`Starting DNS update checks every ${intervalSeconds / 1000} seconds...`);
setInterval(checkAndUpdateDNS, intervalSeconds);
