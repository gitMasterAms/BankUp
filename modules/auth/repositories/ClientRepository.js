class ClientRepository {
    constructor(ClientModel){
        this.Client = ClientModel;        
    }

    async create(data) {
        return await this.Client.create(data);
    }
    async findClientByUserId(userId) {
        //solicitar ao banco de dados que busca um user pelo ID
         return await this.Client.findOne({ where: { userId }});
    }
    async findByCpfCnpj(cpf_cnpj) {
        return await this.Client.findOne({ where: { cpf_cnpj }})
    }    
}

module.exports = ClientRepository;