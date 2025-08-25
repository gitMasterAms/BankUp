/**
 * repositories/PaymentsRepository.js
 * * Esta classe é responsável pela comunicação direta com o banco de dados
 * para a entidade 'Payment'. Ela abstrai as queries do Sequelize.
 */
class PaymentsRepository {
  // O construtor recebe os modelos do Sequelize.
  // Se 'PaymentModel' chegar como undefined, 'this.Payment' será undefined.
  constructor(PaymentModel, RecurringAccountModel) {
    this.Payment = PaymentModel;
    this.RecurringAccount = RecurringAccountModel;
  }

  /**
   * Cria um novo registro de pagamento no banco de dados.
   * @param {object} data - Os dados do pagamento.
   * @returns {Promise<object>} O objeto do pagamento criado.
   */
  async create(data) {
    // O erro acontece aqui se 'this.Payment' for undefined.
    return await this.Payment.create(data);
  }

  /**
   * Busca todos os pagamentos de um usuário específico, fazendo a busca
   * através da associação com RecurringAccount.
   * @param {string} userId - O UUID do usuário.
   * @returns {Promise<Array<object>>} Uma lista de pagamentos.
   */
  async findByUserId(userId) {
    return await this.Payment.findAll({
      include: [{
        model: this.RecurringAccount,
        where: { userId: userId },
        attributes: []
      }]
    });
  }

  /**
   * Busca um pagamento pelo seu ID (UUID).
   * @param {string} payment_id - O UUID do pagamento.
   * @returns {Promise<object|null>} O objeto do pagamento ou null se não encontrado.
   */
  async findById(payment_id) {
    return await this.Payment.findOne({ where: { payment_id } });
  }

  /**
   * Deleta um pagamento pelo seu ID.
   * @param {string} payment_id - O UUID do pagamento.
   * @returns {Promise<number>} O número de registros deletados (0 ou 1).
   */
  async deleteById(payment_id) {
    return await this.Payment.destroy({ where: { payment_id } });
  }

  /**
   * Atualiza um pagamento pelo seu ID.
   * @param {string} payment_id - O UUID do pagamento.
   * @param {object} updatedData - Os novos dados para atualizar.
   * @returns {Promise<Array<number>>} Um array com o número de registros afetados.
   */
  async updateById(payment_id, updatedData) {
    return await this.Payment.update(updatedData, { where: { payment_id } });
  }
}

module.exports = PaymentsRepository;
