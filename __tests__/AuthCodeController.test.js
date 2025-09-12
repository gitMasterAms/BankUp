// AuthCodeController.test.js

const AuthCodeController = require('../modules/user/controllers/AuthCodeController'); // <-- AJUSTE O CAMINHO se necessário
const validator = require('validator');

// Mock da dependência 'validator'
jest.mock('validator', () => ({
  isEmail: jest.fn(),
  isUUID: jest.fn(),
  isStrongPassword: jest.fn(),
}));

// Mock do AuthCodeService, agora com todos os métodos necessários
const mockAuthCodeService = {
  sendCode: jest.fn(),
  verifyCodeAndGetToken: jest.fn(),
  passwordReset: jest.fn(),
};

// --- Funções Auxiliares para Mocks (reutilizadas) ---

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockRequest = (body = {}, id = null) => ({
  body,
  id,
});

// --- Início da Suíte de Testes para o AuthCodeController ---
describe('AuthCodeController', () => {
  let authController;
  let req;
  let res;

  beforeEach(() => {
    authController = new AuthCodeController(mockAuthCodeService);
    res = mockResponse();
    jest.clearAllMocks(); // Essencial para limpar os mocks entre testes
  });

  // --- Testes para o método SENDCODE ---
  describe('sendCode', () => {
    const validBody = { userId: 'some-user-id', email: 'teste@exemplo.com', type: 'login_verification' };

    it('deve enviar um código com sucesso e retornar status 200', async () => {
      // Arrange
      req = mockRequest(validBody);
      validator.isEmail.mockReturnValue(true);
      mockAuthCodeService.sendCode.mockResolvedValue({ messageId: '123' });

      // Act
      await authController.sendCode(req, res);

      // Assert
      expect(mockAuthCodeService.sendCode).toHaveBeenCalledWith(validBody);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Verificação por email efetuada com sucesso!', messageId: '123' });
    });

    it('deve retornar erro 422 se faltarem dados obrigatórios', async () => {
      req = mockRequest({ userId: '123' }); // Body incompleto
      await authController.sendCode(req, res);
      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Envie todos os dados obrigatórios' });
    });
    
    it('deve retornar erro 400 se o tipo for inválido', async () => {
        req = mockRequest({ ...validBody, type: 'tipo_invalido' });
        await authController.sendCode(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Tipo inválido' });
      });

    it('deve retornar erro 422 se o email for inválido', async () => {
      req = mockRequest(validBody);
      validator.isEmail.mockReturnValue(false); // Simulando email inválido
      await authController.sendCode(req, res);
      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({ msg: 'O email informado não é válido!' });
    });
  });

  // --- Testes para o método VERIFYCODEANDGETTOKEN ---
  describe('verifyCodeAndGetToken', () => {
    const validUserId = 'a1b2c3d4-e5f6-7890-1234-567890abcdef';
    const validBody = { userId: validUserId, twoFactorCode: '123456' };

    it('deve verificar o código com sucesso e retornar um token', async () => {
      req = mockRequest(validBody);
      validator.isUUID.mockReturnValue(true);
      const serviceResult = { token: 'meu.jwt.token' };
      mockAuthCodeService.verifyCodeAndGetToken.mockResolvedValue(serviceResult);

      await authController.verifyCodeAndGetToken(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Verificação efetuada com sucesso!', ...serviceResult });
    });

    it('deve retornar erro 400 para um ID de usuário inválido', async () => {
      req = mockRequest({ ...validBody, userId: 'id-invalido' });
      validator.isUUID.mockReturnValue(false);
      await authController.verifyCodeAndGetToken(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ msg: 'ID inválido' });
    });

    it('deve retornar erro 422 para um código com formato inválido', async () => {
      req = mockRequest({ ...validBody, twoFactorCode: '123' });
      validator.isUUID.mockReturnValue(true);
      await authController.verifyCodeAndGetToken(req, res);
      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Insira um código de 6 dígitos.' });
    });

    // Testando os diversos tipos de erro do serviço
    const clientErrors = ['CODIGO_INVALIDO', 'CODIGO_EXPIRADO', 'TIPO_DE_CODIGO_INVALIDO'];
    clientErrors.forEach((error) => {
      it(`deve retornar erro 400 para o erro de serviço: ${error}`, async () => {
        req = mockRequest(validBody);
        validator.isUUID.mockReturnValue(true);
        mockAuthCodeService.verifyCodeAndGetToken.mockRejectedValue(new Error(error));
        await authController.verifyCodeAndGetToken(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: error });
      });
    });

    const throttlingErrors = ['BLOQUEIO_TEMPORARIO', 'CODIGO_INVALIDO_BLOQUEIO'];
    throttlingErrors.forEach((error) => {
        it(`deve retornar erro 429 para o erro de serviço: ${error}`, async () => {
            req = mockRequest(validBody);
            validator.isUUID.mockReturnValue(true);
            mockAuthCodeService.verifyCodeAndGetToken.mockRejectedValue(new Error(error));
            await authController.verifyCodeAndGetToken(req, res);
            expect(res.status).toHaveBeenCalledWith(429);
            expect(res.json).toHaveBeenCalledWith({ msg: error });
        });
    });

    it('deve retornar erro 500 para um erro de servidor inesperado', async () => {
        req = mockRequest(validBody);
        validator.isUUID.mockReturnValue(true);
        mockAuthCodeService.verifyCodeAndGetToken.mockRejectedValue(new Error('ERRO_DE_BANCO'));
        await authController.verifyCodeAndGetToken(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Erro interno no Servidor' });
    });
  });

  // --- Testes para o método PASSWORDRESET ---
  describe('passwordReset', () => {
    const validUserId = 'a1b2c3d4-e5f6-7890-1234-567890abcdef';
    const validBody = { newPassword: 'Password1!' };

    it('deve redefinir a senha com sucesso e retornar status 200', async () => {
      req = mockRequest(validBody, validUserId);
      validator.isStrongPassword.mockReturnValue(true);
      mockAuthCodeService.passwordReset.mockResolvedValue({ success: true });

      await authController.passwordReset(req, res);

      expect(mockAuthCodeService.passwordReset).toHaveBeenCalledWith({ userId: validUserId, newPassword: 'Password1!' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ msg: 'Verificação por email efetuada com sucesso!' }));
    });
    
    it('deve retornar erro 422 se a nova senha não for fornecida', async () => {
      req = mockRequest({ newPassword: '' }, validUserId);
      await authController.passwordReset(req, res);
      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({ msg: 'A senha é obrigatória!' });
    });
    
    it('deve retornar erro 422 se a senha for fraca', async () => {
      req = mockRequest(validBody, validUserId);
      validator.isStrongPassword.mockReturnValue(false); // Simulando senha fraca
      await authController.passwordReset(req, res);
      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ msg: expect.stringContaining('A senha deve ser forte') }));
    });
    
    it('deve retornar erro 401 se o código de autenticação não for encontrado', async () => {
      req = mockRequest(validBody, validUserId);
      validator.isStrongPassword.mockReturnValue(true);
      mockAuthCodeService.passwordReset.mockRejectedValue(new Error('CODIGO_NAO_ENCONTRADO'));
      await authController.passwordReset(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Código de autenticação não existe.' });
    });
    
    it('deve retornar erro 500 se a JWT Secret não estiver definida', async () => {
      req = mockRequest(validBody, validUserId);
      validator.isStrongPassword.mockReturnValue(true);
      mockAuthCodeService.passwordReset.mockRejectedValue(new Error('JWT_SECRET_NAO_DEFINIDO'));
      await authController.passwordReset(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Erro na criação de token para login.' });
    });
  });
});