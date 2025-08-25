/**
 * services/RecurringService.js
 * * Contém a lógica de negócio para Contas Recorrentes.
 */
require('dotenv').config();

class RecurringService {
  // O construtor recebe os dois repositórios necessários
  constructor(recurringRepository, paymentsRepository) {
    this.recurringRepository = recurringRepository;
    this.paymentsRepository = paymentsRepository;
  }

  /**
   * Registra uma nova conta recorrente.
   */
  async register({ userId, description, amount, penalty, due_date, payee, pix_key, status }) {
    try {
      await this.recurringRepository.create({
        userId,
        description,
        amount,
        penalty,
        due_date,
        payee,
        pix_key,
        status,
        created_at: new Date(),
        updated_at: new Date()
      });
    } catch (err) {
      console.error('RecurringService.register ERRO:', err);
      throw err;
    }
  }

  /**
   * Busca todas as contas de um usuário.
   */
  async getAllByUser(userId) {
    return await this.recurringRepository.findByUserId(userId);
  }

  /**
   * Busca uma conta por ID.
   */
  async getById(id) {
    return await this.recurringRepository.findById(id);
  }

  /**
   * Atualiza uma conta por ID.
   */
  async updateById(id, data) {
    data.updated_at = new Date();
    return await this.recurringRepository.updateById(id, data);
  }

  /**
   * Deleta uma conta por ID.
   */
  async deleteById(id) {
    return await this.recurringRepository.deleteById(id);
  }

  /**
   * Função principal: Atualiza o status de uma conta e cria o registro de pagamento.
   */
  async updateStatusAndCreatePayment(userId, accountId, newStatus) {
    try {
      // 1. Busca a conta e verifica se ela pertence ao usuário logado (Segurança)
      const account = await this.recurringRepository.findById(accountId);
      if (!account || account.userId !== userId) {
        throw new Error('CONTA_NAO_ENCONTRADA');
      }

      // 2. Cria o registro de pagamento na tabela 'Payments'
      await this.paymentsRepository.create({
        account_id: account.account_id,
        amount_paid: account.amount,
        payment_date: new Date(),
        payment_method: 'PIX',
        payment_status: 'concluído',
        penalty_applied: account.penalty || 0.00, // Usa a multa da conta, se houver
      });

      // 3. Atualiza o status da conta recorrente na tabela 'Recurring_Accounts'
      await this.recurringRepository.updateById(accountId, {
        status: newStatus,
        updated_at: new Date()
      });

      // 4. Retorna a conta recorrente com os dados totalmente atualizados
      return await this.recurringRepository.findById(accountId);

    } catch (err) {
      // Se qualquer uma das operações acima falhar, o erro será capturado aqui
      console.error('RecurringService.updateStatusAndCreatePayment ERRO:', err);
      throw err; // Propaga o erro para o controller, que retornará o 500
    }
  }
}

module.exports = RecurringService;
