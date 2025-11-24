const express = require('express');
const UserRepository = require('./repositories/UserRepository');
const ProfileRepository = require('./repositories/ProfileRepository');
const AuthCodeRepository = require('./repositories/AuthCodeRepository');

const UserService = require('./services/UserService');
const ProfileService = require('./services/ProfileService');
const AuthCodeService = require('./services/AuthCodeService');

const UserController = require('./controllers/UserController');
const ProfileController = require('./controllers/ProfileController');
const AuthCodeController = require('./controllers/AuthCodeController');

const { checkLoginToken } = require('../../middlewares/checkLoginToken');
const { checkResetToken } = require('../../middlewares/checkResetToken');

module.exports = (db) => {
  const userRouter = express.Router();

  // 1. Use o modelo Sequelize db.User ao instanciar o repositório

  const userRepository = new UserRepository(db.User);
  const profileRepository = new ProfileRepository(db.Profile);
  const authCodeRepository = new AuthCodeRepository(db.AuthCode);

  // 2. Injete o repositório no service
  const userService = new UserService(userRepository, authCodeRepository);
  const profileService = new ProfileService(profileRepository, userRepository);
  const authCodeService = new AuthCodeService(authCodeRepository, userRepository);
  // 3. Injete o service no controller
  const userController = new UserController(userService);
  const profileController = new ProfileController(profileService);
  const authCodeController = new AuthCodeController(authCodeService);

  // rota verifica se o token é válido
  userRouter.get('/check', checkLoginToken, (req, res) => {
  // Se chegou aqui, token é válido
  res.json({ valid: true, userId: req.id });
});

  // Rotas de autenticação (register / login)
  userRouter.post('/register', userController.register);
  userRouter.post('/login', userController.login);

  // Rotas com o código de autenticação
  userRouter.post('/send-code', authCodeController.sendCode);
  userRouter.post('/verify-code', authCodeController.verifyCodeAndGetToken);
  userRouter.post('/password-reset', checkResetToken, authCodeController.passwordReset);

  //Rota cadastro Profile
  userRouter.post('/profile', checkLoginToken, profileController.register);
  userRouter.patch('/profile', checkLoginToken, profileController.update);
  userRouter.get('/profile', checkLoginToken, profileController.getProfile);
  // Rota protegida
  userRouter.get('/user/:id', checkLoginToken, userController.getById);

  return userRouter;
};
