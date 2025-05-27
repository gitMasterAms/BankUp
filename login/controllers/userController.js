const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const sendEmail = require('../utils/emailService');
const crypto = require('crypto');
const { Op } = require('sequelize');
require('dotenv').config();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    full_name, cpf_cnpj, email, phone, whatsapp,
    address_street, address_city, address_state, address_postal_code, address_country,
    birth_date, password
  } = req.body;

  try {
    let existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ msg: 'E-mail já cadastrado.' });
    }
    existingUser = await User.findOne({ where: { cpf_cnpj } });
    if (existingUser) {
      return res.status(400).json({ msg: 'CPF/CNPJ já cadastrado.' });
    }

    const user = await User.create({
      full_name, cpf_cnpj, email, phone, whatsapp,
      address_street, address_city, address_state, address_postal_code, address_country,
      birth_date, password,
    });

    const token = generateToken(user.id);
    const userResponse = await User.findByPk(user.id); // Busca novamente para aplicar defaultScope

    res.status(201).json({
      token,
      user: userResponse, // userResponse já está sem campos sensíveis devido ao defaultScope
      msg: 'Usuário registrado com sucesso!'
    });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      const field = err.errors && err.errors.length > 0 ? err.errors[0].path : 'desconhecido';
      const friendlyField = field.includes('email') ? 'E-mail' : (field.includes('cpf_cnpj') ? 'CPF/CNPJ' : field);
      return res.status(400).json({ msg: `${friendlyField} já cadastrado.` });
    }
    console.error(err.message, err);
    res.status(500).send('Erro no servidor');
  }
};

exports.loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    const user = await User.scope('withPassword').findOne({ where: { email } });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ msg: 'Credenciais inválidas.' });
    }
    const token = generateToken(user.id);
    const userResponse = await User.findByPk(user.id);
    res.json({ token, user: userResponse });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

exports.forgotPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const user = await User.scope('withResetToken').findOne({ where: { email: req.body.email } });
    if (!user) {
      console.log(`Tentativa de reset para email não existente: ${req.body.email}`);
      return res.status(200).json({ msg: 'Se um usuário com este e-mail existir, um link de recuperação será enviado.' });
    }
    const resetToken = user.createPasswordResetToken();
    await user.save({ fields: ['passwordResetToken', 'passwordResetExpires']});

    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const message = `Esqueceu sua senha? Clique no link para redefinir: ${resetURL}.\nEste link expira em ${process.env.PASSWORD_RESET_TOKEN_EXPIRES_MINUTES} minutos.`;
    try {
      await sendEmail({ email: user.email, subject: `Recuperação de Senha`, message });
      res.status(200).json({ msg: 'Token de recuperação enviado para o e-mail.' });
    } catch (emailError) {
      user.passwordResetToken = null;
      user.passwordResetExpires = null;
      await user.save({ fields: ['passwordResetToken', 'passwordResetExpires']});
      console.error("ERRO AO ENVIAR EMAIL DE RESET:", emailError);
      return res.status(500).json({ msg: 'Erro ao enviar e-mail de recuperação. Tente novamente.' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

exports.resetPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.scope(['withPassword', 'withResetToken']).findOne({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires: { [Op.gt]: Date.now() },
      },
    });
    if (!user) {
      return res.status(400).json({ msg: 'Token inválido ou expirado.' });
    }
    user.password = req.body.password; // Hook beforeUpdate vai hashear
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();
    const token = generateToken(user.id);
    const userResponse = await User.findByPk(user.id);
    res.json({ token, user: userResponse, msg: 'Senha redefinida com sucesso!' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id); // req.user.id é do token
    if (!user) {
        return res.status(404).json({ msg: 'Usuário não encontrado.' });
    }
    res.json(user); // defaultScope já cuida de não enviar senha
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};