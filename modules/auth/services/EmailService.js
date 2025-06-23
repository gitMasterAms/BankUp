const transporter = require('../../../config/mailer');

class EmailService {
  async sendTokenEmail(email, token) {
    try {
      const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: 'Seu Token de Acesso',
        html: `
                    <h1>Seu Token de Acesso</h1>
                    <p>Olá! Aqui está seu token de acesso:</p>
                    <h2>${token}</h2>
                    <p>Este token é válido por 1 hora.</p>
                    <p>Se você não solicitou este token, por favor ignore este e-mail.</p>
                `,
      };

      const info = await transporter.sendMail(mailOptions);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      throw new Error(
        `Erro ao enviar e-mail: ${error.message}`
      );
    }
  }
}

module.exports = EmailService;
