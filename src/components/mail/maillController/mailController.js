/* ************************************************************************** */
/* /src/components/mail/mailController/mailController.js -  
/* ************************************************************************** */

const sendMailService = require('../mailServices/mailServices');

class SendMailController {
  async sendMail(req, res, next) {
    try {
      const response = await sendMailService.sendMail(req.body);
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SendMailController();
