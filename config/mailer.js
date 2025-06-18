const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
        user: 'evans26@ethereal.email',
        pass: 'fj6frsJukvxfGu8u7y'
    },
    // Adicione esta seção!
    tls: {
        rejectUnauthorized: false // Ignora erros de certificado
    }
});

module.exports = transporter;