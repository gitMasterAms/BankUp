require('dotenv').config();
const bcrypt = require('bcrypt');

class UserService {
  constructor(userRepository, authCodeRepository) {
    this.userRepository = userRepository;
    this.authCodeRepository = authCodeRepository;
  }

  async register({ email, password }) {
    try {      
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) {
        throw new Error('EMAIL_JA_EXISTE');
      }
     
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);      

      
       await this.userRepository.create({
        email,
        password: passwordHash,
      });   

      
     
    } catch (err) {
      console.error('UserService.register ERRO:', err);
      throw err;
    }
  }

  async login({ email, password }) {
    try {
      const user = await this.userRepository.findByEmail(email);
      
      if (!user) {
        throw new Error('EMAIL_NAO_ENCONTRADO');
      }      

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new Error('SENHA_INVALIDA');
      }

      return {profile_complete: user.profile_complete, id: user.id};
      

    } catch (err) {
      if (err.message !== 'SENHA_INVALIDA' && err.message !== 'EMAIL_NAO_ENCONTRADO') {
        console.error('UserService.login ERRO:', err);
      }
      throw err;
    }
  }

  async getById(id) {
    try {      
      const user = await this.userRepository.getById(id);

      if (!user) {
        throw new Error('USUARIO_NAO_ENCONTRADO');
      }      
      return user;  
    } catch (err) {
      if (err.message !== 'USUARIO_NAO_ENCONTRADO'){ // Boa prática para só salvar erros inesperados no log (Diferente de um 404, que é apenas um user não encontrado).
      console.error('UserService.getById ERRO:', err);   
      }
      throw err;
    }
  }
}

module.exports = UserService;
