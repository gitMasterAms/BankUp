const express = require('express');
const UserRepository = require('./src/repositories/UserRepository');
const UserService    = require('./src/services/UserService');
const UserController = require('./src/controllers/UserController');
const { checkToken } = require('./src/middlewares/checkToken');

module.exports = (db) => {
  const router = express.Router();

  // 1. Use o modelo Sequelize db.User ao instanciar o repositório
  const userRepository = new UserRepository(db.User);

  // 2. Injete o repositório no service
  const userService = new UserService(userRepository);

  // 3. Injete o service no controller
  const userController = new UserController(userService);  
  
  // Rotas públicas
  router.get('/', (req, res) => {
    res.status(200).json({ msg: 'Bem vindo a nossa API!' });
  });

  // Rotas de autenticação (register / login)
  router.post('/user/register', userController.register);
  router.post('/user/login', userController.login);

  // Rota protegida
  router.get('/user/:id', checkToken, userController.getById);

  //Middleware para capturar rotas indefinidas (sempre como a última rota para não engolir erros específicos).
  router.use((req, res) => {
  res.status(404).json({ msg: 'Rota indefinida.' });
});

  return router;
};
