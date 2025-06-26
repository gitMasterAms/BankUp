require('dotenv').config();
const bcrypt = require('bcrypt');
const sendEmail = require('../../../utils/SendEmail')
const EmailService = new sendEmail();

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
    console.log(email)
    try {
      const user = await this.userRepository.findByEmail(email);
      
      if (!user) {
        throw new Error('EMAIL_NAO_ENCONTRADO');
      }      

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new Error('SENHA_INVALIDA');
      }

      // Gera um token aleatório de 6 dígitos
      const authCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      await this.authCodeRepository.create({
        userId: user.id,
        type: 'login_verification',
        code: authCode,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000)});

        const title = 'Seu Token de Acesso';
        const content = `
                    <h1>Seu Token de Acesso</h1>
                    <p>Olá! Aqui está seu token de acesso:</p>
                    <h2>${authCode}</h2>
                    <p>Este token é válido por 1 hora.</p>
                    <p>Se você não solicitou este token, por favor ignore este e-mail.</p>
                `;
      await EmailService.sendEmail(email, title, content);

      // const token = jwt.sign({ id: user.id }, process.env.SECRET, {
      //   expiresIn: '1d',
      // });
      
      console.log(authCode);
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
