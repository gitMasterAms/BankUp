require('dotenv').config();
const jwt = require('jsonwebtoken');

class ProfileService{
 constructor(ProfileRepository, userRepository) {
        this.ProfileRepository = ProfileRepository;
        this.userRepository = userRepository;
    } 

    async register({ userId, name, cpf_cnpj, phone, address, birthdate }) {
        try {      
          const existingProfile = await this.ProfileRepository.findProfileByUserId(userId);
          if (existingProfile) {
            throw new Error('PERFIL_JA_EXISTE');
          }
          const existingCpfCnpj = await this.ProfileRepository.findByCpfCnpj(cpf_cnpj);
          if (existingCpfCnpj) {
            throw new Error ('CPFCNPJ_JA_EXISTE')
          }

           await this.ProfileRepository.create({
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

module.exports = ProfileService;