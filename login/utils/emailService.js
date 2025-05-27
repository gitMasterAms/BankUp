const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10),
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email enviado: ' + info.response);
    if (process.env.EMAIL_HOST === 'smtp.ethereal.email') {
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    throw new Error('Houve um erro ao enviar o e-mail, tente novamente mais tarde.');
  }
};

module.exports = sendEmail;