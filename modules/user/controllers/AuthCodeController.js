const validator = require('validator');

class AuthCodeController {

    constructor(authCodeService){
        this.authCodeService = authCodeService;
    }
    sendCode = async (req, res) => {
    const {email, type} = req.body;

    if ( !email || !type) {
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
      const result = await this.authCodeService.sendCode({ email, type });
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

  // CONTROLLER ATUALIZADO
    verifyCodeAndGetToken = async (req, res) => {
        const { userId, twoFactorCode } = req.body;

        // Suas validações estão ótimas
        if (!validator.isUUID(userId)) {
            return res.status(400).json({ msg: 'ID inválido' });
        }
        if (!twoFactorCode || twoFactorCode.length != 6) {
            return res.status(422).json({ msg: 'Insira um código de 6 dígitos.' });
        }

        try {
            const result = await this.authCodeService.verifyCodeAndGetToken({ userId, twoFactorCode });
            return res.status(200).json({
                msg: 'Verificação efetuada com sucesso!', ...result
            });
        } catch (err) {
            // --- BLOCO CATCH CORRIGIDO ---

            // Erros do cliente (Bad Request)
            const clientErrors = [
                'CODIGO_INVALIDO',
                'CODIGO_EXPIRADO',
                'TIPO_DE_CODIGO_INVALIDO'
            ];
            if (clientErrors.includes(err.message)) {
                // 400: O cliente enviou dados errados.
                return res.status(400).json({ msg: err.message });
            }

            // Erro por excesso de tentativas (Too Many Requests)
            const throttlingErrors = [
                'BLOQUEIO_TEMPORARIO',
                'CODIGO_INVALIDO_BLOQUEIO'
            ];
            if (throttlingErrors.includes(err.message)) {
                // 429: O cliente tentou demais e foi bloqueado.
                return res.status(429).json({ msg: err.message });
            }
            
            // Cooldown para pedir novo código
            if (err.message.startsWith('COOLDOWN')) {
                // 429: Também é um tipo de "tente mais tarde".
                return res.status(429).json({ msg: err.message });
            }

            // Se não for nenhum dos erros esperados, é um erro do servidor.
            console.error('ERRO INTERNO NO AUTH CONTROLLER:', err); // Log para debug
            return res.status(500).json({ msg: 'Erro interno no Servidor' });
        }
    }  

  passwordReset = async (req, res) => {
    const { newPassword } = req.body;
    const userId = req.id;
    console.log(userId);

    if (!userId) {
      return res.status(422).json({msg: 'o código é obrigatório!'});
    }

    if (!newPassword) {
          return res
            .status(422)
            .json({ msg: 'A senha é obrigatória!' });
        }
    
        // Verifica se a senha é forte
        if (
          !validator.isStrongPassword(newPassword, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
          })
        ) {
          return res.status(422).json({
            msg: 'A senha deve ser forte (mín. 8 caracteres, com letra maiúscula, minúscula, número e símbolo).',
          });
        }

    try {
      const result = await this.authCodeService.passwordReset({ userId, newPassword });
      return res.status(200).json({msg: 'Verificação por email efetuada com sucesso!',...result});
    } catch (err) {
       if (err.message === 'CODIGO_NAO_ENCONTRADO') {
         return res.status(401).json({ msg: 'Código de autenticação não existe.'});
       }
       if (err.message === 'JWT_SECRET_NAO_DEFINIDO') {
        return res.status(500).json({msg: 'Erro na criação de token para login.'});
       }
      return res.status(500).json({ msg: 'Erro interno no Servidor' });
    }
  }
}

module.exports = AuthCodeController;