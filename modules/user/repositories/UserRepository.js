class UserRepository{
    constructor(UserModel){
        this.User = UserModel;        
    }
    
    async findByEmail(email) {//achar email
        return await this.User.findOne ({ where: { email } });
    }

    async create(data) {
        return await this.User.create(data);
    }
    
    async getById(id) {
        //solicitar ao banco de dados que busca um user pelo ID
         return await this.User.findByPk(id, {
             attributes: { exclude: ['password'] },
         });
    }

    async updateProfile_Complete(userId){
      
        return await this.User.update(
            {profile_complete: true},
            {where: { id: userId }}
        );
    }

     async update(userId, dataToUpdate) {
        // Encontra o usuário e atualiza os dados especificados
        return await this.User.update(
            dataToUpdate,
            { where: { id: userId } }
        );
    }
}

module.exports = UserRepository;