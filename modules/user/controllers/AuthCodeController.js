const validator = require('validator');

class AuthCodeController {

    constructor(authCodeService){
        this.authCodeService = authCodeService;
    }
    sendCode = async (req, res) => {
    const {userId, email, type} = req.body;

    if (!userId || !email || !type) {
      return res.status(422).json({msg: 'Envie todos os dados obrigatórios'});
    }
    const VALID_TYPES = ['login_verification', 'password_reset'];

    if (!type || !VALID_TYPES.includes(type)) {
    return res.status(400).json({ error: 'Tipo inválido' });
    }

    if (!validator.isEmail(email)) {
          return res.status(422).json({ msg: 'O email informado não é válido!' });
    }

    try {
      const result = await this.authCodeService.sendCode({ userId, email, type });
      return res.status(200).json({msg: 'Verificação por email efetuada com sucesso!', ...result});
    } catch (err) {
      //  if (err.message === 'CODIGO_NAO_ENCONTRADO') {
      //    return res.status(401).json({ msg: 'Código de autenticação inválido!' });
      //  }
      //  if(err.message === 'IDS_NAO_CONFEREM'){
      //   return res.status(401).json({msg: 'Código não pertence ao usuário informado.'});
      //  }
      return res.status(500).json({ msg: 'Erro interno no Servidor', err: err.message });
    }
  }

  verifyCode = async (req, res) => {
    const {twoFactorCode} = req.body;

    if (!twoFactorCode) {
      return res.status(422).json({msg: 'o código é obrigatório!'});
    }

    if (twoFactorCode.length != 6){
        return res.status(401).json({msg: 'Insira um código válido.'})
    }

    try {
      const userId = await this.authCodeService.verifyCode({ twoFactorCode });
      return res.status(200).json({
        msg: 'Verificação por email efetuada com sucesso!', userId});
    } catch (err) {
       if (err.message === 'CODIGO_NAO_ENCONTRADO') {
         return res.status(403).json({ msg: 'Código de autenticação inválido!' });
       }
       if(err.message === 'CODIGO_EXPIRADO'){
        return res.status(403).json({msg: 'Código expirou.'});
       }
      return res.status(500).json({ msg: 'Erro interno no Servidor' });
      
    }
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