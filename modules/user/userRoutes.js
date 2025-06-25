const express = require('express');
const UserRepository = require('./repositories/UserRepository');
const ProfileRepository = require('./repositories/ProfileRepository');

const UserService = require('./services/UserService');
const ProfileService = require('./services/ProfileService');

const UserController = require('./controllers/UserController');
const ProfileController = require('./controllers/ProfileController');

const { checkToken } = require('../../middlewares/checkToken');

module.exports = (db) => {
  const userRouter = express.Router();

  // 1. Use o modelo Sequelize db.User ao instanciar o repositório

  const userRepository = new UserRepository(db.User);
  const profileRepository = new ProfileRepository(db.Profile);

  // 2. Injete o repositório no service
  const userService = new UserService(userRepository);
  const profileService = new ProfileService(profileRepository, userRepository);

  // 3. Injete o service no controller
  const userController = new UserController(userService);
  const profileController = new ProfileController(profileService);

  // Rotas de autenticação (register / login)
  userRouter.post('/register', userController.register);
  userRouter.post('/login', userController.login);
  //Rota cadastro Profile
  userRouter.post('/profile', checkToken, profileController.register);
  // Rota protegida
  userRouter.get('/user/:id', checkToken, userController.getById);

  return userRouter;
};
