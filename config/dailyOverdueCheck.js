const cron = require('node-cron');
const PaymentsRepository = require('../modules/financial/repositories/PaymentsRepository');
const PaymentsService = require('../modules/financial/services/PaymentsService');
const RecurringAccountRepository = require('../modules/financial/repositories/RecurringRepository');
const RecurringAccountService = require('../modules/financial/services/RecurringService');

const startDailyJob = (db) => {
  cron.schedule('0 1 * * *', async () => {
    console.log('--- EXECUTANDO TAREFA AGENDADA DIÁRIA: Verificação de Pagamentos Vencidos ---');
    
    const { Payment, RecurringAccount } = db;

    const paymentsRepository = new PaymentsRepository(Payment);
    const recurringAccountRepository = new RecurringAccountRepository(RecurringAccount);
    const recurringAccountService = new RecurringAccountService(recurringAccountRepository);
    const paymentsService = new PaymentsService(paymentsRepository, recurringAccountService);

    try {
      await paymentsService.processOverduePayments();
      console.log('--- TAREFA AGENDADA DIÁRIA FINALIZADA COM SUCESSO ---');
    } catch (error) {
      console.error('--- ERRO NA EXECUÇÃO DA TAREFA AGENDADA DIÁRIA ---', error);
    }
  }, {
    scheduled: true,
    timezone: "America/Sao_Paulo"
  });

  console.log('✅ Tarefa diária de verificação de pagamentos vencidos foi agendada.');
};

module.exports = { startDailyJob };