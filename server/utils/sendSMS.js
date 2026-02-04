// Mock SMS Gateway
// In production, integrate with Twilio, AWS SNS, Msg91, etc.

const sendSMS = async (phoneNumber, message) => {
    console.log('------------------------------------');
    console.log(`SENDING SMS TO: ${phoneNumber}`);
    console.log(`MESSAGE: ${message}`);
    console.log('------------------------------------');

    // Example Twilio integration placeholder:
    /*
    const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber
    });
    */

    return { success: true };
};

module.exports = sendSMS;
