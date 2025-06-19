require('dotenv').config();
const jwt = require('jsonwebtoken');

class ClientService{
 constructor(clientRepository, userRepository) {
        this.clientRepository = clientRepository;
        this.userRepository = userRepository;
    } 

    async register({ userId, name, cpf_cnpj, phone, address, birthdate }) {
        try {      
          const existingClient = await this.clientRepository.findClientByUserId(userId);
          if (existingClient) {
            throw new Error('PERFIL_JA_EXISTE');
          }
          const existingCpfCnpj = await this.clientRepository.findByCpfCnpj(cpf_cnpj);
          if (existingCpfCnpj) {
            throw new Error ('CPFCNPJ_JA_EXISTE')
          }

           await this.clientRepository.create({
            userId,
            name,
            cpf_cnpj,
            phone,
            address,
            birthdate
          });
    
          await this.userRepository.updateProfile_Complete(userId);
         
        } catch (err) {
          console.error('UserService.register ERRO:', err);
          throw err;
        }
      }
}

module.exports = ClientService;