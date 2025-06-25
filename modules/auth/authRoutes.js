const express = require('express');
const UserRepository = require('./repositories/UserRepository');
const ProfileRepository = require('./repositories/ProfileRepository');

const UserService = require('./services/UserService');
const ProfileService = require('./services/ProfileService');

const UserController = require('./controllers/UserController');
const ProfileController = require('./controllers/ProfileController');

const { checkToken } = require('../../middlewares/checkToken');

module.exports = (db) => {
  const authRouter = express.Router();

  // 1. Use o modelo Sequelize db.User ao instanciar o repositório

  const userRepository = new UserRepository(db.User);
  const profileRepository = new ProfileRepository(db.Profile);

  // 2. Injete o repositório no service
  const userService = new UserService(userRepository);
  const profileService = new ProfileService(profileRepository, userRepository);

  // 3. Injete o service no controller
  const userController = new UserController(userService);
  const profileController = new ProfileController(profileService);

  // Rotas públicas
  authRouter.get('/', (req, res) => {
    res.status(200).json({ msg: 'Bem vindo a nossa API!' });
  });

  // Rotas de autenticação (register / login)
  authRouter.post('/register', userController.register);
  authRouter.post('/login', userController.login);
  //Rota cadastro Profile
  authRouter.post('/profile', checkToken, profileController.register);
  // Rota protegida
  authRouter.get('/user/:id', checkToken, userController.getById);

  return authRouter;
};
