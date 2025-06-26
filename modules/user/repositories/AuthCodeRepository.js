class AuthCodeRepository {
    constructor(AuthCodeModel){
        this.AuthCode = AuthCodeModel;
    }

    async create(data) {
        return await this.AuthCode.create(data);
    }

    async findByTwoFactorCode(code){
        return await this.AuthCode.findOne({where: { code }})
    }
}

module.exports = AuthCodeRepository;