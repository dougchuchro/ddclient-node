const axios = require('axios');
require('dotenv').config();

/**
 * Fetches the current public IP address.
 * @param {object} logger - The logger instance to use.
 * @returns {Promise<string>} - The public IP address.
 */
async function checkPublicIP(logger) {
    const apiKey = process.env.PORKBUN_API_KEY;
    const secretKey = process.env.PORKBUN_SECRET_KEY;

    const url = 'https://api.porkbun.com/api/json/v3/ping';

    try {
        const response = await axios.post(url, {
            apikey: apiKey,
            secretapikey: secretKey
        });

        if (response.data.status === 'SUCCESS') {
            return response.data.yourIp;
        } else {
            logger.error(`Failed to get IP: ${response.data.message}`);
            throw new Error(`Failed to get IP: ${response.data.message}`);
        }
    } catch (error) {
        logger.error('Error checking public IP:', error.message);
        throw error; // Rethrow error for further handling
    }
}

// Example usage
if (require.main === module) {
    checkPublicIP()
        .then(ip => console.log('Your public IP is:', ip))
        .catch(error => console.error('Error:', error.message));
}

module.exports = { checkPublicIP };
