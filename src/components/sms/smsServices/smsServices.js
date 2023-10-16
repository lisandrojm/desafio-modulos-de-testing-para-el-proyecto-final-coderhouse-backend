/* ************************************************************************** */
/* /src/components/sms/smsServices/smsServices.js -  
/* ************************************************************************** */

const SmsManager = require('../../../utils/smsManager/smsManager');
class SendSmsServices {
  async sendSms(payload) {
    return await SmsManager.sendSms(payload);
  }
}

module.exports = new SendSmsServices();
