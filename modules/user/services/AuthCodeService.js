const jwt = require('jsonwebtoken');
const sendEmail = require('../../../utils/SendEmail')
const EmailService = new sendEmail();

class AuthCodeService {

    constructor(AuthCodeRepository){
        this.AuthCodeRepository = AuthCodeRepository;
    }
    
    async sendCode({userId, email, type}){
try{
  
  await this.AuthCodeRepository.delete({userId});
  

  const authCode = Math.floor(100000 + Math.random() * 900000).toString();

  await this.AuthCodeRepository.create({
    userId,
    code: authCode,
    type,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000) 
  });

  const title = 'Código de verificação do BANKUP';
   const content = `
                    <p>Prezado usuário do BANKUP,</p>
                    <p>Recebemos uma solicitação para acessar sua Conta do BANKUP usando seu endereço de e-mail. Seu código de verificação do BANKUP é:</p>
                    <h1>${authCode}</h1>
                    <br>
                    <p>Se você não solicitou este código, é possível que outra pessoa esteja tentando acessar a Conta do BANKUP. <strong>Não encaminhe ou dê o código a ninguém.<strong></p>
                    <p>Atenciosamente,</p>
                    <p>Equipe BANKUP</p>
                `;

await EmailService.sendEmail(email, title, content);
  return {userId};
}catch(err){
 throw err;
}
    };

    async verifyCode({ twoFactorCode}) {
    try{
      const verification = await this.AuthCodeRepository.findByTwoFactorCode(twoFactorCode);
      
      if (!verification) {
        throw new Error('CODIGO_NAO_ENCONTRADO');
      }
    const dateNow = new Date(Date.now());

    if (verification.expiresAt < dateNow){
      throw new Error('CODIGO_EXPIRADO');
    }

      
         

      return verification.userId;
      
   

    } catch (err){
      if (process.env.NODE_ENV !== 'production') {
        console.error('UserService.register ERRO:', err);
      }
          throw err;
    }
  }
    
   async verifyLogin({userId, twoFactorCode}) {
    try{
      const verification = await this.AuthCodeRepository.findByTwoFactorCode(twoFactorCode);
      if (!verification) {
        throw new Error('CODIGO_NAO_ENCONTRADO');
      }
      if (verification.userId != userId){
        throw new Error('IDS_NAO_CONFEREM')
      }

      const token = jwt.sign({ id: userId }, process.env.SECRET, {
        expiresIn: '1d',
      });

      return {token};

    } catch (err){
        console.error('UserService.register ERRO:', err);
          throw err;
    }
  }
}

module.exports = AuthCodeService;