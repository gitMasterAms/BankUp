const express = require('express');
const UserRepository = require('./repositories/UserRepository');
const ClientRepository = require('./repositories/ClientRepository');

const UserService = require('./services/UserService');
const ClientService = require('./services/ClientService');

const UserController = require('./controllers/UserController');
const ClientController = require('./controllers/ClientController');

const { checkToken } = require('../../middlewares/checkToken');

module.exports = (db) => {
  const authRouter = express.Router();

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
  authRouter.get('/', (req, res) => {
    res.status(200).json({ msg: 'Bem vindo a nossa API!' });
  });

  // Rotas de autenticação (register / login)
  authRouter.post('/register', userController.register);
  authRouter.post('/login', userController.login);
  //Rota cadastro Cliente
  authRouter.post('/client', checkToken, clientController.register);

  // Rota protegida
  authRouter.get('/user/:id', checkToken, userController.getById);

  return authRouter;
};
