const validator = require('validator');

class RecurringController {
  constructor(recurringService) {
    this.recurringService = recurringService;
  }

  register = async (req, res) => {
    const userId = req.id;
    const {
      name,      description,      cpf_cnpj,      email,      phone
    } = req.body;

    // Validação básica
    if (!validator.isUUID(userId)) {
      return res.status(400).json({ msg: 'ID de usuário inválido.' });
    }

    if (!description || !name || !cpf_cnpj || !email || !phone) {
      return res.status(422).json({ msg: 'Preencha todos os campos obrigatórios!' });
    }   
    
    if (!validator.isMobilePhone(phone)) {
      return res.status(422).json({ msg: 'O telefone informado não é válido!' });
    }

    try {
      await this.recurringService.register({
        userId,
        name,
        description,
        cpf_cnpj,
        email,
        phone
      });

      return res.status(201).json({ msg: 'Conta recorrente criada com sucesso.' });
    } catch (err) {
      console.error('Erro ao criar conta recorrente:', err);

      if (err.message === 'CONTA_DUPLICADA') {
        return res.status(409).json({ msg: 'Conta já cadastrada para esse vencimento.' });
      }

      return res.status(500).json({ msg: 'Erro ao cadastrar conta recorrente.' });
    }
  };
  getAllByUser = async (req, res) => {
    const userId = req.id;

    try {
      const contas = await this.recurringService.getAllByUser(userId);
      return res.status(200).json(contas);
    } catch (err) {
      console.error('Erro ao buscar contas:', err);
      return res.status(500).json({ msg: 'Erro ao buscar contas.' });
    }
  };

  getById = async (req, res) => {
    const { id } = req.params;

    try {
      const conta = await this.recurringService.getById(id);
      if (!conta) return res.status(404).json({ msg: 'Conta não encontrada.' });
      return res.status(200).json(conta);
    } catch (err) {
      console.error('Erro ao buscar conta por ID:', err);
      return res.status(500).json({ msg: 'Erro ao buscar conta.' });
    }
  };

  updateById = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
      const updated = await this.recurringService.updateById(id, updatedData);
      if (updated[0] === 0) return res.status(404).json({ msg: 'Conta não encontrada para atualização.' });

      return res.status(200).json({ msg: 'Conta atualizada com sucesso.' });
    } catch (err) {
      console.error('Erro ao atualizar conta:', err);
      return res.status(500).json({ msg: 'Erro ao atualizar conta.' });
    }
  };

  deleteById = async (req, res) => {
    const { id } = req.params;

    try {
      const deleted = await this.recurringService.deleteById(id);
      if (!deleted) return res.status(404).json({ msg: 'Conta não encontrada para exclusão.' });

      return res.status(200).json({ msg: 'Conta excluída com sucesso.' });
    } catch (err) {
      console.error('Erro ao deletar conta:', err);
      return res.status(500).json({ msg: 'Erro ao deletar conta.' });
    }
  };
  /**
   * NOVA ROTA: Atualiza o status de uma conta e registra o pagamento.
   * Espera um PATCH em /recurring/:id/status
   */
  // updateStatusAndPay = async (req, res) => {
  //   const userId = req.id;
  //   const { id: accountId } = req.params; // Pega o ID da conta da URL
  //   const { status } = req.body; // Pega o novo status do corpo da requisição

  //   // Validação básica
  //   if (!status) {
  //     return res.status(422).json({ msg: 'O campo "status" é obrigatório.' });
  //   }

  //   if (!validator.isUUID(accountId)) {
  //       return res.status(400).json({ msg: 'ID de conta inválido.' });
  //   }

  //   try {
  //     const updatedAccount = await this.recurringService.updateStatusAndCreatePayment(userId, accountId, status);

  //     return res.status(200).json(updatedAccount); // Retorna a conta atualizada

  //   } catch (err) {
  //     console.error('Erro ao confirmar pagamento:', err);

  //     if (err.message === 'CONTA_NAO_ENCONTRADA') {
  //       return res.status(404).json({ msg: 'Conta recorrente não encontrada ou não pertence a este usuário.' });
  //     }

  //     return res.status(500).json({ msg: 'Erro interno ao confirmar pagamento.' });
  //   }
  // };
}

module.exports = RecurringController;