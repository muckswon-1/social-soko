require('dotenv').config();

const testAccountPassword = process.env.TEST_ALL_PASSWORD;
const testAccountEmail= process.env.TEST_CUSTOMER_ROLE_EMAIL;

module.exports = {
    testAccountPassword,
    testAccountEmail
}
