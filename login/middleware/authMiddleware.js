const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('dotenv').config();

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findByPk(decoded.id); // defaultScope já remove campos sensíveis
      if (!req.user) {
          return res.status(401).json({ msg: 'Usuário não encontrado, autorização negada.' });
      }
      next();
    } catch (err) {
      console.error('Erro na autenticação do token:', err.message);
      const status = (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') ? 401 : 500;
      const msg = (err.name === 'JsonWebTokenError') ? 'Token inválido.' :
                  (err.name === 'TokenExpiredError') ? 'Token expirado.' : 'Não autorizado, token falhou.';
      return res.status(status).json({ msg: `${msg} Autorização negada.` });
    }
  }
  if (!token) {
    return res.status(401).json({ msg: 'Não autorizado, sem token.' });
  }
};

module.exports = { protect };