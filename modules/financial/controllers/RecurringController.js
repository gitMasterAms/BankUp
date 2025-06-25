const validator = require('validator');

class RecurringController {
  constructor(recurringService) {
    this.recurringService = recurringService;
  }

  register = async (req, res) => {
    const userId = req.id;
    const {
      description,
      amount,
      due_date,
      payee,
      pix_key,
      status
    } = req.body;

    // Validação básica
    if (!validator.isUUID(userId)) {
      return res.status(400).json({ msg: 'ID de usuário inválido.' });
    }

    if (!description || !amount || !due_date || !payee || !pix_key || !status) {
      return res.status(422).json({ msg: 'Preencha todos os campos obrigatórios!' });
    }

    if (!validator.isDecimal(amount.toString())) {
      return res.status(422).json({ msg: 'Valor da conta inválido.' });
    }

    if (!validator.isDate(due_date)) {
      return res.status(422).json({ msg: 'Data de vencimento inválida.' });
    }

    if (!validator.isAlphanumeric(pix_key)) {
      return res.status(422).json({ msg: 'Chave PIX inválida.' });
    }

    try {
      await this.recurringService.register({
        userId,
        description,
        amount,
        due_date,
        payee,
        pix_key,
        status
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
}

module.exports = RecurringController;
