/**
 * services/PaymentsService.js
 * * Contém a lógica de negócio para pagamentos.
 * * ATUALIZADO: A criação de pagamento não inclui mais o 'userId' diretamente.
 */
require('dotenv').config();

class PaymentsService {
  constructor(paymentsRepository, recurringRepository) {
    this.paymentsRepository = paymentsRepository;
    this.recurringRepository = recurringRepository;
  }

  /**
   * Registra um novo pagamento.
   * @param {object} paymentData - Dados do pagamento.
   * @returns {Promise<object>} O pagamento registrado.
   */
  async register({ userId, account_id, amount_paid, payment_date, payment_method, payment_status, penalty_applied }) {
    try {
      // A validação continua usando o userId (vindo do token) para garantir
      // que o usuário é o dono da conta recorrente.
      const recurringAccount = await this.recurringRepository.findById(account_id);
      if (!recurringAccount || recurringAccount.userId !== userId) {
        throw new Error('CONTA_NAO_ENCONTRADA');
      }

      // Cria o registro do pagamento sem o campo 'userId'.
      const newPayment = await this.paymentsRepository.create({
        account_id,
        amount_paid,
        payment_date,
        payment_method,
        payment_status,
        penalty_applied,
        created_at: new Date(),
        updated_at: new Date()
      });

      return newPayment;

    } catch (err) {
      console.error('PaymentsService.register ERRO:', err);
      throw err;
    }
  }

  async getAllByUser(userId) {
    // Esta chamada agora funciona corretamente com o novo repositório.
    return await this.paymentsRepository.findByUserId(userId);
  }

  async getById(id) {
    return await this.paymentsRepository.findById(id);
  }

  async updateById(id, data) {
    data.updated_at = new Date();
    return await this.paymentsRepository.updateById(id, data);
  }

  async deleteById(id) {
    return await this.paymentsRepository.deleteById(id);
  }
}

module.exports = PaymentsService;
