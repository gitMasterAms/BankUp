class ProfileRepository {
    constructor(ProfileModel){
        this.Profile = ProfileModel;        
    }

    async create(data) {
        return await this.Profile.create(data);
    }
    async findProfileByUserId(userId) {
        //solicitar ao banco de dados que busca um user pelo ID
         return await this.Profile.findOne({ where: { userId }});
    }
    async findByCpfCnpj(cpf_cnpj) {
        return await this.Profile.findOne({ where: { cpf_cnpj }})
    }    
}

module.exports = ProfileRepository;