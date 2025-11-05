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
      amount,
      description,
      due_date,
      days_before_due_date,
      status, // Opcional, pois tem defaultValue
      fine_amount,      // <<< MUDANÇA: de 'penalty' para 'fine_amount'
      interest_rate,    
      pix_key,
      is_recurring, // boolean (true/false)
      installments
    } = req.body;

    if (is_recurring === true && (!installments || installments <= 1)) {
        return res.status(422).json({ msg: 'Para cobranças recorrentes, o número de parcelas (installments) deve ser maior que 1.' });
    }

    // Validação dos dados de entrada

    if (days_before_due_date === undefined || isNaN(Number(days_before_due_date))) {
      return res.status(422).json({ msg: 'O campo days_before_due_date é obrigatório e deve ser um número.' });
    }
    
    if (!validator.isUUID(account_id)) {
      return res.status(400).json({ msg: 'ID da conta recorrente inválido.' });
    }
    if (!description){
      return res.status(400).json({ msg: 'Descrição é obrigatória'});
    }

    // <<< MUDANÇA: Atualizada a verificação de campos obrigatórios
    if (!account_id || !amount || !due_date || fine_amount === undefined || interest_rate === undefined || !pix_key) {
      return res.status(422).json({ msg: 'Preencha todos os campos obrigatórios: account_id, amount, due_date, fine_amount, interest_rate, pix_key' });
    } 

    if (!validator.isDecimal(amount.toString())) {
      return res.status(422).json({ msg: 'Valor da conta inválido.' });
    }
    
    // <<< MUDANÇA: Nova validação para os campos de multa e juros
    if (!validator.isDecimal(fine_amount.toString())) {
      return res.status(422).json({ msg: 'Valor da multa (fine_amount) inválido.' });
    }

    if (!validator.isDecimal(interest_rate.toString())) {
        return res.status(422).json({ msg: 'Taxa de juros (interest_rate) inválida.' });
    }
    
    if (!validator.isDate(due_date)) {
      return res.status(422).json({ msg: 'Data de vencimento inválida.' });
    }
    
    // ATENÇÃO: a validação isAlphanumeric pode ser muito restritiva para uma chave PIX
    // (que pode ter '@', '.', '+', '-'). Considere uma validação mais flexível.
    if (!pix_key || typeof pix_key !== 'string') {
      return res.status(422).json({ msg: 'Chave PIX inválida.' });
    }

    // <<< MUDANÇA: Lógica para 'days_before_due_date' removida.

    try {
      // <<< MUDANÇA: Passando os campos corretos para o serviço
      await this.paymentsService.register({
        userId,
        account_id,
        amount,
        description,
        due_date,
        days_before_due_date,
        status, // Se não for enviado, o model usará 'pendente'
        fine_amount,
        interest_rate,
        pix_key,
        is_recurring,
        installments
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

  getAll = async(req, res) =>{
    
    const userId = req.id;
    try {
      const contas = await this.paymentsService.findAll(userId);
      return res.status(200).json(contas);
    } catch (err) { 
      console.error('Erro ao buscar contas:', err);
      return res.status(500).json({ msg: 'Erro ao buscar contas.' });
    }
  }

  getAllByRecurring = async (req, res) => {
    const {account_id} = req.params;
    try {
      const payments = await this.paymentsService.getAllByRecurring(account_id);
      return res.status(200).json(payments);
    } catch (err) {
      console.error('Erro ao buscar pagamentos:', err);
      return res.status(500).json({ msg: 'Erro ao buscar pagamentos.' });
    }
  };

  getById = async (req, res) => {
    const { payment_id } = req.params;
    try {
      const payment = await this.paymentsService.getById(payment_id);
      if (!payment) return res.status(404).json({ msg: 'Pagamento não encontrado.' });
      return res.status(200).json(payment);
    } catch (err) {
      console.error('Erro ao buscar pagamento por ID:', err);
      return res.status(500).json({ msg: 'Erro ao buscar pagamento.' });
    }
  };

  updateById = async (req, res) => {
    const { payment_id } = req.params;
    const updatedData = req.body;
    try {
      const updated = await this.paymentsService.updateById(payment_id, updatedData);
      if (updated[0] === 0) return res.status(404).json({ msg: 'Pagamento não encontrado para atualização.' });
      return res.status(200).json({ msg: 'Pagamento atualizado com sucesso.' });
    } catch (err) {
      console.error('Erro ao atualizar pagamento:', err);
      return res.status(500).json({ msg: 'Erro ao atualizar pagamento.' });
    }
  };

  deleteById = async (req, res) => {
    const { payment_id } = req.params;
    try {
      const deleted = await this.paymentsService.deleteById(payment_id);
      if (!deleted) return res.status(404).json({ msg: 'Pagamento não encontrado para exclusão.' });
      return res.status(200).json({ msg: 'Pagamento excluído com sucesso.' });
    } catch (err) {
      console.error('Erro ao deletar pagamento:', err);
      return res.status(500).json({ msg: 'Erro ao deletar pagamento.' });
    }
  };
}

module.exports = PaymentsController;