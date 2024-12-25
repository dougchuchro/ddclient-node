// src/porkbunApi.js
const axios = require('axios');
require('dotenv').config();

/**
 * Checks the current DNS record for a specified subdomain on Porkbun.
 * @param {string} subdomain - The subdomain to check.
 * @param {string} domain - The domain to check.
 * @param {string} type - The DNS record type to check (e.g., 'A', 'CNAME').
 * @returns {Promise<string>} The current IP address for the DNS record.
 * @throws {Error} Throws an error if the API request fails or if no record is found.
 */
async function checkCurrentDNS(subdomain, domain, type) {
    const apiKey = process.env.PORKBUN_API_KEY;
    const secretKey = process.env.PORKBUN_SECRET_KEY;

    const url = `https://api.porkbun.com/api/json/v3/dns/retrieveByNameType/${domain}/${type}/${subdomain}`;

    var requestBody = JSON.stringify({
        "secretapikey": secretKey,
        "apikey": apiKey
      });
      
    try {
        const response = await axios.post(url, requestBody);

        if (response.data.status !== 'SUCCESS' || !response.data.records) {
            throw new Error(`Failed to retrieve DNS record: ${response.data.message}. Request URL: ${url}. Request Body: ${JSON.stringify(requestBody)}`);
        }

        // We expect to find only one record of the specified type for the subdomain
        const currentRecord = response.data.records[0];
        if (currentRecord) {
            return currentRecord; // Return the current record content, including the IP address and ID
        } else {
            throw new Error(`No ${type} record found for the specified subdomain. Request URL: ${url}. Request Body: ${JSON.stringify(requestBody)}`);
        }
    } catch (error) {
        console.error('Error checking current DNS record:', error.message);
        throw new Error(`Error checking current DNS record: ${error.message}. Request URL: ${url}. Request Body: ${JSON.stringify(requestBody)}`);
    }
}

/**
 * Updates the DNS record for a specified subdomain and domain to a new IP address.
 * @param {string} domain - The domain to update.
 * @param {string} recordId - The ID of the DNS record to update.
 * @param {string} newIPAddress - The new IP address for the DNS record.
 * @returns {Promise<void>} Resolves if the update is successful, rejects with an error otherwise.
 */
async function updateDNS(currentRecord, newIPAddress) {
    console.log("current Record: " + JSON.stringify(currentRecord));
    const apiKey = process.env.PORKBUN_API_KEY;
    const secretKey = process.env.PORKBUN_SECRET_KEY;
    const domain = process.env.DOMAIN;
    const name = process.env.SUBDOMAIN;
    const type = process.env.TYPE;
    const url = `https://api.porkbun.com/api/json/v3/dns/edit/${domain}/${currentRecord.id}`;
    
    const requestBody = {
        apikey: apiKey,
        secretapikey: secretKey,
        name: name,
        type: type,
        content: newIPAddress,
        ttl: 300
    };
    console.log("REQUEST: " + url + " :: " + JSON.stringify(requestBody));

    try {
        const response = await axios.post(url, requestBody);
        console.log("RESPONSE: " + JSON.stringify(response.data));
        if (response.data.status !== 'SUCCESS') {
            throw new Error(`Failed to update DNS record. Message: ${response.data.message}`);
        }
        console.log(`Successfully updated ${domain} to IP: ${newIPAddress}`);
    } catch (error) {
        console.error('Error updating DNS record:', error.message);
        throw new Error(`Error updating DNS record: ${error.message}`);
    }
}

// Example usage
if (require.main === module) {
    const subdomain = process.env.SUBDOMAIN; // e.g., 'home'
    const domain = process.env.DOMAIN;       // e.g., 'example.com'
    const type = process.env.TYPE;           // e.g., 'A'

    checkCurrentDNS(subdomain, domain, type)
        .then(currentIP => {
            console.log(`Current IP for ${subdomain}.${domain} is: ${currentIP}`);
            // You can then call updateDNS if you want to update it based on the current IP
        })
        .catch(error => console.error('Error:', error.message));
}

module.exports = { updateDNS, checkCurrentDNS };
