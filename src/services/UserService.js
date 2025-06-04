// src/services/UserService.js
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
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

      const token = jwt.sign({ id: user.id }, process.env.SECRET, {
        expiresIn: '15m',
      });
      
      return { id: user.id, token };
      

    } catch (err) {
      if (err.message !== 'SENHA_INVALIDA' && err.message !== 'EMAIL_NAO_ENCONTRADO') {
        console.error('UserService.login ERRO:', err);
      }
      throw err;
    }
  }

}

module.exports = UserService;
