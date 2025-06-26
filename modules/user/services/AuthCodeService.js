const jwt = require('jsonwebtoken');

class AuthCodeService {

    constructor(AuthCodeRepository){
        this.AuthCodeRepository = AuthCodeRepository;
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