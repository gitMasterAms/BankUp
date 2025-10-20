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
    const existingUser = await this.userRepository.getById(userId);
    if (!existingUser) {
      throw new Error('USUARIO_NAO_ENCONTRADO');
    }

    const existingProfile = await this.ProfileRepository.findProfileByUserId(userId);

    const { name, email, cpf_cnpj, phone, address, birthdate } = data;

    // valida CPF somente se vier no update
    if (cpf_cnpj && cpf_cnpj !== existingProfile.cpf_cnpj) {
      const existingCpfCnpj = await this.ProfileRepository.findByCpfCnpj(cpf_cnpj);
      if (existingCpfCnpj && existingCpfCnpj.userId !== userId) {
        throw new Error('CPFCNPJ_JA_EXISTE');
      }
    }

    // atualiza apenas os campos passados
    const updatedData = {
      name: name ?? existingProfile.name,
      cpf_cnpj: cpf_cnpj ?? existingProfile.cpf_cnpj,
      phone: phone ?? existingProfile.phone,
      address: address ?? existingProfile.address,
      birthdate: birthdate ?? existingProfile.birthdate
    };

    await this.ProfileRepository.update(userId, updatedData);

    const updatedProfile = await this.ProfileRepository.findProfileByUserId(userId);

    return {
      ...updatedProfile.dataValues,
      email: existingUser.email
    };

  } catch (err) {
    console.error('ProfileService.update ERRO:', err);
    throw err;
  }
}




 async getProfile(userId) {
  try {
    const user = await this.userRepository.getById(userId);

    const profile = await this.ProfileRepository.findProfileByUserId(userId);

    // junta tudo num único objeto
    const result = {
      ...profile,   // espalha os campos do profile
      email: user.email
    };

    return result;
  } catch (err) {
    console.error('ProfileService.getProfile ERRO:', err);
    throw err;
  }
}
async getProfile(userId) {
  try {
    const user = await this.userRepository.getById(userId);
    const profile = await this.ProfileRepository.findProfileByUserId(userId);

    // junta tudo num único objeto
    const result = {
      ...profile.dataValues,   // espalha os campos do profile
      email: user.email
    };

    return result;
  } catch (err) {
    console.error('ProfileService.getProfile ERRO:', err);
    throw err;
  }
}

}

module.exports = ProfileService;