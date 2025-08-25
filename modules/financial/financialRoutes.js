const express = require('express');

const RecurringRepository = require('./repositories/RecurringRepository');
const RecurringService = require('./services/RecurringService');
const PaymentsRepository = require('./repositories/PaymentsRepository'); 
const RecurringController = require('./controllers/RecurringController');

const { checkLoginToken } = require('../../middlewares/checkLoginToken');

module.exports = (db) => {
  const financialRouter = express.Router();

  // Instância do repositório
  const recurringRepository = new RecurringRepository(db.RecurringAccount);

   // Precisamos do modelo 'Payment' e 'RecurringAccount' para o PaymentsRepository
  const paymentsRepository = new PaymentsRepository(db.Payment, db.RecurringAccount);

  // 2. Instância do service (agora recebe os dois repositórios)
  const recurringService = new RecurringService(recurringRepository, paymentsRepository);

  // 3. Instância do controller
  const recurringController = new RecurringController(recurringService);

  // Rota de teste/ping
  financialRouter.get('/', (req, res) => {
    res.status(200).json({ msg: 'Serviço financeiro ativo!' });
  });

  // Rotas protegidas
  financialRouter.post('/recurring', checkLoginToken, recurringController.register);
  financialRouter.get('/recurring', checkLoginToken, recurringController.getAllByUser);
  financialRouter.get('/recurring/:id', checkLoginToken, recurringController.getById);
  financialRouter.put('/recurring/:id', checkLoginToken, recurringController.updateById);
  financialRouter.delete('/recurring/:id', checkLoginToken, recurringController.deleteById);
  // ---> NOVA ROTA PARA ATUALIZAR STATUS E CRIAR PAGAMENTO <---
  financialRouter.patch('/recurring/:id/status', checkLoginToken, recurringController.updateStatusAndPay);



  return financialRouter;
};
