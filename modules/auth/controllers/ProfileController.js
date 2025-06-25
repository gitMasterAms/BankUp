const validator = require('validator');

class ProfileController{

         constructor(ProfileService) {
         this.ProfileService = ProfileService;

     }

    register = async (req, res) => {        
            const userId = req.id;
            let { name, cpf_cnpj, phone, address, birthdate } = req.body;

            if (!validator.isUUID(userId)) {
                        return res.status(400).json({ msg: 'ID inválido' });
                    }
            
    
             if (!name || !cpf_cnpj || !phone || !address || !birthdate) {
                 return res.status(422).json({ msg: 'Preencha todos os campos obrigatórios!' });
            }
            
            if (!validator.isMobilePhone(phone)) {
                return res.status(422).json({ msg: 'O telefone informado não é válido!' });
            } 
                
            
            try {
                await this.ProfileService.register({ userId, name, cpf_cnpj, phone, address, birthdate });
                return res.status(201).json({ msg: 'Usuário cadastrado com sucesso.'});
            } catch (err) {
                console.error('Erro ao cadastrar usuário:', err);  // log do erro completo
                if (err.message === 'PERFIL_JA_EXISTE') {
                    return res.status(409).json({ msg: 'Este usuário já completou seu cadastro de perfil.'});
                }
                if (err.message === 'CPFCNPJ_JA_EXISTE') {
                    return res.status(409).json({ msg: 'Este CPF / CPNJ já está em uso.'});
                }
                return res.status(500).json({ msg: 'Erro ao cadastrar usuário'});
            }
        }
    
}


module.exports = ProfileController;