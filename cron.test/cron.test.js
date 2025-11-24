const cron = require('node-cron');
const moment = require('moment');

// Função de teste do envio
const sendTestEmail = () => {
  console.log(`[${moment().format('HH:mm:ss')}] E-mail de teste enviado!`);
};

// Hora atual
const now = moment();
const testTime = now.add(3, 'minutes'); // 10 minutos à frente

// Monta o cronTime: minuto, hora, dia, mês, *
const cronTime = `${testTime.minute()} ${testTime.hour()} ${testTime.date()} ${testTime.month() + 1} *`;

console.log(`Agendado para: ${testTime.format('YYYY-MM-DD HH:mm')}`);
console.log(`Cron expression: ${cronTime}`);

// Agendamento
cron.schedule(cronTime, () => {
  sendTestEmail();
}, {
  timezone: "America/Sao_Paulo"
});
