/* eslint-env jest */

/ ProfileController.test.js */

const ProfileController = require('../modules/user/controllers/ProfileController'); // <-- AJUSTE O CAMINHO se necessário
const validator = require('validator');

// Mock da dependência 'validator'
jest.mock('validator', () => ({
  isUUID: jest.fn(),
  isMobilePhone: jest.fn(),
  isDate: jest.fn(),
}));

// Mock do ProfileService
const mockProfileService = {
  register: jest.fn(),
};

// --- Funções Auxiliares para Mocks (reutilizadas do outro teste) ---

// Mock do objeto de resposta (res) do Express
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// Mock do objeto de requisição (req), agora incluindo o 'id'
const mockRequest = (body = {}, id = null) => ({
  body,
  id, // Adicionado para simular o ID do usuário vindo do middleware
});

// --- Início da Suíte de Testes para o ProfileController ---
describe('ProfileController', () => {
  let profileController;
  let req;
  let res;

  // Executado antes de cada teste para garantir um ambiente limpo
  beforeEach(() => {
    profileController = new ProfileController(mockProfileService);
    res = mockResponse();
    jest.clearAllMocks(); // Limpa os mocks entre os testes
  });

  // --- Testes para o método REGISTER ---
  describe('register', () => {
    const validUserId = 'a1b2c3d4-e5f6-7890-1234-567890abcdef';
    const validBody = {
      name: 'Eduardo Teste',
      cpf_cnpj: '123.456.789-00',
      phone: '11987654321',
      address: 'Rua dos Testes, 123',
      birthdate: '2005-01-01',
    };

    it('deve registrar um perfil com sucesso e retornar status 201', async () => {
      // Arrange (Preparação)
      req = mockRequest(validBody, validUserId);
      validator.isUUID.mockReturnValue(true);
      validator.isMobilePhone.mockReturnValue(true);
      validator.isDate.mockReturnValue(true);
      mockProfileService.register.mockResolvedValue(); // Simula sucesso no serviço

      // Act (Ação)
      await profileController.register(req, res);

      // Assert (Verificação)
      expect(mockProfileService.register).toHaveBeenCalledWith({
        userId: validUserId,
        ...validBody,
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Usuário cadastrado com sucesso.' });
    });

    it('deve retornar erro 400 se o ID do usuário for inválido', async () => {
      req = mockRequest(validBody, 'id-invalido');
      validator.isUUID.mockReturnValue(false); // Simulando ID inválido

      await profileController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ msg: 'ID inválido' });
    });

    it('deve retornar erro 422 se algum campo obrigatório estiver faltando', async () => {
      const incompleteBody = { ...validBody, name: '' }; // Removendo o nome
      req = mockRequest(incompleteBody, validUserId);
      validator.isUUID.mockReturnValue(true);

      await profileController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Preencha todos os campos obrigatórios!' });
    });

    it('deve retornar erro 422 se o telefone for inválido', async () => {
      req = mockRequest(validBody, validUserId);
      validator.isUUID.mockReturnValue(true);
      validator.isMobilePhone.mockReturnValue(false); // Simulando telefone inválido
      validator.isDate.mockReturnValue(true);
      
      await profileController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({ msg: 'O telefone informado não é válido!' });
    });

    it('deve retornar erro 422 se a data de nascimento for inválida', async () => {
        req = mockRequest(validBody, validUserId);
        validator.isUUID.mockReturnValue(true);
        validator.isMobilePhone.mockReturnValue(true);
        validator.isDate.mockReturnValue(false); // Simulando data inválida
        
        await profileController.register(req, res);
  
        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.json).toHaveBeenCalledWith({ msg: 'A data de nascimento informado não é válido!' });
    });

    it('deve retornar erro 409 se o perfil para aquele usuário já existe', async () => {
      req = mockRequest(validBody, validUserId);
      validator.isUUID.mockReturnValue(true);
      validator.isMobilePhone.mockReturnValue(true);
      validator.isDate.mockReturnValue(true);
      mockProfileService.register.mockRejectedValue(new Error('PERFIL_JA_EXISTE'));

      await profileController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Este usuário já completou seu cadastro de perfil.' });
    });

    it('deve retornar erro 409 se o CPF/CNPJ já estiver em uso', async () => {
        req = mockRequest(validBody, validUserId);
        validator.isUUID.mockReturnValue(true);
        validator.isMobilePhone.mockReturnValue(true);
        validator.isDate.mockReturnValue(true);
        mockProfileService.register.mockRejectedValue(new Error('CPFCNPJ_JA_EXISTE'));
  
        await profileController.register(req, res);
  
        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Este CPF / CPNJ já está em uso.' });
    });

    it('deve retornar erro 500 para um erro genérico do servidor', async () => {
        req = mockRequest(validBody, validUserId);
        validator.isUUID.mockReturnValue(true);
        validator.isMobilePhone.mockReturnValue(true);
        validator.isDate.mockReturnValue(true);
        mockProfileService.register.mockRejectedValue(new Error('ERRO_INESPERADO'));
  
        await profileController.register(req, res);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Erro ao cadastrar usuário' });
    });
  });
});