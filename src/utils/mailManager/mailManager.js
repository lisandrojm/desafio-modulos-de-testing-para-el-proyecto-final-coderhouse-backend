/* ************************************************************************** */
/* /src/utils/mailManager/mailManager.js 
/* ************************************************************************** */

const { createTransport } = require('nodemailer');
const { config } = require('../../config');

class MailManager {
  static instance;
  constructor() {
    if (MailManager.instance) MailManager.instance;
    MailManager.instance = this;
    this.setTransport();
  }

  setTransport() {
    this.transport = createTransport({
      service: 'gmail',
      port: 587,
      auth: {
        user: config.nodemailer_user,
        pass: config.nodemailer_pass,
      },
    });
  }

  async sendEmail({ from, to, subject, html, attachments }) {
    return await this.transport.sendMail({
      from,
      to,
      subject,
      html,
      attachments,
    });
  }
}

module.exports = new MailManager();
