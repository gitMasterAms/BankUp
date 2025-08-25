/**
 * controllers/PaymentsController.js
 * * Responsável por receber as requisições HTTP, agora validando os novos campos de pagamento.
 */
const validator = require('validator');

class PaymentsController {
  constructor(paymentsService) {
    this.paymentsService = paymentsService;
  }

  /**
   * Rota para registrar um novo pagamento.
   */
  register = async (req, res) => {
    const userId = req.id;
    const {
      account_id,
      amount_paid,
      payment_date,
      payment_method,
      payment_status,
      penalty_applied
    } = req.body;

    // Validação dos dados de entrada
    if (!validator.isUUID(userId)) {
      return res.status(400).json({ msg: 'ID de usuário inválido.' });
    }

    if (!account_id || !amount_paid || !payment_date) {
      return res.status(422).json({ msg: 'Os campos account_id, amount_paid e payment_date são obrigatórios!' });
    }

    if (!validator.isUUID(account_id)) {
      return res.status(400).json({ msg: 'ID da conta recorrente inválido.' });
    }

    if (!validator.isDecimal(amount_paid.toString())) {
      return res.status(422).json({ msg: 'Valor pago inválido.' });
    }

    if (!validator.isISO8601(payment_date)) {
      return res.status(422).json({ msg: 'Data de pagamento inválida (use o formato ISO8601).' });
    }

    try {
      await this.paymentsService.register({
        userId,
        account_id,
        amount_paid,
        payment_date,
        payment_method,
        payment_status,
        penalty_applied
      });

      return res.status(201).json({ msg: 'Pagamento registrado com sucesso.' });
    } catch (err) {
      console.error('Erro ao registrar pagamento:', err);

      if (err.message === 'CONTA_NAO_ENCONTRADA') {
        return res.status(404).json({ msg: 'Conta recorrente não encontrada ou não pertence a este usuário.' });
      }

      return res.status(500).json({ msg: 'Erro interno ao registrar pagamento.' });
    }
  };

  getAllByUser = async (req, res) => {
    const userId = req.id;
    try {
      const payments = await this.paymentsService.getAllByUser(userId);
      return res.status(200).json(payments);
    } catch (err) {
      console.error('Erro ao buscar pagamentos:', err);
      return res.status(500).json({ msg: 'Erro ao buscar pagamentos.' });
    }
  };

  getById = async (req, res) => {
    const { id } = req.params;
    try {
      const payment = await this.paymentsService.getById(id);
      if (!payment) return res.status(404).json({ msg: 'Pagamento não encontrado.' });
      return res.status(200).json(payment);
    } catch (err) {
      console.error('Erro ao buscar pagamento por ID:', err);
      return res.status(500).json({ msg: 'Erro ao buscar pagamento.' });
    }
  };

  updateById = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    try {
      const updated = await this.paymentsService.updateById(id, updatedData);
      if (updated[0] === 0) return res.status(404).json({ msg: 'Pagamento não encontrado para atualização.' });
      return res.status(200).json({ msg: 'Pagamento atualizado com sucesso.' });
    } catch (err) {
      console.error('Erro ao atualizar pagamento:', err);
      return res.status(500).json({ msg: 'Erro ao atualizar pagamento.' });
    }
  };

  deleteById = async (req, res) => {
    const { id } = req.params;
    try {
      const deleted = await this.paymentsService.deleteById(id);
      if (!deleted) return res.status(404).json({ msg: 'Pagamento não encontrado para exclusão.' });
      return res.status(200).json({ msg: 'Pagamento excluído com sucesso.' });
    } catch (err) {
      console.error('Erro ao deletar pagamento:', err);
      return res.status(500).json({ msg: 'Erro ao deletar pagamento.' });
    }
  };
}

module.exports = PaymentsController;
