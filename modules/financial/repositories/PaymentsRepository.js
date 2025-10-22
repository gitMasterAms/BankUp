const { Op } = require('sequelize');

class PaymentsRepository {
  constructor(PaymentModel, RecurringAccountModel) {
    this.Payment = PaymentModel;
    this.RecurringAccount = RecurringAccountModel;
  }

  async create(data) {
    return await this.Payment.create(data);
  }

  async findByAccountId(account_id) {
    return await this.Payment.findAll({ where: { account_id } });
  }

  async findAll(userId) {
    return await this.Payment.findAll({ where: { userId: userId } });
  }

  async findById(payment_id) {
    return await this.Payment.findOne({ where: { payment_id } });
  }

  async deleteById(payment_id) {
    return await this.Payment.destroy({ where: { payment_id } });
  }

  async updateById(payment_id, updatedData) {
    return await this.Payment.update(updatedData, { where: { payment_id } });
  }

  async findPendingAndOverdue() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return await this.Payment.findAll({
      where: {
        status: {
          [Op.in]: ['pendente', 'vencido']
        },
        due_date: {
          [Op.lt]: today
        }
      }
    });
  }
}

module.exports = PaymentsRepository;