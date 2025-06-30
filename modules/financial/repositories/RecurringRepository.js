class RecurringRepository {
  constructor(RecurringModel) {
    this.Recurring = RecurringModel;
  }

  async create(data) {
    return await this.Recurring.create(data);
  }

  async findByUserId(userId) {
    return await this.Recurring.findAll({ where: { userId } });
  }

  async findById(account_id) {
    return await this.Recurring.findOne({ where: { account_id } });
  }

  async deleteById(account_id) {
    return await this.Recurring.destroy({ where: { account_id } });
  }

  async updateById(account_id, updatedData) {
    return await this.Recurring.update(updatedData, { where: { account_id } });
  }
}

module.exports = RecurringRepository;
