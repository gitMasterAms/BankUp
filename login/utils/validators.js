const { body, param } = require('express-validator');

const registerValidation = [
  body('full_name').notEmpty().withMessage('Nome completo é obrigatório.'),
  body('cpf_cnpj')
    .notEmpty().withMessage('CPF/CNPJ é obrigatório.')
    .custom((value) => {
      const cleaned = String(value).replace(/\D/g, '');
      if (cleaned.length !== 11 && cleaned.length !== 14) {
        throw new Error('CPF/CNPJ inválido.');
      }
      return true;
    }),
  body('email').isEmail().withMessage('Forneça um e-mail válido.'),
  body('phone').optional().isString(),
  body('address_street').optional().isString(),
  body('address_city').optional().isString(),
  body('address_state').optional().isString(),
  body('address_postal_code').optional().custom((value) => {
    if (value && !/^\d{5}-?\d{3}$/.test(value)) { // Validação simples de CEP brasileiro
      throw new Error('CEP inválido.');
    }
    return true;
  }),
  body('birth_date').optional().isISO8601().toDate().withMessage('Data de nascimento inválida.'),
  body('password').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres.'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Forneça um e-mail válido.'),
  body('password').notEmpty().withMessage('Senha é obrigatória.'),
];

const forgotPasswordValidation = [
  body('email').isEmail().withMessage('Forneça um e-mail válido.'),
];

const resetPasswordValidation = [
  param('token').notEmpty().withMessage('Token é obrigatório.'),
  body('password').isLength({ min: 6 }).withMessage('Nova senha deve ter no mínimo 6 caracteres.'),
  body('passwordConfirm')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('As senhas não conferem.');
      }
      return true;
    }),
];

module.exports = {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
};