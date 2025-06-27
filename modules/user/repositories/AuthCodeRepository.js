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


    

    async findByTwoFactorCode(data){
        return await this.AuthCode.findOne({where: { ...data }});
    }
}

module.exports = AuthCodeRepository;