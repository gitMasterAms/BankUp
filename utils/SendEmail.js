require('dotenv').config();
const nodemailer = require('nodemailer');

class SendEmail {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: parseInt(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER || 'alba.konopelski@ethereal.email',
        pass: process.env.SMTP_PASS || 'CcyZRczFWf6h4wSXJv'
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async sendEmail(to, subject, html) {
    try {
      const info = await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject,
        html,
      });

      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      throw new Error(`Erro ao enviar e-mail: ${error.message}`);
    }
  }
}

module.exports = SendEmail;
