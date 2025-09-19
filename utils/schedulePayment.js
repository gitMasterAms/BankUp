const cron = require('node-cron');
const moment = require('moment'); // para manipular datas facilmente

function schedulePayment({ dueDate, daysBefore = 0, callback }) {
    const sendDates = [];

    // Data do pagamento (dia do vencimento)
    sendDates.push(moment(dueDate));

    // Dias antes da data final
    if (daysBefore > 0) {
        for (let i = 1; i <= daysBefore; i++) {
            sendDates.push(moment(dueDate).subtract(i, 'days'));
        }
    }

    sendDates.forEach(date => {
        const cronTime = `0 9 ${date.date()} ${date.month() + 1} *`; // todo dia 9h


        cron.schedule(cronTime, () => {
            console.log(`Enviando cobrança programada para ${date.format('YYYY-MM-DD')}`);
            callback();
        }, {
            timezone: "America/Sao_Paulo"
        });
    });
}

module.exports = schedulePayment;