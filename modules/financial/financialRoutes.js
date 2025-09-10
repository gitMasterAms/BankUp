const express = require('express');


const RecurringController = require('./controllers/RecurringController');
const RecurringService = require('./services/RecurringService');
const RecurringRepository = require('./repositories/RecurringRepository');

const PaymentsController = require('./controllers/PaymentsController');
const PaymentsService = require('./services/PaymentsService');
const PaymentsRepository = require('./repositories/PaymentsRepository');

const { checkLoginToken } = require('../../middlewares/checkLoginToken');

module.exports = (db) => {
  const financialRouter = express.Router();

  // Instâncias dos repositórios
  const recurringRepository = new RecurringRepository(db.RecurringAccount);
  const paymentsRepository = new PaymentsRepository(db.Payment, db.RecurringAccount);

  // Instâncias dos services
  const recurringService = new RecurringService(recurringRepository);
  const paymentsService = new PaymentsService(paymentsRepository, recurringService);

  // Instâncias dos controllers
  const recurringController = new RecurringController(recurringService);
  const paymentsController = new PaymentsController(paymentsService);

  // Rota de teste
  financialRouter.get('/', (req, res) => {
    res.status(200).json({ msg: 'Serviço financeiro ativo!' });
  });

  // Rotas Contas Recorrentes
  financialRouter.post('/recurring', checkLoginToken, recurringController.register);
  financialRouter.get('/recurring', checkLoginToken, recurringController.getAllByUser);
  financialRouter.get('/recurring/:id', checkLoginToken, recurringController.getById);
  financialRouter.put('/recurring/:id', checkLoginToken, recurringController.updateById);
  financialRouter.delete('/recurring/:id', checkLoginToken, recurringController.deleteById);
  // financialRouter.patch('/recurring/:id/status', checkLoginToken, recurringController.updateStatusAndPay); // ativada

  // Rotas Pagamentos
  financialRouter.post('/payments', checkLoginToken, paymentsController.register);
  financialRouter.get('/payments', checkLoginToken, paymentsController.getAll)
  financialRouter.get('/recurring/:account_id/payments', checkLoginToken, paymentsController.getAllByRecurring);
  financialRouter.get('/payments/:payment_id', checkLoginToken, paymentsController.getById);
  financialRouter.put('/payments/:payment_id', checkLoginToken, paymentsController.updateById);
  financialRouter.delete('/payments/:payment_id', checkLoginToken, paymentsController.deleteById);

  return financialRouter;
};
