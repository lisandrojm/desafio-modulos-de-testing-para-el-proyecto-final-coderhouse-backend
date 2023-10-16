/* ************************************************************************** */
/* /src/utils/smsManager/index.js 
/* ************************************************************************** */

const twilio = require('twilio');
const { config } = require('../../config');

class SmsManager {
  static instance;
  constructor() {
    if (SmsManager.instance) SmsManager.instance;
    SmsManager.instance = this;
    this.twilioClient = twilio(config.twilio_sid, config.twilio_auth_token);
  }

  async sendSms({ to, body }) {
    return await this.twilioClient.messages.create({
      from: config.twilio_phone_number,
      to,
      body,
    });
  }
}

module.exports = new SmsManager();
