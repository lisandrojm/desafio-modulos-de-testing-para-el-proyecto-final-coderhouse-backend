/* ************************************************************************** */
/* /src/components/sms/smsController/smsController.js -  
/* ************************************************************************** */

const sendSmsService = require('../smsServices/smsServices');

class SendSmsServices {
  async sendSms(req, res, next) {
    try {
      const response = await sendSmsService.sendSms(req.body);
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SendSmsServices();
