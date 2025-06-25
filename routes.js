const { Router } = require('express');

// Importa os roteadores de cada módulo.
// Cada importação é uma função que espera a instância 'db'.
const createUserRoutes = require('./modules/user/userRoutes');
// const createFinancialRoutes = require('./modules/financial/financial.routes'); // Futuro módulo

// Exporta uma função que recebe a instância do DB e retorna o roteador principal.
// Isso permite que o app.js injete a instância do BD após a inicialização.
module.exports = (db) => {
  const router = Router();

  // Aplica os roteadores de cada módulo com seus prefixos.
  // Chama a função importada e passa a instância 'db'.
  router.use('/user', createUserRoutes(db)); // Ex: /user/register, /user/profile, 

  // Descomente e adicione conforme você criar os outros módulos:
  // appRouter.use('/financial', createFinancialRoutes(db)); // Ex: /financial/recurring-accounts, /financial/payments

  // Middleware para capturar rotas não encontradas (404 Not Found).
  // É crucial que este middleware seja o ÚLTIMO a ser adicionado ao appRouter,
  // garantindo que todas as rotas definidas acima sejam verificadas antes.

    // Rotas públicas
  router.get('/', (req, res) => {
    res.status(200).json({ msg: 'Bem vindo a nossa API!' });
  });

  router.use((req, res) => {
    res.status(404).json({ message: 'A URL USADA NÃO EXISTE NA NOSSA API.' });
  });

  return router;
};