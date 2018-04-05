const twilio = require('twilio');
const serviceAccount = require('./twilio_account.json')

const accountSid = serviceAccount.sid;
const authToken = serviceAccount.token;

module.exports = new twilio.Twilio(accountSid, authToken);