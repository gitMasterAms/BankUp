require('dotenv').config();

class RecurringService {
  constructor(recurringRepository) {
    this.recurringRepository = recurringRepository;
  }

  async register({ userId, description, amount, due_date, payee, pix_key, status }) {
    try {
      // Aqui você poderia fazer alguma verificação extra, como evitar duplicidade
      // Exemplo: se quiser garantir que um mesmo usuário não cadastre a mesma conta com mesma descrição e data
      // const existingAccount = await this.recurringRepository.findByDescriptionAndDate(userId, description, due_date);
      // if (existingAccount) throw new Error('CONTA_DUPLICADA');

      await this.recurringRepository.create({
        userId,
        description,
        amount,
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
    async getAllByUser(userId) {
        return await this.recurringRepository.findByUserId(userId);
    }

    async getById(id) {
        return await this.recurringRepository.findById(id);
    }

    async updateById(id, data) {
        data.updated_at = new Date();
        return await this.recurringRepository.updateById(id, data);
    }

    async deleteById(id) {
        return await this.recurringRepository.deleteById(id);
    }
}

module.exports = RecurringService;