class AuthCodeRepository {
    constructor(AuthCodeModel){
        this.AuthCode = AuthCodeModel;
    }

    async create(data) {
        return await this.AuthCode.create(data);
    }
    async delete(where){
        return await this.AuthCode.destroy({where});
    }


    

    async findByTwoFactorCode(code){
        return await this.AuthCode.findOne({where: { code }})
    }
}

module.exports = AuthCodeRepository;