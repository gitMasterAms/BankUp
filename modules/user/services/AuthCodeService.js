const jwt = require('jsonwebtoken');
const sendEmail = require('../../../utils/SendEmail')
const EmailService = new sendEmail();

class AuthCodeService {

    constructor(AuthCodeRepository){
        this.AuthCodeRepository = AuthCodeRepository;
    }
    
    async sendCode({userId, email, type}){
      try{

        const twoFactorCode = Math.floor(100000 + Math.random() * 900000).toString();

        const title = 'Código de verificação do BANKUP';
        const content = `
                    <p>Prezado usuário do BANKUP,</p>
                    <p>Recebemos uma solicitação para acessar sua Conta do BANKUP usando seu endereço de e-mail. Seu código de verificação do BANKUP é:</p>
                    <h1>${twoFactorCode}</h1>
                    <br>
                    <p>Se você não solicitou este código, é possível que outra pessoa esteja tentando acessar a Conta do BANKUP. <strong>Não encaminhe ou dê o código a ninguém.<strong></p>
                    <p>Atenciosamente,</p>
                    <p>Equipe BANKUP</p>
                `;

        await EmailService.sendEmail(email, title, content);

        await this.AuthCodeRepository.delete({userId});
        
        await this.AuthCodeRepository.create({
            userId,
            twoFactorCode,
            type,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000) 
          });

  return {userId};
}catch (err) {
  if (process.env.NODE_ENV !== 'production') {
    console.error('AuthCodeService.sendCode ERRO:', err);
  }
  throw err;
}

    };

    async verifyCode({ userId, twoFactorCode}) {
    try{

      const verification = await this.AuthCodeRepository.findByTwoFactorCode({userId, twoFactorCode});
     
      if (!verification) {
        throw new Error('CODIGO_NAO_ENCONTRADO');
      }
    const dateNow = new Date(Date.now());

    if (verification.expiresAt < dateNow){
      throw new Error('CODIGO_EXPIRADO');
    }      
        const { type } = verification;

      return {userId, type};
      
   

    } catch (err){
      if (process.env.NODE_ENV !== 'production') {
        console.error('AuthCodeService.verifyCode ERRO:', err);
      }
          throw err;
    }
  }
    
    async verifyLogin({userId}) {
      try{      

        const deleted = await this.AuthCodeRepository.delete({ userId });
        if (!deleted) {
          throw new Error('CODIGO_NAO_ENCONTRADO');
        }

        if (!process.env.SECRET) {
          throw new Error('JWT_SECRET_NAO_DEFINIDO');
        }

        const token = jwt.sign({ id: userId }, process.env.SECRET, {
            expiresIn: '1d',
        });

        return {token};

      } catch (err) {
  if (process.env.NODE_ENV !== 'production') {
    console.error('AuthCodeService.verifyLogin ERRO:', err);
  }
  throw err;
}

    }
}

module.exports = AuthCodeService;