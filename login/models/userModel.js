const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

class User extends Model {
  async comparePassword(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  }

  createPasswordResetToken() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    this.passwordResetExpires = Date.now() + parseInt(process.env.PASSWORD_RESET_TOKEN_EXPIRES_MINUTES) * 60 * 1000;
    return resetToken;
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: 'Nome completo é obrigatório' } },
    },
    cpf_cnpj: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { msg: 'CPF/CNPJ já cadastrado.' },
      validate: { notEmpty: { msg: 'CPF/CNPJ é obrigatório' } },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { msg: 'E-mail já cadastrado.' },
      validate: {
        isEmail: { msg: 'Por favor, use um endereço de e-mail válido.' },
        notEmpty: { msg: 'E-mail é obrigatório' },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Senha é obrigatória' },
        len: { args: [6, 255], msg: 'Senha deve ter pelo menos 6 caracteres' },
      },
    },
    phone: { type: DataTypes.STRING, allowNull: true },
    whatsapp: { type: DataTypes.STRING, allowNull: true },
    address_street: { type: DataTypes.STRING, allowNull: true },
    address_city: { type: DataTypes.STRING, allowNull: true },
    address_state: { type: DataTypes.STRING, allowNull: true },
    address_postal_code: { type: DataTypes.STRING, allowNull: true },
    address_country: { type: DataTypes.STRING, allowNull: true, defaultValue: 'Brasil' },
    birth_date: { type: DataTypes.DATEONLY, allowNull: true },
    passwordResetToken: { type: DataTypes.STRING, allowNull: true },
    passwordResetExpires: { type: DataTypes.DATE, allowNull: true },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    underscored: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password') && user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
    defaultScope: {
      attributes: { exclude: ['password', 'passwordResetToken', 'passwordResetExpires'] },
    },
    scopes: {
      withPassword: { attributes: { include: ['password'] } },
      withResetToken: { attributes: { include: ['passwordResetToken', 'passwordResetExpires'] } }
    },
  }
);

module.exports = User;