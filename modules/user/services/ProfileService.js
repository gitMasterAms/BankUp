require('dotenv').config();

class ProfileService {
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
        throw new Error('CPFCNPJ_JA_EXISTE');
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
      console.error('ProfileService.register ERRO:', err);
      throw err;
    }
  }

  async update({ userId, data }) {
  try {
    const existingProfile = await this.ProfileRepository.findProfileByUserId(userId);
    if (!existingProfile) {
      throw new Error('PERFIL_NAO_EXISTE');
    }

    const { name, cpf_cnpj, phone, address, birthdate } = data;

    const existingCpfCnpj = await this.ProfileRepository.findByCpfCnpj(cpf_cnpj);
    if (existingCpfCnpj && existingCpfCnpj.userId !== userId) {
      throw new Error('CPFCNPJ_JA_EXISTE');
    }

    await this.ProfileRepository.update(userId, {
      name,
      cpf_cnpj,
      phone,
      address,
      birthdate
    });
  } catch (err) {
    console.error('ProfileService.update ERRO:', err);
    throw err;
  }
}


  async getProfile(userId) {
    try {
      const profile = await this.ProfileRepository.findProfileByUserId(userId);
      return profile;
    } catch (err) {
      console.error('ProfileService.getProfile ERRO:', err);
      throw err;
    }
  }
}

module.exports = ProfileService;