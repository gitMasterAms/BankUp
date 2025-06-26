const validator = require('validator');

class AuthCodeController {

    constructor(authCodeService){
        this.authCodeService = authCodeService;
    }
    
  verifyLogin = async (req, res) => {
    const {userId, twoFactorCode} = req.body;

    if (!userId || !twoFactorCode) {
      return res.status(422).json({msg: 'o código é obrigatório!'});
    }

    if (twoFactorCode.length != 6){
        return res.status(401).json({msg: 'Insira um código válido.'})
    }

    try {
      const result = await this.authCodeService.verifyLogin({ userId, twoFactorCode });
      return res.status(200).json({
        msg: 'Verificação por email efetuada com sucesso!',
        ...result,
      });
    } catch (err) {
       if (err.message === 'CODIGO_NAO_ENCONTRADO') {
         return res.status(401).json({ msg: 'Código de autenticação inválido!' });
       }
       if(err.message === 'IDS_NAO_CONFEREM'){
        return res.status(401).json({msg: 'Código não pertence ao usuário informado.'});
       }
      return res
        .status(500)
        .json({ msg: 'Erro interno no Servidor' });
    }
  }
}

module.exports = AuthCodeController;