const validator = require('validator');

class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  register = async (req, res) => {
    let { email, password, confirmpassword } = req.body;
    email = email.toLowerCase();

    if (!email) {
      return res
        .status(422)
        .json({ msg: 'O email é obrigatório!' });
    }

    if (!validator.isEmail(email)) {
      return res
        .status(422)
        .json({ msg: 'O email informado não é válido!' });
    }

    if (!password) {
      return res
        .status(422)
        .json({ msg: 'A senha é obrigatória!' });
    }

    // Verifica se a senha é forte
    if (
      !validator.isStrongPassword(password, {
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

    // Verifica se as senhas conferem
    if (password !== confirmpassword) {
      return res
        .status(422)
        .json({ msg: 'As senhas não conferem!' });
    }

    try {
      await this.userService.register({ email, password });
      return res
        .status(201)
        .json({ msg: 'Usuário cadastrado com sucesso.' });
    } catch (err) {
      console.error('Erro ao cadastrar usuário:', err); // log do erro completo
      if (err.message === 'EMAIL_JA_EXISTE') {
        return res
          .status(409)
          .json({ msg: 'Este email já está em uso.' });
      }
      return res.status(500).json({
        msg: 'Erro ao cadastrar usuário',
        error: err.message,
      });
    }
  };

  login = async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
      return res
        .status(422)
        .json({ msg: 'O email é obrigatório!' });
    }

    if (!validator.isEmail(email)) {
      return res
        .status(422)
        .json({ msg: 'O email informado não é válido!' });
    }

    if (!password) {
      return res
        .status(422)
        .json({ msg: 'A senha é obrigatória!' });
    }

    try {
      const result = await this.userService.login(req.body);
      return res.status(200).json({
        msg: 'Login efetuado com sucesso!',
        ...result,
      });
    } catch (err) {
      if (
        err.message === 'EMAIL_NAO_ENCONTRADO' ||
        err.message === 'SENHA_INVALIDA'
      ) {
        return res
          .status(401)
          .json({ msg: 'Credenciais inválidas!' });
      }
      return res
        .status(500)
        .json({ msg: 'Erro interno no Servidor' });
    }
  };

  getById = async (req, res) => {
    const id = req.params.id;

    if (!validator.isUUID(id)) {
      return res.status(400).json({ msg: 'ID inválido' });
    }

    try {
      const result = await this.userService.getById(id);
      return res.status(200).json(result);
    } catch (err) {
      console.error('Erro em getById:', err); // log do erro completo
      if (err.message === 'USUARIO_NAO_ENCONTRADO') {
        return res
          .status(404)
          .json({ msg: 'Usuário não encontrado' });
      }

      return res.status(500).json({
        msg: 'Erro ao buscar usuário',
        error: err.message,
      });
    }
  };
}

module.exports = UserController;
