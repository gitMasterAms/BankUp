const validator = require('validator');

class ProfileController {
  constructor(ProfileService) {
    this.ProfileService = ProfileService;
  }

  register = async (req, res) => {
    const userId = req.id;
    let { name, cpf_cnpj, phone, address, birthdate } = req.body;

    if (!validator.isUUID(userId)) {
      return res.status(400).json({ msg: 'ID inválido' });
    }

    if (!name || !cpf_cnpj || !phone || !address || !birthdate) {
      return res.status(422).json({ msg: 'Preencha todos os campos obrigatórios!' });
    }

    if (!validator.isMobilePhone(phone)) {
      return res.status(422).json({ msg: 'O telefone informado não é válido!' });
    }

    if (!validator.isDate(birthdate)) {
      return res.status(422).json({ msg: 'A data de nascimento informado não é válido!' });
    }

    try {
      await this.ProfileService.register({ userId, name, cpf_cnpj, phone, address, birthdate });
      return res.status(201).json({ msg: 'Usuário cadastrado com sucesso.' });
    } catch (err) {
      if (err.message === 'PERFIL_JA_EXISTE') {
        return res.status(409).json({ msg: 'Este usuário já completou seu cadastro de perfil.' });
      }
      if (err.message === 'CPFCNPJ_JA_EXISTE') {
        return res.status(409).json({ msg: 'Este CPF / CPNJ já está em uso.' });
      }
      return res.status(500).json({ msg: 'Erro ao cadastrar usuário' });
    }
  }

  update = async (req, res) => {
    const userId = req.id;
    let data = req.body;

    try {
      await this.ProfileService.update({ userId, data });
      return res.status(200).json({ msg: 'Perfil atualizado com sucesso.' });
    } catch (err) {
      if (err.message === 'PERFIL_NAO_ENCONTRADO') {
        return res.status(404).json({ msg: 'Perfil não encontrado.' });
      }
      return res.status(500).json({ msg: 'Erro ao atualizar perfil' });
    }
  }

    getProfile = async (req, res) => {
        const userId = req.id;
        if (!validator.isUUID(userId)) {
            return res.status(400).json({ msg: 'ID inválido' });
        }
        try {
            const profile = await this.ProfileService.getProfile(userId);
            if (!profile) {
                return res.status(404).json({ msg: 'Perfil não encontrado.' });
            }
            return res.status(200).json(profile);
        } catch (err) {
            return res.status(500).json({ msg: 'Erro ao buscar perfil' });
        }
    }
}

module.exports = ProfileController;