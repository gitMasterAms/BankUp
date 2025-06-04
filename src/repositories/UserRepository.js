class UserRepository{
    constructor(UserModel){
        this.User = UserModel;        
    }
    async getById(id) {
        //solicitar ao banco de dados que busca um user pelo ID
         return await this.User.findByPk(id, {
             attributes: { exclude: ['password'] },
         });
    }

    async findByEmail(email) {//achar email
        return await this.User.findOne ({ where: { email } });
    }

    async create(data) {
        return await this.User.create(data);
    }     
    
}

module.exports = UserRepository;