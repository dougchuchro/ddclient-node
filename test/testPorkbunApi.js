// test/testPorkbunApi.js
const createLogger = require('../src/logger');
const logger = createLogger("./logs/testPorkbunApis.log"); // Create a single shared logger
const { updateDNS, checkCurrentDNS } = require('../src/porkbunApi');

async function testCheckCurrentDNS() {
    const subdomain = process.env.SUBDOMAIN; // e.g., 'home'
    const domain = process.env.DOMAIN;       // e.g., 'example.com'
    const type = process.env.TYPE;           // e.g., 'A'

//    console.log(`Checking DNS for subdomain: ${subdomain}, domain: ${domain}, type: ${type}`);
    logger.info(`Checking DNS for subdomain: ${subdomain}, domain: ${domain}, type: ${type}`);

    try {
        const resp = await checkCurrentDNS(subdomain, domain, type, logger);
        logger.info("TEST RESPONSE: " + JSON.stringify(resp));
        logger.info(`Test Passed: Current IP for ${subdomain}.${domain} is: ${resp.content}`);
        return resp;
    } catch (error) {
        console.error('Test Failed:', error.message);
    }
}

async function testUpdateDNS(currentRecord) {
    const subdomain = process.env.SUBDOMAIN; // e.g., 'test'
    const domain = process.env.DOMAIN;       // e.g., 'chuchro.dev'
    const Id = currentRecord.id;
    const newIPAddress = '1.2.3.4'; // Replace with the actual new IP address for testing
//    const newIPAddress = '43.233.132.87'; // Replace with the actual new IP address for testing

    try {
        await updateDNS(currentRecord, newIPAddress);
        console.log(`Test Passed: Successfully updated ${subdomain}.${domain} to ${newIPAddress}`);
    } catch (error) {
        console.error('Test Failed:', error.message);
    }
}

// Run the tests
async function runTests() {
    const currentRecord = await testCheckCurrentDNS();
//    await testUpdateDNS(currentRecord);
}

runTests();
//testCheckCurrentDNS();
// testUpdateDNS();
