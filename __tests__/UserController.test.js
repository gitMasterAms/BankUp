/* eslint-env jest */

// UserController.test.js

const UserController = require('../modules/user/controllers/UserController'); // Ajuste o caminho se necessário
const validator = require('validator');

// Mock da dependência 'validator'
// Nós simulamos o comportamento da biblioteca para não dependermos dela nos testes.
jest.mock('validator', () => ({
  isEmail: jest.fn(),
  isStrongPassword: jest.fn(),
  isUUID: jest.fn(),
}));

// Mock do UserService
// Criamos um objeto falso que simula o UserService.
// Cada método é uma função de mock do Jest para podermos controlar seu retorno.
const mockUserService = {
  register: jest.fn(),
  login: jest.fn(),
  getById: jest.fn(),
};

// Mock dos objetos de requisição (req) e resposta (res) do Express
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res); // Permite encadeamento: res.status(200).json(...)
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockRequest = (body = {}, params = {}) => ({
  body,
  params,
});

// Início da suíte de testes para o UserController
describe('UserController', () => {
  let userController;
  let req;
  let res;

  // beforeEach é executado antes de cada teste ('it')
  // Isso garante que os mocks e variáveis sejam resetados a cada teste.
  beforeEach(() => {
    userController = new UserController(mockUserService);
    res = mockResponse();
    jest.clearAllMocks(); // Limpa todas as chamadas e instâncias de mocks
  });

  // --- Testes para o método REGISTER ---
  describe('register', () => {
    it('deve registrar um usuário com sucesso e retornar status 201', async () => {
      // Arrange (Preparação)
      req = mockRequest({
        email: 'teste@exemplo.com',
        password: 'Password1!',
        confirmpassword: 'Password1!',
      });
      validator.isEmail.mockReturnValue(true);
      validator.isStrongPassword.mockReturnValue(true);
      mockUserService.register.mockResolvedValue(); // Simula que o serviço funcionou

      // Act (Ação)
      await userController.register(req, res);

      // Assert (Verificação)
      expect(mockUserService.register).toHaveBeenCalledWith({
        email: 'teste@exemplo.com',
        password: 'Password1!',
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Usuário cadastrado com sucesso.' });
    });

    it('deve retornar erro 422 se o email não for fornecido', async () => {
      req = mockRequest({ password: 'Password1!', confirmpassword: 'Password1!' });
      
      await userController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({ msg: 'O email é obrigatório!' });
    });

    it('deve retornar erro 422 se a senha for fraca', async () => {
      req = mockRequest({ email: 'teste@exemplo.com', password: '123', confirmpassword: '123' });
      validator.isEmail.mockReturnValue(true);
      validator.isStrongPassword.mockReturnValue(false); // Simulando senha fraca

      await userController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({ msg: 'A senha deve ser forte (mín. 8 caracteres, com letra maiúscula, minúscula, número e símbolo).' });
    });
    
    it('deve retornar erro 422 se as senhas não conferem', async () => {
        req = mockRequest({ email: 'teste@exemplo.com', password: 'Password1!', confirmpassword: 'diferente' });
        validator.isEmail.mockReturnValue(true);
        validator.isStrongPassword.mockReturnValue(true);

        await userController.register(req, res);

        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.json).toHaveBeenCalledWith({ msg: 'As senhas não conferem!' });
    });

    it('deve retornar erro 409 se o email já estiver em uso', async () => {
      req = mockRequest({ email: 'existente@exemplo.com', password: 'Password1!', confirmpassword: 'Password1!' });
      validator.isEmail.mockReturnValue(true);
      validator.isStrongPassword.mockReturnValue(true);
      // Simulamos que o serviço lança um erro específico
      mockUserService.register.mockRejectedValue(new Error('EMAIL_JA_EXISTE'));

      await userController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Este email já está em uso.' });
    });
  });

  // --- Testes para o método LOGIN ---
  describe('login', () => {
    it('deve fazer login com sucesso e retornar status 200 com token', async () => {
      req = mockRequest({ email: 'teste@exemplo.com', password: 'Password1!' });
      const loginResult = { token: 'meu.token.jwt', user: { id: '123', email: 'teste@exemplo.com' }};
      
      validator.isEmail.mockReturnValue(true);
      mockUserService.login.mockResolvedValue(loginResult);

      await userController.login(req, res);

      expect(mockUserService.login).toHaveBeenCalledWith({ email: 'teste@exemplo.com', password: 'Password1!' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        msg: 'Login efetuado com sucesso!',
        ...loginResult
      });
    });

    it('deve retornar erro 401 para credenciais inválidas', async () => {
        req = mockRequest({ email: 'teste@exemplo.com', password: 'senhaerrada' });
        validator.isEmail.mockReturnValue(true);
        mockUserService.login.mockRejectedValue(new Error('SENHA_INVALIDA'));

        await userController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Credenciais inválidas!' });
    });

    it('deve retornar erro 500 para falhas internas do servidor', async () => {
        req = mockRequest({ email: 'teste@exemplo.com', password: 'Password1!' });
        validator.isEmail.mockReturnValue(true);
        mockUserService.login.mockRejectedValue(new Error('ERRO_DE_BANCO')); // Um erro genérico

        await userController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Erro interno no Servidor' });
    });
  });

  // --- Testes para o método GETBYID ---
  describe('getById', () => {
    it('deve retornar um usuário com sucesso e status 200', async () => {
        const userId = 'a1b2c3d4-e5f6-7890-1234-567890abcdef';
        const userFound = { id: userId, email: 'encontrado@exemplo.com' };
        req = mockRequest({}, { id: userId }); // body vazio, params com id

        validator.isUUID.mockReturnValue(true);
        mockUserService.getById.mockResolvedValue(userFound);

        await userController.getById(req, res);

        expect(mockUserService.getById).toHaveBeenCalledWith(userId);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(userFound);
    });

    it('deve retornar erro 400 para um ID inválido', async () => {
        req = mockRequest({}, { id: '123' });
        validator.isUUID.mockReturnValue(false); // Simulando ID inválido

        await userController.getById(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'ID inválido' });
    });

    it('deve retornar erro 404 se o usuário não for encontrado', async () => {
        const userId = 'a1b2c3d4-e5f6-7890-1234-567890abcdef';
        req = mockRequest({}, { id: userId });

        validator.isUUID.mockReturnValue(true);
        mockUserService.getById.mockRejectedValue(new Error('USUARIO_NAO_ENCONTRADO'));
        
        await userController.getById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Usuário não encontrado' });
    });
  });
});