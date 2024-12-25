// test/testIpChecker.js
const { checkPublicIP } = require('../src/ipChecker');

async function testCheckPublicIP() {
    try {
        const ip = await checkPublicIP();
        console.log('Test Passed: Your public IP is:', ip);
    } catch (error) {
        console.error('Test Failed:', error.message);
    }
}

// Run the test
testCheckPublicIP();
