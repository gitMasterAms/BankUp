const { Router } = require('express');

// Importa os roteadores de cada módulo.
// Cada importação é uma função que espera a instância 'db'.
const createAuthRoutes = require('./modules/auth/authRoutes');
// const createFinancialRoutes = require('./modules/financial/financial.routes'); // Futuro módulo

// Exporta uma função que recebe a instância do DB e retorna o roteador principal.
// Isso permite que o app.js injete a instância do BD após a inicialização.
module.exports = (db) => {
  const router = Router();

  // Aplica os roteadores de cada módulo com seus prefixos.
  // Chama a função importada e passa a instância 'db'.
  router.use('/auth', createAuthRoutes(db)); // Ex: /auth/user/register, /auth/Profile, /auth/user/:id

  // Descomente e adicione conforme você criar os outros módulos:
  // appRouter.use('/financial', createFinancialRoutes(db)); // Ex: /financial/recurring-accounts, /financial/payments

  // Middleware para capturar rotas não encontradas (404 Not Found).
  // É crucial que este middleware seja o ÚLTIMO a ser adicionado ao appRouter,
  // garantindo que todas as rotas definidas acima sejam verificadas antes.
  router.use((req, res) => {
    res.status(404).json({ message: 'Recurso não encontrado. Verifique a URL e o método da requisição.' });
  });

  return router;
};