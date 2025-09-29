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
    const {
      account_id,
      amount,
      description,
      due_date,
      days_before_due_date,
      status,
      penalty,
      pix_key
    } = req.body;

    let processedDays = days_before_due_date;

    // Validação dos dados de entrada
       
    if (!validator.isUUID(account_id)) {
      return res.status(400).json({ msg: 'ID da conta recorrente inválido.' });
    }
    if (!description){
      return res.status(400).json({ msg: 'Descrição é obrigatória'});
    }

    if (!account_id || !amount || !due_date || !penalty || !pix_key) {
      return res.status(422).json({ msg: 'Preencha todos os campos obrigatórios!' });
    } 

    if (!validator.isDecimal(amount.toString())) {
          return res.status(422).json({ msg: 'Valor da conta inválido.' });
        }
    
        if (!validator.isDecimal(penalty.toString())) {
          return res.status(422).json({ msg: 'Valor da penalidade inválido.' });
        }
    
        if (!validator.isDate(due_date)) {
          return res.status(422).json({ msg: 'Data de vencimento inválida.' });
        }
    
        if (!validator.isAlphanumeric(pix_key)) {
          return res.status(422).json({ msg: 'Chave PIX inválida.' });
        }

          // --- Validação e ajuste do days_before_due_date ---
          
        if (processedDays == null) {
          processedDays = 0; // se for null ou undefined
        } else if (isNaN(Number(processedDays))) {
          return res.status(422).json({ msg: 'days_before_due_date deve ser um número.' });
        } else {
          processedDays = Number(processedDays); // garante que é number
        }

    try {
      await this.paymentsService.register({
      account_id,
      amount,
      description,
      due_date,
      days_before_due_date: processedDays,
      status,
      penalty,
      pix_key
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
    try {
      const contas = await this.paymentsService.getAll();
      return res.status(200).json(contas);
    } catch (err) {
      console.error('Erro ao buscar contas:', err);
      return res.status(500).json({ msg: 'Erro ao buscar contas.' });
    }
  }

  getAllByRecurring = async (req, res) => {
    const {account_id} = req.params;
    try {
      //console.log(account_id);
      const payments = await this.paymentsService.getAllByRecurring(account_id);
      return res.status(200).json(payments);
    } catch (err) {
      console.error('Erro ao buscar pagamentos:', err);
      return res.status(500).json({ msg: 'Erro ao buscar pagamentos.' });
    }
  };

  getById = async (req, res) => {
    const { payment_id } = req.params;
    console.log(payment_id);
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
      console.log('Tentando deletar payment_id:', payment_id);
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
