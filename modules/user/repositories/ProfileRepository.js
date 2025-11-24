class ProfileRepository {
    constructor(ProfileModel){
        this.Profile = ProfileModel;        
    }

    async create(data) {
        return await this.Profile.create(data);
    }
    async findProfileByUserId(userId) {
        //solicitar ao banco de dados que busca um user pelo ID
         const profile = await this.Profile.findOne({ where: { userId }});
         return profile;
    }
    async findByCpfCnpj(cpf_cnpj) {
        return await this.Profile.findOne({ where: { cpf_cnpj }})
    }
    async update(userId, data) {
        return await this.Profile.update(data, { where: { userId }});
    } 
}

module.exports = ProfileRepository;