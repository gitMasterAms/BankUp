const express = require('express');
const UserRepository = require('./src/repositories/UserRepository');
const ClientRepository = require('./src/repositories/ClientRepository')

const UserService    = require('./src/services/UserService');
const ClientService = require('./src/services/ClientService')

const UserController = require('./src/controllers/UserController');
const ClientController = require('./src/controllers/ClientController');

const { checkToken } = require('./src/middlewares/checkToken');

module.exports = (db) => {
  const router = express.Router();

  // 1. Use o modelo Sequelize db.User ao instanciar o repositório
  
  const userRepository = new UserRepository(db.User); 
  const clientRepository = new ClientRepository(db.Client);
  
  // 2. Injete o repositório no service
  const userService = new UserService(userRepository);  
  const clientService = new ClientService(clientRepository, userRepository);

  // 3. Injete o service no controller
  const userController = new UserController(userService);  
  const clientController = new ClientController(clientService);
  
  // Rotas públicas
  router.get('/', (req, res) => {
    res.status(200).json({ msg: 'Bem vindo a nossa API!' });
  });

  // Rotas de autenticação (register / login)
  router.post('/user/register', userController.register);
  router.post('/user/login', userController.login);

  //Rota cadastro Cliente
  router.post('/client', checkToken, clientController.register);

  // Rota protegida
  router.get('/user/:id', checkToken, userController.getById);

  //Middleware para capturar rotas indefinidas (sempre como a última rota para não engolir erros específicos).
  router.use((req, res) => {
  res.status(404).json({ msg: 'Rota indefinida.' });
});

  return router;
};
