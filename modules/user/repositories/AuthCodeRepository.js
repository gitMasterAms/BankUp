class AuthCodeRepository {
    constructor(AuthCodeModel) {
        this.AuthCode = AuthCodeModel;
    }

    async create(data) {
        return await this.AuthCode.create(data);
    }

    async delete(where) {
        return await this.AuthCode.destroy({ where });
    }

    async update(where, data) {
        return await this.AuthCode.update(data, {
            where,
            returning: true, // opcional, se quiser o objeto atualizado de volta
        });
    }

    async findByUserId(data) {
        return await this.AuthCode.findOne({ where: { ...data } });
    }
}

module.exports = AuthCodeRepository;
