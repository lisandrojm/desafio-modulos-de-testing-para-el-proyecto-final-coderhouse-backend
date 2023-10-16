/* ************************************************************************** */
/* /src/components/mail/mailServices/mailServices.js -  
/* ************************************************************************** */

const MailManager = require('../../../utils/mailManager/mailManager');

class SendMailServices {
  async sendMail(payload) {
    return await MailManager.sendEmail(payload);
  }

  async sendSMS(payload) {
    return await SmsManager.sendSMS(payload);
  }
}

module.exports = new SendMailServices();
